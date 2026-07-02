import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"

const bodySchema = z.object({ toUserId: z.string() })

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id: campaignId } = await params

  const gmMember = await db.campaignMember.findFirst({
    where: { campaignId, userId: session.user.id, role: "gm" },
  })
  if (!gmMember) return NextResponse.json({ error: "Apenas o Mestre pode convidar" }, { status: 403 })

  let body: z.infer<typeof bodySchema>
  try { body = bodySchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: "Dados inválidos" }, { status: 400 }) }

  const alreadyMember = await db.campaignMember.findFirst({
    where: { campaignId, userId: body.toUserId },
  })
  if (alreadyMember) return NextResponse.json({ error: "Jogador já é membro da campanha" }, { status: 409 })

  try {
    const invite = await db.campaignInvite.create({
      data: { campaignId, fromId: session.user.id, toId: body.toUserId },
    })
    return NextResponse.json(invite, { status: 201 })
  } catch {
    // @@unique violation — convite já existe
    return NextResponse.json({ error: "Convite já enviado para este jogador" }, { status: 409 })
  }
}
