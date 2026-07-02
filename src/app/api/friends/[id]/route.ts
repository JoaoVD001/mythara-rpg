import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

// PATCH /api/friends/[id] — aceitar ou recusar solicitação
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params
  const { status } = await req.json() as { status?: string }

  if (status !== "accepted" && status !== "declined") {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 })
  }

  const friendship = await db.friendship.findUnique({ where: { id } })
  if (!friendship) return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 })
  if (friendship.toId !== session.user.id) return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  if (friendship.status !== "pending") return NextResponse.json({ error: "Solicitação já processada" }, { status: 400 })

  const updated = await db.friendship.update({ where: { id }, data: { status } })
  return NextResponse.json(updated)
}

// DELETE /api/friends/[id] — desfazer amizade
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params
  const friendship = await db.friendship.findUnique({ where: { id } })
  if (!friendship) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })

  const me = session.user.id
  if (friendship.fromId !== me && friendship.toId !== me) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  }

  await db.friendship.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
