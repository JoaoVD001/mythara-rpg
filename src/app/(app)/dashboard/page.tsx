import { auth } from "@/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Sword, Users, ChevronRight } from "lucide-react"
import { SYSTEM_LABELS } from "@/lib/systems"
import { redirect } from "next/navigation"
import { cn } from "@/lib/utils"
import { PendingInvites } from "@/app/(app)/campaigns/pending-invites"

const systemStyles: Record<string, string> = {
  "ordem-paranormal":
    "bg-red-950/60 text-red-300 border border-red-900/50",
  "dnd5e":
    "bg-blue-950/60 text-blue-300 border border-blue-900/50",
}

function SystemBadge({ system }: { system: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        systemStyles[system] ?? "bg-muted text-muted-foreground border border-border"
      )}
    >
      {SYSTEM_LABELS[system] ?? system}
    </span>
  )
}

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) redirect("/login")

  const [characters, campaigns] = await Promise.all([
    db.character.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    db.campaignMember.findMany({
      where: { userId },
      include: { campaign: true },
      orderBy: { joinedAt: "desc" },
      take: 6,
    }),
  ])

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-wider">
          Olá, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Seus personagens e campanhas recentes.
        </p>
      </div>

      <PendingInvites />

      {/* Fichas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2 text-foreground/90">
            <Sword className="h-4 w-4 text-primary" />
            Fichas de Personagem
          </h2>
          <Button asChild size="sm" className="glow-primary-sm">
            <Link href="/characters/new">
              <Plus className="h-4 w-4" />
              Nova Ficha
            </Link>
          </Button>
        </div>

        {characters.length === 0 ? (
          <div className="border border-dashed border-border/60 rounded-xl p-8 text-center space-y-3">
            <Sword className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm text-muted-foreground">Nenhuma ficha criada ainda.</p>
            <Button asChild size="sm" variant="outline">
              <Link href="/characters/new">Criar primeira ficha</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((char) => (
              <Link key={char.id} href={`/characters/${char.id}`} className="group">
                <Card className="hover:border-primary/40 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10 transition-all duration-200 cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{char.name}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SystemBadge system={char.system} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Campanhas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2 text-foreground/90">
            <Users className="h-4 w-4 text-primary" />
            Campanhas
          </h2>
          <Button asChild size="sm" className="glow-primary-sm">
            <Link href="/campaigns/new">
              <Plus className="h-4 w-4" />
              Nova Campanha
            </Link>
          </Button>
        </div>

        {campaigns.length === 0 ? (
          <div className="border border-dashed border-border/60 rounded-xl p-8 text-center space-y-3">
            <Users className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm text-muted-foreground">
              Você não está em nenhuma campanha ainda.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/campaigns/new">Criar campanha</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map(({ campaign, role }) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="group">
                <Card className="hover:border-primary/40 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10 transition-all duration-200 cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{campaign.name}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <SystemBadge system={campaign.system} />
                    {role === "gm" && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                        Mestre
                      </span>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
