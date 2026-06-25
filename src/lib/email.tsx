import { Resend } from "resend"
import { render } from "@react-email/render"
import { VerificationEmail } from "@/emails/verification-email"
import { PasswordResetEmail } from "@/emails/password-reset-email"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  const verifyUrl = `${baseUrl}/api/verify-email?token=${token}`

  const html = await render(<VerificationEmail name={name} verifyUrl={verifyUrl} />)

  const result = await resend.emails.send({
    from: "Mythara RPG <onboarding@resend.dev>",
    to: email,
    subject: "⚔ Confirme seu email — Mythara RPG",
    html,
  })

  if (result.error) {
    throw new Error(`Resend error: ${JSON.stringify(result.error)}`)
  }

  console.log("Email enviado:", result.data?.id)
}

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  const resetUrl = `${baseUrl}/reset-password?token=${token}`

  const html = await render(<PasswordResetEmail name={name} resetUrl={resetUrl} />)

  const result = await resend.emails.send({
    from: "Mythara RPG <onboarding@resend.dev>",
    to: email,
    subject: "🔑 Redefinição de senha — Mythara RPG",
    html,
  })

  if (result.error) {
    throw new Error(`Resend error: ${JSON.stringify(result.error)}`)
  }

  console.log("Email de reset enviado:", result.data?.id)
}
