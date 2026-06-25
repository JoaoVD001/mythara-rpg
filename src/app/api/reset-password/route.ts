import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, password } = schema.parse(body)

    const resetToken = await db.passwordResetToken.findUnique({ where: { token } })

    if (!resetToken || resetToken.expires < new Date()) {
      if (resetToken) await db.passwordResetToken.delete({ where: { token } })
      return NextResponse.json({ error: "Link inválido ou expirado" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await db.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    })

    await db.passwordResetToken.delete({ where: { token } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
