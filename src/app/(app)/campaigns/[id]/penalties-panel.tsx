"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { ShieldAlert, X, Plus, ChevronDown, ChevronUp, Search, Wand2, ArrowLeft, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  ORDEM_PARANORMAL_CONDITIONS,
  CONDITION_CATEGORY_LABELS,
  detectAutoApply,
  type ActiveCondition,
  type Condition,
  type ConditionAutoApply,
  type ConditionCategory,
  type OrdemParanormalData,
} from "@/lib/systems"

const FIELD_LABELS: Record<NonNullable<ConditionAutoApply["field"]>, string> = {
  str:       "FOR",
  dex:       "AGI",
  int:       "INT",
  pres:      "PRE",
  vig:       "VIG",
  hpMax:     "PV máx",
  sanityMax: "SAN máx",
  peMax:     "PE máx",
}

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
  initials: string
  conditions: ActiveCondition[]
}

function parsePlayerRows(members: Member[]): PlayerRow[] {
  return members
    .filter((m) => m.character)
    .map((m) => {
      let conditions: ActiveCondition[] = []
      try {
        const data = JSON.parse(m.character!.data) as OrdemParanormalData
        conditions = JSON.parse(data.conditions ?? "[]")
      } catch { /* ignore */ }

      return {
        memberId: m.id,
        characterId: m.character!.id,
        characterName: m.character!.name,
        userName: m.user.name,
        userImage: m.user.image,
        initials: m.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase(),
        conditions,
      }
    })
}

const CATEGORY_COLORS: Record<ConditionCategory, string> = {
  medo:      "bg-amber-500/15 border-amber-500/30 text-amber-300",
  mental:    "bg-violet-500/15 border-violet-500/30 text-violet-300",
  fadiga:    "bg-orange-500/15 border-orange-500/30 text-orange-300",
  paralisia: "bg-blue-500/15 border-blue-500/30 text-blue-300",
  sentidos:  "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
  fisica:    "bg-red-500/15 border-red-500/30 text-red-300",
  ferimento: "bg-rose-500/15 border-rose-500/30 text-rose-300",
  doenca:    "bg-emerald-900/40 border-emerald-700/40 text-emerald-400",
  veneno:    "bg-green-900/40 border-green-600/30 text-green-400",
}

const CONDITIONS_BY_CATEGORY = ORDEM_PARANORMAL_CONDITIONS.reduce<Record<ConditionCategory, typeof ORDEM_PARANORMAL_CONDITIONS>>((acc, c) => {
  if (!acc[c.category]) acc[c.category] = []
  acc[c.category].push(c)
  return acc
}, {} as Record<ConditionCategory, typeof ORDEM_PARANORMAL_CONDITIONS>)

const CATEGORY_ORDER: ConditionCategory[] = [
  "medo", "mental", "fadiga", "paralisia", "sentidos", "fisica",
  "ferimento", "doenca", "veneno",
]

function ConditionCard({
  condition,
  onSelect,
}: {
  condition: Condition
  onSelect: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-colors border-border/50 bg-card/40`}
    >
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          {open ? (
            <ChevronUp className="h-4 w-4 text-primary shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-sm">{condition.name}</span>
            <p className="text-xs text-muted-foreground/60 leading-tight mt-0.5">{condition.shortEffect}</p>
          </div>
        </button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="shrink-0 h-7 text-xs"
          onClick={onSelect}
        >
          Aplicar
        </Button>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-border/30 space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">{condition.description}</p>
          {condition.autoApply && (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2">
              <span className="text-amber-400 text-sm shrink-0">⚡</span>
              <p className="text-xs text-amber-300/80 leading-relaxed">
                Modifica <strong>{condition.autoApply.field.toUpperCase()}</strong> em{" "}
                <strong>{condition.autoApply.delta > 0 ? "+" : ""}{condition.autoApply.delta}</strong> automaticamente ao aplicar.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

type CustomConditionData = {
  name: string
  description: string
  shortEffect: string
  autoApply?: ConditionAutoApply
}

function CreateConditionForm({
  onSubmit,
  onBack,
}: {
  onSubmit: (data: CustomConditionData) => void
  onBack: () => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [shortEffect, setShortEffect] = useState("")

  const detected = description.trim() ? detectAutoApply(description) : null

  function handleSubmit() {
    if (!name.trim() || !description.trim()) return
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      shortEffect: shortEffect.trim() || description.trim().slice(0, 60),
      autoApply: detected ?? undefined,
    })
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/8 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar
        </button>
        <span className="text-muted-foreground/20">|</span>
        <span className="text-sm font-semibold">Condição personalizada</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 [scrollbar-width:thin] [scrollbar-color:#ffffff20_transparent]">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">
            Nome da condição
          </label>
          <input
            autoFocus
            type="text"
            placeholder="Ex: Maldição da Floresta"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-9 px-3 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/25 text-foreground placeholder:text-muted-foreground/30"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">
            Descrição / Efeitos
          </label>
          <p className="text-[10px] text-muted-foreground/40 leading-relaxed">
            Descreva os efeitos. Menções como <span className="text-primary/60">"-1 em VIG"</span>,{" "}
            <span className="text-primary/60">"FOR -2"</span> ou{" "}
            <span className="text-primary/60">"-5 PV máx"</span> são detectadas automaticamente.
          </p>
          <textarea
            rows={5}
            placeholder="Ex: O personagem sofre uma maldição que reduz VIG -1 e o impede de descansar normalmente."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/25 text-foreground placeholder:text-muted-foreground/30 resize-none leading-relaxed"
          />
        </div>

        {/* Auto-detect preview */}
        {description.trim() && (
          <div className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 ${
            detected
              ? "border-amber-500/25 bg-amber-500/5"
              : "border-white/8 bg-white/3"
          }`}>
            <span className="text-base shrink-0 mt-0.5">{detected ? "⚡" : "ℹ️"}</span>
            <div>
              {detected ? (
                <>
                  <p className="text-xs font-semibold text-amber-300">Efeito numérico detectado</p>
                  <p className="text-[11px] text-amber-300/70 mt-0.5">
                    Irá modificar <strong>{FIELD_LABELS[detected.field]}</strong> em{" "}
                    <strong>{detected.delta > 0 ? "+" : ""}{detected.delta}</strong> automaticamente ao aplicar.
                    Revertido ao remover.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground/50">Nenhum modificador numérico detectado</p>
                  <p className="text-[11px] text-muted-foreground/35 mt-0.5">
                    Esta condição será registrada como narrativa. Para modificar atributos automaticamente,
                    mencione o atributo e valor (ex: "VIG -1").
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Short effect (optional override) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60">
            Resumo curto <span className="font-normal normal-case text-muted-foreground/30">(opcional — aparece na badge da ficha)</span>
          </label>
          <input
            type="text"
            placeholder="Ex: VIG -1, sem descanso natural"
            value={shortEffect}
            onChange={(e) => setShortEffect(e.target.value)}
            className="w-full h-9 px-3 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/25 text-foreground placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/8 shrink-0">
        <Button
          onClick={handleSubmit}
          disabled={!name.trim() || !description.trim()}
          className="w-full"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          Criar e aplicar condição
        </Button>
      </div>
    </div>
  )
}

function ConditionSelector({
  onSelect,
  excluded,
}: {
  onSelect: (conditionId: string, custom?: CustomConditionData) => void
  excluded: string[]
}) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<"list" | "create">("list")
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<ConditionCategory | "all">("all")

  function close() {
    setOpen(false)
    setView("list")
    setSearch("")
    setActiveCategory("all")
  }

  function handleSelect(conditionId: string) {
    onSelect(conditionId)
    close()
  }

  function handleCustomSubmit(data: CustomConditionData) {
    const id = `custom-${Date.now()}`
    onSelect(id, data)
    close()
  }

  const available = ORDEM_PARANORMAL_CONDITIONS.filter(c => !excluded.includes(c.id))

  const filtered = available.filter(
    (c) =>
      (activeCategory === "all" || c.category === activeCategory) &&
      (search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.shortEffect.toLowerCase().includes(search.toLowerCase()))
  )

  const filteredByCategory = CATEGORY_ORDER.reduce<Record<string, typeof ORDEM_PARANORMAL_CONDITIONS>>((acc, cat) => {
    if (activeCategory !== "all" && cat !== activeCategory) return acc
    const items = filtered.filter(c => c.category === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-white/10 text-[11px] text-foreground/40 hover:border-white/20 hover:text-foreground/60 transition-all"
      >
        <Plus className="h-3 w-3" />
        Condição
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

          <div className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl border border-white/10 bg-[#0d0d0d] shadow-2xl overflow-hidden">

            {view === "create" ? (
              <CreateConditionForm onSubmit={handleCustomSubmit} onBack={() => setView("list")} />
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
                  <div>
                    <h2 className="font-bold text-base">Aplicar Condição</h2>
                    <p className="text-xs text-muted-foreground/50 mt-0.5">
                      {available.length} condições disponíveis
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1.5"
                      onClick={() => setView("create")}
                    >
                      <Wand2 className="h-3 w-3" />
                      Criar personalizada
                    </Button>
                    <button
                      type="button"
                      onClick={close}
                      className="text-muted-foreground/40 hover:text-muted-foreground transition-colors ml-1"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="px-5 pt-4 shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Buscar condição..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/25 text-foreground placeholder:text-muted-foreground/40"
                    />
                  </div>
                </div>

                {/* Category filters */}
                <div className="px-5 pt-3 pb-2 flex gap-1.5 flex-wrap shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveCategory("all")}
                    className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all ${
                      activeCategory === "all"
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-white/10 text-muted-foreground/50 hover:border-white/20 hover:text-muted-foreground/70"
                    }`}
                  >
                    Todas
                  </button>
                  {CATEGORY_ORDER.map((cat) => {
                    const count = available.filter(c => c.category === cat).length
                    if (count === 0) return null
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all ${
                          activeCategory === cat
                            ? CATEGORY_COLORS[cat]
                            : "border-white/10 text-muted-foreground/50 hover:border-white/20 hover:text-muted-foreground/70"
                        }`}
                      >
                        {CONDITION_CATEGORY_LABELS[cat]}
                      </button>
                    )
                  })}
                </div>

                {/* Condition list */}
                <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4 [scrollbar-width:thin] [scrollbar-color:#ffffff20_transparent]">
                  {Object.keys(filteredByCategory).length === 0 ? (
                    <p className="text-sm text-muted-foreground/40 text-center py-10">
                      Nenhuma condição encontrada.
                    </p>
                  ) : (
                    Object.entries(filteredByCategory).map(([cat, items]) => (
                      <div key={cat} className="space-y-2">
                        <p className="text-[10px] font-bold tracking-widest uppercase">
                          <span className={`px-2 py-0.5 rounded border ${CATEGORY_COLORS[cat as ConditionCategory]}`}>
                            {CONDITION_CATEGORY_LABELS[cat as ConditionCategory]}
                          </span>
                        </p>
                        <div className="space-y-1.5">
                          {items.map((c) => (
                            <ConditionCard
                              key={c.id}
                              condition={c}
                              onSelect={() => handleSelect(c.id)}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function PlayerConditionsRow({
  player,
  campaignId,
  onConditionsChange,
}: {
  player: PlayerRow
  campaignId: string
  onConditionsChange: (characterId: string, conditions: ActiveCondition[]) => void
}) {
  const [notes, setNotes] = useState("")
  const [pendingAdd, setPendingAdd] = useState<string | null>(null)
  const [pendingCustom, setPendingCustom] = useState<CustomConditionData | null>(null)
  const [isPending, startTransition] = useTransition()

  function addCondition(conditionId: string, custom?: CustomConditionData) {
    setPendingAdd(conditionId)
    setPendingCustom(custom ?? null)
  }

  function confirmAdd() {
    if (!pendingAdd) return
    startTransition(async () => {
      const res = await fetch(`/api/campaigns/${campaignId}/conditions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: player.characterId,
          conditionId: pendingAdd,
          notes: notes || undefined,
          ...(pendingCustom ? { customCondition: pendingCustom } : {}),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error ?? "Erro ao aplicar condição")
        return
      }
      const data = await res.json()
      onConditionsChange(player.characterId, data.conditions)
      const builtIn = ORDEM_PARANORMAL_CONDITIONS.find(c => c.id === pendingAdd)
      const name = pendingCustom?.name ?? builtIn?.name ?? "Condição"
      const autoApply = pendingCustom?.autoApply ?? builtIn?.autoApply
      toast.success(`${name} aplicada${autoApply ? ` · ${FIELD_LABELS[autoApply.field]} ${autoApply.delta > 0 ? "+" : ""}${autoApply.delta}` : ""}`)
      setPendingAdd(null)
      setPendingCustom(null)
      setNotes("")
    })
  }

  function removeCondition(conditionId: string) {
    startTransition(async () => {
      const res = await fetch(`/api/campaigns/${campaignId}/conditions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: player.characterId, conditionId }),
      })
      if (!res.ok) {
        toast.error("Erro ao remover condição")
        return
      }
      const data = await res.json()
      onConditionsChange(player.characterId, data.conditions)
      const existing = player.conditions.find(c => c.id === conditionId)
      const name = existing?.custom?.name ?? ORDEM_PARANORMAL_CONDITIONS.find(c => c.id === conditionId)?.name ?? "Condição"
      toast.success(`${name} removida`)
    })
  }

  // Resolve display data for the pending condition (built-in or custom)
  const pendingBuiltIn = pendingAdd && !pendingCustom
    ? ORDEM_PARANORMAL_CONDITIONS.find(c => c.id === pendingAdd)
    : null
  const pendingDisplay = pendingCustom
    ? { name: pendingCustom.name, shortEffect: pendingCustom.shortEffect, autoApply: pendingCustom.autoApply }
    : pendingBuiltIn
    ? { name: pendingBuiltIn.name, shortEffect: pendingBuiltIn.shortEffect, autoApply: pendingBuiltIn.autoApply }
    : null

  return (
    <div className="rounded-lg border border-white/8 bg-black/20 p-3 space-y-2.5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs">{player.initials}</AvatarFallback>
          {player.userImage && <AvatarImage src={player.userImage} />}
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">{player.userName}</p>
          <p className="text-[11px] text-muted-foreground/50 truncate">{player.characterName}</p>
        </div>
        <ConditionSelector
          excluded={player.conditions.map(c => c.id)}
          onSelect={addCondition}
        />
      </div>

      {/* Condições ativas */}
      {player.conditions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-0.5">
          {player.conditions.map((ac) => {
            const def = ORDEM_PARANORMAL_CONDITIONS.find(c => c.id === ac.id)
            const displayName = ac.custom?.name ?? def?.name
            const displayDesc = ac.custom?.description ?? def?.description
            const displayCat = def?.category
            if (!displayName) return null
            return (
              <span
                key={ac.id}
                title={`${displayDesc ?? ""}${ac.notes ? `\nNotas: ${ac.notes}` : ""}`}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
                  displayCat ? CATEGORY_COLORS[displayCat] : "bg-white/10 border-white/20 text-white/70"
                }`}
              >
                {ac.custom && <Wand2 className="h-2.5 w-2.5 opacity-60" />}
                {displayName}
                {ac.notes && <span className="opacity-60">· {ac.notes}</span>}
                <button
                  type="button"
                  onClick={() => removeCondition(ac.id)}
                  disabled={isPending}
                  className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity disabled:opacity-20"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )
          })}
        </div>
      )}

      {player.conditions.length === 0 && (
        <p className="text-[11px] text-muted-foreground/30 pl-0.5">Sem condições ativas</p>
      )}

      {/* Confirmar adição */}
      {pendingDisplay && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 space-y-2">
          <div>
            <div className="flex items-center gap-1.5">
              {pendingCustom && <Wand2 className="h-3 w-3 text-amber-300/70" />}
              <p className="text-xs font-semibold text-amber-300">{pendingDisplay.name}</p>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{pendingDisplay.shortEffect}</p>
            {pendingDisplay.autoApply && (
              <p className="text-[10px] text-amber-400/80 mt-1">
                ⚡ Irá modificar {FIELD_LABELS[pendingDisplay.autoApply.field]} em {pendingDisplay.autoApply.delta > 0 ? "+" : ""}{pendingDisplay.autoApply.delta} automaticamente
              </p>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Notas (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmAdd()}
              className="flex-1 h-7 px-2 text-xs bg-black/40 border border-white/10 rounded focus:outline-none focus:border-white/25"
            />
            <Button
              size="sm"
              onClick={confirmAdd}
              disabled={isPending}
              className="h-7 px-3 text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 shrink-0"
            >
              Aplicar
            </Button>
            <button
              type="button"
              onClick={() => { setPendingAdd(null); setPendingCustom(null); setNotes("") }}
              className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 shrink-0"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function PenaltiesPanel({ campaignId, members }: {
  campaignId: string
  members: Member[]
}) {
  const [rows, setRows] = useState<PlayerRow[]>(() => parsePlayerRows(members))
  const noCharMembers = members.filter((m) => m.role !== "gm" && !m.character)

  function handleConditionsChange(characterId: string, conditions: ActiveCondition[]) {
    setRows(prev =>
      prev.map(r => r.characterId === characterId ? { ...r, conditions } : r)
    )
  }

  if (rows.length === 0 && noCharMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShieldAlert className="h-10 w-10 text-muted-foreground/20 mb-3" />
        <p className="text-muted-foreground/60 text-sm">Nenhum jogador na campanha ainda.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex items-center gap-2 px-1">
        <ShieldAlert className="h-4 w-4 text-destructive/60" />
        <span className="text-xs font-semibold tracking-widest uppercase text-destructive/70">
          Condições e Penalidades
        </span>
      </div>
      <p className="text-xs text-muted-foreground/60 px-1">
        Aplique condições nos personagens. Condições com ⚡ alteram atributos automaticamente na ficha. Para remover, clique no ×.
      </p>

      <div className="space-y-2">
        {rows.map((player) => (
          <PlayerConditionsRow
            key={player.characterId}
            player={player}
            campaignId={campaignId}
            onConditionsChange={handleConditionsChange}
          />
        ))}

        {noCharMembers.map((m) => {
          const initials = m.user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
          return (
            <div key={m.id} className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 flex items-center gap-3 opacity-50">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary/60">{initials}</AvatarFallback>
                {m.user.image && <AvatarImage src={m.user.image} />}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{m.user.name}</p>
                <p className="flex items-center gap-1 text-[11px] text-amber-400/70 mt-0.5">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  Sem personagem vinculado
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
