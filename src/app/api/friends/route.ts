import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

// GET /api/friends — listar amigos aceitos
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const me = session.user.id

  const friendships = await db.friendship.findMany({
    where: {
      status: "accepted",
      OR: [{ fromId: me }, { toId: me }],
    },
    include: {
      from: { select: { id: true, name: true, username: true, image: true } },
      to:   { select: { id: true, name: true, username: true, image: true } },
    },
  })

  const friends = friendships.map((f) => (f.fromId === me ? f.to : f.from))
  return NextResponse.json(friends)
}

// POST /api/friends — enviar solicitação
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const me = session.user.id
  const { username } = await req.json() as { username?: string }

  if (!username) return NextResponse.json({ error: "Username obrigatório" }, { status: 400 })

  const target = await db.user.findUnique({ where: { username } })
  if (!target) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  if (target.id === me) return NextResponse.json({ error: "Não é possível adicionar a si mesmo" }, { status: 400 })

  const existing = await db.friendship.findFirst({
    where: { OR: [{ fromId: me, toId: target.id }, { fromId: target.id, toId: me }] },
  })
  if (existing) {
    if (existing.status === "accepted") return NextResponse.json({ error: "Vocês já são amigos" }, { status: 409 })
    if (existing.status === "pending") return NextResponse.json({ error: "Solicitação já enviada" }, { status: 409 })
  }

  const friendship = await db.friendship.create({
    data: { fromId: me, toId: target.id, status: "pending" },
  })

  return NextResponse.json(friendship, { status: 201 })
}
