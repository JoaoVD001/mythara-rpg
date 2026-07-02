import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

// GET /api/friends/requests — solicitações pendentes recebidas
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const requests = await db.friendship.findMany({
    where: { toId: session.user.id, status: "pending" },
    include: {
      from: { select: { id: true, name: true, username: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(requests)
}
