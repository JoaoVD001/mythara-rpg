import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SYSTEM_LABELS } from "@/lib/systems"
import { CampaignInvite } from "./campaign-invite"
import { MembersList } from "./members-list"
import { SessionsList } from "./sessions-list"

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { id } = await params

  const campaign = await db.campaign.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, image: true } },
          character: { select: { id: true, name: true, system: true } },
        },
        orderBy: { joinedAt: "asc" },
      },
      sessions: { orderBy: { date: "desc" } },
    },
  })

  if (!campaign) notFound()

  const userId = session.user?.id
  if (!userId) redirect("/login")

  const myMembership = campaign.members.find((m) => m.userId === userId)
  if (!myMembership) notFound()

  const isGm = myMembership.role === "gm"

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary">
              {SYSTEM_LABELS[campaign.system] ?? campaign.system}
            </Badge>
            {isGm && <Badge>Mestre</Badge>}
          </div>
          {campaign.description && (
            <p className="text-muted-foreground mt-2 text-sm max-w-xl">
              {campaign.description}
            </p>
          )}
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">
            Jogadores ({campaign.members.length})
          </TabsTrigger>
          <TabsTrigger value="sessions">
            Sessões ({campaign.sessions.length})
          </TabsTrigger>
          {isGm && <TabsTrigger value="invite">Convite</TabsTrigger>}
        </TabsList>

        <TabsContent value="members" className="pt-4">
          <MembersList
            members={campaign.members}
            currentUserId={userId}
            isGm={isGm}
          />
        </TabsContent>

        <TabsContent value="sessions" className="pt-4">
          <SessionsList
            campaignId={campaign.id}
            sessions={campaign.sessions}
            isGm={isGm}
          />
        </TabsContent>

        {isGm && (
          <TabsContent value="invite" className="pt-4">
            <CampaignInvite
              campaignId={campaign.id}
              inviteCode={campaign.inviteCode}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
