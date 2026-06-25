import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "NÃ£o autenticado" }, { status: 401 })
  }

  const characters = await db.character.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, system: true },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(characters)
}
