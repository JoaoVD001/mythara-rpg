import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SYSTEM_LABELS, type OrdemParanormalData } from "@/lib/systems"
import { ShieldCheck, Dices } from "lucide-react"

const SYSTEM_BADGE: Record<string, { className: string; icon: React.ReactNode }> = {
  "ordem-paranormal": {
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
    className: "flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium text-xs px-2.5 py-1 rounded-md",
  },
  "dnd5e": {
    icon: <Dices className="h-3.5 w-3.5" />,
    className: "flex items-center gap-1.5 border border-violet-500/30 bg-violet-500/10 text-violet-400 font-medium text-xs px-2.5 py-1 rounded-md",
  },
}
import { CampaignInvite } from "./campaign-invite"
import { MembersList } from "./members-list"
import { SessionsList } from "./sessions-list"
import { CampaignShop } from "./campaign-shop"
import { RewardsPanel } from "./rewards-panel"
import { PenaltiesPanel } from "./penalties-panel"

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
          character: { select: { id: true, name: true, system: true, data: true } },
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

  const myCharacters = await db.character.findMany({
    where: { userId, system: campaign.system },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  })

  const playerCharacterId = myMembership.character?.id
  let playerDinheiro = 0
  let playerPatente = "recruta"
  let playerPP = 0
  if (myMembership.character?.data) {
    try {
      const charData = JSON.parse(myMembership.character.data) as OrdemParanormalData
      playerDinheiro = parseInt(charData.dinheiro ?? "0", 10)
      playerPatente = charData.patente ?? "recruta"
      playerPP = parseInt(charData.pp ?? "0", 10)
    } catch { /* dados não disponíveis */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <div className="flex gap-2 mt-1 items-center flex-wrap">
            {SYSTEM_BADGE[campaign.system] ? (
              <span className={SYSTEM_BADGE[campaign.system].className}>
                {SYSTEM_BADGE[campaign.system].icon}
                {SYSTEM_LABELS[campaign.system] ?? campaign.system}
              </span>
            ) : (
              <Badge variant="secondary">{SYSTEM_LABELS[campaign.system] ?? campaign.system}</Badge>
            )}
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
          <TabsTrigger value="shop">Mercado</TabsTrigger>
          {isGm && <TabsTrigger value="rewards">Recompensas</TabsTrigger>}
          {isGm && <TabsTrigger value="conditions">Condições</TabsTrigger>}
          {isGm && <TabsTrigger value="invite">Convite</TabsTrigger>}
        </TabsList>

        <TabsContent value="members" className="pt-4">
          <MembersList
            members={campaign.members}
            currentUserId={userId}
            isGm={isGm}
            campaignId={campaign.id}
            myMemberId={myMembership.id}
            myCharacters={myCharacters}
            campaignSystem={campaign.system}
          />
        </TabsContent>

        <TabsContent value="sessions" className="pt-4">
          <SessionsList
            campaignId={campaign.id}
            sessions={campaign.sessions}
            isGm={isGm}
          />
        </TabsContent>

        <TabsContent value="shop" className="pt-4">
          <CampaignShop
            campaignId={campaign.id}
            system={campaign.system}
            isGm={isGm}
            initialEnabled={campaign.shopEnabled}
            initialConfig={(campaign.shopConfig as { mode?: "requisition" | "market"; disabled: string[]; overrides: Record<string, { price?: number }> }) ?? { mode: "requisition", disabled: [], overrides: {} }}
            playerCharacterId={playerCharacterId ?? undefined}
            playerDinheiro={playerDinheiro}
            playerPatente={playerPatente}
            playerPP={playerPP}
          />
        </TabsContent>

        {isGm && (
          <TabsContent value="rewards" className="pt-4">
            <RewardsPanel
              campaignId={campaign.id}
              members={campaign.members
                .map((m) => ({
                  id: m.id,
                  role: m.role,
                  user: m.user,
                  character: m.character
                    ? { id: m.character.id, name: m.character.name, data: m.character.data }
                    : null,
                }))}
            />
          </TabsContent>
        )}

        {isGm && (
          <TabsContent value="conditions" className="pt-4">
            <PenaltiesPanel
              campaignId={campaign.id}
              members={campaign.members.map((m) => ({
                id: m.id,
                role: m.role,
                user: m.user,
                character: m.character
                  ? { id: m.character.id, name: m.character.name, data: m.character.data }
                  : null,
              }))}
            />
          </TabsContent>
        )}

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
