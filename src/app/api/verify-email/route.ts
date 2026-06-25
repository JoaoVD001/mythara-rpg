import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=token-invalido", req.url))
  }

  const verificationToken = await db.emailVerificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken || verificationToken.expires < new Date()) {
    if (verificationToken) {
      await db.emailVerificationToken.delete({ where: { token } })
    }
    return NextResponse.redirect(new URL("/login?error=token-expirado", req.url))
  }

  await db.user.update({
    where: { email: verificationToken.email },
    data: { emailVerified: new Date() },
  })

  await db.emailVerificationToken.delete({ where: { token } })

  return NextResponse.redirect(new URL("/email-verified", req.url))
}
