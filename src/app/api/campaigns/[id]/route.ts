import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params

  const campaign = await db.campaign.findUnique({ where: { id } })
  if (!campaign) return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 })
  if (campaign.ownerId !== session.user.id) return NextResponse.json({ error: "Sem permissão" }, { status: 403 })

  await db.campaign.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
