import { auth } from "@/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { SYSTEM_LABELS } from "@/lib/systems"

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campanhas</h1>
          <p className="text-muted-foreground">
            {memberships.length} campanha{memberships.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Link>
        </Button>
      </div>

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
            <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{campaign.name}</CardTitle>
                  {campaign.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Badge variant="secondary">
                    {SYSTEM_LABELS[campaign.system] ?? campaign.system}
                  </Badge>
                  {role === "gm" && <Badge>Mestre</Badge>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
