import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const campaign = await db.campaign.findUnique({
    where: { inviteCode: code },
    select: { id: true, name: true, system: true },
  })

  if (!campaign) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
  }

  return NextResponse.json(campaign)
}
