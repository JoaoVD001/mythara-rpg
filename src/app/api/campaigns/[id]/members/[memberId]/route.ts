import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"

const patchSchema = z.object({
  characterId: z.string().nullable().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
  }

  const { memberId } = await params

  const member = await db.campaignMember.findUnique({ where: { id: memberId } })
  if (!member || member.userId !== session.user.id) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { characterId } = patchSchema.parse(body)

    const updated = await db.campaignMember.update({
      where: { id: memberId },
      data: { characterId: characterId ?? null },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Dados invalidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
