import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { type OrdemParanormalData, getPatenteForPP } from "@/lib/systems"

const schema = z.object({
  delta: z.number().optional(),
  pp: z.number().int().min(0).optional(),
}).refine((d) => d.delta !== undefined || d.pp !== undefined, {
  message: "Forneça delta ou pp",
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const { id: campaignId, memberId } = await params

  // Verificar que o requester é GM da campanha
  const requesterMembership = await db.campaignMember.findFirst({
    where: { campaignId, userId: session.user.id, role: "gm" },
  })
  if (!requesterMembership) {
    return NextResponse.json({ error: "Apenas o Mestre pode gerenciar PP" }, { status: 403 })
  }

  // Buscar o membro alvo com seu personagem
  const targetMember = await db.campaignMember.findUnique({
    where: { id: memberId },
    include: { character: true },
  })
  if (!targetMember || targetMember.campaignId !== campaignId) {
    return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 })
  }
  if (!targetMember.character) {
    return NextResponse.json({ error: "Membro não tem personagem" }, { status: 400 })
  }

  let body: { delta?: number; pp?: number }
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  const charData = JSON.parse(targetMember.character.data) as OrdemParanormalData
  const currentPP = parseInt(charData.pp ?? "0", 10)
  const newPP = Math.max(0, body.pp !== undefined ? body.pp : currentPP + (body.delta ?? 0))
  const newPatente = getPatenteForPP(newPP)

  const updatedData: OrdemParanormalData = {
    ...charData,
    pp: String(newPP),
    patente: newPatente.id,
  }

  await db.character.update({
    where: { id: targetMember.character.id },
    data: { data: JSON.stringify(updatedData) },
  })

  return NextResponse.json({ pp: newPP, patente: newPatente.id, patenteName: newPatente.name })
}
