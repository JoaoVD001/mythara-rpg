import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
  }

  const { id } = await params
  const character = await db.character.findUnique({ where: { id } })
  if (!character || character.userId !== session.user.id) {
    return NextResponse.json({ error: "Nao encontrado" }, { status: 404 })
  }

  try {
    const body = await req.json()
    const updates = updateSchema.parse(body)

    const updated = await db.character.update({
      where: { id },
      data: {
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.data ? { data: JSON.stringify(updates.data) } : {}),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Dados invalidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
  }

  const { id } = await params
  const character = await db.character.findUnique({ where: { id } })
  if (!character || character.userId !== session.user.id) {
    return NextResponse.json({ error: "Nao encontrado" }, { status: 404 })
  }

  await db.character.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
