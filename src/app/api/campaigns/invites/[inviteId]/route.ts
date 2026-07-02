import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"

const bodySchema = z.object({
  status: z.enum(["accepted", "declined"]),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ inviteId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { inviteId } = await params

  const invite = await db.campaignInvite.findUnique({
    where: { id: inviteId },
  })
  if (!invite) return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 })
  if (invite.toId !== session.user.id) return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  if (invite.status !== "pending") return NextResponse.json({ error: "Convite já respondido" }, { status: 409 })

  let body: z.infer<typeof bodySchema>
  try { body = bodySchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: "Dados inválidos" }, { status: 400 }) }

  if (body.status === "accepted") {
    // Verificar se já é membro (edge case)
    const existing = await db.campaignMember.findFirst({
      where: { campaignId: invite.campaignId, userId: invite.toId },
    })
    if (!existing) {
      await db.campaignMember.create({
        data: { campaignId: invite.campaignId, userId: invite.toId, role: "player" },
      })
    }
  }

  const updated = await db.campaignInvite.update({
    where: { id: inviteId },
    data: { status: body.status },
    include: {
      campaign: { select: { id: true, name: true, system: true } },
    },
  })

  return NextResponse.json(updated)
}
