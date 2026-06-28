import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import type { ShopConfig } from "@/lib/systems"

async function getGmCampaign(campaignId: string, userId: string) {
  const campaign = await db.campaign.findUnique({
    where: { id: campaignId },
    include: { members: { where: { userId } } },
  })
  if (!campaign) return null
  const member = campaign.members[0]
  if (!member || member.role !== "gm") return null
  return campaign
}

// GET — retorna config atual do mercado
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const { id } = await params
  const campaign = await db.campaign.findUnique({
    where: { id },
    include: { members: { where: { userId: session.user.id } } },
  })

  if (!campaign || !campaign.members[0]) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
  }

  return NextResponse.json({
    shopEnabled: campaign.shopEnabled,
    shopConfig: campaign.shopConfig ?? { disabled: [], overrides: {} },
    system: campaign.system,
  })
}

// PATCH — atualiza config do mercado (só GM)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const { id } = await params
  const campaign = await getGmCampaign(id, session.user.id)
  if (!campaign) return NextResponse.json({ error: "Proibido" }, { status: 403 })

  const body = await req.json()
  const updates: { shopEnabled?: boolean; shopConfig?: ShopConfig } = {}

  if (typeof body.shopEnabled === "boolean") updates.shopEnabled = body.shopEnabled
  if (body.shopConfig) updates.shopConfig = body.shopConfig

  const updated = await db.campaign.update({
    where: { id },
    data: updates,
  })

  return NextResponse.json({
    shopEnabled: updated.shopEnabled,
    shopConfig: updated.shopConfig,
  })
}
