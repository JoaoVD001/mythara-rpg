import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"

export async function POST() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const email = session.user.email

  const user = await db.user.findUnique({
    where: { email },
    select: { name: true, emailVerified: true },
  })

  if (user?.emailVerified) {
    return NextResponse.json({ error: "Email já verificado" }, { status: 400 })
  }

  await db.emailVerificationToken.deleteMany({ where: { email } })

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const verificationToken = await db.emailVerificationToken.create({
    data: { email, expires },
  })

  await sendVerificationEmail(email, verificationToken.token, user?.name ?? "Aventureiro")

  return NextResponse.json({ success: true })
}
