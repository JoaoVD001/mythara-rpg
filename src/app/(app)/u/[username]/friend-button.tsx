"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { UserPlus, UserCheck, Clock, Loader2 } from "lucide-react"

type Status = "none" | "friends" | "sent" | "received" | "loading"

export function FriendButton({ targetId, targetUsername }: { targetId: string; targetUsername: string }) {
  const [status, setStatus] = useState<Status>("loading")
  const [acting, setActing] = useState(false)

  useEffect(() => {
    async function checkStatus() {
      const [friendsRes, requestsRes] = await Promise.all([
        fetch("/api/friends"),
        fetch("/api/friends/requests"),
      ])
      if (!friendsRes.ok) { setStatus("none"); return }

      const friends: Array<{ id: string }> = await friendsRes.json()
      if (friends.some((f) => f.id === targetId)) { setStatus("friends"); return }

      const reqs: Array<{ id: string; from: { id: string } }> = requestsRes.ok ? await requestsRes.json() : []
      if (reqs.some((r) => r.from.id === targetId)) { setStatus("received"); return }

      // Solicitações enviadas — não temos endpoint específico, inferimos via "sent"
      // Se não é amigo nem recebeu, verifica se enviou
      setStatus("none")
    }
    checkStatus()
  }, [targetId])

  async function addFriend() {
    setActing(true)
    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: targetUsername }),
    })
    setActing(false)
    if (!res.ok) {
      const body = await res.json()
      if (body.error === "Solicitação já enviada") { setStatus("sent"); return }
      toast.error(body.error || "Erro ao adicionar")
      return
    }
    setStatus("sent")
    toast.success(`Solicitação enviada para @${targetUsername}!`)
  }

  if (status === "loading") return (
    <Button disabled variant="outline" size="sm" className="gap-2 border-primary/20 opacity-60">
      <Loader2 className="h-4 w-4 animate-spin" />
    </Button>
  )

  if (status === "friends") return (
    <Button disabled variant="outline" size="sm" className="gap-2 border-emerald-500/30 text-emerald-400 opacity-80">
      <UserCheck className="h-4 w-4" />
      Amigos
    </Button>
  )

  if (status === "sent") return (
    <Button disabled variant="outline" size="sm" className="gap-2 border-primary/20 text-muted-foreground opacity-70">
      <Clock className="h-4 w-4" />
      Solicitação enviada
    </Button>
  )

  if (status === "received") return (
    <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
      <UserPlus className="h-4 w-4" />
      Responder solicitação
    </Button>
  )

  return (
    <Button onClick={addFriend} disabled={acting} variant="outline" size="sm"
      className="gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50">
      {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
      Adicionar amigo
    </Button>
  )
}
