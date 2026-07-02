import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"

const registerSchema = z.object({
  name:     z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  username: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(20, "Máximo 20 caracteres")
    .regex(/^[a-z0-9_]+$/, "Username inválido"),
  email:    z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, username, email, password } = registerSchema.parse(body)

    const existingEmail = await db.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    const existingUsername = await db.user.findUnique({ where: { username } })
    if (existingUsername) {
      return NextResponse.json({ error: "Username já está em uso" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await db.user.create({
      data: { name, username, email, password: hashedPassword },
    })

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const verificationToken = await db.emailVerificationToken.create({
      data: { email, expires },
    })

    try {
      await sendVerificationEmail(email, verificationToken.token, name)
    } catch (emailError) {
      console.error("[email] Falha ao enviar verificação:", emailError)
    }

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Dados inválidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
