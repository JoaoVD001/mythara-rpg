import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { type OrdemParanormalData, type ActiveCondition, type ConditionAutoApply, ORDEM_PARANORMAL_CONDITIONS } from "@/lib/systems"

async function getGmMember(campaignId: string, userId: string) {
  return db.campaignMember.findFirst({
    where: { campaignId, userId, role: "gm" },
  })
}

async function getCharacterInCampaign(characterId: string, campaignId: string) {
  return db.character.findFirst({
    where: {
      id: characterId,
      memberships: { some: { campaignId } },
    },
  })
}

const autoApplySchema = z.object({
  field: z.enum(["str", "dex", "int", "pres", "vig", "hpMax", "sanityMax", "peMax"]),
  delta: z.number().int(),
})

const customConditionSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  shortEffect: z.string().min(1),
  autoApply: autoApplySchema.optional(),
})

// POST — aplicar condição
const postSchema = z.object({
  characterId: z.string(),
  conditionId: z.string(),
  notes: z.string().optional(),
  /** Present only when conditionId starts with "custom-" */
  customCondition: customConditionSchema.optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const { id: campaignId } = await params

  if (!await getGmMember(campaignId, session.user.id)) {
    return NextResponse.json({ error: "Apenas o Mestre pode aplicar condições" }, { status: 403 })
  }

  let body: z.infer<typeof postSchema>
  try {
    body = postSchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  const isCustom = body.conditionId.startsWith("custom-")

  // Resolve condition definition: built-in or custom
  let autoApply: ConditionAutoApply | undefined
  if (isCustom) {
    if (!body.customCondition) {
      return NextResponse.json({ error: "Dados da condição personalizada ausentes" }, { status: 400 })
    }
    autoApply = body.customCondition.autoApply
  } else {
    const conditionDef = ORDEM_PARANORMAL_CONDITIONS.find(c => c.id === body.conditionId)
    if (!conditionDef) {
      return NextResponse.json({ error: "Condição não encontrada" }, { status: 400 })
    }
    autoApply = conditionDef.autoApply
  }

  const character = await getCharacterInCampaign(body.characterId, campaignId)
  if (!character) {
    return NextResponse.json({ error: "Personagem não encontrado" }, { status: 404 })
  }

  const data = JSON.parse(character.data) as OrdemParanormalData
  const conditions: ActiveCondition[] = JSON.parse(data.conditions ?? "[]")

  // Não duplicar
  if (conditions.some(c => c.id === body.conditionId)) {
    return NextResponse.json({ error: "Condição já ativa" }, { status: 409 })
  }

  const newCondition: ActiveCondition = {
    id: body.conditionId,
    notes: body.notes,
    appliedAt: new Date().toISOString(),
    ...(isCustom && body.customCondition ? { custom: body.customCondition } : {}),
  }

  const updatedData: OrdemParanormalData = {
    ...data,
    conditions: JSON.stringify([...conditions, newCondition]),
  }

  // Aplicar efeito numérico automático
  if (autoApply) {
    const { field, delta } = autoApply
    const current = parseInt(updatedData[field] ?? "0", 10)
    updatedData[field] = String(Math.max(0, current + delta))
  }

  await db.character.update({
    where: { id: character.id },
    data: { data: JSON.stringify(updatedData) },
  })

  return NextResponse.json({
    characterId: character.id,
    conditions: JSON.parse(updatedData.conditions ?? "[]"),
    charData: {
      str: updatedData.str,
      dex: updatedData.dex,
      int: updatedData.int,
      pres: updatedData.pres,
      vig: updatedData.vig,
      hpMax: updatedData.hpMax,
      sanityMax: updatedData.sanityMax,
      peMax: updatedData.peMax,
    },
  })
}

// DELETE — remover condição
const deleteSchema = z.object({
  characterId: z.string(),
  conditionId: z.string(),
})

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const { id: campaignId } = await params

  if (!await getGmMember(campaignId, session.user.id)) {
    return NextResponse.json({ error: "Apenas o Mestre pode remover condições" }, { status: 403 })
  }

  let body: z.infer<typeof deleteSchema>
  try {
    body = deleteSchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  const character = await getCharacterInCampaign(body.characterId, campaignId)
  if (!character) {
    return NextResponse.json({ error: "Personagem não encontrado" }, { status: 404 })
  }

  const data = JSON.parse(character.data) as OrdemParanormalData
  const conditions: ActiveCondition[] = JSON.parse(data.conditions ?? "[]")

  // Resolve autoApply from built-in list or from stored custom data
  const existing = conditions.find(c => c.id === body.conditionId)
  const builtIn = ORDEM_PARANORMAL_CONDITIONS.find(c => c.id === body.conditionId)
  const autoApply: ConditionAutoApply | undefined = existing?.custom?.autoApply ?? builtIn?.autoApply

  const updatedConditions = conditions.filter(c => c.id !== body.conditionId)

  const updatedData: OrdemParanormalData = {
    ...data,
    conditions: JSON.stringify(updatedConditions),
  }

  // Reverter efeito numérico automático
  if (autoApply) {
    const { field, delta } = autoApply
    const current = parseInt(updatedData[field] ?? "0", 10)
    updatedData[field] = String(Math.max(0, current - delta))
  }

  await db.character.update({
    where: { id: character.id },
    data: { data: JSON.stringify(updatedData) },
  })

  return NextResponse.json({
    characterId: character.id,
    conditions: updatedConditions,
    charData: {
      str: updatedData.str,
      dex: updatedData.dex,
      int: updatedData.int,
      pres: updatedData.pres,
      vig: updatedData.vig,
      hpMax: updatedData.hpMax,
      sanityMax: updatedData.sanityMax,
      peMax: updatedData.peMax,
    },
  })
}
