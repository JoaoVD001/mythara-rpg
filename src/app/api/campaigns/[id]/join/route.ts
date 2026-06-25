import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"

const joinSchema = z.object({
  characterId: z.string().optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
  }

  const { id } = await params

  const campaign = await db.campaign.findUnique({ where: { id } })
  if (!campaign) {
    return NextResponse.json({ error: "Campanha nao encontrada" }, { status: 404 })
  }

  const existing = await db.campaignMember.findUnique({
    where: { userId_campaignId: { userId: session.user.id, campaignId: id } },
  })
  if (existing) {
    return NextResponse.json({ error: "Voce ja esta nesta campanha" }, { status: 400 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { characterId } = joinSchema.parse(body)

    const member = await db.campaignMember.create({
      data: {
        userId: session.user.id,
        campaignId: id,
        role: "player",
        characterId: characterId ?? null,
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Dados invalidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
