import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { type OrdemParanormalData } from "@/lib/systems"

const schema = z.object({
  rewards: z.array(z.object({
    characterId: z.string(),
    delta: z.number().int(),
  })).min(1),
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

  const gmMember = await db.campaignMember.findFirst({
    where: { campaignId, userId: session.user.id, role: "gm" },
  })
  if (!gmMember) {
    return NextResponse.json({ error: "Apenas o Mestre pode distribuir recompensas" }, { status: 403 })
  }

  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  const results: { characterId: string; newDinheiro: number }[] = []

  for (const { characterId, delta } of body.rewards) {
    if (delta === 0) continue

    const character = await db.character.findFirst({
      where: {
        id: characterId,
        memberships: { some: { campaignId } },
      },
    })
    if (!character) continue

    const data = JSON.parse(character.data) as OrdemParanormalData
    const current = parseInt(data.dinheiro ?? "0", 10)
    const newDinheiro = Math.max(0, current + delta)

    const updated: OrdemParanormalData = { ...data, dinheiro: String(newDinheiro) }
    await db.character.update({
      where: { id: characterId },
      data: { data: JSON.stringify(updated) },
    })

    results.push({ characterId, newDinheiro })
  }

  return NextResponse.json({ results })
}
