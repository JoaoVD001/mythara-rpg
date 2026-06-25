import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"

const schema = z.object({
  email: z.string().email("Email inválido"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = schema.parse(body)

    const user = await db.user.findUnique({ where: { email } })

    // Always return success to avoid user enumeration
    if (!user) {
      return NextResponse.json({ ok: true })
    }

    await db.passwordResetToken.deleteMany({ where: { email } })

    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    const token = await db.passwordResetToken.create({
      data: { email, expires },
    })

    await sendPasswordResetEmail(email, token.token, user.name)

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
