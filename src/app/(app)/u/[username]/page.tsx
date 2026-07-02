import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Sword, User, Scroll, Calendar, AtSign } from "lucide-react"
import { SYSTEM_LABELS } from "@/lib/systems"
import { FriendButton } from "./friend-button"
import { InviteToCampaignButton } from "./invite-button"

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const session = await auth()
  const viewerId = session?.user?.id ?? null

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

  if (!user) notFound()

  const joinYear = new Date(user.createdAt).getFullYear()

  // Campanhas onde o viewer é GM — para o botão de convite
  const viewerGmCampaigns = viewerId && viewerId !== user.id
    ? await db.campaign.findMany({
        where: {
          members: { some: { userId: viewerId, role: "gm" } },
          // Excluir campanhas onde o target já é membro
          NOT: { members: { some: { userId: user.id } } },
        },
        select: { id: true, name: true, system: true },
        orderBy: { createdAt: "desc" },
      })
    : []

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">

      {/* Header do perfil */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar */}
        <div className="shrink-0 w-20 h-20 rounded-2xl border border-white/10 bg-primary/10 flex items-center justify-center overflow-hidden shadow-[0_0_32px_-8px] shadow-primary/20">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="h-9 w-9 text-primary/50" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div>
            <h1 className="text-2xl font-bold font-[Cinzel]">{user.name}</h1>
            {user.username && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground justify-center sm:justify-start">
                <AtSign className="h-3.5 w-3.5" />
                {user.username}
              </p>
            )}
          </div>

          {user.bio && (
            <p className="text-sm text-foreground/80 leading-relaxed max-w-sm">{user.bio}</p>
          )}

          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Na plataforma desde {joinYear}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Scroll className="h-3.5 w-3.5" />
              {user._count.characters} ficha{user._count.characters !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sword className="h-3.5 w-3.5" />
              {user.ownedCampaigns.length} campanha{user.ownedCampaigns.length !== 1 ? "s" : ""} como mestre
            </span>
          </div>
        </div>

        {/* Botão de amizade */}
        {user.username && viewerId && viewerId !== user.id && (
          <div className="shrink-0">
            <FriendButton targetId={user.id} targetUsername={user.username} />
          </div>
        )}
      </div>

      {/* Convidar para campanha */}
      {viewerGmCampaigns.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/60 flex items-center gap-2">
            <Sword className="h-4 w-4" />
            Convidar para campanha
          </h2>
          <div className="space-y-2">
            {viewerGmCampaigns.map((c) => (
              <div key={c.id}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/8 bg-white/[0.03]">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5">
                    {SYSTEM_LABELS[c.system] ?? c.system}
                  </p>
                </div>
                <InviteToCampaignButton
                  campaignId={c.id}
                  toUserId={user.id}
                  targetName={user.name}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Campanhas como mestre */}
      {user.ownedCampaigns.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/40 flex items-center gap-2">
            <Sword className="h-4 w-4" />
            Mestre em
          </h2>
          <div className="space-y-2">
            {user.ownedCampaigns.map((c) => (
              <div key={c.id}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/8 bg-white/[0.03]">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {SYSTEM_LABELS[c.system] ?? c.system}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      {user.ownedCampaigns.length === 0 && viewerGmCampaigns.length === 0 && (
        <div className="text-center py-10 text-muted-foreground space-y-2">
          <Sword className="h-8 w-8 mx-auto opacity-20" />
          <p className="text-sm">{user.name} ainda não criou nenhuma campanha.</p>
        </div>
      )}

      <div className="pt-4 border-t border-white/6">
        <Link href="/friends" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Voltar
        </Link>
      </div>
    </div>
  )
}
