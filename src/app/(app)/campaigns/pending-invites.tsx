"use client"

import { useState, useEffect, useTransition } from "react"
import { toast } from "sonner"
import { Bell, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SYSTEM_LABELS } from "@/lib/systems"

type Invite = {
  id: string
  status: string
  campaign: { id: string; name: string; system: string }
  from: { name: string; username: string | null }
}

export function PendingInvites() {
  const [invites, setInvites] = useState<Invite[]>([])
  const [loaded, setLoaded] = useState(false)
  const [respondingId, setRespondingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  useEffect(() => {
    fetch("/api/campaigns/invites")
      .then((r) => r.json())
      .then((data: Invite[]) => { setInvites(data); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  async function respond(inviteId: string, status: "accepted" | "declined") {
    setRespondingId(inviteId)
    startTransition(async () => {
      const res = await fetch(`/api/campaigns/invites/${inviteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      setRespondingId(null)
      if (!res.ok) { toast.error("Erro ao responder convite"); return }
      const data = await res.json() as Invite
      setInvites((prev) => prev.filter((i) => i.id !== inviteId))
      if (status === "accepted") {
        toast.success(`Você entrou em "${data.campaign.name}"!`)
        // Recarrega a página para a campanha aparecer na lista
        window.location.reload()
      } else {
        toast.success("Convite recusado")
      }
    })
  }

  if (!loaded || invites.length === 0) return null

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/15">
        <Bell className="h-4 w-4 text-primary/70" />
        <span className="text-sm font-semibold text-primary/80">
          Convites pendentes ({invites.length})
        </span>
      </div>
      <div className="divide-y divide-white/5">
        {invites.map((invite) => (
          <div key={invite.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{invite.campaign.name}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                Convidado por {invite.from.name}
                {invite.from.username && ` (@${invite.from.username})`}
                {" · "}
                {SYSTEM_LABELS[invite.campaign.system] ?? invite.campaign.system}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => respond(invite.id, "accepted")}
                disabled={respondingId === invite.id}
                className="h-7 text-xs gap-1"
              >
                {respondingId === invite.id
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <Check className="h-3 w-3" />
                }
                Aceitar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => respond(invite.id, "declined")}
                disabled={respondingId === invite.id}
                className="h-7 text-xs gap-1 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
                Recusar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
