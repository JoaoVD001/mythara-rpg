"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Coins, Check, RotateCcw, Users, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { type OrdemParanormalData } from "@/lib/systems"

type Member = {
  id: string
  role?: string
  user: { name: string; image: string | null }
  character: { id: string; name: string; data: string } | null
}

type PlayerRow = {
  memberId: string
  characterId: string
  characterName: string
  userName: string
  userImage: string | null
  currentDinheiro: number
  initials: string
}

function parsePlayerRows(members: Member[]): PlayerRow[] {
  return members
    .filter((m) => m.character)
    .map((m) => {
      let currentDinheiro = 0
      try {
        const data = JSON.parse(m.character!.data) as OrdemParanormalData
        currentDinheiro = parseInt(data.dinheiro ?? "0", 10)
      } catch { /* ignore */ }

      return {
        memberId: m.id,
        characterId: m.character!.id,
        characterName: m.character!.name,
        userName: m.user.name,
        userImage: m.user.image,
        currentDinheiro,
        initials: m.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase(),
      }
    })
}

export function RewardsPanel({ campaignId, members }: {
  campaignId: string
  members: Member[]
}) {
  const players = parsePlayerRows(members)
  const noCharMembers = members.filter((m) => m.role !== "gm" && !m.character)
  const [amounts, setAmounts] = useState<Record<string, string>>(
    Object.fromEntries(players.map((p) => [p.characterId, ""]))
  )
  const [localDinheiro, setLocalDinheiro] = useState<Record<string, number>>(
    Object.fromEntries(players.map((p) => [p.characterId, p.currentDinheiro]))
  )
  const [baseAmount, setBaseAmount] = useState("")
  const [isPending, startTransition] = useTransition()

  function setAmount(characterId: string, value: string) {
    if (value === "" || value === "-" || /^-?\d*$/.test(value)) {
      setAmounts((prev) => ({ ...prev, [characterId]: value }))
    }
  }

  function applyBase(value: string) {
    setBaseAmount(value)
    if (value === "" || value === "-") return
    if (/^-?\d+$/.test(value)) {
      setAmounts(Object.fromEntries(players.map((p) => [p.characterId, value])))
    }
  }

  function resetAll() {
    setBaseAmount("")
    setAmounts(Object.fromEntries(players.map((p) => [p.characterId, ""])))
  }

  const hasAnyAmount = Object.values(amounts).some((v) => v !== "" && v !== "-" && parseInt(v, 10) !== 0)

  function distribute() {
    const rewards = players
      .map((p) => ({ characterId: p.characterId, delta: parseInt(amounts[p.characterId] || "0", 10) }))
      .filter((r) => r.delta !== 0)

    if (rewards.length === 0) {
      toast.error("Nenhum valor preenchido")
      return
    }

    startTransition(async () => {
      const res = await fetch(`/api/campaigns/${campaignId}/rewards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewards }),
      })

      if (!res.ok) {
        toast.error("Erro ao distribuir recompensas")
        return
      }

      const data = await res.json()
      // Atualiza saldos locais
      for (const result of data.results) {
        setLocalDinheiro((prev) => ({ ...prev, [result.characterId]: result.newDinheiro }))
      }

      const total = rewards.reduce((acc, r) => acc + r.delta, 0)
      toast.success(`Recompensas distribuídas! Total: ${total > 0 ? "+" : ""}$${total.toLocaleString("pt-BR")}`)
      resetAll()
    })
  }

  if (players.length === 0 && noCharMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Coins className="h-10 w-10 text-muted-foreground/20 mb-3" />
        <p className="text-muted-foreground/60 text-sm">Nenhum jogador na campanha ainda.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-lg">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 px-1">
        <Coins className="h-4 w-4 text-primary/60" />
        <span className="text-xs font-semibold tracking-widest uppercase text-primary/70">
          Distribuir Recompensas da Sessão
        </span>
      </div>
      <p className="text-xs text-muted-foreground/60 px-1">
        Defina o valor individual de cada jogador. Use negativos para punições. Confirme para creditar direto nas fichas.
      </p>

      {/* Box de valor para todos */}
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Users className="h-4 w-4 text-muted-foreground/40 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground/70">Valor para todos</p>
            <p className="text-[11px] text-muted-foreground/50">Preenche todos os jogadores. Edite individualmente abaixo.</p>
          </div>
        </div>
        <div className="relative shrink-0">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground/40 font-mono select-none">
            {baseAmount.startsWith("-") ? "" : "+"} $
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={baseAmount}
            onChange={(e) => {
              const v = e.target.value
              if (v === "" || v === "-" || /^-?\d*$/.test(v)) applyBase(v)
            }}
            placeholder="0"
            className="w-28 h-9 pl-7 pr-2 text-sm font-mono text-right bg-black/40 border border-white/12 rounded-lg focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      {/* Lista de jogadores */}
      <div className="rounded-lg border border-white/8 bg-black/20 overflow-hidden divide-y divide-white/6">
        {players.length === 0 && noCharMembers.length === 0 && (
          <div className="py-10 text-center text-muted-foreground/50 text-sm">Nenhum jogador encontrado.</div>
        )}
        {players.map((player) => {
          const delta = parseInt(amounts[player.characterId] || "0", 10)
          const preview = isNaN(delta) ? localDinheiro[player.characterId] : localDinheiro[player.characterId] + delta
          const hasValue = amounts[player.characterId] !== "" && !isNaN(delta) && delta !== 0

          return (
            <div key={player.characterId} className="flex items-center gap-3 px-4 py-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs">{player.initials}</AvatarFallback>
                {player.userImage && <AvatarImage src={player.userImage} />}
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight truncate">{player.userName}</p>
                <p className="text-[11px] text-muted-foreground/60 truncate">{player.characterName}</p>
              </div>

              {/* Saldo atual → preview */}
              <div className="text-right shrink-0 min-w-[80px]">
                <p className="text-[11px] text-muted-foreground/40 tabular-nums line-through">
                  ${localDinheiro[player.characterId].toLocaleString("pt-BR")}
                </p>
                <p className={`text-sm font-bold font-mono tabular-nums ${
                  hasValue
                    ? delta > 0 ? "text-emerald-400" : "text-red-400"
                    : "text-primary/50"
                }`}>
                  ${isNaN(preview) ? localDinheiro[player.characterId].toLocaleString("pt-BR") : preview.toLocaleString("pt-BR")}
                </p>
              </div>

              {/* Input de valor */}
              <div className="relative shrink-0">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-primary/40 font-mono select-none">
                  {delta > 0 ? "+" : ""}$
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amounts[player.characterId]}
                  onChange={(e) => setAmount(player.characterId, e.target.value)}
                  placeholder="0"
                  className="w-24 h-8 pl-6 pr-2 text-sm font-mono text-right bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>
          )
        })}

        {/* Membros sem personagem vinculado */}
        {noCharMembers.map((m) => {
          const initials = m.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
          return (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3 opacity-50">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                {m.user.image && <AvatarImage src={m.user.image} />}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight truncate">{m.user.name}</p>
                <p className="flex items-center gap-1 text-[11px] text-amber-400/70 mt-0.5">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  Sem personagem vinculado
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          onClick={resetAll}
          disabled={!hasAnyAmount || isPending}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground disabled:opacity-30 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />Limpar
        </button>

        <Button
          onClick={distribute}
          disabled={!hasAnyAmount || isPending}
          className="gap-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary"
        >
          <Check className="h-4 w-4" />
          {isPending ? "Distribuindo..." : "Confirmar Distribuição"}
        </Button>
      </div>
    </div>
  )
}
