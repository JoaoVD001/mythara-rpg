import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"

const createSchema = z.object({
  name: z.string().min(1, "Nome e obrigatorio"),
  system: z.enum(["ordem-paranormal", "dnd5e"]),
  data: z.record(z.string(), z.unknown()),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, system, data } = createSchema.parse(body)

    const character = await db.character.create({
      data: {
        name,
        system,
        data: JSON.stringify(data),
        userId: session.user.id,
      },
    })

    return NextResponse.json(character, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Dados invalidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
