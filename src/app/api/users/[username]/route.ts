import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      image: true,
      createdAt: true,
      ownedCampaigns: { select: { id: true, name: true, system: true } },
      _count: { select: { characters: true } },
    },
  })

  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

  return NextResponse.json({
    id: user.id,
    name: user.name,
    username: user.username,
    bio: user.bio,
    image: user.image,
    createdAt: user.createdAt,
    campaignsAsGm: user.ownedCampaigns,
    charactersCount: user._count.characters,
  })
}
