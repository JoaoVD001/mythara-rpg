"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Send, Loader2 } from "lucide-react"

type State = "idle" | "loading" | "sent" | "already" | "error"

export function InviteToCampaignButton({
  campaignId,
  toUserId,
  targetName,
}: {
  campaignId: string
  toUserId: string
  targetName: string
}) {
  const [state, setState] = useState<State>("idle")

  async function sendInvite() {
    setState("loading")
    const res = await fetch(`/api/campaigns/${campaignId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId }),
    })

    if (res.ok) { setState("sent"); return }

    const body = await res.json().catch(() => ({}))
    if (res.status === 409) { setState("already"); return }
    console.error(body.error)
    setState("error")
    setTimeout(() => setState("idle"), 3000)
  }

  if (state === "sent" || state === "already") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-primary/70 shrink-0">
        <Check className="h-3.5 w-3.5" />
        {state === "sent" ? "Convite enviado!" : "Já convidado"}
      </span>
    )
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={sendInvite}
      disabled={state === "loading"}
      title={`Convidar ${targetName}`}
      className="h-7 text-xs gap-1.5 shrink-0"
    >
      {state === "loading" ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : state === "error" ? (
        "Erro — tentar novamente"
      ) : (
        <>
          <Send className="h-3 w-3" />
          Convidar
        </>
      )}
    </Button>
  )
}
