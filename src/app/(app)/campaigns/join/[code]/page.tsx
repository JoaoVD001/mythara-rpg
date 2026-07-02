"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, Sword, User, ChevronRight, Scroll } from "lucide-react"
import { SYSTEM_LABELS } from "@/lib/systems"

type Character = { id: string; name: string; system: string }
type Campaign = { id: string; name: string; system: string; description?: string }

export default function JoinCampaignPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState("")
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    params.then(({ code: c }) => {
      setCode(c)
      fetchCampaign(c)
    })
  }, [params])

  async function fetchCampaign(inviteCode: string) {
    const res = await fetch(`/api/campaigns/by-invite/${inviteCode}`)
    if (!res.ok) {
      setError("Link de convite inválido ou expirado.")
      setLoading(false)
      return
    }
    const data = await res.json()
    setCampaign(data)

    const charsRes = await fetch("/api/characters/mine")
    if (charsRes.ok) {
      const chars = await charsRes.json()
      setCharacters(chars.filter((c: Character) => c.system === data.system))
    }
    setLoading(false)
  }

  async function handleJoin(characterId?: string) {
    if (!campaign) return
    setJoining(true)
    const res = await fetch(`/api/campaigns/${campaign.id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId: (characterId ?? selectedCharacter) || null }),
    })
    setJoining(false)

    if (!res.ok) {
      const body = await res.json()
      toast.error(body.error || "Erro ao entrar na campanha")
      return
    }

    toast.success(`Você entrou em ${campaign.name}!`)
    router.push(`/campaigns/${campaign.id}`)
  }

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-[60dvh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm">Verificando convite...</p>
        </div>
      </div>
    )
  }

  // ─── Erro ─────────────────────────────────────────────────────────────────

  if (error || !campaign) {
    return (
      <div className="min-h-[60dvh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold font-[Cinzel]">Convite inválido</h2>
            <p className="text-sm text-muted-foreground">{error || "Campanha não encontrada."}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => { setError(""); setLoading(true); fetchCampaign(code) }}
              variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10">
              Tentar novamente
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground"
              onClick={() => router.push("/campaigns")}>
              Voltar às campanhas
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const systemLabel = SYSTEM_LABELS[campaign.system] ?? campaign.system
  const hasChars = characters.length > 0
  const returnTo = `/campaigns/join/${code}`

  // ─── Página principal ─────────────────────────────────────────────────────

  return (
    <div className="min-h-[60dvh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm space-y-6">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-[0_0_24px_-6px] shadow-primary/30">
            <Sword className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary/60">Convite de campanha</p>
            <h1 className="text-2xl font-bold font-[Cinzel] text-foreground leading-tight">{campaign.name}</h1>
            <Badge variant="secondary" className="text-[11px]">{systemLabel}</Badge>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-white/8 bg-white/[0.03] divide-y divide-white/6 overflow-hidden">

          {/* Selecionar personagem */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary/70 shrink-0" />
              <span className="text-sm font-semibold text-foreground">Selecionar personagem</span>
            </div>

            {hasChars ? (
              <div className="space-y-2">
                <Select value={selectedCharacter} onValueChange={(v) => setSelectedCharacter(v ?? "")}>
                  <SelectTrigger className="bg-black/20 border-white/10 h-10 text-sm focus:border-primary/40">
                    <SelectValue placeholder="Escolha uma ficha..." />
                  </SelectTrigger>
                  <SelectContent>
                    {characters.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Fichas compatíveis com {systemLabel}.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Você não tem fichas de <strong>{systemLabel}</strong> ainda.
                </p>
                <Button
                  onClick={() => router.push(`/characters/new?system=${campaign.system}&returnTo=${encodeURIComponent(returnTo)}`)}
                  className="w-full h-10 gap-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary font-semibold"
                  variant="ghost"
                >
                  <Scroll className="h-4 w-4" />
                  Criar ficha agora
                  <ChevronRight className="h-3.5 w-3.5 ml-auto" />
                </Button>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="p-4 flex flex-col gap-2">
            <Button
              onClick={() => handleJoin()}
              disabled={joining}
              className="w-full h-11 font-semibold text-sm"
            >
              {joining ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Entrando...</>
              ) : (
                <>Entrar na campanha<ChevronRight className="h-4 w-4 ml-1" /></>
              )}
            </Button>

            {hasChars && (
              <Button
                variant="ghost"
                onClick={() => handleJoin(undefined)}
                disabled={joining}
                className="w-full h-9 text-xs text-muted-foreground hover:text-foreground"
              >
                Entrar sem personagem por enquanto
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => router.push("/campaigns")}
              disabled={joining}
              className="w-full h-9 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
