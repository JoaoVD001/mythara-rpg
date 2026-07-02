import { auth } from "@/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SYSTEM_LABELS } from "@/lib/systems"
import { JoinByCodeInput } from "./join-by-code"
import { CampaignCard } from "./campaign-card"
import { PendingInvites } from "./pending-invites"

export default async function CampaignsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const memberships = await db.campaignMember.findMany({
    where: { userId: session.user.id },
    include: { campaign: true },
    orderBy: { joinedAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campanhas</h1>
          <p className="text-muted-foreground">
            {memberships.length} campanha{memberships.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <JoinByCodeInput />
          <Button asChild className="h-9">
            <Link href="/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Link>
          </Button>
        </div>
      </div>

      {/* Convites pendentes — busca client-side */}
      <PendingInvites />

      {memberships.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-muted-foreground">
            Você não está em nenhuma campanha.
          </p>
          <Button asChild>
            <Link href="/campaigns/new">Criar campanha</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {memberships.map(({ campaign, role }) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              role={role}
              systemLabel={SYSTEM_LABELS[campaign.system] ?? campaign.system}
            />
          ))}
        </div>
      )}
    </div>
  )
}
