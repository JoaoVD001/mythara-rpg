"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, UserPlus, Check, X, Users, AtSign, Search, AlertCircle } from "lucide-react"
import { PendingInvites } from "@/app/(app)/campaigns/pending-invites"

type Friend = { id: string; name: string; username: string | null; image: string | null }
type FriendRequest = {
  id: string
  status: string
  createdAt: string
  from: Friend
}

function UserAvatar({ user, size = "md" }: { user: Friend; size?: "sm" | "md" }) {
  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-10 w-10"
  return (
    <Avatar className={sizeClass}>
      <AvatarImage src={user.image ?? undefined} />
      <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{initials}</AvatarFallback>
    </Avatar>
  )
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [addUsername, setAddUsername] = useState("")
  const [adding, setAdding] = useState(false)
  const [respondingId, setRespondingId] = useState<string | null>(null)
  const [myUsername, setMyUsername] = useState<string | null | undefined>(undefined)

  const refresh = useCallback(async () => {
    const [friendsRes, requestsRes, meRes] = await Promise.all([
      fetch("/api/friends"),
      fetch("/api/friends/requests"),
      fetch("/api/users/me"),
    ])
    if (friendsRes.ok) setFriends(await friendsRes.json())
    if (requestsRes.ok) setRequests(await requestsRes.json())
    if (meRes.ok) {
      const me = await meRes.json()
      setMyUsername(me.username ?? null)
    }
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const username = addUsername.trim().replace(/^@/, "")
    if (!username) return
    setAdding(true)
    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
    setAdding(false)
    if (!res.ok) {
      const body = await res.json()
      toast.error(body.error || "Erro ao enviar solicitação")
      return
    }
    toast.success(`Solicitação enviada para @${username}!`)
    setAddUsername("")
  }

  async function respond(requestId: string, status: "accepted" | "declined") {
    setRespondingId(requestId)
    const res = await fetch(`/api/friends/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setRespondingId(null)
    if (!res.ok) { toast.error("Erro ao processar solicitação"); return }
    toast.success(status === "accepted" ? "Solicitação aceita!" : "Solicitação recusada")
    refresh()
  }

  const pendingCount = requests.length

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[Cinzel]">Amigos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas amizades e encontre jogadores.
        </p>
      </div>

      <PendingInvites />

      {/* Aviso para contas sem username */}
      {myUsername === null && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-medium text-amber-300">Você ainda não tem um username</p>
            <p className="text-amber-300/60 text-xs mt-0.5">
              Sem username, outros jogadores não conseguem te encontrar para adicionar como amigo.{" "}
              <Link href="/settings/profile" className="underline hover:text-amber-300 transition-colors">
                Definir agora →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Adicionar amigo */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <div className="relative flex-1">
          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={addUsername}
            onChange={(e) => setAddUsername(e.target.value)}
            placeholder="username do jogador"
            className="pl-9 h-10 font-mono"
            aria-label="Username para adicionar como amigo"
          />
        </div>
        <Button type="submit" disabled={adding || !addUsername.trim()} className="h-10 gap-2">
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {adding ? "" : "Adicionar"}
        </Button>
      </form>

      {/* Tabs */}
      <Tabs defaultValue="friends">
        <TabsList className="w-full">
          <TabsTrigger value="friends" className="flex-1 gap-2">
            <Users className="h-4 w-4" />
            Amigos ({friends.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex-1 gap-2">
            Solicitações
            {pendingCount > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-1">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-12 space-y-3 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto opacity-20" />
              <div>
                <p className="text-sm font-medium">Nenhum amigo ainda</p>
                <p className="text-xs">Adicione jogadores pelo username acima.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {friends.map((f) => (
                <div key={f.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                  <UserAvatar user={f} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{f.name}</p>
                    {f.username && <p className="text-xs text-muted-foreground">@{f.username}</p>}
                  </div>
                  {f.username && (
                    <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
                      <Link href={`/u/${f.username}`}>
                        <Search className="h-3.5 w-3.5 mr-1" />
                        Perfil
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground space-y-2">
              <p className="text-sm">Nenhuma solicitação pendente.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {requests.map((r) => (
                <div key={r.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/8 bg-white/[0.03]">
                  <UserAvatar user={r.from} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{r.from.name}</p>
                    {r.from.username && <p className="text-xs text-muted-foreground">@{r.from.username}</p>}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => respond(r.id, "accepted")}
                      disabled={respondingId === r.id}
                      className="h-8 w-8 p-0 bg-emerald-600/80 hover:bg-emerald-600 border-0"
                      aria-label="Aceitar"
                    >
                      {respondingId === r.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Check className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => respond(r.id, "declined")}
                      disabled={respondingId === r.id}
                      className="h-8 w-8 p-0 border-red-500/30 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                      aria-label="Recusar"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
