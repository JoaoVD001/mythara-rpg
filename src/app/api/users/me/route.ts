import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, username: true, bio: true, image: true, createdAt: true },
  })

  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const body = await req.json()
  const { name, username, bio } = body as { name?: string; username?: string; bio?: string }

  // Validar username
  if (username !== undefined) {
    if (username !== "" && !/^[a-z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json(
        { error: "Username inválido. Use 3–20 caracteres: letras minúsculas, números ou _" },
        { status: 400 }
      )
    }
    if (username !== "") {
      const existing = await db.user.findUnique({ where: { username } })
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json({ error: "Este username já está em uso" }, { status: 409 })
      }
    }
  }

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && name.trim() ? { name: name.trim() } : {}),
      ...(username !== undefined ? { username: username || null } : {}),
      ...(bio !== undefined ? { bio: bio.trim().slice(0, 160) || null } : {}),
    },
    select: { id: true, name: true, username: true, bio: true, image: true, createdAt: true },
  })

  return NextResponse.json(updated)
}
