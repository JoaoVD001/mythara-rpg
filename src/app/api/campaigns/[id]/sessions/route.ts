import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"

const createSchema = z.object({
  title: z.string().min(1, "Titulo e obrigatorio"),
  notes: z.string().optional(),
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
  if (!campaign || campaign.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { title, notes } = createSchema.parse(body)

    const gameSession = await db.gameSession.create({
      data: { campaignId: id, title, notes },
    })

    return NextResponse.json(gameSession, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Dados invalidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
