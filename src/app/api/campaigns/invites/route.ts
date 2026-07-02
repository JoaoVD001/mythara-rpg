import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const invites = await db.campaignInvite.findMany({
    where: { toId: session.user.id, status: "pending" },
    include: {
      campaign: { select: { id: true, name: true, system: true } },
      from:     { select: { name: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(invites)
}
