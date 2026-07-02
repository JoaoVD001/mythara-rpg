"use client"

import { useState, useTransition, useCallback, useEffect, useRef } from "react"
import { toast } from "sonner"
import {
  ShoppingBag, Save, Eye, EyeOff, ShoppingCart, Plus, Sparkles, X,
  ChevronRight, Crosshair, AlertTriangle, Pencil, Check,
  RotateCcw, Package, Star, Swords, Coins, BookOpen, Filter,
  Zap, Shield, Bomb, Pill, FlaskConical, Skull, ChevronDown,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  ORDEM_PARANORMAL_ITEMS,
  ORDEM_PARANORMAL_ITEM_BOOKS,
  CATEGORY_LABELS,
  RANK_CATEGORY_LABELS,
  PATENTE_DATA,
  WEAPON_MODS,
  getPatenteById,
  getModsForWeapon,
  applyModsToCategory,
  gameIconUrl,
  type ShopItem,
  type ShopItemCategory,
  type ShopConfig,
  type CustomShopItem,
  type OPRankCategory,
  type ShopMode,
  type WeaponMod,
} from "@/lib/systems"
import { suggestIcon } from "@/lib/suggest-icon"

// ─── Constantes ───────────────────────────────────────────────────────────────

const RANK_CAT_COLORS: Record<OPRankCategory, { bg: string; text: string; border: string; accent: string; iconBg: string; glow: string }> = {
  "cat-0":   { bg: "bg-zinc-700/30",    text: "text-zinc-300",    border: "border-zinc-600/50",   accent: "border-l-zinc-600",    iconBg: "bg-zinc-800",    glow: "shadow-[0_0_10px_rgba(113,113,122,0.18)]" },
  "cat-I":   { bg: "bg-indigo-500/20",  text: "text-indigo-300",  border: "border-indigo-500/40", accent: "border-l-indigo-500",  iconBg: "bg-indigo-950",  glow: "shadow-[0_0_10px_rgba(99,102,241,0.22)]" },
  "cat-II":  { bg: "bg-sky-500/20",     text: "text-sky-300",     border: "border-sky-500/40",    accent: "border-l-sky-500",     iconBg: "bg-sky-950",     glow: "shadow-[0_0_10px_rgba(14,165,233,0.22)]" },
  "cat-III": { bg: "bg-amber-500/20",   text: "text-amber-300",   border: "border-amber-500/40",  accent: "border-l-amber-500",   iconBg: "bg-amber-950",   glow: "shadow-[0_0_10px_rgba(245,158,11,0.22)]" },
  "cat-IV":  { bg: "bg-rose-500/20",    text: "text-rose-300",    border: "border-rose-500/40",   accent: "border-l-rose-500",    iconBg: "bg-rose-950",    glow: "shadow-[0_0_10px_rgba(244,63,94,0.25)]" },
}

const ITEMS_BY_SYSTEM: Record<string, ShopItem[]> = {
  "ordem-paranormal": ORDEM_PARANORMAL_ITEMS,
}

const CONFIDENCE_LABEL: Record<string, string> = {
  high: "Alta confiança", medium: "Confiança média", low: "Baixa confiança", none: "",
}
const CONFIDENCE_COLOR: Record<string, string> = {
  high: "text-sky-400", medium: "text-amber-400",
  low: "text-muted-foreground/50", none: "text-muted-foreground/50",
}

// Ícone de categoria para o filtro de categoria
const CATEGORY_ICONS: Partial<Record<ShopItemCategory, React.ReactNode>> = {
  "arma-simples":          <Swords className="h-3.5 w-3.5" />,
  "arma-tatica":           <Swords className="h-3.5 w-3.5" />,
  "arma-fogo":             <Crosshair className="h-3.5 w-3.5" />,
  "arma-pesada":           <Zap className="h-3.5 w-3.5" />,
  "arma-disparo":          <Crosshair className="h-3.5 w-3.5" />,
  "municao":               <Package className="h-3.5 w-3.5" />,
  "modificacao-arma":      <Filter className="h-3.5 w-3.5" />,
  "protecao":              <Shield className="h-3.5 w-3.5" />,
  "modificacao-protecao":  <Shield className="h-3.5 w-3.5" />,
  "explosivo":             <Bomb className="h-3.5 w-3.5" />,
  "equipamento":           <Package className="h-3.5 w-3.5" />,
  "medicamento":           <Pill className="h-3.5 w-3.5" />,
  "item-paranormal":       <FlaskConical className="h-3.5 w-3.5" />,
  "item-amaldicado":       <Skull className="h-3.5 w-3.5" />,
  "veiculo":               <ShoppingCart className="h-3.5 w-3.5" />,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

type PropStyle = { bg: string; text: string; border: string; icon?: React.ReactNode }
function propStyle(prop: string): PropStyle {
  const p = prop.toLowerCase()
  if (p === "pesada")                               return { bg: "bg-red-900/60",      text: "text-red-300",     border: "border-red-700/50",     icon: <AlertTriangle className="h-2.5 w-2.5" /> }
  if (p === "duas mãos" || p === "duas maos")       return { bg: "bg-orange-900/60",   text: "text-orange-300",  border: "border-orange-700/50",  icon: <AlertTriangle className="h-2.5 w-2.5" /> }
  if (p === "leve")                                 return { bg: "bg-teal-900/50",     text: "text-teal-300",    border: "border-teal-700/40" }
  if (p === "automática" || p === "automatica")     return { bg: "bg-blue-900/50",     text: "text-blue-300",    border: "border-blue-700/40" }
  if (p === "dispersão" || p === "dispersao")       return { bg: "bg-amber-900/50",    text: "text-amber-300",   border: "border-amber-700/40" }
  if (p === "alcance")                              return { bg: "bg-sky-900/50",      text: "text-sky-300",     border: "border-sky-700/40" }
  if (p === "arremessável" || p === "arremessavel") return { bg: "bg-cyan-900/50",     text: "text-cyan-300",    border: "border-cyan-700/40" }
  if (p.startsWith("munição") || p.startsWith("municao")) return { bg: "bg-zinc-800/80", text: "text-zinc-300", border: "border-zinc-600/50" }
  if (p === "corpo" || p === "cabeça")              return { bg: "bg-violet-900/50",   text: "text-violet-300",  border: "border-violet-700/40" }
  if (p === "discreta")                             return { bg: "bg-teal-900/50",     text: "text-teal-300",    border: "border-teal-700/40" }
  if (p === "balístico")                            return { bg: "bg-blue-900/50",     text: "text-blue-300",    border: "border-blue-700/40" }
  if (p === "ágil")                                 return { bg: "bg-emerald-900/50",  text: "text-emerald-300", border: "border-emerald-700/40" }
  if (p === "arremessável" || p === "arremessavel") return { bg: "bg-cyan-900/50",     text: "text-cyan-300",    border: "border-cyan-700/40" }
  return { bg: "bg-zinc-800/60", text: "text-zinc-300", border: "border-zinc-600/40" }
}

function PropertyChips({ properties }: { properties: string[] }) {
  if (!properties.length) return null
  return (
    <div className="flex flex-wrap gap-1">
      {properties.map((prop) => {
        const s = propStyle(prop)
        return (
          <span key={prop} className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded border ${s.bg} ${s.text} ${s.border}`}>
            {s.icon}{prop}
          </span>
        )
      })}
    </div>
  )
}

function RankBadge({ cat }: { cat: OPRankCategory }) {
  const c = RANK_CAT_COLORS[cat]
  return (
    <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded border tracking-wider ${c.bg} ${c.text} ${c.border}`}>
      {RANK_CATEGORY_LABELS[cat]}
    </span>
  )
}

// ─── Painel de detalhes expandido ────────────────────────────────────────────

function ItemDetails({
  damage, damageType, critical, hands, range, defense, penalty, slots, description, properties, element,
}: {
  damage?: string; damageType?: string; critical?: string; hands?: string; range?: string
  defense?: number; penalty?: number; slots: number
  description: string; properties?: string[]; element?: string
}) {
  const slotsLabel = slots === 0 ? "Especial" : slots === 1 ? "1 espaço" : `${slots} espaços`
  const slotsColor = slots === 0 ? "text-zinc-500" : slots <= 1 ? "text-teal-400" : slots <= 2 ? "text-amber-400" : "text-red-400"

  return (
    <div className="px-4 pb-4 pt-3 space-y-3 border-t border-white/8 bg-black/40">
      {description && (
        <p className="text-[12px] text-foreground/75 leading-relaxed">{description}</p>
      )}

      {element && (
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded border bg-rose-950/40 border-rose-800/40 text-rose-300 text-[11px] font-semibold">
          <Skull className="h-3 w-3" />Elemento: {element}
        </div>
      )}

      {(damage || range !== undefined || defense !== undefined || penalty || critical) && (
        <div className="flex flex-wrap gap-3">
          {damage && (
            <div className="flex items-center gap-1.5">
              <Crosshair className="h-3.5 w-3.5 text-red-400 shrink-0" />
              <span className="text-sm font-bold font-mono text-red-300">{damage}</span>
              <span className="text-xs text-foreground/55">{damageType}</span>
              {critical && <span className="text-[10px] text-foreground/40 font-mono">crit {critical}</span>}
            </div>
          )}
          {hands && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wide">Empunhadura</span>
              <span className="text-xs font-bold text-foreground/70">{hands === "light" ? "Leve" : hands === "one" ? "1 mão" : "2 mãos"}</span>
            </div>
          )}
          {range && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wide">Alcance</span>
              <span className="text-sm font-bold font-mono text-sky-300">{range}</span>
            </div>
          )}
          {defense !== undefined && (
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-teal-400 shrink-0" />
              <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wide">Defesa</span>
              <span className="text-sm font-bold font-mono text-teal-300">+{defense}</span>
            </div>
          )}
          {penalty !== undefined && penalty !== 0 && (
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-400 shrink-0" />
              <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wide">Penalidade AGI</span>
              <span className="text-sm font-bold font-mono text-orange-300">{penalty}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 text-foreground/40 shrink-0" />
            <span className={`text-xs font-medium ${slotsColor}`}>{slotsLabel}</span>
          </div>
        </div>
      )}

      {properties && properties.length > 0 && <PropertyChips properties={properties} />}
    </div>
  )
}

// ─── Diálogo de item personalizado ───────────────────────────────────────────

function AddCustomItemDialog({ onAdd }: { onAdd: (item: CustomShopItem) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [category, setCategory] = useState<ShopItemCategory>("equipamento")
  const [rankCategory, setRankCategory] = useState<OPRankCategory>("cat-I")
  const [price, setPrice] = useState("")
  const [slots, setSlots] = useState("")
  const [damage, setDamage] = useState("")
  const [damageType, setDamageType] = useState("")
  const [defense, setDefense] = useState("")
  const [description, setDescription] = useState("")
  const [iconOverride, setIconOverride] = useState("")
  const [selectedMods, setSelectedMods] = useState<string[]>([])
  const [suggestion, setSuggestion] = useState<{ icon: string; confidence: string }>({ icon: "", confidence: "none" })
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const WEAPON_CATS: ShopItemCategory[] = ["arma-simples", "arma-tatica", "arma-fogo", "arma-pesada", "arma-disparo"]
  const isWeaponCategory = WEAPON_CATS.includes(category)
  const availableModsForCategory = getModsForWeapon(category)
  const effectiveRankFromMods = isWeaponCategory && selectedMods.length > 0
    ? applyModsToCategory(rankCategory, selectedMods.length)
    : undefined

  function toggleMod(id: string) {
    setSelectedMods((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id])
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (name.trim().length < 2) { setSuggestion({ icon: "", confidence: "none" }); return }
      setSuggestion(suggestIcon(name, description))
    }, 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, description])

  const activeIcon = iconOverride.trim() || suggestion.icon

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim() || !price) return
    const item: CustomShopItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      category,
      rankCategory,
      price: parseInt(price, 10) || 0,
      slots: parseFloat(slots) || 1,
      description: description.trim(),
      icon: activeIcon || undefined,
      damage: damage.trim() || undefined,
      damageType: damageType.trim() || undefined,
      defense: defense ? parseInt(defense, 10) : undefined,
      ...(selectedMods.length > 0 ? {
        modifications: selectedMods,
        effectiveRankCategory: applyModsToCategory(rankCategory, selectedMods.length),
      } : {}),
    }
    onAdd(item)
    setOpen(false)
    setName(""); setCategory("equipamento"); setRankCategory("cat-I"); setPrice(""); setSlots("")
    setDamage(""); setDamageType(""); setDefense(""); setDescription(""); setIconOverride("")
    setSelectedMods([])
    setSuggestion({ icon: "", confidence: "none" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 text-xs bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary px-3 gap-1.5">
          <Plus className="h-3 w-3" />Criar Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-zinc-900 border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold tracking-widest uppercase text-primary/80 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />Criar Item Personalizado
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground/70">Nome do item *</Label>
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 shrink-0 rounded bg-black/50 border border-primary/20 flex items-center justify-center">
                {activeIcon
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={gameIconUrl(activeIcon, "ffffff")} alt="" className="w-5 h-5" />
                  : <Sparkles className="h-3.5 w-3.5 text-muted-foreground/30" />}
              </div>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Espada Amaldiçoada"
                className="h-8 text-sm bg-black/30 border-primary/20" required />
            </div>
            {suggestion.confidence !== "none" && !iconOverride && (
              <p className={`text-[10px] pl-10 ${CONFIDENCE_COLOR[suggestion.confidence]}`}>
                <Sparkles className="h-2.5 w-2.5 inline mr-1" />
                Ícone sugerido: {suggestion.icon} — {CONFIDENCE_LABEL[suggestion.confidence]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground/70">Tipo *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ShopItemCategory)}>
                <SelectTrigger className="h-8 text-xs bg-black/30 border-primary/20"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-primary/20">
                  {(Object.entries(CATEGORY_LABELS) as [ShopItemCategory, string][]).map(([k, v]) => (
                    <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground/70">Categoria (regras) *</Label>
              <Select value={rankCategory} onValueChange={(v) => setRankCategory(v as OPRankCategory)}>
                <SelectTrigger className="h-8 text-xs bg-black/30 border-primary/20"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-primary/20">
                  {(Object.entries(RANK_CATEGORY_LABELS) as [OPRankCategory, string][]).map(([k, v]) => (
                    <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground/70">Preço ($)</Label>
              <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="500" className="h-8 text-sm bg-black/30 border-primary/20" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground/70">Espaços de carga</Label>
              <Input type="number" min="0" step="1" value={slots} onChange={(e) => setSlots(e.target.value)}
                placeholder="1" className="h-8 text-xs bg-black/30 border-primary/20" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground/70">Dano</Label>
              <Input value={damage} onChange={(e) => setDamage(e.target.value)} placeholder="2d6"
                className="h-8 text-xs bg-black/30 border-primary/20" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground/70">Tipo</Label>
              <Input value={damageType} onChange={(e) => setDamageType(e.target.value)} placeholder="Corte"
                className="h-8 text-xs bg-black/30 border-primary/20" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground/70">Defesa</Label>
              <Input type="number" value={defense} onChange={(e) => setDefense(e.target.value)} placeholder="2"
                className="h-8 text-xs bg-black/30 border-primary/20" />
            </div>
          </div>

          {isWeaponCategory && availableModsForCategory.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground/70">Modificações (opcional)</Label>
                {effectiveRankFromMods && (
                  <span className="text-[10px] text-amber-300 font-semibold">
                    {RANK_CATEGORY_LABELS[rankCategory]} → {RANK_CATEGORY_LABELS[effectiveRankFromMods]}
                  </span>
                )}
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto rounded-md border border-primary/15 p-1.5 bg-black/20 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                {availableModsForCategory.map((mod) => (
                  <label key={mod.id}
                    className={`flex items-start gap-2.5 px-2.5 py-2 rounded cursor-pointer transition-colors ${
                      selectedMods.includes(mod.id) ? "bg-primary/15 border border-primary/25" : "hover:bg-white/[0.04] border border-transparent"
                    }`}>
                    <input type="checkbox" checked={selectedMods.includes(mod.id)}
                      onChange={() => toggleMod(mod.id)} className="mt-0.5 accent-primary" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-foreground leading-tight">{mod.name}</p>
                      <p className="text-[10px] text-foreground/45 leading-snug">{mod.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground/70">Ícone (autor/nome)</Label>
            <Input value={iconOverride} onChange={(e) => setIconOverride(e.target.value)}
              placeholder={suggestion.icon || "lorc/broadsword"}
              className="h-8 text-xs bg-black/30 border-primary/20" />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground/70">Descrição</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes do item, história, efeitos especiais..."
              className="h-16 text-xs bg-black/30 border-primary/20 resize-none" />
          </div>

          <Button type="submit" className="w-full h-8 text-xs bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary gap-1.5">
            <Plus className="h-3 w-3" />Adicionar ao Mercado
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Editor de preço inline ───────────────────────────────────────────────────

function PriceEditor({ originalPrice, overridePrice, onSave, onReset }: {
  originalPrice: number; overridePrice?: number
  onSave: (p: number) => void; onReset: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(overridePrice ?? originalPrice))
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  function commit() {
    const val = parseInt(draft, 10)
    if (!isNaN(val) && val >= 0) { if (val === originalPrice) onReset(); else onSave(val) }
    setEditing(false)
  }

  const displayPrice = overridePrice ?? originalPrice
  const isOverridden = overridePrice !== undefined && overridePrice !== originalPrice

  if (editing) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <span className="text-primary/40 text-[11px] font-mono">$</span>
        <input ref={inputRef} type="number" min="0" value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false) }}
          onBlur={commit}
          className="w-20 h-6 text-xs font-mono bg-black/60 border border-primary/40 rounded px-1 text-primary text-right focus:outline-none focus:border-primary/80" />
        <button type="button" onClick={commit} className="w-5 h-5 rounded flex items-center justify-center text-primary/70 hover:text-primary hover:bg-primary/10">
          <Check className="h-3 w-3" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <div className="text-right">
        <span className={`text-[13px] font-bold font-mono tracking-tight ${isOverridden ? "text-amber-400" : "text-primary"}`}>
          ${displayPrice.toLocaleString("pt-BR")}
        </span>
        {isOverridden && (
          <div className="text-[9px] text-muted-foreground/40 line-through text-right">${originalPrice.toLocaleString("pt-BR")}</div>
        )}
      </div>
      <button type="button" onClick={(e) => { e.stopPropagation(); setDraft(String(displayPrice)); setEditing(true) }}
        className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-muted-foreground/20 hover:text-primary/60 hover:bg-primary/10 transition-colors"
        aria-label="Editar preço">
        <Pencil className="h-2.5 w-2.5" />
      </button>
      {isOverridden && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onReset() }}
          className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-amber-400/40 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
          aria-label="Restaurar preço original" title={`Restaurar $${originalPrice}`}>
          <RotateCcw className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  )
}

// ─── Diálogo de modificações de arma ─────────────────────────────────────────

const RANK_ORDER: OPRankCategory[] = ["cat-0", "cat-I", "cat-II", "cat-III", "cat-IV"]

const WEAPON_CATS: ShopItemCategory[] = ["arma-simples", "arma-tatica", "arma-fogo", "arma-pesada", "arma-disparo"]

function WeaponModDialog({
  item, shopMode, patenteId, inventoryItems, onConfirm, viewOnly, initialSelected, children,
}: {
  item: { id: string; name: string; category: ShopItemCategory; rankCategory: OPRankCategory }
  shopMode?: ShopMode
  patenteId?: string
  inventoryItems?: Array<{ rankCategory?: string; effectiveRankCategory?: string }>
  onConfirm?: (mods: string[]) => void
  viewOnly?: boolean
  initialSelected?: string[]
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(initialSelected ?? [])

  const availableMods: WeaponMod[] = getModsForWeapon(item.category)
  const effectiveCat = applyModsToCategory(item.rankCategory, selected.length)

  function canAddMod(modId: string): boolean {
    if (selected.includes(modId)) return false
    if (viewOnly || !patenteId || shopMode === "market") return true
    const newCat = applyModsToCategory(item.rankCategory, selected.length + 1)
    const patente = getPatenteById(patenteId)
    const limit = patente.catLimits[newCat]
    if (limit === 0) return false
    if (limit === -1) return true
    const used = (inventoryItems ?? []).filter((i) => (i.effectiveRankCategory ?? i.rankCategory ?? "cat-0") === newCat).length
    return used < limit
  }

  function canConfirmWithMods(): boolean {
    if (viewOnly || !patenteId || shopMode === "market") return true
    const patente = getPatenteById(patenteId)
    const limit = patente.catLimits[effectiveCat]
    if (limit === 0) return false
    if (limit === -1) return true
    const used = (inventoryItems ?? []).filter((i) => (i.effectiveRankCategory ?? i.rankCategory ?? "cat-0") === effectiveCat).length
    return used < limit
  }

  const effectiveCatIdx = RANK_ORDER.indexOf(effectiveCat)
  const baseCatIdx = RANK_ORDER.indexOf(item.rankCategory)
  const catUpgradeCount = effectiveCatIdx - baseCatIdx

  function toggle(id: string) {
    if (viewOnly) return
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  function handleConfirm(withMods: boolean) {
    onConfirm?.(withMods ? selected : [])
    setOpen(false)
    if (!viewOnly) setSelected([])
  }

  const isWeapon = WEAPON_CATS.includes(item.category)
  if (!isWeapon && !viewOnly) {
    return <div onClick={() => onConfirm?.([])}>{children}</div>
  }

  const confirmBlocked = selected.length > 0 && !canConfirmWithMods()

  const rankColors = {
    "cat-0":   { text: "text-zinc-300",   bg: "bg-zinc-700/30",   border: "border-zinc-600/50" },
    "cat-I":   { text: "text-indigo-300", bg: "bg-indigo-500/20", border: "border-indigo-500/40" },
    "cat-II":  { text: "text-sky-300",    bg: "bg-sky-500/20",    border: "border-sky-500/40" },
    "cat-III": { text: "text-amber-300",  bg: "bg-amber-500/20",  border: "border-amber-500/40" },
    "cat-IV":  { text: "text-rose-300",   bg: "bg-rose-500/20",   border: "border-rose-500/40" },
  }
  const effColors = rankColors[effectiveCat]
  const baseColors = rankColors[item.rankCategory]

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v && !viewOnly) setSelected([]) }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm bg-[#111318] border-white/8 p-0 overflow-hidden gap-0">

        <div className="px-5 pt-5 pb-4 border-b border-white/6">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-white/40" />
            <DialogTitle className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/40">
              {viewOnly ? "Modificações disponíveis" : "Selecionar modificações"}
            </DialogTitle>
          </div>
          <p className="text-[15px] font-semibold text-white/90">{item.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${baseColors.bg} ${baseColors.text} ${baseColors.border}`}>
              Base: {RANK_CATEGORY_LABELS[item.rankCategory]}
            </span>
            {catUpgradeCount > 0 && (
              <>
                <ChevronRight className="h-3 w-3 text-white/20" />
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${effColors.bg} ${effColors.text} ${effColors.border}`}>
                  {viewOnly ? "" : "Com mods: "}{RANK_CATEGORY_LABELS[effectiveCat]}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="px-3 py-3 space-y-1 max-h-72 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {availableMods.map((mod) => {
            const isSelected = selected.includes(mod.id)
            const canAdd = canAddMod(mod.id)
            const isDisabledMod = !viewOnly && !isSelected && !canAdd

            return (
              <label
                key={mod.id}
                className={`flex items-start gap-3 px-3.5 py-3 rounded-lg border transition-all duration-150 ${
                  viewOnly ? "cursor-default" : "cursor-pointer"
                } ${
                  isSelected
                    ? "bg-white/[0.07] border-white/20"
                    : isDisabledMod
                      ? "bg-transparent border-white/4 opacity-30 cursor-not-allowed"
                      : viewOnly
                        ? "bg-white/[0.03] border-white/6"
                        : "bg-white/[0.03] border-white/6 hover:bg-white/[0.06] hover:border-white/12"
                }`}
              >
                {!viewOnly && (
                  <div className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isSelected ? "bg-white/90 border-white/90" : "border-white/20 bg-transparent"
                  }`}>
                    {isSelected && <Check className="h-2.5 w-2.5 text-[#111318]" strokeWidth={3} />}
                    <input type="checkbox" checked={isSelected} disabled={isDisabledMod}
                      onChange={() => !isDisabledMod && toggle(mod.id)} className="sr-only" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold leading-tight text-white/85">{mod.name}</p>
                  <p className="text-[11px] text-white/40 leading-snug mt-0.5">{mod.description}</p>
                </div>
                {isSelected && viewOnly && (
                  <span className="text-[9px] font-semibold text-white/50 bg-white/8 border border-white/12 px-1.5 py-0.5 rounded shrink-0 mt-0.5 tracking-wide">
                    ATIVA
                  </span>
                )}
              </label>
            )
          })}
        </div>

        <div className="px-4 pb-4 pt-3 border-t border-white/6 space-y-2.5">
          {!viewOnly && selected.length > 0 && (
            <div className={`px-3 py-2 rounded-lg border text-[11px] leading-relaxed ${
              confirmBlocked
                ? "bg-red-950/40 border-red-800/40 text-red-400"
                : "bg-white/[0.04] border-white/8 text-white/50"
            }`}>
              <span className="font-semibold text-white/70">{selected.length} mod{selected.length > 1 ? "s" : ""}</span>
              {" · "}{RANK_CATEGORY_LABELS[item.rankCategory]}
              <span className="mx-1.5 text-white/20">→</span>
              <span className={`font-bold ${effColors.text}`}>{RANK_CATEGORY_LABELS[effectiveCat]}</span>
              {confirmBlocked && (
                <span className="block mt-0.5 font-semibold text-red-400">
                  Limite de {RANK_CATEGORY_LABELS[effectiveCat]} atingido para sua patente
                </span>
              )}
            </div>
          )}

          {viewOnly ? (
            <Button variant="outline" className="w-full h-9 text-sm font-medium border-white/10 hover:bg-white/6 text-white/70"
              onClick={() => setOpen(false)}>
              Fechar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 h-9 text-xs border-white/10 text-white/60 hover:bg-white/6"
                onClick={() => handleConfirm(false)}>
                Sem modificações
              </Button>
              <Button size="sm"
                className="flex-1 h-9 text-xs bg-white/90 hover:bg-white text-[#111318] font-semibold border-0 disabled:opacity-30"
                disabled={selected.length === 0 || confirmBlocked}
                onClick={() => handleConfirm(true)}>
                {selected.length === 0 ? "Selecione mods" : `Confirmar (${RANK_CATEGORY_LABELS[effectiveCat]})`}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Separador ornamental de categoria ───────────────────────────────────────

function CategoryDivider({ label, count, icon }: { label: string; count: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 select-none bg-white/[0.02] border-y border-white/[0.06] sticky top-0 z-10 backdrop-blur-sm">
      {icon && <span className="text-foreground/30 shrink-0">{icon}</span>}
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40 shrink-0">{label}</span>
      <div className="flex-1 h-px bg-white/[0.06]" />
      <span className="text-[10px] tabular-nums text-foreground/25 shrink-0 font-mono">{count}</span>
    </div>
  )
}

// ─── Linha de item ────────────────────────────────────────────────────────────

function ItemRow({
  item, disabled, isGm, overridePrice, shopMode,
  canRequisition, patenteId, inventoryItems, onToggle, onOverride, onBuy,
}: {
  item: ShopItem
  disabled: boolean
  isGm: boolean
  overridePrice?: number
  shopMode: ShopMode
  canRequisition?: boolean
  patenteId?: string
  inventoryItems?: Array<{ rankCategory?: string; effectiveRankCategory?: string }>
  onToggle: () => void
  onOverride?: (price: number | null) => void
  onBuy?: (mods: string[]) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const displayPrice = overridePrice ?? item.price
  const effectiveRank = item.rankCategory
  const rankColors = RANK_CAT_COLORS[effectiveRank]

  return (
    <div className={`border-b border-white/[0.05] last:border-b-0 transition-opacity ${disabled ? "opacity-30" : ""}`}>
      <div
        className={`flex items-center gap-3 pl-0 pr-3 py-2.5 cursor-pointer group hover:bg-white/[0.035] transition-colors duration-150 border-l-[3px] ${rankColors.accent}`}
        onClick={() => setExpanded((v) => !v)}
        role="button"
        aria-expanded={expanded}
      >
        {isGm && (
          <div className="pl-3" onClick={(e) => e.stopPropagation()}>
            <Switch checked={!disabled} onCheckedChange={onToggle}
              className="h-4 w-7 shrink-0 data-checked:bg-primary data-unchecked:bg-zinc-700" />
          </div>
        )}

        <div className={`${isGm ? "" : "ml-3"} w-9 h-9 shrink-0 flex items-center justify-center rounded-md ${rankColors.iconBg} ${rankColors.glow} border border-white/10`}>
          {item.icon
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={gameIconUrl(item.icon, "ffffff")} alt="" className="w-6 h-6" loading="lazy" />
            : <Swords className="w-4 h-4 text-white/60" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap leading-none">
            <span className="text-[14px] font-semibold text-foreground leading-tight">{item.name}</span>
            <RankBadge cat={effectiveRank} />
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {item.damage && (
              <span className="flex items-center gap-1">
                <Crosshair className="h-2.5 w-2.5 text-red-400 shrink-0" />
                <span className="text-[11px] font-bold font-mono text-red-300">{item.damage}</span>
                <span className="text-[10px] text-foreground/50">{item.damageType}</span>
                {item.critical && <span className="text-[9px] text-foreground/35 font-mono">/{item.critical}</span>}
              </span>
            )}
            {item.defense !== undefined && (
              <span className="text-[11px] font-bold font-mono text-teal-300">+{item.defense} def</span>
            )}
            {item.range && (
              <span className="text-[11px] font-mono text-sky-300">{item.range}</span>
            )}
            {item.element && (
              <span className="text-[10px] font-semibold text-rose-400/80 bg-rose-950/40 border border-rose-900/50 px-1.5 py-0.5 rounded">
                {item.element}
              </span>
            )}
            {item.properties && item.properties.slice(0, expanded ? 0 : 2).map((p) => {
              const s = propStyle(p)
              return (
                <span key={p} className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded border ${s.bg} ${s.text} ${s.border}`}>
                  {s.icon}{p}
                </span>
              )
            })}
            {!expanded && (item.properties?.length ?? 0) > 2 && (
              <span className="text-[10px] text-foreground/35">+{(item.properties?.length ?? 0) - 2}</span>
            )}
          </div>
        </div>

        {shopMode === "market" && (
          isGm && onOverride ? (
            <PriceEditor originalPrice={item.price} overridePrice={overridePrice} onSave={(p) => onOverride(p)} onReset={() => onOverride(null)} />
          ) : (
            <div className="shrink-0 text-right">
              <span className="text-sm font-bold text-primary font-mono">${displayPrice.toLocaleString("pt-BR")}</span>
            </div>
          )
        )}

        {onBuy && (() => {
          const isWeapon = WEAPON_CATS.includes(item.category)
          const label = shopMode === "market" ? "Comprar" : "Coletar"
          const Icon = shopMode === "market" ? ShoppingCart : Package
          const disabledTitle = shopMode === "market" ? "Dinheiro insuficiente" : "Limite de categoria atingido"
          const btn = (
            <button type="button"
              onClick={isWeapon ? undefined : (e) => { e.stopPropagation(); onBuy([]) }}
              disabled={!canRequisition}
              className="shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-primary/20 hover:bg-primary/35 border border-primary/30 text-primary"
              title={canRequisition ? label : disabledTitle}
              aria-label={`${label} ${item.name}`}>
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          )
          if (!isWeapon || !canRequisition) return <div onClick={(e) => e.stopPropagation()}>{btn}</div>
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <WeaponModDialog
                item={item}
                shopMode={shopMode}
                patenteId={patenteId ?? "recruta"}
                inventoryItems={inventoryItems ?? []}
                onConfirm={onBuy}
              >
                {btn}
              </WeaponModDialog>
            </div>
          )
        })()}

        {isGm && WEAPON_CATS.includes(item.category) && (
          <div onClick={(e) => e.stopPropagation()}>
            <WeaponModDialog item={item} viewOnly>
              <button type="button"
                className="shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-colors text-foreground/25 hover:text-primary/70 hover:bg-primary/10 border border-transparent hover:border-primary/20"
                title="Ver modificações disponíveis"
                aria-label={`Modificações de ${item.name}`}>
                <Package className="h-3.5 w-3.5" />
              </button>
            </WeaponModDialog>
          </div>
        )}

        <span className={`shrink-0 text-foreground/25 group-hover:text-foreground/50 transition-all duration-200 ease-out ${expanded ? "rotate-90" : "rotate-0"}`}>
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>

      {expanded && (
        <ItemDetails damage={item.damage} damageType={item.damageType} critical={item.critical}
          hands={item.hands} range={item.range} defense={item.defense} penalty={item.penalty}
          slots={item.slots} description={item.description} properties={item.properties} element={item.element} />
      )}
    </div>
  )
}

// ─── Linha de item personalizado ──────────────────────────────────────────────

function CustomItemRow({
  item, isGm, shopMode, patenteId, inventoryItems, onRemove, onBuy, canBuy,
}: {
  item: CustomShopItem; isGm: boolean; shopMode: ShopMode
  patenteId?: string
  inventoryItems?: Array<{ rankCategory?: string; effectiveRankCategory?: string }>
  onRemove?: () => void; onBuy?: (mods: string[]) => void; canBuy?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const effectiveCat = item.effectiveRankCategory ?? item.rankCategory
  const rankColors = RANK_CAT_COLORS[effectiveCat]
  const mods = item.modifications ?? []
  const modNames = mods.map((id) => WEAPON_MODS.find((m) => m.id === id)?.name ?? id)

  return (
    <div className="border-b border-white/[0.05] last:border-b-0">
      <div className={`flex items-center gap-3 pl-0 pr-3 py-2.5 cursor-pointer group hover:bg-white/[0.035] transition-colors duration-150 border-l-[3px] ${rankColors.accent}`}
        onClick={() => setExpanded((v) => !v)} role="button" aria-expanded={expanded}>
        {isGm && onRemove && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="ml-3 shrink-0 w-6 h-6 rounded flex items-center justify-center text-red-400/70 hover:text-red-300 hover:bg-red-900/40 transition-colors"
            aria-label={`Remover ${item.name}`}>
            <X className="h-3 w-3" />
          </button>
        )}
        <div className={`${isGm ? "" : "ml-3"} w-9 h-9 shrink-0 flex items-center justify-center rounded-md ${rankColors.iconBg} ${rankColors.glow} border border-white/10`}>
          {item.icon
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={gameIconUrl(item.icon, "ffffff")} alt="" className="w-5 h-5" loading="lazy" />
            : <Star className="w-4 h-4 text-primary/50" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap leading-none">
            <span className="text-[14px] font-semibold text-foreground leading-tight truncate">{item.name}</span>
            <span className="text-[9px] font-bold text-primary/60 bg-primary/15 border border-primary/25 px-1.5 py-0.5 rounded shrink-0 tracking-wide">MESTRE</span>
            <RankBadge cat={effectiveCat} />
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {item.damage && (
              <span className="flex items-center gap-1">
                <Crosshair className="h-2.5 w-2.5 text-red-400 shrink-0" />
                <span className="text-[11px] font-bold font-mono text-red-300">{item.damage}</span>
                <span className="text-[10px] text-foreground/50">{item.damageType}</span>
              </span>
            )}
            {item.defense !== undefined && <span className="text-[11px] font-bold font-mono text-teal-300">+{item.defense} def</span>}
            {modNames.map((n) => (
              <span key={n} className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-primary/10 text-primary/70 border-primary/20">{n}</span>
            ))}
          </div>
        </div>

        {shopMode === "market" && (
          <span className="text-sm font-bold text-primary font-mono shrink-0">${item.price.toLocaleString("pt-BR")}</span>
        )}

        {onBuy && (() => {
          const isWeapon = WEAPON_CATS.includes(item.category)
          const label = shopMode === "market" ? "Comprar" : "Coletar"
          const Icon = shopMode === "market" ? ShoppingCart : Package
          const btn = (
            <button type="button"
              onClick={isWeapon ? undefined : (e) => { e.stopPropagation(); onBuy([]) }}
              disabled={!canBuy}
              className="shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-primary/20 hover:bg-primary/35 border border-primary/30 text-primary"
              aria-label={`${label} ${item.name}`}>
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          )
          if (!isWeapon || !canBuy) return <div onClick={(e) => e.stopPropagation()}>{btn}</div>
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <WeaponModDialog item={item} shopMode={shopMode} patenteId={patenteId ?? "recruta"}
                inventoryItems={inventoryItems ?? []} onConfirm={onBuy}>
                {btn}
              </WeaponModDialog>
            </div>
          )
        })()}

        <span className={`shrink-0 text-foreground/25 group-hover:text-foreground/50 transition-all duration-200 ease-out ${expanded ? "rotate-90" : "rotate-0"}`}>
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
      {expanded && (
        <ItemDetails damage={item.damage} damageType={item.damageType}
          defense={item.defense} slots={item.slots} description={item.description} properties={item.properties} />
      )}
    </div>
  )
}

// ─── Painel de limites por categoria (modo requisição) ────────────────────────

function RequisitionLimits({ patenteId, inventoryItems }: {
  patenteId: string
  inventoryItems: Array<{ rankCategory?: string }>
}) {
  const patente = getPatenteById(patenteId)
  const cats: OPRankCategory[] = ["cat-I", "cat-II", "cat-III", "cat-IV"]
  const used: Record<OPRankCategory, number> = { "cat-0": 0, "cat-I": 0, "cat-II": 0, "cat-III": 0, "cat-IV": 0 }
  for (const item of inventoryItems) {
    const cat = (item.rankCategory ?? "cat-0") as OPRankCategory
    used[cat] = (used[cat] ?? 0) + 1
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5">
        <Star className="h-3 w-3 text-primary/60" />
        <span className="text-[10px] font-semibold text-primary/70">{patente.name}</span>
      </div>
      {cats.map((cat) => {
        const limit = patente.catLimits[cat]
        if (limit === 0) return null
        const u = used[cat] ?? 0
        const full = u >= limit
        return (
          <div key={cat} className="flex items-center gap-1">
            <RankBadge cat={cat} />
            <span className={`text-[10px] font-mono font-semibold ${full ? "text-red-400" : "text-foreground/55"}`}>
              {u}/{limit}
            </span>
          </div>
        )
      })}
      <span className="text-[9px] text-foreground/35">Cat. 0 ilimitado</span>
    </div>
  )
}

// ─── Seletor de livros ────────────────────────────────────────────────────────

function BookSelector({
  selectedBook, onSelect, allBooks,
}: {
  selectedBook: string | null
  onSelect: (id: string | null) => void
  allBooks: typeof ORDEM_PARANORMAL_ITEM_BOOKS
}) {
  return (
    <div className="flex items-start gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
        <BookOpen className="h-3.5 w-3.5 text-muted-foreground/40" />
        <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">Livros</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {allBooks.map((book) => {
          const active = selectedBook === book.id
          return (
            <button
              key={book.id}
              type="button"
              onClick={() => onSelect(active ? null : book.id)}
              className={`h-6 px-2.5 rounded-full text-[11px] font-semibold border transition-all duration-150 ${
                active
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-transparent border-white/10 text-foreground/30 hover:border-white/20 hover:text-foreground/50"
              }`}
            >
              {book.shortName}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Filtro de categorias ─────────────────────────────────────────────────────

function CategoryFilter({
  categories, active, onChange,
}: {
  categories: ShopItemCategory[]
  active: ShopItemCategory | null
  onChange: (c: ShopItemCategory | null) => void
}) {
  if (categories.length === 0) return null
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`h-6 px-2.5 rounded-full text-[11px] font-semibold border transition-all duration-150 ${
          active === null
            ? "bg-white/10 border-white/20 text-foreground"
            : "bg-transparent border-white/8 text-foreground/35 hover:border-white/16 hover:text-foreground/60"
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(active === cat ? null : cat)}
          className={`h-6 px-2.5 rounded-full text-[11px] font-semibold border transition-all duration-150 flex items-center gap-1 ${
            active === cat
              ? "bg-white/10 border-white/20 text-foreground"
              : "bg-transparent border-white/8 text-foreground/35 hover:border-white/16 hover:text-foreground/60"
          }`}
        >
          {CATEGORY_ICONS[cat]}
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────

type Props = {
  campaignId: string
  system: string
  isGm: boolean
  initialEnabled: boolean
  initialConfig: Omit<ShopConfig, "mode"> & { mode?: ShopMode }
  playerCharacterId?: string
  playerDinheiro?: number
  playerPatente?: string
  playerPP?: number
}

export function CampaignShop({
  campaignId, system, isGm,
  initialEnabled, initialConfig,
  playerCharacterId, playerDinheiro: initialDinheiro,
  playerPatente: initialPatente = "recruta",
}: Props) {
  const [shopEnabled, setShopEnabled] = useState(initialEnabled)
  const [config, setConfig] = useState<ShopConfig>({
    ...initialConfig,
    mode: initialConfig.mode ?? "requisition",
    customItems: initialConfig.customItems ?? [],
  })
  const [dinheiro, setDinheiro] = useState(initialDinheiro ?? 0)
  const [inventoryItems, setInventoryItems] = useState<Array<{ rankCategory?: string }>>([])
  const [isPending, startTransition] = useTransition()
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<ShopItemCategory | null>(null)

  const allSystemItems = ITEMS_BY_SYSTEM[system] ?? []
  const allBooks = system === "ordem-paranormal" ? ORDEM_PARANORMAL_ITEM_BOOKS : []

  // Livro selecionado — single-select, null = todos
  const [selectedBook, setSelectedBook] = useState<string | null>(null)

  // Itens visíveis filtrados pelo livro selecionado
  const visibleSystemItems = allSystemItems.filter((i) =>
    !selectedBook || i.source === selectedBook
  )

  const categories = [...new Set(visibleSystemItems.map((i) => i.category))] as ShopItemCategory[]
  const customItems = config.customItems ?? []
  const shopMode: ShopMode = config.mode ?? "requisition"

  useEffect(() => {
    if (!playerCharacterId || isGm) return
    fetch(`/api/characters/${playerCharacterId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((char) => {
        if (!char?.data) return
        try {
          const data = JSON.parse(char.data)
          const items = JSON.parse(data.inventoryItems ?? "[]")
          setInventoryItems(items)
        } catch { /* ignore */ }
      })
  }, [playerCharacterId, isGm])

  function isDisabled(id: string) { return config.disabled.includes(id) }

  function toggleItem(id: string) {
    setConfig((prev) => ({
      ...prev,
      disabled: prev.disabled.includes(id) ? prev.disabled.filter((d) => d !== id) : [...prev.disabled, id],
    }))
  }

  function setOverride(id: string, price: number | null) {
    setConfig((prev) => {
      const overrides = { ...prev.overrides }
      if (price === null) delete overrides[id]; else overrides[id] = { price }
      return { ...prev, overrides }
    })
  }

  function toggleShop(enabled: boolean) {
    setShopEnabled(enabled)
    startTransition(async () => {
      const res = await fetch(`/api/campaigns/${campaignId}/shop`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopEnabled: enabled }),
      })
      if (!res.ok) toast.error("Erro ao atualizar mercado")
    })
  }

  function saveConfig() {
    startTransition(async () => {
      const res = await fetch(`/api/campaigns/${campaignId}/shop`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopConfig: config }),
      })
      if (res.ok) toast.success("Mercado salvo!")
      else toast.error("Erro ao salvar")
    })
  }

  const addCustomItem = useCallback((item: CustomShopItem) => {
    setConfig((prev) => ({ ...prev, customItems: [...(prev.customItems ?? []), item] }))
    toast.success(`"${item.name}" adicionado ao mercado!`)
  }, [])

  function removeCustomItem(id: string) {
    setConfig((prev) => ({ ...prev, customItems: (prev.customItems ?? []).filter((i) => i.id !== id) }))
  }

  async function doAction(itemId: string, itemName: string, mods: string[], customItem?: CustomShopItem) {
    if (!playerCharacterId) return
    startTransition(async () => {
      const body = customItem
        ? { customItem, mode: shopMode, modifications: mods }
        : { itemId, overridePrice: config.overrides[itemId]?.price, mode: shopMode, modifications: mods }

      const res = await fetch(`/api/characters/${playerCharacterId}/buy-item`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const data = await res.json()
        if (shopMode === "market") setDinheiro(parseInt(data.dinheiro, 10))
        try {
          const items = JSON.parse(data.inventoryItems ?? "[]")
          setInventoryItems(items)
        } catch { /* ignore */ }
        const modLabel = mods.length > 0 ? ` (${mods.length} mod${mods.length > 1 ? "s" : ""})` : ""
        toast.success(shopMode === "requisition" ? `${itemName}${modLabel} requisitado!` : `${itemName}${modLabel} comprado!`)
      } else {
        const data = await res.json()
        toast.error(data.error ?? "Erro ao processar item")
      }
    })
  }

  function canBuyItem(rankCat: OPRankCategory, price: number): boolean {
    if (isPending) return false
    if (shopMode === "market") return dinheiro >= price
    const patente = getPatenteById(initialPatente)
    const limit = patente.catLimits[rankCat]
    if (limit === 0) return false
    if (limit === -1) return true
    const used = inventoryItems.filter((i) => (i.rankCategory ?? "cat-0") === rankCat).length
    return used < limit
  }

  if (!isGm && !shopEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/8 flex items-center justify-center">
          <ShoppingBag className="h-7 w-7 text-foreground/15" />
        </div>
        <div>
          <p className="text-foreground/50 text-sm font-semibold">Mercado Fechado</p>
          <p className="text-muted-foreground/40 text-xs mt-1">O Mestre ainda não abriu o mercado para esta campanha.</p>
        </div>
      </div>
    )
  }

  // Aplicar filtro de categoria
  const filteredItems = activeCategoryFilter
    ? visibleSystemItems.filter((i) => i.category === activeCategoryFilter)
    : visibleSystemItems
  const filteredCategories = activeCategoryFilter ? [activeCategoryFilter] : categories
  const enabledCount = visibleSystemItems.length - visibleSystemItems.filter((i) => isDisabled(i.id)).length

  return (
    <div className="space-y-4 max-w-2xl">

      {/* ── Cabeçalho do Mercado ─── */}
      <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-black/60 via-[#0a1a0a]/80 to-black/40">
        {/* Padrão de fundo sutil */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "12px 12px",
        }} />

        <div className="relative px-5 py-4 space-y-3">
          {/* Título */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                <ShoppingBag className="h-4.5 w-4.5 text-primary/80" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground/90 tracking-wide">
                  {shopMode === "requisition" ? "Requisição de Equipamento" : "Mercado"}
                </h3>
                <p className="text-[10px] text-foreground/40">
                  {shopMode === "requisition" ? "A Ordem fornece itens conforme sua Patente" : "Adquira itens com seu dinheiro"}
                </p>
              </div>
            </div>
            {/* GM: toggle visibilidade */}
            {isGm && (
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => toggleShop(!shopEnabled)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all ${
                    shopEnabled
                      ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                      : "border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                  }`}
                  aria-label="Toggle mercado">
                  {shopEnabled
                    ? <><Eye className="h-3.5 w-3.5" /><span>Visível</span></>
                    : <><EyeOff className="h-3.5 w-3.5" /><span>Oculto</span></>
                  }
                </button>
              </div>
            )}
            {/* Jogador: saldo em modo mercado */}
            {!isGm && shopMode === "market" && playerCharacterId && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Coins className="h-3.5 w-3.5 text-primary/70" />
                <span className="text-sm font-bold text-primary font-mono">${dinheiro.toLocaleString("pt-BR")}</span>
              </div>
            )}
          </div>

          {/* Seletor de livros — visível para todos */}
          {allBooks.length > 0 && (
            <div className="pt-1 border-t border-white/6">
              <BookSelector selectedBook={selectedBook} onSelect={setSelectedBook} allBooks={allBooks} />
            </div>
          )}

          {/* GM: controles */}
          {isGm && (
            <div className="space-y-2.5 pt-1 border-t border-white/6">
              {/* Modo + Ações */}
              <div className="flex items-center gap-2 flex-wrap">
                <Select value={shopMode} onValueChange={(v) => setConfig((prev) => ({ ...prev, mode: v as ShopMode }))}>
                  <SelectTrigger className="h-7 text-[11px] bg-black/40 border-white/10 w-auto pr-6 gap-1.5">
                    <ChevronDown className="h-3 w-3 opacity-50" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-primary/20">
                    <SelectItem value="requisition" className="text-xs">Requisição (Patente)</SelectItem>
                    <SelectItem value="market" className="text-xs">Mercado ($)</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-[10px] text-muted-foreground/40 tabular-nums ml-auto">{enabledCount}/{visibleSystemItems.length} itens</span>
                <AddCustomItemDialog onAdd={addCustomItem} />
                <Button size="sm" onClick={saveConfig} disabled={isPending}
                  className="h-7 text-xs bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary px-3 gap-1.5">
                  <Save className="h-3 w-3" />Salvar
                </Button>
              </div>
            </div>
          )}

          {/* Jogador: limites de requisição */}
          {!isGm && shopMode === "requisition" && playerCharacterId && (
            <div className="pt-1 border-t border-white/6">
              <RequisitionLimits patenteId={initialPatente} inventoryItems={inventoryItems} />
            </div>
          )}
        </div>
      </div>

      {/* ── Filtro de categorias ─── */}
      {categories.length > 1 && (
        <div className="overflow-x-auto -mx-1 px-1">
          <CategoryFilter
            categories={categories}
            active={activeCategoryFilter}
            onChange={setActiveCategoryFilter}
          />
        </div>
      )}

      {/* ── Lista de itens ─── */}
      <div className="rounded-xl border border-white/8 bg-black/30 overflow-hidden">
        {filteredCategories.map((cat) => {
          const catItems = filteredItems.filter((i) => i.category === cat)
          const catEnabled = catItems.filter((i) => !isDisabled(i.id))
          const displayItems = isGm ? catItems : catEnabled
          if (displayItems.length === 0) return null
          return (
            <div key={cat}>
              <CategoryDivider
                label={CATEGORY_LABELS[cat]}
                count={isGm ? `${catEnabled.length}/${catItems.length}` : `${catEnabled.length}`}
                icon={CATEGORY_ICONS[cat]}
              />
              {displayItems.map((item) => {
                const overridePrice = config.overrides[item.id]?.price
                const effectivePrice = overridePrice ?? item.price
                const canAct = canBuyItem(item.rankCategory, effectivePrice)
                return (
                  <ItemRow key={item.id} item={item} disabled={isDisabled(item.id)}
                    isGm={isGm} overridePrice={overridePrice} shopMode={shopMode}
                    canRequisition={canAct}
                    patenteId={initialPatente}
                    inventoryItems={inventoryItems}
                    onToggle={() => toggleItem(item.id)}
                    onOverride={isGm ? (p) => setOverride(item.id, p) : undefined}
                    onBuy={!isGm && playerCharacterId ? (mods) => doAction(item.id, item.name, mods) : undefined}
                  />
                )
              })}
            </div>
          )
        })}

        {customItems.length > 0 && (
          <div>
            <CategoryDivider label="Itens do Mestre" count={`${customItems.length}`} icon={<Star className="h-3.5 w-3.5" />} />
            {customItems.map((item) => (
              <CustomItemRow key={item.id} item={item} isGm={isGm} shopMode={shopMode}
                patenteId={initialPatente}
                inventoryItems={inventoryItems}
                onRemove={isGm ? () => removeCustomItem(item.id) : undefined}
                onBuy={!isGm && playerCharacterId ? (mods) => doAction(item.id, item.name, mods, item) : undefined}
                canBuy={!isGm && canBuyItem(item.rankCategory, item.price) && !isPending}
              />
            ))}
          </div>
        )}

        {filteredItems.filter((i) => isGm || !isDisabled(i.id)).length === 0 && customItems.length === 0 && (
          <div className="py-16 text-center">
            <ShoppingBag className="h-8 w-8 text-foreground/10 mx-auto mb-3" />
            <p className="text-foreground/30 text-sm">
              {activeCategoryFilter ? "Nenhum item nesta categoria." : "Nenhum item disponível."}
            </p>
          </div>
        )}
      </div>

      {/* Rodapé jogador */}
      {!isGm && (
        <p className="text-[10px] text-muted-foreground/40 text-center">
          {shopMode === "requisition" ? "Itens fornecidos pela Ordem Paranormal conforme sua Patente" : "Itens disponibilizados pelo Mestre"}
        </p>
      )}
    </div>
  )
}
