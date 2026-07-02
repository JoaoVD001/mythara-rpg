import { db } from "@/lib/db"

export async function generateUniqueInviteCode(): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const code = String(Math.floor(10000 + Math.random() * 90000))
    const existing = await db.campaign.findUnique({ where: { inviteCode: code } })
    if (!existing) return code
  }
  // Fallback improvável: adiciona 1 dígito extra se tiver muita colisão
  return String(Math.floor(100000 + Math.random() * 900000))
}
