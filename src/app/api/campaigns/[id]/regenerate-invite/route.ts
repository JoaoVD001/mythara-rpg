import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { generateUniqueInviteCode } from "@/lib/invite-code"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params

  const campaign = await db.campaign.findUnique({ where: { id } })
  if (!campaign) return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 })
  if (campaign.ownerId !== session.user.id) return NextResponse.json({ error: "Sem permissão" }, { status: 403 })

  const newCode = await generateUniqueInviteCode()
  const updated = await db.campaign.update({
    where: { id },
    data: { inviteCode: newCode },
    select: { inviteCode: true },
  })

  return NextResponse.json({ inviteCode: updated.inviteCode })
}
