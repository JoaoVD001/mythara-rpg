"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Copy, Check, RefreshCw, Link2, Hash, ShieldAlert, Users, X } from "lucide-react"

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const el = document.createElement("textarea")
    el.value = text
    el.style.position = "fixed"
    el.style.opacity = "0"
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
  }
}

export function CampaignInvite({
  campaignId,
  inviteCode: initialCode,
}: {
  campaignId: string
  inviteCode: string
}) {
  const [inviteCode, setInviteCode] = useState(initialCode)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/campaigns/join/${inviteCode}`
      : `/campaigns/join/${inviteCode}`

  async function handleCopyCode() {
    await copyText(inviteCode)
    setCopiedCode(true)
    toast.success("Código copiado!")
    setTimeout(() => setCopiedCode(false), 2000)
  }

  async function handleCopyLink() {
    await copyText(joinUrl)
    setCopiedLink(true)
    toast.success("Link copiado!")
    setTimeout(() => setCopiedLink(false), 2000)
  }

  async function handleRegenerate() {
    setConfirmOpen(false)
    setRegenerating(true)
    const res = await fetch(`/api/campaigns/${campaignId}/regenerate-invite`, {
      method: "POST",
    })
    setRegenerating(false)
    if (!res.ok) {
      toast.error("Erro ao gerar novo código")
      return
    }
    const data = await res.json()
    setInviteCode(data.inviteCode)
    toast.success("Novo código gerado! O código anterior não funciona mais.")
  }

  return (
    <div className="max-w-lg space-y-4">

      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary/70" />
          Convidar Jogadores
        </h2>
        <p className="text-sm text-muted-foreground">
          Compartilhe o código ou o link com seus jogadores para eles entrarem na campanha.
        </p>
      </div>

      {/* Código em destaque */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
        <div className="px-4 pt-4 pb-3 flex items-center gap-2">
          <Hash className="h-3.5 w-3.5 text-primary/60 shrink-0" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary/60">Código de convite</span>
        </div>

        <div className="px-4 pb-4 flex items-center gap-3">
          <div className="flex-1 min-w-0 overflow-hidden">
            {inviteCode.length <= 6 ? (
              <p className="font-mono text-4xl font-bold tracking-[0.3em] text-foreground select-all">
                {inviteCode}
              </p>
            ) : (
              <>
                <p className="font-mono text-sm font-bold tracking-widest text-foreground/60 select-all break-all leading-relaxed">
                  {inviteCode}
                </p>
                <p className="text-[10px] text-amber-400/80 mt-1.5 flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 shrink-0" />
                  Gere um novo código de 5 dígitos abaixo
                </p>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-150 bg-primary/15 hover:bg-primary/25 border border-primary/25 text-primary active:scale-95"
            aria-label="Copiar código"
            title="Copiar código"
          >
            {copiedCode
              ? <Check className="h-5 w-5 text-emerald-400" />
              : <Copy className="h-5 w-5" />}
          </button>
        </div>

        <div className="border-t border-primary/10 px-4 py-2.5 flex items-center justify-between gap-3 bg-black/10">
          <p className="text-[11px] text-muted-foreground truncate font-mono">{joinUrl}</p>
          <button
            type="button"
            onClick={handleCopyLink}
            className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-primary/70 hover:text-primary transition-colors whitespace-nowrap"
            aria-label="Copiar link completo"
          >
            {copiedLink
              ? <><Check className="h-3 w-3 text-emerald-400" />Copiado</>
              : <><Link2 className="h-3 w-3" />Copiar link</>}
          </button>
        </div>
      </div>

      {/* Instrução rápida */}
      <p className="text-xs text-muted-foreground leading-relaxed px-0.5">
        Os jogadores podem entrar em <span className="font-medium text-foreground/60">Campanhas → Entrar com código</span> e digitar o código acima, ou acessar o link diretamente.
      </p>

      {/* Regenerar código */}
      <div className="pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setConfirmOpen(true)}
          disabled={regenerating}
          className="gap-2 border-red-500/20 text-red-400/70 hover:text-red-300 hover:bg-red-900/20 hover:border-red-500/30 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
          {regenerating ? "Gerando..." : "Gerar novo código"}
        </Button>
      </div>

      {/* Modal de confirmação */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-white/10 bg-[#0d1a0d] shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />
                <h3 className="font-semibold text-foreground">Gerar novo código?</h3>
              </div>
              <button type="button" onClick={() => setConfirmOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O código atual <span className="font-mono font-medium text-foreground/80">{inviteCode}</span> vai
              deixar de funcionar imediatamente. Jogadores que ainda não entraram precisarão do novo código.
            </p>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setConfirmOpen(false)}>
                Cancelar
              </Button>
              <Button size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white border-0"
                onClick={handleRegenerate}>
                Gerar novo código
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
