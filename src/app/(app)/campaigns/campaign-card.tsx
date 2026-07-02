"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, X, AlertTriangle, Loader2, ShieldCheck, Dices } from "lucide-react"

const SYSTEM_BADGE: Record<string, { className: string; icon: React.ReactNode }> = {
  "ordem-paranormal": {
    icon: <ShieldCheck className="h-3 w-3" />,
    className: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1.5",
  },
  "dnd5e": {
    icon: <Dices className="h-3 w-3" />,
    className: "border border-violet-500/30 bg-violet-500/10 text-violet-400 font-medium text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1.5",
  },
}

type Campaign = {
  id: string
  name: string
  system: string
  description: string | null
}

export function CampaignCard({
  campaign,
  role,
  systemLabel,
}: {
  campaign: Campaign
  role: string
  systemLabel: string
}) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`/api/campaigns/${campaign.id}`, { method: "DELETE" })
    setDeleting(false)
    if (!res.ok) {
      toast.error("Erro ao excluir campanha")
      return
    }
    setConfirmOpen(false)
    toast.success(`"${campaign.name}" foi excluída.`)
    router.refresh()
  }

  return (
    <>
      <div className="relative group">
        <Link href={`/campaigns/${campaign.id}`}>
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2 pr-10">
              <CardTitle className="text-base">{campaign.name}</CardTitle>
              {campaign.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {campaign.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex gap-2 items-center flex-wrap">
              {SYSTEM_BADGE[campaign.system] ? (
                <span className={SYSTEM_BADGE[campaign.system].className}>
                  {SYSTEM_BADGE[campaign.system].icon}
                  {systemLabel}
                </span>
              ) : (
                <Badge variant="secondary">{systemLabel}</Badge>
              )}
              {role === "gm" && <Badge>Mestre</Badge>}
            </CardContent>
          </Card>
        </Link>

        {/* Botão excluir — só para o mestre */}
        {role === "gm" && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setConfirmOpen(true) }}
            className="absolute top-3 right-3 w-8 h-8 rounded-md flex items-center justify-center text-red-400/60 hover:text-red-300 hover:bg-red-900/40 border border-red-500/20 hover:border-red-500/40 transition-all duration-150 bg-red-900/10"
            aria-label={`Excluir ${campaign.name}`}
            title="Excluir campanha"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Modal de confirmação */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-white/10 bg-[#0d1a0d] shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
                <h3 className="font-semibold text-foreground">Excluir campanha?</h3>
              </div>
              <button type="button" onClick={() => setConfirmOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Você está prestes a excluir{" "}
              <span className="font-semibold text-foreground/80">"{campaign.name}"</span>.
              Todos os membros, sessões e itens do mercado serão removidos permanentemente.
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setConfirmOpen(false)}>
                Cancelar
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-red-700 hover:bg-red-600 text-white border-0"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting
                  ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Excluindo...</>
                  : <><Trash2 className="h-3.5 w-3.5 mr-1.5" />Excluir</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
