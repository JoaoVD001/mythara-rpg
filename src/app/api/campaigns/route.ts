import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"

const createSchema = z.object({
  name: z.string().min(1, "Nome e obrigatorio"),
  system: z.enum(["ordem-paranormal", "dnd5e"]),
  description: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, system, description } = createSchema.parse(body)

    const campaign = await db.campaign.create({
      data: {
        name,
        system,
        description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "gm",
          },
        },
      },
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Dados invalidos" }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
