"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import {
  Shield, Plus, Trash2, Hexagon, ChevronDown, ChevronRight, X,
  Settings, Share2, Heart, Brain, Zap, Eye, Activity, Wind, Search, BookOpen,
} from "lucide-react"
import {
  type OrdemParanormalData, type OPAttack, type OPSkillDef, type ShopItem, type OPHabilidadeDef,
  OP_SKILL_DEFS, ORDEM_PARANORMAL_CLASSES, PATENTE_DATA, getPatenteForPP,
  WEAPON_MODS, gameIconUrl, ORDEM_PARANORMAL_CONDITIONS, CONDITION_CATEGORY_LABELS,
  ORDEM_PARANORMAL_ORIGINS, ORDEM_PARANORMAL_ITEMS, HABILIDADES_OP, calcOPStats,
  type InventoryItem, type ActiveCondition, type ConditionCategory, type OPPatente,
  RITUAIS_OP, type OPRitualDef, defaultOrdemParanormalData,
} from "@/lib/systems"
import { suggestIcon } from "@/lib/suggest-icon"

const ITEM_LOOKUP = new Map<string, ShopItem>(ORDEM_PARANORMAL_ITEMS.map((i) => [i.id, i]))

// ─── Types ────────────────────────────────────────────────────────────────────

type SkillEntry = { treino: number; outros: number }
type SkillsMap = Record<string, SkillEntry>

type OPHabilidade = {
  id: string
  name: string
  description?: string
  nex?: string
  icon?: string
}

type Props = {
  characterId: string
  characterName: string
  initialData: OrdemParanormalData
  readOnly?: boolean
  deleteButton?: React.ReactNode
}

// ─── Roll result ─────────────────────────────────────────────────────────────

type RollResult = {
  skillName: string
  attrKey: string
  attrValue: number
  rolls: number[]
  bonus: number
  best: number
  total: number
}

// ─── D20 SVG icon ────────────────────────────────────────────────────────────

function D20Icon({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" />
      <polygon points="12,2 17,9 12,13 7,9" />
      <line x1="7" y1="9" x2="2" y2="8" />
      <line x1="17" y1="9" x2="22" y2="8" />
      <line x1="12" y1="13" x2="12" y2="22" />
      <line x1="12" y1="13" x2="2" y2="16" />
      <line x1="12" y1="13" x2="22" y2="16" />
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ATTR_ABBR: Record<string, string> = { str: "FOR", dex: "AGI", int: "INT", pres: "PRE", vig: "VIG" }

function parseSkills(raw: string): SkillsMap {
  try {
    const parsed = JSON.parse(raw || "{}")
    const out: SkillsMap = {}
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === "boolean") out[k] = { treino: v ? 5 : 0, outros: 0 }
      else if (v && typeof v === "object") out[k] = v as SkillEntry
    }
    return out
  } catch { return {} }
}

function parseHabilidades(raw: string): OPHabilidade[] {
  try { return JSON.parse(raw || "[]") } catch { return [] }
}

function rollDice(expr: string): number | null {
  const m = expr.trim().match(/^(\d+)d(\d+)([+-]\d+)?$/i)
  if (!m) { const n = parseInt(expr); return isNaN(n) ? null : n }
  const count = Math.min(20, parseInt(m[1]))
  const sides = parseInt(m[2])
  const bonus = m[3] ? parseInt(m[3]) : 0
  if (count < 1 || sides < 2 || sides > 1000) return null
  return Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1).reduce((a, b) => a + b, 0) + bonus
}

// ─── Condition colors ─────────────────────────────────────────────────────────

const CONDITION_COLORS: Record<ConditionCategory, string> = {
  medo:      "bg-amber-500/15 border-amber-500/30 text-amber-300",
  mental:    "bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300",
  fadiga:    "bg-orange-500/15 border-orange-500/30 text-orange-300",
  paralisia: "bg-blue-500/15 border-blue-500/30 text-blue-300",
  sentidos:  "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
  fisica:    "bg-red-500/15 border-red-500/30 text-red-300",
  ferimento: "bg-rose-500/15 border-rose-500/30 text-rose-300",
  doenca:    "bg-emerald-900/40 border-emerald-700/40 text-emerald-400",
  veneno:    "bg-green-900/40 border-green-600/30 text-green-400",
}

// ─── ResourceBar (pixel RPG style) ───────────────────────────────────────────

// Pixel art border colors — verde floresta (combina com primary oklch 0.55 0.17 145)
const GOLD_LIGHT  = "#4ade80"   // green-400  (highlight)
const GOLD_MID    = "#15803d"   // green-700  (um tom abaixo do botão)
const GOLD_DARK   = "#14532d"   // green-900  (sombra profunda)
const FRAME_DARK  = "#060d08"
const MEDAL_BG    = "#0b1a0f"

function ResourceBar({ label, icon, current, max, color, colorLight, colorDark, readOnly, onCurrentChange, onMaxChange }: {
  label: string
  icon: React.ReactNode
  current: number; max: number; color: string
  colorLight?: string; colorDark?: string
  readOnly: boolean
  onCurrentChange: (v: number) => void; onMaxChange: (v: number) => void
}) {
  const [editing, setEditing] = useState<"max" | null>(null)
  const [temp, setTemp] = useState("")
  const [popup, setPopup] = useState(false)
  const [delta, setDelta] = useState("")
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0

  function commit() {
    const n = parseInt(temp)
    if (!isNaN(n)) {
      if (editing === "max") onMaxChange(Math.max(0, n))
    }
    setEditing(null)
  }

  function startEdit(val: number) {
    if (readOnly) return
    setEditing("max"); setTemp(String(val))
  }

  function applyDano() {
    const n = parseInt(delta) || 0
    if (n > 0) { onCurrentChange(Math.max(0, current - n)); setPopup(false); setDelta("") }
  }
  function applyCura() {
    const n = parseInt(delta) || 0
    if (n > 0) { onCurrentChange(Math.min(max, current + n)); setPopup(false); setDelta("") }
  }
  function applyFull() { onCurrentChange(max); setPopup(false); setDelta("") }

  // Multi-layer gold box-shadow: highlight / mid / dark / outer black
  const frameShadow = `0 0 0 1px ${GOLD_LIGHT}, 0 0 0 2px #000, 0 0 0 4px ${GOLD_MID}, 0 0 0 6px #000`
  const medalShadow = `0 0 0 1px ${GOLD_LIGHT}, 0 0 0 2px #000, 0 0 0 4px ${GOLD_MID}, 0 0 0 6px #000`

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, position: "relative", paddingLeft: 4 }}>
      {/* Medallion */}
      <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0, zIndex: 2, marginRight: -6, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Diamond frame (rotated square) */}
        <div style={{
          position: "absolute", width: 40, height: 40,
          transform: "rotate(45deg)",
          background: MEDAL_BG,
          border: `3px solid #000`,
          boxShadow: medalShadow,
        }} />
        {/* Icon */}
        <div style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}>
          {icon}
        </div>
      </div>

      {/* Bar frame */}
      <div style={{
        flex: 1, height: 34, position: "relative",
        background: FRAME_DARK,
        border: `3px solid #000`,
        boxShadow: frameShadow,
      }}>
        {/* Track */}
        <div style={{ position: "absolute", inset: 2, background: "#160a10" }} />

        {/* Fill gradient */}
        {pct > 0 && (
          <div style={{
            position: "absolute", top: 2, bottom: 2, left: 2,
            width: `calc(${pct}% - 4px)`,
            background: `linear-gradient(180deg,
              ${colorLight || color}ee 0%,
              ${colorLight || color}bb 18%,
              ${color} 35%,
              ${color} 70%,
              ${colorDark || color}99 100%)`,
            transition: "width 0.25s ease",
          }}>
            {/* Top pixel highlight strip */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.25)" }} />
          </div>
        )}

        {/* Rivet bump (center decoration) */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 8, height: 8, borderRadius: "50%",
          background: GOLD_MID,
          border: "1px solid #000",
          boxShadow: `0 0 0 1px ${GOLD_LIGHT}`,
          zIndex: 3,
        }} />

        {/* Values overlay */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 12, gap: 3, zIndex: 4 }}>
          <button type="button" onClick={() => { if (!readOnly) { setDelta(""); setPopup(true) } }}
            style={{ fontWeight: 900, fontSize: 15, fontFamily: "monospace", color: "#fff", textShadow: "1px 1px 0 #000, 0 0 6px rgba(0,0,0,0.8)", lineHeight: 1, background: "none", border: "none", cursor: readOnly ? "default" : "pointer", padding: 0 }}>
            {current}
          </button>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, lineHeight: 1 }}>/</span>
          {editing === "max" ? (
            <input autoFocus type="number" value={temp}
              onChange={(e) => setTemp(e.target.value)}
              onBlur={commit} onKeyDown={(e) => e.key === "Enter" && commit()}
              style={{ width: 30, textAlign: "center", fontWeight: 700, fontSize: 12, background: "transparent", outline: "none", borderBottom: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }} />
          ) : (
            <button type="button" onClick={() => startEdit(max)}
              style={{ fontWeight: 700, fontSize: 12, fontFamily: "monospace", color: "rgba(255,255,255,0.55)", textShadow: "1px 1px 0 #000", lineHeight: 1, background: "none", border: "none", cursor: readOnly ? "default" : "pointer", padding: 0 }}>
              {max}
            </button>
          )}
        </div>
      </div>

      {/* +/– controls */}
      {!readOnly && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginLeft: 6, flexShrink: 0 }}>
          <button type="button" disabled={current >= max} onClick={() => onCurrentChange(current + 1)}
            style={{ width: 20, height: 16, fontSize: 13, fontWeight: 900, color, background: "transparent", border: `1px solid ${color}40`, borderRadius: 2, cursor: "pointer", lineHeight: 1, opacity: current >= max ? 0.2 : 1 }}>+</button>
          <button type="button" disabled={current <= 0} onClick={() => onCurrentChange(current - 1)}
            style={{ width: 20, height: 16, fontSize: 13, fontWeight: 900, color, background: "transparent", border: `1px solid ${color}40`, borderRadius: 2, cursor: "pointer", lineHeight: 1, opacity: current <= 0 ? 0.2 : 1 }}>–</button>
        </div>
      )}

      {/* Popup de dano/cura */}
      {popup && !readOnly && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setPopup(false)} />
          <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-lg border border-border/30 bg-card shadow-xl p-3 space-y-2">
            <div className="text-[9px] font-black tracking-widest text-foreground/50 uppercase">{label}</div>
            <input
              autoFocus type="number" min={1} value={delta}
              onChange={(e) => setDelta(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") applyDano(); if (e.key === "Escape") setPopup(false) }}
              placeholder="Quantidade..."
              className="w-full text-center text-lg font-black bg-background border border-border/30 rounded px-2 py-1 outline-none focus:border-primary/50"
            />
            <div className="flex gap-1.5">
              <button type="button" onClick={applyDano} disabled={!delta}
                className="flex-1 py-1.5 rounded text-[11px] font-black bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 disabled:opacity-30 transition-colors">
                − Dano
              </button>
              <button type="button" onClick={applyCura} disabled={!delta}
                className="flex-1 py-1.5 rounded text-[11px] font-black bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 disabled:opacity-30 transition-colors">
                + Cura
              </button>
              <button type="button" onClick={applyFull}
                className="px-2.5 py-1.5 rounded text-[11px] font-black bg-primary/10 border border-primary/20 text-primary/70 hover:bg-primary/20 transition-colors">
                Full
              </button>
            </div>
            {delta && (
              <div className="text-[9px] text-center text-foreground/35">
                {current} →{" "}
                <span className="text-red-400">{Math.max(0, current - (parseInt(delta) || 0))}</span>
                {" / "}
                <span className="text-green-400">{Math.min(max, current + (parseInt(delta) || 0))}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── AttributeCircle ──────────────────────────────────────────────────────────

type AttrKey = "str" | "dex" | "int" | "pres" | "vig"

// Posições dos números dentro de cada orbe da imagem atributos_sem_fundo.png
// Cada coordenada é o centro do espaço vazio abaixo do traço separador de cada orbe
const ATTR_NODES: { key: AttrKey; lp: string; tp: string }[] = [
  { key: "dex",  lp: "50.4%", tp: "21.8%" },  // AGI
  { key: "str",  lp: "19.1%", tp: "45%"   },  // FOR
  { key: "int",  lp: "82.2%", tp: "45.8%" },  // INT
  { key: "pres", lp: "29.6%", tp: "83.9%" },  // PRE
  { key: "vig",  lp: "71.7%", tp: "83.9%" },  // VIG
]

function AttrNode({ value, onChange, readOnly }: {
  value: number; onChange: (v: number) => void; readOnly: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [temp, setTemp] = useState("")

  function commit() {
    const n = parseInt(temp)
    if (!isNaN(n)) onChange(Math.max(0, Math.min(5, n)))
    setEditing(false)
  }

  return (
    <div style={{ transform: "translate(-50%, -50%)" }}>
      <button type="button"
        onClick={() => { if (!readOnly) { setEditing(true); setTemp(String(value)) } }}
        style={{
          width: 44, height: 44,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "transparent", border: "none", cursor: readOnly ? "default" : "pointer",
          opacity: 1,
        }}
      >
        {editing ? (
          <input autoFocus type="number" min={0} max={5} value={temp}
            onChange={(e) => setTemp(e.target.value)}
            onBlur={commit} onKeyDown={(e) => e.key === "Enter" && commit()}
            style={{
              width: 38, textAlign: "center", fontSize: 18, fontWeight: 400,
              background: "transparent", outline: "none", border: "none",
              color: GOLD_LIGHT, fontFamily: "var(--font-pixel), 'Courier New', monospace",
            }} />
        ) : (
          <span style={{
            fontSize: 22, fontWeight: 400, lineHeight: 1,
            fontFamily: "var(--font-pixel), 'Courier New', monospace",
            color: GOLD_LIGHT,
            textShadow: `0 0 8px ${GOLD_MID}, 2px 2px 0 #000, -1px -1px 0 #000`,
            imageRendering: "pixelated",
          }}>{value}</span>
        )}
      </button>
    </div>
  )
}

function AttributeCircle({ data, onChange, readOnly }: {
  data: Record<AttrKey, number>; onChange: (key: AttrKey, v: number) => void; readOnly: boolean
}) {
  return (
    <div className="relative mx-auto" style={{ aspectRatio: "1 / 1", width: "min(100%, 380px)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/atributos_sem_fundo.png"
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
      />
      {ATTR_NODES.map(({ key, lp, tp }) => (
        <div key={key} className="absolute" style={{ left: lp, top: tp }}>
          <AttrNode value={data[key]} onChange={(v) => onChange(key, v)} readOnly={readOnly} />
        </div>
      ))}
    </div>
  )
}

// ─── InlineEditNum ────────────────────────────────────────────────────────────

function InlineEditNum({ value, onChange, readOnly, className = "" }: {
  value: number; onChange: (v: number) => void; readOnly: boolean; className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [temp, setTemp] = useState("")

  function commit() {
    const n = parseInt(temp)
    if (!isNaN(n)) onChange(n)
    setEditing(false)
  }

  if (editing) return (
    <input autoFocus type="number" value={temp}
      onChange={(e) => setTemp(e.target.value)}
      onBlur={commit} onKeyDown={(e) => e.key === "Enter" && commit()}
      className={`w-8 text-center bg-transparent outline-none border-b border-current ${className}`} />
  )
  return (
    <button type="button"
      onClick={() => { if (!readOnly) { setEditing(true); setTemp(String(value)) } }}
      className={`${className} ${!readOnly ? "hover:opacity-70 transition-opacity" : ""}`}>
      {value}
    </button>
  )
}

// ─── DefenseSection ───────────────────────────────────────────────────────────

function DefenseSection({ defesa, esquiva, bloqueioDisplay, bloqueioIsOverride, outros, protecaoLabel, readOnly, onOutros, onBloqueioOverride }: {
  defesa: number; esquiva: number; bloqueioDisplay: number; bloqueioIsOverride: boolean
  outros: number; protecaoLabel: string; readOnly: boolean
  onOutros: (v: number) => void
  onBloqueioOverride: (v: number | null) => void
}) {
  const bloqueioLabel = bloqueioDisplay > 0 ? `RD ${bloqueioDisplay}` : "—"

  return (
    <div className="space-y-1.5">
      {/* 3 stat cells */}
      <div className="grid grid-cols-3 gap-1.5">
        {/* DEFESA */}
        <div className="flex flex-col items-center py-2.5 px-1 rounded-lg border border-primary/15 bg-primary/5">
          <div className="flex items-center gap-1 mb-1">
            <Shield className="h-3 w-3 text-primary/50" />
            <span className="text-[7px] font-black tracking-[0.2em] text-foreground/55 uppercase">DEFESA</span>
          </div>
          <span className="text-2xl font-black leading-none" style={{ textShadow: "0 0 12px rgba(var(--primary)/0.3)" }}>{defesa}</span>
        </div>

        {/* BLOQUEIO */}
        <div className="flex flex-col items-center py-2.5 px-1 rounded-lg border border-border/15 bg-background/30">
          <span className="text-[7px] font-black tracking-[0.2em] text-foreground/55 uppercase mb-1">
            BLOQUEIO{bloqueioIsOverride && <span className="text-primary/50 ml-0.5">*</span>}
          </span>
          {!readOnly ? (
            <InlineEditNum value={bloqueioDisplay} onChange={(v) => onBloqueioOverride(v)} readOnly={false}
              className="text-2xl font-black leading-none text-center" />
          ) : (
            <span className="text-2xl font-black leading-none">{bloqueioLabel}</span>
          )}
          {!readOnly && bloqueioIsOverride && (
            <button type="button" onClick={() => onBloqueioOverride(null)}
              className="text-[7px] text-primary/50 hover:text-primary/80 mt-0.5 transition-colors">auto</button>
          )}
        </div>

        {/* ESQUIVA */}
        <div className="flex flex-col items-center py-2.5 px-1 rounded-lg border border-border/15 bg-background/30">
          <span className="text-[7px] font-black tracking-[0.2em] text-foreground/55 uppercase mb-1">ESQUIVA</span>
          <span className="text-2xl font-black leading-none">{esquiva}</span>
        </div>
      </div>

      {/* Info de proteção detectada + Outros */}
      <div className="flex items-center gap-2 px-1 text-[8px] text-foreground/40">
        <Shield className="h-2.5 w-2.5 shrink-0" />
        <span className="flex-1 truncate">{protecaoLabel}</span>
        <span className="shrink-0">Outros</span>
        <InlineEditNum value={outros} onChange={onOutros} readOnly={readOnly}
          className="text-[9px] font-bold text-foreground/65 w-5 text-center" />
      </div>
    </div>
  )
}

// ─── SkillsTable (coluna central) ────────────────────────────────────────────

function SkillsTable({ skillsMap, attrValues, onUpdate, onRoll, readOnly }: {
  skillsMap: SkillsMap
  attrValues: Record<string, number>
  onUpdate: (name: string, entry: SkillEntry) => void
  onRoll: (def: OPSkillDef, entry: SkillEntry) => void
  readOnly: boolean
}) {
  return (
    <div>
      <div className="flex items-center justify-center py-2 mb-1 border-b border-border/20">
        <span className="text-[10px] font-bold tracking-[0.25em] text-foreground/50 uppercase">PERÍCIAS</span>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border/15">
            <th className="text-left py-1.5 pl-1 text-[10px] text-muted-foreground/70 font-medium tracking-wider">PERÍCIA</th>
            <th className="text-center py-1.5 text-[10px] text-muted-foreground/70 font-medium">DADOS</th>
            <th className="text-center py-1.5 text-[10px] text-muted-foreground/70 font-medium">BÔNUS</th>
            <th className="text-center py-1.5 text-[10px] text-muted-foreground/70 font-medium">Treino</th>
            <th className="text-center py-1.5 pr-1 text-[10px] text-muted-foreground/70 font-medium">Outros</th>
          </tr>
        </thead>
        <tbody>
          {OP_SKILL_DEFS.map((def) => {
            const entry = skillsMap[def.name] ?? { treino: 0, outros: 0 }
            const bonus = entry.treino + entry.outros
            const trained = entry.treino > 0
            const attrVal = attrValues[def.attr] ?? 0
            return (
              <tr key={def.name} className={`border-b border-border/6 ${trained ? "bg-primary/3" : ""}`}>
                <td className="py-1 pl-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onRoll(def, entry)}
                      title={`Rolar ${attrVal}d20 + ${bonus}`}
                      className={`shrink-0 transition-colors hover:text-primary ${trained ? "text-primary/50" : "text-muted-foreground/50 hover:text-primary/60"}`}
                    >
                      <D20Icon className="h-3.5 w-3.5" />
                    </button>
                    <span className={`text-xs font-medium leading-tight ${trained ? "text-primary/90" : "text-foreground/55"}`}>
                      {def.name}
                      {def.suffix && <span className="text-muted-foreground/60 text-[9px]">{def.suffix}</span>}
                    </span>
                  </div>
                </td>
                <td className="text-center text-[11px] text-muted-foreground/70 py-1.5 whitespace-nowrap">
                  {attrVal}d20 <span className="text-[9px] opacity-60">({ATTR_ABBR[def.attr]})</span>
                </td>
                <td className="text-center py-1.5">
                  <span className={`font-mono font-bold text-xs ${trained || entry.outros > 0 ? "text-primary/80" : "text-foreground/55"}`}>
                    +{bonus}
                  </span>
                </td>
                <td className="text-center py-1.5">
                  {readOnly ? (
                    <span className="font-mono text-xs">{entry.treino}</span>
                  ) : (
                    <input type="text" inputMode="numeric" value={entry.treino === 0 ? "" : String(entry.treino)}
                      onChange={(e) => onUpdate(def.name, { ...entry, treino: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-9 text-center font-mono bg-transparent border border-border/20 rounded px-1 py-0.5 focus:outline-none focus:border-primary/40 text-xs" />
                  )}
                </td>
                <td className="text-center py-1.5 pr-1">
                  {readOnly ? (
                    <span className="font-mono text-xs">{entry.outros}</span>
                  ) : (
                    <input type="text" inputMode="numeric" value={entry.outros === 0 ? "" : String(entry.outros)}
                      onChange={(e) => onUpdate(def.name, { ...entry, outros: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-9 text-center font-mono bg-transparent border border-border/20 rounded px-1 py-0.5 focus:outline-none focus:border-primary/40 text-xs" />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── CombateTab ───────────────────────────────────────────────────────────────

function CombateTab({ attacks, onAttacksChange, readOnly }: {
  attacks: OPAttack[]; onAttacksChange: (a: OPAttack[]) => void; readOnly: boolean
}) {
  const [filter, setFilter] = useState("")
  const [diceExpr, setDiceExpr] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [newAtk, setNewAtk] = useState<Omit<OPAttack, "id">>({
    name: "", damage: "1d4", critical: "20", multiplier: "2",
    attackBonus: "0", type: "Balístico", range: "-",
    skill: "Luta", damageAttr: "Força", extraDamage: [], notes: "",
  })

  const filtered = attacks.filter((a) => !filter || a.name.toLowerCase().includes(filter.toLowerCase()))

  function handleRoll() {
    if (!diceExpr.trim()) return
    const result = rollDice(diceExpr)
    if (result === null) { toast.error("Expressão inválida. Ex: 1d20, 2d6+3"); return }
    toast.success(`🎲 ${diceExpr} → ${result}`)
  }

  function addAttack() {
    if (!newAtk.name.trim() || !newAtk.damage.trim()) {
      toast.error("Nome e dano são obrigatórios"); return
    }
    onAttacksChange([...attacks, { ...newAtk, id: `atk-${Date.now()}` }])
    setNewAtk({ name: "", damage: "1d4", critical: "20", multiplier: "2", attackBonus: "0", type: "Balístico", range: "-", skill: "Luta", damageAttr: "Força", extraDamage: [], notes: "" })
    setShowNew(false)
    toast.success(`"${newAtk.name}" adicionado!`)
  }

  return (
    <div className="space-y-3">
      <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)}
        placeholder="Filtrar ataques..."
        className="w-full h-8 px-3 text-xs bg-transparent border border-border/25 rounded-lg focus:outline-none focus:border-primary/40 text-foreground/60 placeholder:text-foreground/55" />

      <div className="flex gap-2">
        <input type="text" value={diceExpr} onChange={(e) => setDiceExpr(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRoll()}
          placeholder="Rolar dados (1d20+3...)"
          className="flex-1 h-8 px-3 text-xs bg-transparent border border-border/25 rounded-lg focus:outline-none focus:border-primary/40 text-foreground/60 placeholder:text-foreground/55 font-mono" />
        <button type="button" onClick={handleRoll}
          className="w-8 h-8 rounded-lg border border-border/25 flex items-center justify-center text-foreground/60 hover:text-primary/60 hover:border-primary/30 transition-colors">
          <Hexagon className="h-3.5 w-3.5" />
        </button>
      </div>

      {!readOnly && (
        <Button type="button" variant="outline" size="sm" onClick={() => setShowNew(true)}
          className="w-full gap-1.5 text-xs h-8">
          <Plus className="h-3.5 w-3.5" />Novo Ataque
        </Button>
      )}

      <div className="space-y-1.5">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground/55 text-sm">
            Nenhum ataque cadastrado.
          </div>
        )}
        {filtered.map((a) => (
          <div key={a.id}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/15 bg-background/15 group hover:border-primary/20 transition-colors">
            {a.image ? (
              <img src={a.image} alt={a.name} className="w-8 h-8 rounded object-cover shrink-0 border border-border/20" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary/40" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground/75">{a.name}</p>
              <p className="text-[10px] text-muted-foreground/70">
                {a.damage && <span className="text-primary/60 font-mono">{a.damage}</span>}
                {(a.critical || a.multiplier) && <span className="font-mono"> · {a.critical || "20"}/{a.multiplier ? `x${a.multiplier}` : "x2"}</span>}
                {a.attackBonus && a.attackBonus !== "0" && <> · +{a.attackBonus}</>}
                {a.type && <> · {a.type}</>}
                {a.range && a.range !== "-" && <> · {a.range}</>}
                {a.skill && <> · {a.skill}</>}
                {(a.extraDamage ?? []).map((ed, i) => ed.damage ? <span key={i} className="text-amber-400/70 font-mono"> +{ed.damage}{ed.type ? ` ${ed.type}` : ""}</span> : null)}
              </p>
            </div>
            <button type="button" onClick={() => { const r = rollDice(a.damage); if (r !== null) toast.success(`${a.name}: ${r}`) }}
              className="w-7 h-7 rounded border border-border/15 flex items-center justify-center text-foreground/55 hover:text-primary/60 hover:border-primary/25 transition-colors shrink-0">
              <Hexagon className="h-3 w-3" />
            </button>
            {!readOnly && (
              <button type="button" onClick={() => onAttacksChange(attacks.filter((x) => x.id !== a.id))}
                className="w-7 h-7 rounded flex items-center justify-center text-foreground/12 hover:text-red-400 hover:bg-red-900/15 transition-colors shrink-0 opacity-0 group-hover:opacity-100">
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      <Dialog open={showNew} onOpenChange={(o) => !o && setShowNew(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Novo Ataque</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {/* Nome */}
            <div>
              <Label className="text-xs text-muted-foreground">Nome *</Label>
              <Input value={newAtk.name} onChange={(e) => setNewAtk((p) => ({ ...p, name: e.target.value }))}
                placeholder="Novo Ataque" className="h-8 text-sm mt-1" />
            </div>

            {/* Dano | Crítico | Multiplicador */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Dano *</Label>
                <Input value={newAtk.damage} onChange={(e) => setNewAtk((p) => ({ ...p, damage: e.target.value }))}
                  placeholder="1d4" className="h-8 text-sm mt-1 font-mono" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Crítico *</Label>
                <Input value={newAtk.critical} onChange={(e) => setNewAtk((p) => ({ ...p, critical: e.target.value }))}
                  placeholder="20" className="h-8 text-sm mt-1 font-mono" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Multiplicador *</Label>
                <Input value={newAtk.multiplier} onChange={(e) => setNewAtk((p) => ({ ...p, multiplier: e.target.value }))}
                  placeholder="2" className="h-8 text-sm mt-1 font-mono" />
              </div>
            </div>

            {/* Ataque Bônus | Tipo de Dano */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Ataque Bônus</Label>
                <Input value={newAtk.attackBonus} onChange={(e) => setNewAtk((p) => ({ ...p, attackBonus: e.target.value }))}
                  placeholder="0" className="h-8 text-sm mt-1 font-mono" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Tipo de Dano</Label>
                <select value={newAtk.type} onChange={(e) => setNewAtk((p) => ({ ...p, type: e.target.value }))}
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-ring">
                  {["Balístico","Corte","Impacto","Perfuração","Fogo","Frio","Elétrico","Ácido","Energia","Morte"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Alcance | Perícia | Atributo Dano */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Alcance</Label>
                <Input value={newAtk.range} onChange={(e) => setNewAtk((p) => ({ ...p, range: e.target.value }))}
                  placeholder="-" className="h-8 text-sm mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Perícia</Label>
                <select value={newAtk.skill} onChange={(e) => setNewAtk((p) => ({ ...p, skill: e.target.value }))}
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-ring">
                  {["Luta","Pontaria","Artes","Atletismo","Ciências","Crime","Diplomacia","Enganação","Fortitude","Furtividade","Iniciativa","Intimidação","Intuição","Investigação","Medicina","Ocultismo","Percepção","Pilotagem","Profissão","Reflexos","Religião","Sobrevivência","Tática","Tecnologia","Vontade"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Atributo Dano</Label>
                <select value={newAtk.damageAttr} onChange={(e) => setNewAtk((p) => ({ ...p, damageAttr: e.target.value }))}
                  className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-ring">
                  {["Força","Agilidade","Intelecto","Presença","Vigor","—"].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dano Extra */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs text-muted-foreground">Dano extra</Label>
                <button type="button"
                  onClick={() => setNewAtk((p) => ({ ...p, extraDamage: [...(p.extraDamage ?? []), { damage: "", type: "" }] }))}
                  className="text-xs px-2 py-0.5 rounded border border-border/30 bg-primary text-primary-foreground hover:opacity-80 transition-opacity">
                  Adicionar
                </button>
              </div>
              {(newAtk.extraDamage ?? []).map((ed, i) => (
                <div key={i} className="flex gap-2 mb-1.5">
                  <Input value={ed.damage} onChange={(e) => setNewAtk((p) => {
                    const ex = [...(p.extraDamage ?? [])]
                    ex[i] = { ...ex[i], damage: e.target.value }
                    return { ...p, extraDamage: ex }
                  })} placeholder="1d6" className="h-7 text-xs font-mono flex-1" />
                  <Input value={ed.type ?? ""} onChange={(e) => setNewAtk((p) => {
                    const ex = [...(p.extraDamage ?? [])]
                    ex[i] = { ...ex[i], type: e.target.value }
                    return { ...p, extraDamage: ex }
                  })} placeholder="Tipo" className="h-7 text-xs flex-1" />
                  <button type="button" onClick={() => setNewAtk((p) => ({ ...p, extraDamage: (p.extraDamage ?? []).filter((_, j) => j !== i) }))}
                    className="w-7 h-7 flex items-center justify-center text-foreground/40 hover:text-red-400 transition-colors">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Imagem */}
            <div>
              <Label className="text-xs text-muted-foreground">Imagem</Label>
              <div className="flex items-start gap-3 mt-1">
                <label className="flex flex-col items-center justify-center w-16 h-16 rounded border border-dashed border-border/40 bg-background/20 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors shrink-0 overflow-hidden relative">
                  {newAtk.image ? (
                    <img src={newAtk.image} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-foreground/30 text-[10px] text-center px-1">Clique para adicionar</span>
                  )}
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = (ev) => setNewAtk((p) => ({ ...p, image: ev.target?.result as string }))
                    reader.readAsDataURL(file)
                  }} />
                </label>
                <div className="flex-1 space-y-1">
                  <Input value={newAtk.image?.startsWith("data:") ? "" : (newAtk.image ?? "")}
                    onChange={(e) => setNewAtk((p) => ({ ...p, image: e.target.value }))}
                    placeholder="Ou cole uma URL..."
                    className="h-8 text-sm" />
                  {newAtk.image && (
                    <button type="button" onClick={() => setNewAtk((p) => ({ ...p, image: "" }))}
                      className="text-[10px] text-muted-foreground/60 hover:text-red-400 transition-colors">
                      Remover imagem
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowNew(false)}>Cancelar</Button>
              <Button type="button" size="sm" onClick={addAttack}>Adicionar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── AddHabilidadesModal ──────────────────────────────────────────────────────

type HabClass = "combatente" | "especialista" | "ocultista" | "paranormal"

const ELEMENTO_LABELS: Record<string, string> = {
  geral: "Geral",
  medo: "Medo",
  conhecimento: "Conhecimento",
  energia: "Energia",
  morte: "Morte",
  sangue: "Sangue",
  sacrificio: "Sacrifício",
}

const ELEMENTO_CORES: Record<string, {
  text: string; border: string; bg: string
  glow: string; openBorder: string; openBg: string; leftBorder: string
}> = {
  sangue:       { text: "text-red-400",    border: "border-red-400/35",    bg: "bg-red-400/10",    glow: "shadow-[0_0_16px_rgba(248,113,113,0.20)]",  openBorder: "border-red-400/35",    openBg: "bg-red-400/[0.06]",    leftBorder: "border-red-400/35" },
  energia:      { text: "text-purple-400", border: "border-purple-400/35", bg: "bg-purple-400/10", glow: "shadow-[0_0_16px_rgba(192,132,252,0.20)]",  openBorder: "border-purple-400/35", openBg: "bg-purple-400/[0.06]", leftBorder: "border-purple-400/35" },
  conhecimento: { text: "text-amber-400",  border: "border-amber-400/35",  bg: "bg-amber-400/10",  glow: "shadow-[0_0_16px_rgba(251,191,36,0.20)]",   openBorder: "border-amber-400/35",  openBg: "bg-amber-400/[0.06]",  leftBorder: "border-amber-400/35" },
  morte:        { text: "text-zinc-300",   border: "border-zinc-400/35",   bg: "bg-zinc-400/10",   glow: "shadow-[0_0_16px_rgba(161,161,170,0.16)]",  openBorder: "border-zinc-400/35",   openBg: "bg-zinc-400/[0.06]",   leftBorder: "border-zinc-400/35" },
  sacrificio:   { text: "text-orange-400", border: "border-orange-400/35", bg: "bg-orange-400/10", glow: "shadow-[0_0_16px_rgba(251,146,60,0.20)]",   openBorder: "border-orange-400/35", openBg: "bg-orange-400/[0.06]", leftBorder: "border-orange-400/35" },
  medo:         { text: "text-rose-400",   border: "border-rose-400/35",   bg: "bg-rose-400/10",   glow: "shadow-[0_0_16px_rgba(251,113,133,0.20)]",  openBorder: "border-rose-400/35",   openBg: "bg-rose-400/[0.06]",   leftBorder: "border-rose-400/35" },
}
type HabSource = "all" | "livro-basico" | "sobrevivendo-ao-horror" | "arquivos-secretos"

const CLASS_LABELS: Record<HabClass, string> = {
  combatente:   "Combatente",
  especialista: "Especialista",
  ocultista:    "Ocultista",
  paranormal:   "Paranormais",
}

const HAB_SOURCE_LABELS: Record<HabSource, string> = {
  all:                    "Todos",
  "livro-basico":         "LdR",
  "sobrevivendo-ao-horror": "SaH",
  "arquivos-secretos":    "AS",
}

function AddHabilidadesModal({ open, onClose, habilidades, onAdd }: {
  open: boolean; onClose: () => void
  habilidades: OPHabilidade[]; onAdd: (def: OPHabilidadeDef) => void
}) {
  const [cls,      setCls]      = useState<HabClass>("combatente")
  const [source,   setSource]   = useState<HabSource>("all")
  const [category, setCategory] = useState("all")
  const [search,   setSearch]   = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  function changeClass(c: HabClass) { setCls(c); setCategory("all") }

  const poderLabel = cls === "combatente" ? "Poderes de Combatente"
                   : cls === "especialista" ? "Poderes de Especialista"
                   : "Poderes de Ocultista"

  const hasGeral = cls !== "paranormal" && HABILIDADES_OP.some(h =>
    h.class === cls && h.category === "poder-geral" && (source === "all" || h.source === source))

  const trails = cls !== "paranormal" ? HABILIDADES_OP
    .filter(h => h.class === cls && h.categoryType === "trilha" && (source === "all" || h.source === source))
    .map(h => ({ id: h.category, label: h.name }))
    .filter((v, i, a) => a.findIndex(x => x.id === v.id) === i) : []

  const cats = cls === "paranormal"
    ? [
        { id: "all", label: "Todos" },
        ...["geral", "conhecimento", "energia", "morte", "sangue", "sacrificio"]
          .filter(el => HABILIDADES_OP.some(h =>
            h.class === "paranormal" && h.category === el && (source === "all" || h.source === source)))
          .map(el => ({ id: el, label: ELEMENTO_LABELS[el] })),
      ]
    : [
        { id: "all",       label: "Todos" },
        { id: "poder",     label: poderLabel },
        ...(hasGeral ? [{ id: "poder-geral", label: "Poderes Gerais" }] : []),
        ...trails,
      ]

  const visible = HABILIDADES_OP.filter(h => {
    if (h.class !== cls) return false
    if (source !== "all" && h.source !== source) return false
    if (category !== "all" && h.category !== category) return false
    if (search) {
      const q = search.toLowerCase()
      if (!h.name.toLowerCase().includes(q) && !h.description.toLowerCase().includes(q)) return false
    }
    return true
  })

  const iconMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const h of visible) {
      const { icon, confidence } = suggestIcon(h.name, h.description)
      if (icon && (confidence === "high" || confidence === "medium")) map[h.id] = icon
    }
    return map
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cls, source, category, search])

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-xl h-[88vh] flex flex-col p-0 gap-0 [&>button:last-child]:hidden border-white/[0.08] bg-[#080808]"
        style={{ borderRadius: 18 }}
      >
        {/* ── Header ── */}
        <DialogHeader className="shrink-0 px-6 pt-5 pb-4 border-b border-white/[0.06] flex-row items-start justify-between gap-4">
          <div>
            <DialogTitle className="text-base font-bold text-foreground/92 tracking-tight">Adicionar Habilidade</DialogTitle>
            <p className="text-[11px] text-foreground/35 mt-0.5">
              {visible.length} {visible.length === 1 ? "habilidade disponível" : "habilidades disponíveis"}
            </p>
          </div>
          <button type="button" onClick={onClose}
            className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center text-foreground/30 hover:text-foreground/70 hover:bg-white/[0.06] transition-all shrink-0">
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        {/* ── Filters ── */}
        <div className="shrink-0 px-5 py-4 space-y-4 border-b border-white/[0.05] bg-white/[0.01]">

          {/* Source */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/25 mb-2">Fonte</p>
            <div className="flex gap-1.5">
              {(["all", "livro-basico", "sobrevivendo-ao-horror", "arquivos-secretos"] as HabSource[]).map(s => (
                <button key={s} type="button"
                  onClick={() => { setSource(s); setCategory("all") }}
                  className={`h-8 px-3.5 text-[11px] font-semibold rounded-lg border transition-all ${
                    source === s
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-white/[0.08] text-foreground/38 hover:border-white/[0.18] hover:text-foreground/65 hover:bg-white/[0.03]"
                  }`}>
                  {HAB_SOURCE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Class tabs */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/25 mb-2">Classe</p>
            <div className="flex gap-1">
              {(["combatente", "especialista", "ocultista", "paranormal"] as HabClass[]).map(c => (
                <button key={c} type="button" onClick={() => changeClass(c)}
                  className={`flex-1 py-2 text-[11px] font-bold rounded-lg border transition-all ${
                    cls === c
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-white/[0.08] text-foreground/38 hover:border-white/[0.18] hover:text-foreground/60 hover:bg-white/[0.03]"
                  }`}>
                  {CLASS_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          {/* Category pills */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/25 mb-2">Categoria</p>
            <div className="flex gap-1.5 flex-wrap">
              {cats.map(({ id, label }) => {
                const cor = cls === "paranormal" && id !== "all" ? ELEMENTO_CORES[id] : null
                const active = category === id
                return (
                  <button key={id} type="button" onClick={() => setCategory(id)}
                    className={`flex items-center gap-1.5 px-3 h-7 text-[10px] font-semibold rounded-lg border transition-all ${
                      active
                        ? cor
                          ? `${cor.text} ${cor.border} ${cor.bg}`
                          : "border-primary/40 bg-primary/10 text-primary"
                        : "border-white/[0.08] text-foreground/38 hover:border-white/[0.18] hover:text-foreground/60 hover:bg-white/[0.03]"
                    }`}>
                    {cor && (
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 transition-opacity"
                        style={{ background: ELEMENTO_DOT_COLOR[id], opacity: active ? 1 : 0.4 }} />
                    )}
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/28" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou descrição..."
              className="w-full h-9 pl-9 pr-4 text-[12px] bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:border-primary/35 focus:bg-white/[0.05] text-foreground/70 placeholder:text-foreground/28 transition-all" />
          </div>
        </div>

        {/* ── List ── */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {visible.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Search className="w-8 h-8 text-foreground/12" />
              <p className="text-xs text-foreground/30">Nenhuma habilidade encontrada</p>
            </div>
          )}
          {visible.map((def) => {
            const added = habilidades.some(h => h.name === def.name)
            const isOpen = expanded === def.id
            const cor = def.class === "paranormal" ? ELEMENTO_CORES[def.category] : null
            return (
              <div key={def.id}
                className={`rounded-xl overflow-hidden transition-all duration-200 ${cor ? cor.glow : ""}`}
                style={{
                  border: `1px solid ${isOpen ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
                  background: isOpen ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                }}>

                {/* Card row */}
                <div className="flex items-center gap-0 cursor-pointer group"
                  onClick={() => setExpanded(isOpen ? null : def.id)}>

                  {/* Left accent bar */}
                  <div className={`w-[3px] self-stretch shrink-0 rounded-l-xl transition-opacity ${
                    cor ? cor.bg : "bg-primary/30"
                  }`} style={{ opacity: isOpen ? 0.9 : 0.45 }} />

                  {/* Icon area */}
                  <div className="shrink-0 mx-3 my-3 w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {iconMap[def.id] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={gameIconUrl(iconMap[def.id], "ffffff")}
                        alt=""
                        className={`w-4 h-4 transition-opacity group-hover:opacity-90 ${isOpen ? "opacity-75" : "opacity-40"}`}
                      />
                    ) : (
                      <Hexagon className={`w-4 h-4 ${cor ? cor.text + " opacity-30" : "text-primary/30"}`} />
                    )}
                  </div>

                  {/* Name + badges */}
                  <div className="flex-1 min-w-0 py-3">
                    <p className={`text-[13px] font-semibold leading-tight truncate transition-colors ${
                      isOpen ? "text-foreground/95" : "text-foreground/80 group-hover:text-foreground/92"
                    }`}>{def.name}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {cor && (
                        <span className={`text-[9px] font-bold px-2 py-[2px] rounded-full border ${cor.text} ${cor.border} ${cor.bg}`}>
                          {ELEMENTO_LABELS[def.category]}
                        </span>
                      )}
                      {def.categoryType === "trilha" && (
                        <span className="text-[9px] font-medium px-2 py-[2px] rounded-full border border-primary/25 text-primary/50">
                          TRILHA
                        </span>
                      )}
                      {def.source === "sobrevivendo-ao-horror" && (
                        <span className="text-[9px] font-medium px-2 py-[2px] rounded-full border border-sky-400/20 text-sky-400/50">SaH</span>
                      )}
                      {def.source === "arquivos-secretos" && (
                        <span className="text-[9px] font-medium px-2 py-[2px] rounded-full border border-indigo-400/20 text-indigo-400/50">AS</span>
                      )}
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronDown className={`w-3.5 h-3.5 text-foreground/20 transition-transform duration-200 shrink-0 mx-1 ${isOpen ? "rotate-180" : ""}`} />

                  {/* Add button */}
                  <button type="button" disabled={added}
                    onClick={(e) => { e.stopPropagation(); if (!added) onAdd(def) }}
                    className={`w-8 h-8 mr-3 rounded-lg flex items-center justify-center text-sm font-bold transition-all border shrink-0 ${
                      added
                        ? "border-primary/20 bg-primary/5 text-primary/35 cursor-default"
                        : cor
                          ? `${cor.border} ${cor.bg} ${cor.text} hover:opacity-75`
                          : "border-primary/35 bg-primary/8 text-primary/75 hover:bg-primary/20 hover:border-primary/55"
                    }`}>
                    {added ? "✓" : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 ml-[3px]">
                    <div className={`border-l-2 pl-3 space-y-2 ${cor ? cor.leftBorder : "border-primary/25"}`}>
                      <p className="text-[12px] text-foreground/65 leading-[1.70] whitespace-pre-wrap">{def.description}</p>
                      {def.prereq && (
                        <p className="text-[10px] text-amber-400/75 font-semibold flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-amber-400/60 inline-block" />
                          Pré-requisito: {def.prereq}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── HabilidadesTab ───────────────────────────────────────────────────────────

function HabilidadeItem({ hab, onRemove, readOnly }: {
  hab: OPHabilidade; onRemove: () => void; readOnly: boolean
}) {
  const [open, setOpen] = useState(false)
  const dbDef = HABILIDADES_OP.find(h => h.name === hab.name)
  const elementoCor = dbDef?.class === "paranormal" && dbDef.category ? ELEMENTO_CORES[dbDef.category] : null
  const elementoLabel = dbDef?.class === "paranormal" && dbDef.category ? ELEMENTO_LABELS[dbDef.category] : null
  return (
    <div className={`border rounded-lg overflow-hidden transition-all ${
      elementoCor
        ? open
          ? `${elementoCor.openBorder} ${elementoCor.openBg} ${elementoCor.glow}`
          : `border-border/25 bg-white/[0.03] ${elementoCor.glow} hover:bg-white/[0.05] hover:${elementoCor.openBorder}`
        : open
          ? "border-primary/25 bg-primary/[0.06]"
          : "border-border/25 bg-white/[0.03] hover:bg-white/[0.05] hover:border-border/40"
    }`}>
      <div className="flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors"
        onClick={() => setOpen((o) => !o)}>
        <span className={`shrink-0 transition-colors ${open ? (elementoCor ? elementoCor.text + "/60" : "text-primary/60") : "text-foreground/35"}`}>
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </span>
        {hab.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gameIconUrl(hab.icon, "ffffff")} alt="" className="h-4 w-4 shrink-0 opacity-60" />
        ) : (
          <Hexagon className="h-3.5 w-3.5 shrink-0 text-primary/40" />
        )}
        <span className={`flex-1 text-xs font-semibold transition-colors ${open ? "text-foreground" : "text-foreground/80"}`}>{hab.name}</span>
        {elementoCor && elementoLabel && (
          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${elementoCor.text} ${elementoCor.border} ${elementoCor.bg}`}>
            {elementoLabel}
          </span>
        )}
        {hab.nex && (
          <span className="text-[9px] text-foreground/40 font-mono shrink-0 border border-border/20 px-1.5 py-0.5 rounded">NEX {hab.nex}</span>
        )}
        {!readOnly && (
          <button type="button"
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="w-6 h-6 rounded flex items-center justify-center text-foreground/20 hover:text-red-400 hover:bg-red-900/15 transition-colors shrink-0">
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
      {open && hab.description && (
        <div className={`px-4 pb-3.5 pt-0 ml-3 border-l-2 ${elementoCor ? elementoCor.leftBorder : "border-primary/20"}`}>
          <p className="text-[11.5px] text-foreground/70 leading-[1.65] whitespace-pre-wrap">{hab.description}</p>
        </div>
      )}
    </div>
  )
}

function HabilidadesTab({ habilidades, onUpdate, readOnly }: {
  habilidades: OPHabilidade[]; onUpdate: (next: OPHabilidade[]) => void; readOnly: boolean
}) {
  const [filter,     setFilter]     = useState("")
  const [showAdd,    setShowAdd]    = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [newHab,     setNewHab]     = useState<Omit<OPHabilidade, "id">>({ name: "", description: "", nex: "" })

  const filtered = habilidades.filter((h) => !filter || h.name.toLowerCase().includes(filter.toLowerCase()))

  function addManual() {
    if (!newHab.name.trim()) { toast.error("Nome é obrigatório"); return }
    onUpdate([...habilidades, { ...newHab, id: `hab-${Date.now()}` }])
    setNewHab({ name: "", description: "", nex: "" })
    setShowManual(false)
    toast.success(`"${newHab.name}" adicionada!`)
  }

  function addFromDb(def: OPHabilidadeDef) {
    if (habilidades.some(h => h.name === def.name)) { toast.error("Já adicionada"); return }
    onUpdate([...habilidades, { id: `hab-${Date.now()}`, name: def.name, description: def.description }])
    toast.success(`"${def.name}" adicionada!`)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrar habilidades"
          className="flex-1 h-8 px-3 text-xs bg-transparent border border-border/25 rounded-lg focus:outline-none focus:border-primary/40 text-foreground/60 placeholder:text-foreground/55" />
        {!readOnly && (
          <Button type="button" size="sm" onClick={() => setShowAdd(true)} className="h-8 text-xs gap-1.5 shrink-0">
            <Plus className="h-3.5 w-3.5" />Adicionar
          </Button>
        )}
      </div>

      {!readOnly && (
        <button type="button" onClick={() => setShowManual(true)}
          className="text-[10px] text-foreground/30 hover:text-foreground/55 transition-colors text-right w-full">
          + personalizada
        </button>
      )}

      <div className="space-y-1.5">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground/55 text-sm">
            Nenhuma habilidade cadastrada.
          </div>
        )}
        {filtered.map((h) => (
          <HabilidadeItem key={h.id} hab={h} readOnly={readOnly}
            onRemove={() => onUpdate(habilidades.filter((x) => x.id !== h.id))} />
        ))}
      </div>

      {/* Modal do banco de dados */}
      <AddHabilidadesModal open={showAdd} onClose={() => setShowAdd(false)}
        habilidades={habilidades} onAdd={addFromDb} />

      {/* Dialog manual (personalizada) */}
      <Dialog open={showManual} onOpenChange={(o) => !o && setShowManual(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Habilidade Personalizada</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Nome *</Label>
              <Input value={newHab.name} onChange={(e) => setNewHab((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ex: Lâmina Maldita" className="h-8 text-sm mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">NEX mínimo</Label>
              <Input value={newHab.nex} onChange={(e) => setNewHab((p) => ({ ...p, nex: e.target.value }))}
                placeholder="Ex: 10%" className="h-8 text-sm mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Descrição</Label>
              <Textarea value={newHab.description} onChange={(e) => setNewHab((p) => ({ ...p, description: e.target.value }))}
                placeholder="Efeito, requisitos, mecânica..." className="text-sm mt-1 h-24 resize-none" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowManual(false)}>Cancelar</Button>
              <Button type="button" size="sm" onClick={addManual}>Adicionar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


// ─── RituaisTab ───────────────────────────────────────────────────────────────

type OPRitual = { id: string; name: string; description?: string }

const CIRCLE_LABELS: Record<number, string> = { 1: "1º", 2: "2º", 3: "3º", 4: "4º" }

function parseRitualDescription(text: string) {
  const result: { type: "main" | "discente" | "verdadeiro"; text: string }[] = []
  let current: typeof result[0] = { type: "main", text: "" }
  for (const line of text.split("\n")) {
    const t = line.trim()
    if (t.startsWith("Discente")) {
      if (current.text.trim()) result.push({ ...current, text: current.text.trim() })
      current = { type: "discente", text: t }
    } else if (t.startsWith("Verdadeiro")) {
      if (current.text.trim()) result.push({ ...current, text: current.text.trim() })
      current = { type: "verdadeiro", text: t }
    } else {
      current.text += (current.text ? "\n" : "") + t
    }
  }
  if (current.text.trim()) result.push({ ...current, text: current.text.trim() })
  return result
}

// ─── RitualDetailModal ────────────────────────────────────────────────────────

function RitualDetailModal({ ritual, def, onClose, onRemove, readOnly }: {
  ritual: OPRitual; def: OPRitualDef | undefined
  onClose: () => void; onRemove: () => void; readOnly: boolean
}) {
  const [visible, setVisible] = useState(false)
  const cor = def ? ELEMENTO_CORES[def.element] : null

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    document.body.style.overflow = "hidden"
    return () => { cancelAnimationFrame(id); document.body.style.overflow = "" }
  }, [])

  function dismiss() { setVisible(false); setTimeout(onClose, 260) }
  function remove()  { dismiss(); setTimeout(onRemove, 260) }

  const sections = parseRitualDescription(ritual.description ?? def?.description ?? "")

  return createPortal(
    <div
      onClick={dismiss}
      style={{
        position: "fixed", inset: 0, zIndex: 9990,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
        background: visible ? "rgba(0,0,0,0.80)" : "rgba(0,0,0,0)",
        transition: "background 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cor ? cor.glow : ""}
        style={{
          width: "100%", maxWidth: 400,
          background: "#0d0d0d",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 20,
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.32s cubic-bezier(0.34,1.1,0.64,1), opacity 0.25s ease",
          transform: visible ? "scale(1) translateY(0)" : "scale(0.93) translateY(22px)",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* ── Hero header ── */}
        {def?.img ? (
          <div style={{ position: "relative", height: 200, flexShrink: 0, background: "#111" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={def.img} alt={def.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
            {/* gradient fade to card bg */}
            <div style={{ position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.50) 50%, rgba(13,13,13,1) 100%)" }} />
            {/* close button */}
            <button type="button" onClick={dismiss}
              style={{
                position: "absolute", top: 10, right: 10,
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                cursor: "pointer", color: "rgba(255,255,255,0.70)",
                padding: "5px 7px", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              <X style={{ width: 14, height: 14 }} />
            </button>
            {/* name + badges overlaid at bottom */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 18px 14px" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 7, flexWrap: "wrap", alignItems: "center" }}>
                {cor && (
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 999, border: "1px solid" }}
                    className={`${cor.text} ${cor.border} ${cor.bg}`}>
                    {ELEMENTO_LABELS[def.element].toUpperCase()}
                  </span>
                )}
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.48)",
                  background: "rgba(255,255,255,0.06)",
                }}>
                  {CIRCLE_LABELS[def.circle]} Círculo
                </span>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: 20, color: "#fff", textShadow: "0 2px 14px rgba(0,0,0,0.9)", margin: 0, lineHeight: 1.2 }}>
                {ritual.name}
              </h2>
            </div>
          </div>
        ) : (
          /* No image: plain header */
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
            <button type="button" onClick={dismiss}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", padding: 4, display: "flex" }}>
              <X style={{ width: 15, height: 15 }} />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 5, marginBottom: 4, flexWrap: "wrap" }}>
                {cor && (
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 9px", borderRadius: 999, border: "1px solid" }}
                    className={`${cor.text} ${cor.border} ${cor.bg}`}>
                    {ELEMENTO_LABELS[def!.element].toUpperCase()}
                  </span>
                )}
                {def && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 9px", borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.40)",
                    background: "rgba(255,255,255,0.04)",
                  }}>
                    {CIRCLE_LABELS[def.circle]} Círculo
                  </span>
                )}
              </div>
              <span style={{ fontWeight: 700, fontSize: 16, color: "rgba(255,255,255,0.92)" }}>{ritual.name}</span>
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div style={{ overflowY: "auto", flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Properties grid */}
          {def && (def.execution || def.range || def.duration || def.resistance) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px",
              background: "rgba(255,255,255,0.025)", borderRadius: 10, padding: "10px 14px" }}>
              {[
                { label: "Execução",   value: def.execution },
                { label: "Alcance",    value: def.range },
                { label: "Duração",    value: def.duration },
                { label: "Resistência",value: def.resistance },
              ].filter(p => p.value).map(p => (
                <div key={p.label}>
                  <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em",
                    color: "rgba(255,255,255,0.28)", marginBottom: 2 }}>{p.label}</p>
                  <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{p.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Formatted description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sections.map((s, i) => {
              if (s.type === "main") {
                return (
                  <p key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.70)", lineHeight: 1.78, textAlign: "justify" }}>
                    {s.text}
                  </p>
                )
              }
              const [label, ...rest] = s.text.split(":")
              return (
                <div key={i} style={{ padding: "9px 13px", borderRadius: 9, borderLeft: "2px solid" }}
                  className={cor ? `${cor.leftBorder} ${cor.openBg}` : "border-border/30 bg-white/[0.02]"}>
                  <p style={{ fontSize: 13, lineHeight: 1.75 }} className={cor?.text ?? "text-primary"}>
                    <span style={{ fontWeight: 700 }}>{label}:</span>
                    <span style={{ opacity: 0.72 }}>{rest.join(":")}</span>
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Footer ── */}
        {!readOnly && (
          <div style={{ display: "flex", justifyContent: "flex-end",
            padding: "10px 18px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button type="button" onClick={remove}
              style={{ fontSize: 12, color: "rgba(248,113,113,0.50)", background: "none", border: "none",
                cursor: "pointer", padding: "4px 8px", borderRadius: 6, transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(248,113,113,1)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,113,113,0.50)")}>
              Remover Ritual
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

// ─── RitualItem ───────────────────────────────────────────────────────────────

function RitualItem({ ritual, onRemove, readOnly }: {
  ritual: OPRitual; onRemove: () => void; readOnly: boolean
}) {
  const [showDetail, setShowDetail] = useState(false)
  const dbDef = RITUAIS_OP.find(r => r.name === ritual.name)
  const cor   = dbDef ? ELEMENTO_CORES[dbDef.element] : null
  const label = dbDef ? ELEMENTO_LABELS[dbDef.element] : null

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className={`group relative border rounded-xl cursor-pointer overflow-hidden transition-all duration-200 ${
          cor
            ? `border-border/20 ${cor.glow} hover:border-border/40`
            : "border-border/20 hover:border-border/40"
        }`}
        style={{ background: "rgba(255,255,255,0.025)" }}
      >
        <div className="flex items-stretch" style={{ minHeight: 68 }}>
          {/* Image column */}
          <div className="relative shrink-0 overflow-hidden bg-black/20" style={{ width: 64 }}>
            {dbDef?.img ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dbDef.img} alt={ritual.name}
                  className="group-hover:scale-105 transition-transform duration-300"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                />
                {/* right-side fade to card bg */}
                <div style={{ position: "absolute", inset: 0,
                  background: "linear-gradient(to right, transparent 30%, rgba(10,10,10,0.85) 100%)" }} />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Hexagon className={`w-5 h-5 ${cor ? cor.text + "/20" : "text-foreground/10"}`} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 px-3.5 py-3 flex flex-col justify-center gap-1.5 min-w-0">
            <span className="text-sm font-bold text-foreground/88 leading-tight truncate">{ritual.name}</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {cor && label && (
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${cor.text} ${cor.border} ${cor.bg}`}>
                  {label.toUpperCase()}
                </span>
              )}
              {dbDef && (
                <span className="text-[9px] font-medium px-2 py-0.5 rounded-full border border-border/22 text-foreground/35 bg-white/[0.02]">
                  {CIRCLE_LABELS[dbDef.circle]} Círculo
                </span>
              )}
            </div>
          </div>

          {/* Trash */}
          {!readOnly && (
            <button type="button"
              onClick={(e) => { e.stopPropagation(); onRemove() }}
              className="w-11 flex items-center justify-center text-foreground/15 hover:text-red-400 hover:bg-red-950/25 transition-colors shrink-0">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {showDetail && (
        <RitualDetailModal
          ritual={ritual} def={dbDef}
          onClose={() => setShowDetail(false)}
          onRemove={onRemove}
          readOnly={readOnly}
        />
      )}
    </>
  )
}

type RitualSource = "all" | "livro-basico" | "sobrevivendo-ao-horror" | "arquivos-secretos"

const FONTE_CAPAS: Record<string, { img: string; label: string; short: string }> = {
  "livro-basico":           { img: "", label: "Livro de Regras", short: "LdR" },
  "sobrevivendo-ao-horror": { img: "", label: "Sobrevivendo ao Horror", short: "SaH" },
  "arquivos-secretos":      { img: "", label: "Arquivos Secretos", short: "AS"  },
}

const ELEMENTO_DOT_COLOR: Record<string, string> = {
  conhecimento: "#f59e0b",
  energia:      "#a78bfa",
  morte:        "#94a3b8",
  sangue:       "#f87171",
  medo:         "#fb7185",
  sacrificio:   "#fb923c",
  geral:        "#6b7280",
}

function AddRituaisModal({ open, onClose, rituais, onAdd }: {
  open: boolean; onClose: () => void; rituais: OPRitual[]; onAdd: (def: OPRitualDef) => void
}) {
  const [source,   setSource]   = useState<RitualSource>("all")
  const [circle,   setCircle]   = useState<0 | 1 | 2 | 3 | 4>(0)
  const [element,  setElement]  = useState("all")
  const [search,   setSearch]   = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const availableElements = ["all", "conhecimento", "energia", "morte", "sangue", "medo"].filter(el =>
    el === "all" || RITUAIS_OP.some(r =>
      r.element === el &&
      (source === "all" || r.source === source) &&
      (circle === 0 || r.circle === circle)
    )
  )

  const visible = RITUAIS_OP.filter(r => {
    if (source !== "all" && r.source !== source) return false
    if (circle !== 0 && r.circle !== circle) return false
    if (element !== "all" && r.element !== element) return false
    if (search) {
      const q = search.toLowerCase()
      if (!r.name.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-xl max-h-[88vh] flex flex-col gap-0 p-0 [&>button:last-child]:hidden border-white/[0.08] bg-[#080808]"
        onInteractOutside={(e) => e.preventDefault()}
        style={{ borderRadius: 18 }}
      >
        {/* ── Header ── */}
        <DialogHeader className="shrink-0 px-6 pt-5 pb-4 border-b border-white/[0.06] flex-row items-start justify-between gap-4">
          <div>
            <DialogTitle className="text-base font-bold text-foreground/92 tracking-tight">Adicionar Ritual</DialogTitle>
            <p className="text-[11px] text-foreground/35 mt-0.5">
              {visible.length} {visible.length === 1 ? "ritual disponível" : "rituais disponíveis"}
            </p>
          </div>
          <button type="button" onClick={onClose}
            className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center text-foreground/30 hover:text-foreground/70 hover:bg-white/[0.06] transition-all shrink-0">
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        {/* ── Filters ── */}
        <div className="shrink-0 px-5 py-4 space-y-4 border-b border-white/[0.05] bg-white/[0.01]">

          {/* Source — livros */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/25 mb-2">Fonte</p>
            <div className="flex gap-2">
              <button type="button"
                onClick={() => { setSource("all"); setElement("all") }}
                className={`h-10 px-4 text-[11px] font-semibold rounded-lg border transition-all ${
                  source === "all"
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-white/[0.08] text-foreground/40 hover:border-white/[0.18] hover:text-foreground/65 hover:bg-white/[0.03]"
                }`}>
                Todos
              </button>
              {(["livro-basico", "sobrevivendo-ao-horror", "arquivos-secretos"] as const).map(id => {
                const capa = FONTE_CAPAS[id]
                const active = source === id
                return (
                  <button key={id} type="button"
                    onClick={() => { setSource(id); setElement("all") }}
                    title={capa.label}
                    className={`relative h-10 overflow-hidden rounded-lg border transition-all shrink-0 ${
                      active
                        ? "border-primary/50 ring-1 ring-primary/25 scale-[1.03]"
                        : "border-white/[0.08] opacity-55 hover:opacity-85 hover:border-white/[0.18]"
                    }`}
                    style={{ width: capa.img ? 28 : "auto", minWidth: capa.img ? 28 : 0, paddingLeft: capa.img ? 0 : 12, paddingRight: capa.img ? 0 : 12 }}>
                    {capa.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={capa.img} alt={capa.short} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-foreground/50">{capa.short}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Circle + Element row */}
          <div className="flex gap-5 items-start">
            {/* Círculo */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/25 mb-2">Círculo</p>
              <div className="flex gap-1.5">
                {([0, 1, 2, 3, 4] as const).map(c => (
                  <button key={c} type="button"
                    onClick={() => setCircle(c)}
                    className={`w-9 h-9 text-[11px] font-bold rounded-lg border transition-all ${
                      circle === c
                        ? "border-primary/45 bg-primary/12 text-primary"
                        : "border-white/[0.08] text-foreground/38 hover:border-white/[0.20] hover:text-foreground/65 hover:bg-white/[0.03]"
                    }`}>
                    {c === 0 ? "—" : `${c}°`}
                  </button>
                ))}
              </div>
            </div>

            {/* Separador */}
            <div className="w-px self-stretch bg-white/[0.06] mx-1" />

            {/* Elemento */}
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/25 mb-2">Elemento</p>
              <div className="flex gap-1.5 flex-wrap">
                {availableElements.map(el => {
                  const cor = el !== "all" ? ELEMENTO_CORES[el] : null
                  const dot = el !== "all" ? ELEMENTO_DOT_COLOR[el] : null
                  const active = element === el
                  return (
                    <button key={el} type="button"
                      onClick={() => setElement(el)}
                      className={`flex items-center gap-1.5 px-2.5 h-7 text-[10px] font-semibold rounded-lg border transition-all ${
                        active
                          ? cor ? `${cor.text} ${cor.border} ${cor.bg}` : "border-primary/40 bg-primary/10 text-primary"
                          : "border-white/[0.08] text-foreground/40 hover:border-white/[0.18] hover:text-foreground/65 hover:bg-white/[0.03]"
                      }`}>
                      {dot && (
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 transition-opacity"
                          style={{ background: dot, opacity: active ? 1 : 0.4 }} />
                      )}
                      {el === "all" ? "Todos" : ELEMENTO_LABELS[el]}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/28" />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou descrição..."
              className="w-full h-9 pl-9 pr-4 text-[12px] bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:border-primary/35 focus:bg-white/[0.05] text-foreground/70 placeholder:text-foreground/28 transition-all"
            />
          </div>
        </div>

        {/* ── Ritual list ── */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-1">
          {visible.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Search className="w-8 h-8 text-foreground/12" />
              <p className="text-xs text-foreground/30">Nenhum ritual encontrado</p>
            </div>
          )}
          {visible.map(def => {
            const added = rituais.some(r => r.name === def.name)
            const isOpen = expanded === def.id
            const cor = ELEMENTO_CORES[def.element]
            return (
              <div key={def.id}
                className={`rounded-xl overflow-hidden transition-all duration-200 ${cor.glow}`}
                style={{
                  border: `1px solid ${isOpen ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
                  background: isOpen ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                }}>

                {/* Card row */}
                <div className="flex items-center gap-0 cursor-pointer group"
                  onClick={() => setExpanded(isOpen ? null : def.id)}>

                  {/* Element accent bar */}
                  <div className={`w-[3px] self-stretch shrink-0 rounded-l-xl transition-opacity ${cor.bg}`}
                    style={{ opacity: isOpen ? 0.9 : 0.5 }} />

                  {/* Thumbnail */}
                  <div className="shrink-0 mx-3 my-2.5 w-11 h-11 rounded-lg overflow-hidden"
                    style={{ border: "1px solid rgba(255,255,255,0.09)", background: "rgba(0,0,0,0.3)" }}>
                    {def.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={def.img} alt={def.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${cor.bg}`}>
                        <Hexagon className={`w-4 h-4 ${cor.text} opacity-40`} />
                      </div>
                    )}
                  </div>

                  {/* Name + badges */}
                  <div className="flex-1 min-w-0 py-2.5">
                    <p className={`text-[13px] font-semibold leading-tight truncate transition-colors ${
                      isOpen ? "text-foreground/95" : "text-foreground/80 group-hover:text-foreground/92"
                    }`}>{def.name}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className={`text-[9px] font-bold px-2 py-[2px] rounded-full border ${cor.text} ${cor.border} ${cor.bg}`}>
                        {ELEMENTO_LABELS[def.element].toUpperCase()}
                      </span>
                      <span className="text-[9px] font-medium px-2 py-[2px] rounded-full border border-white/[0.10] text-foreground/35 bg-white/[0.03]">
                        {CIRCLE_LABELS[def.circle]}° Círculo
                      </span>
                      {def.source === "sobrevivendo-ao-horror" && (
                        <span className="text-[9px] font-medium px-2 py-[2px] rounded-full border border-sky-400/20 text-sky-400/50">SaH</span>
                      )}
                      {def.source === "arquivos-secretos" && (
                        <span className="text-[9px] font-medium px-2 py-[2px] rounded-full border border-indigo-400/20 text-indigo-400/50">AS</span>
                      )}
                    </div>
                  </div>

                  {/* Chevron indicator */}
                  <ChevronDown className={`w-3.5 h-3.5 text-foreground/20 transition-transform duration-200 shrink-0 mx-1 ${isOpen ? "rotate-180" : ""}`} />

                  {/* Add button */}
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); if (!added) onAdd(def) }}
                    className={`w-8 h-8 mr-3 rounded-lg flex items-center justify-center text-sm font-bold transition-all border shrink-0 ${
                      added
                        ? "border-primary/20 bg-primary/5 text-primary/35 cursor-default"
                        : `${cor.border} ${cor.bg} ${cor.text} hover:opacity-75`
                    }`}>
                    {added ? "✓" : "+"}
                  </button>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 ml-[3px]">
                    <div className={`border-l-2 ${cor.leftBorder} pl-3`}>
                      {/* Properties pills */}
                      {(def.execution || def.range || def.duration || def.resistance) && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {[
                            { label: "Execução", value: def.execution },
                            { label: "Alcance",  value: def.range },
                            { label: "Duração",  value: def.duration },
                            { label: "Resistência", value: def.resistance },
                          ].filter(p => p.value).map(p => (
                            <span key={p.label}
                              className="text-[9px] text-foreground/45 border border-white/[0.09] bg-white/[0.03] px-2 py-0.5 rounded-md">
                              <span className="text-foreground/30 font-medium">{p.label}: </span>{p.value}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-[12px] text-foreground/65 leading-[1.70] whitespace-pre-wrap">{def.description}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── InventarioTab ────────────────────────────────────────────────────────────

const CREDIT_LABELS: Record<string, string> = { baixo: "Baixo", medio: "Médio", alto: "Alto", ilimitado: "Ilimitado" }

const PATENTE_OPTIONS: import("@/lib/systems").OPPatente[] = [
  { id: "mundano", name: "Mundano", ppMin: -1, creditLimit: "baixo", catLimits: { "cat-0": -1, "cat-I": 0, "cat-II": 0, "cat-III": 0, "cat-IV": 0 } },
  ...PATENTE_DATA,
]

const NOVO_CATS = [
  { id: "arma",          label: "Arma" },
  { id: "municao",       label: "Munição" },
  { id: "protecao",      label: "Proteção" },
  { id: "equipamento",   label: "Geral" },
  { id: "item-amaldicado", label: "Item Amald." },
]

function novoFilterMatch(cat: string, filter: string): boolean {
  if (filter === "arma")           return cat.startsWith("arma") || cat === "modificacao-arma" || cat === "explosivo"
  if (filter === "municao")        return cat === "municao"
  if (filter === "protecao")       return cat === "protecao" || cat === "modificacao-protecao"
  if (filter === "equipamento")    return cat === "equipamento" || cat === "medicamento" || cat === "veiculo"
  if (filter === "item-amaldicado") return cat === "item-amaldicado" || cat === "item-paranormal"
  return true
}

// ─── AddInventoryModal ────────────────────────────────────────────────────────

const ADD_INV_CAT_S = {
  "cat-0":   { text: "text-zinc-300",   border: "border-zinc-600/40",   bg: "bg-zinc-700/20",   iconBg: "bg-zinc-800/70",   accentColor: "#52525b" },
  "cat-I":   { text: "text-indigo-300", border: "border-indigo-500/35", bg: "bg-indigo-500/10", iconBg: "bg-indigo-950/80",  accentColor: "#6366f1" },
  "cat-II":  { text: "text-sky-300",    border: "border-sky-500/35",    bg: "bg-sky-500/10",    iconBg: "bg-sky-950/80",     accentColor: "#0ea5e9" },
  "cat-III": { text: "text-amber-300",  border: "border-amber-500/35",  bg: "bg-amber-500/10",  iconBg: "bg-amber-950/80",   accentColor: "#f59e0b" },
  "cat-IV":  { text: "text-rose-300",   border: "border-rose-500/35",   bg: "bg-rose-500/10",   iconBg: "bg-rose-950/80",    accentColor: "#f43f5e" },
} as const

function AddInventoryModal({ open, onClose, onAdd, catFilter }: {
  open: boolean
  onClose: () => void
  onAdd: (item: ShopItem) => void
  catFilter: string
}) {
  const [search,   setSearch]   = useState("")
  const [activeCat, setActiveCat] = useState(catFilter)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => { setActiveCat(catFilter) }, [catFilter])
  useEffect(() => { if (!open) { setSearch(""); setExpanded(null) } }, [open])

  const visible = ORDEM_PARANORMAL_ITEMS.filter(item => {
    if (!novoFilterMatch(item.category, activeCat)) return false
    if (search) {
      const q = search.toLowerCase()
      if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-[340px] max-h-[88vh] flex flex-col gap-0 p-0 overflow-hidden rounded-xl">
        {/* ── Header ─────────────────────────────────────────────── */}
        <DialogHeader className="px-5 pt-5 pb-4 shrink-0">
          <DialogTitle className="text-base font-bold tracking-tight">Adicionar Item</DialogTitle>
        </DialogHeader>

        {/* ── Search + Filtros ───────────────────────────────────── */}
        <div className="px-4 pb-3 space-y-2.5 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30 pointer-events-none" />
            <input value={search} onChange={e => { setSearch(e.target.value); setExpanded(null) }}
              placeholder="Buscar item..."
              className="w-full h-9 pl-9 pr-3 text-[12px] bg-background/30 border border-border/20 rounded-lg focus:outline-none focus:border-primary/40 text-foreground/70 placeholder:text-foreground/35 transition-colors" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-px">
            {[{ id: "all", label: "Tudo" }, ...NOVO_CATS].map(c => (
              <button key={c.id} type="button"
                onClick={() => { setActiveCat(c.id); setExpanded(null) }}
                className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-all
                  ${activeCat === c.id
                    ? "bg-primary/15 border-primary/40 text-primary shadow-[0_0_8px_rgba(139,92,246,0.20)]"
                    : "border-border/20 text-foreground/45 hover:border-border/35 hover:text-foreground/60"}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-border/15 shrink-0" />

        {/* ── Lista ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 min-h-0">
          {visible.length === 0 && (
            <div className="text-center py-12 text-muted-foreground/35 text-xs">Nenhum item encontrado.</div>
          )}
          {visible.map(item => {
            const cat = (item.rankCategory ?? "cat-0") as keyof typeof ADD_INV_CAT_S
            const s   = ADD_INV_CAT_S[cat] ?? ADD_INV_CAT_S["cat-0"]
            const catLabel = cat === "cat-0" ? "Cat.0" : `Cat.${cat.slice(4)}`
            const isOpen  = expanded === item.id

            return (
              <div key={item.id}
                className={`rounded-lg border ${s.border} overflow-hidden transition-all`}
                style={{ borderLeftColor: s.accentColor, borderLeftWidth: "2px" }}>

                {/* Row */}
                <div className={`flex items-center gap-2.5 px-3 py-2.5 ${isOpen ? s.bg : "bg-background/20 hover:bg-background/35"} transition-colors`}>
                  {/* Icon */}
                  <div className={`w-8 h-8 shrink-0 rounded-md flex items-center justify-center ${s.iconBg} border ${s.border}`}>
                    {item.icon
                      ? (/* eslint-disable-next-line @next/next/no-img-element */
                        <img src={gameIconUrl(item.icon, "ffffff")} alt="" className="w-5 h-5 opacity-65" />)
                      : <Hexagon className="w-4 h-4 text-muted-foreground/30" />
                    }
                  </div>

                  {/* Info button (expand) */}
                  <button type="button" onClick={() => setExpanded(isOpen ? null : item.id)}
                    className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[12px] font-semibold text-foreground/88 leading-tight">{item.name}</span>
                      <span className={`text-[8px] font-bold tracking-widest px-1.5 py-px rounded border ${s.text} ${s.border} ${s.bg}`}>
                        {catLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 mt-0.5">
                      {item.damage && (
                        <span className="text-[9px] text-foreground/40">
                          Dano <span className={`font-semibold ${s.text}`}>{item.damage}</span>
                        </span>
                      )}
                      {item.critical && (
                        <span className="text-[9px] text-foreground/40">
                          Crít <span className="font-semibold text-foreground/65">{item.critical}</span>
                        </span>
                      )}
                      {item.defense !== undefined && (
                        <span className="text-[9px] text-foreground/40">
                          Def <span className={`font-semibold ${s.text}`}>+{item.defense}</span>
                        </span>
                      )}
                      <span className="text-[9px] text-foreground/30">{item.slots} esp.</span>
                    </div>
                  </button>

                  {/* Add button */}
                  <button type="button" onClick={() => { onAdd(item); onClose() }}
                    className={`w-7 h-7 shrink-0 rounded-md border flex items-center justify-center transition-all hover:scale-105 ${s.border} ${s.text} ${s.iconBg} hover:brightness-125`}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Expanded description */}
                {isOpen && (
                  <div className={`px-3 pb-3 pt-2 border-t ${s.border} ${s.bg} space-y-1.5`}>
                    <p className="text-[10px] text-foreground/60 leading-relaxed">{item.description}</p>
                    {item.properties && item.properties.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {item.properties.map(p => (
                          <span key={p} className={`text-[9px] px-1.5 py-px rounded border ${s.border} ${s.bg} ${s.text} opacity-80`}>{p}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function InventarioTab({ inventoryItems, onAdd, onRemove, onUpdateItem, onSetPP, slotsUsed, carryLimit, derivedPatente, ppValue, readOnly }: {
  inventoryItems: InventoryItem[]
  onAdd: (item: ShopItem) => void
  onRemove: (idx: number) => void
  onUpdateItem: (idx: number, patch: Partial<InventoryItem>) => void
  onSetPP: (pp: number) => void
  slotsUsed: number
  carryLimit: number
  derivedPatente: OPPatente
  ppValue: number
  readOnly: boolean
}) {
  const [search,       setSearch]       = useState("")
  const [expanded,     setExpanded]     = useState<number | null>(null)
  const [showAdd,      setShowAdd]      = useState(false)
  const [addCat,       setAddCat]       = useState("all")
  const [patenteId,    setPatenteId]    = useState<string>(derivedPatente.id)
  const [openPatente,  setOpenPatente]  = useState(false)
  const [creditOv,     setCreditOv]     = useState<string | null>(null)
  const [openCredit,   setOpenCredit]   = useState(false)
  const [carryInput,   setCarryInput]   = useState<string>(String(carryLimit))
  const [slotsInput,   setSlotsInput]   = useState<string>("")
  const [catLimitOv,   setCatLimitOv]   = useState<Partial<Record<string, string>>>({})

  // Sync when pp changes from outside (other tab)
  useEffect(() => { setPatenteId(derivedPatente.id); setCreditOv(null); setCatLimitOv({}) }, [derivedPatente.id])
  useEffect(() => { setCarryInput(String(carryLimit)) }, [carryLimit])

  const effectivePatente = PATENTE_OPTIONS.find(p => p.id === patenteId) ?? derivedPatente
  const effectiveCredit  = creditOv ?? effectivePatente.creditLimit
  const effectiveCarry   = Number(carryInput) || carryLimit

  const catCounts: Partial<Record<string, number>> = {}
  for (const item of inventoryItems) {
    const cat = item.effectiveRankCategory ?? item.rankCategory ?? "cat-0"
    if (cat !== "cat-0") catCounts[cat] = (catCounts[cat] ?? 0) + 1
  }

  const displayed = inventoryItems
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => !search || item.itemName.toLowerCase().includes(search.toLowerCase()))

  function openAdd(cat = "all") { setAddCat(cat); setShowAdd(true) }

  const RANK_CATS = ["cat-I", "cat-II", "cat-III", "cat-IV"] as const

  const dropdownCls = "absolute z-50 top-full left-0 mt-1 min-w-[140px] rounded-lg border border-border/30 bg-zinc-900 shadow-xl overflow-hidden"
  const dropdownItemCls = "w-full px-3 py-2 text-left text-xs hover:bg-white/8 transition-colors cursor-pointer"

  return (
    <div className="pt-3 space-y-4">
      {/* ── Search + Adicionar ────────────────────────────────────── */}
      <div className="flex gap-2">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Filtrar itens"
          className="flex-1 h-9 px-3 text-sm bg-transparent border border-border/25 rounded-lg focus:outline-none focus:border-primary/40 text-foreground/70 placeholder:text-foreground/40" />
        {!readOnly && (
          <Button type="button" size="sm" onClick={() => openAdd()} className="h-9 shrink-0">
            Adicionar
          </Button>
        )}
      </div>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div className="space-y-2 text-[10px]">
        {/* PP + Patente */}
        <div className="flex items-center gap-2">
          <span className="text-foreground/50 tracking-widest uppercase whitespace-nowrap w-36">PONTOS DE PRESTÍGIO</span>
          <input
            type="number"
            value={ppValue}
            onChange={e => onSetPP(parseInt(e.target.value, 10) || 0)}
            className="w-14 border border-border/30 rounded px-2 py-1 text-center bg-background/20 font-mono text-xs text-foreground/80 focus:outline-none focus:border-primary/40"
          />
          <span className="text-foreground/50 tracking-widest uppercase ml-2 whitespace-nowrap">PATENTE</span>
          {/* Patente dropdown */}
          <div className="relative flex-1">
            <button type="button"
              onClick={() => { setOpenPatente(v => !v); setOpenCredit(false) }}
              className="w-full border border-border/30 rounded px-3 py-1 bg-background/20 flex items-center justify-between gap-1 hover:border-primary/30 transition-colors group">
              <span className="text-foreground/80 text-xs">{effectivePatente.name}</span>
              <ChevronDown className="w-3 h-3 text-foreground/35 group-hover:text-foreground/60 transition-transform" style={{ transform: openPatente ? "rotate(180deg)" : "" }} />
            </button>
            {openPatente && (
              <div className={dropdownCls} onMouseLeave={() => setOpenPatente(false)}>
                {PATENTE_OPTIONS.map(p => (
                  <button key={p.id} type="button"
                    className={`${dropdownItemCls} ${p.id === patenteId ? "text-primary/90 bg-primary/8" : "text-foreground/75"}`}
                    onClick={() => {
                      setPatenteId(p.id)
                      setCreditOv(null)
                      onSetPP(Math.max(0, p.ppMin))
                      setOpenPatente(false)
                    }}>
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Limite de Itens */}
        <div className="flex items-center gap-2">
          <span className="text-foreground/50 tracking-widest uppercase whitespace-nowrap w-36">LIMITE DE ITENS</span>
          {RANK_CATS.map(cat => {
            const autoLimit = effectivePatente.catLimits[cat]
            const inputVal  = catLimitOv[cat] ?? (autoLimit === -1 ? "∞" : String(autoLimit))
            return (
              <input key={cat}
                type="text"
                value={inputVal}
                onChange={e => setCatLimitOv(prev => ({ ...prev, [cat]: e.target.value }))}
                className="w-9 border border-border/30 rounded px-1 py-1 text-center bg-background/20 font-mono text-xs text-foreground/80 focus:outline-none focus:border-primary/40"
              />
            )
          })}
        </div>

        {/* No Inventário */}
        <div className="flex items-center gap-2">
          <span className="text-foreground/50 tracking-widest uppercase whitespace-nowrap w-36">NO INVENTÁRIO</span>
          {RANK_CATS.map(cat => {
            const rawLimit  = catLimitOv[cat]
            const autoLimit = effectivePatente.catLimits[cat]
            const limit     = rawLimit !== undefined ? (rawLimit === "∞" ? -1 : parseInt(rawLimit, 10)) : autoLimit
            const count = catCounts[cat] ?? 0
            const over  = limit !== -1 && !isNaN(limit) && count > limit
            return (
              <div key={cat} className={`border rounded px-2 py-1 min-w-[36px] text-center bg-background/20 ${over ? "border-red-500/50" : "border-border/30"}`}>
                <span className={`font-mono text-xs ${over ? "text-red-400" : "text-foreground/80"}`}>{count}</span>
              </div>
            )
          })}
        </div>

        {/* Limite de Crédito + Carga */}
        <div className="flex items-center gap-2">
          <span className="text-foreground/50 tracking-widest uppercase whitespace-nowrap w-36">LIMITE DE CRÉDITO</span>
          {/* Credit dropdown */}
          <div className="relative">
            <button type="button"
              onClick={() => { setOpenCredit(v => !v); setOpenPatente(false) }}
              className="border border-border/30 rounded px-3 py-1 bg-background/20 flex items-center gap-1.5 hover:border-primary/30 transition-colors group">
              <span className="text-foreground/80 text-xs">{CREDIT_LABELS[effectiveCredit]}</span>
              <ChevronDown className="w-3 h-3 text-foreground/35 group-hover:text-foreground/60" style={{ transform: openCredit ? "rotate(180deg)" : "" }} />
            </button>
            {openCredit && (
              <div className={dropdownCls} onMouseLeave={() => setOpenCredit(false)}>
                {Object.entries(CREDIT_LABELS).map(([val, label]) => (
                  <button key={val} type="button"
                    className={`${dropdownItemCls} ${val === effectiveCredit ? "text-primary/90 bg-primary/8" : "text-foreground/75"}`}
                    onClick={() => { setCreditOv(val); setOpenCredit(false) }}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="text-foreground/50 tracking-widest uppercase ml-2 whitespace-nowrap">CARGA MÁX.</span>
          {/* Slots usados — editável, auto se vazio */}
          <input
            type="number"
            value={slotsInput !== "" ? slotsInput : slotsUsed}
            onChange={e => setSlotsInput(e.target.value)}
            onBlur={e => { if (e.target.value === "" || e.target.value === String(slotsUsed)) setSlotsInput("") }}
            className={`w-12 border rounded px-2 py-1 text-center bg-background/20 font-mono text-xs focus:outline-none focus:border-primary/40 ${
              (slotsInput !== "" ? Number(slotsInput) : slotsUsed) > effectiveCarry
                ? "border-orange-500/50 text-orange-400"
                : "border-border/30 text-foreground/80"
            }`}
          />
          {/* Carga máx editável */}
          <input
            type="number"
            value={carryInput}
            onChange={e => setCarryInput(e.target.value)}
            className="w-12 border border-border/30 rounded px-2 py-1 text-center bg-background/20 font-mono text-xs text-foreground/80 focus:outline-none focus:border-primary/40"
          />
        </div>
      </div>

      {/* ── NOVO ──────────────────────────────────────────────────── */}
      {!readOnly && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] tracking-widest uppercase text-foreground/45">NOVO</span>
          {NOVO_CATS.map(c => (
            <button key={c.id} type="button" onClick={() => openAdd(c.id)}
              className="px-2.5 py-1 rounded border border-primary/30 text-primary/70 text-[10px] font-semibold hover:bg-primary/10 hover:border-primary/50 transition-all">
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Lista de Itens ────────────────────────────────────────── */}
      <div className="space-y-1">
        {displayed.length === 0 && (
          <div className="text-center py-8 text-muted-foreground/45 text-sm">
            {inventoryItems.length === 0 ? "Inventário vazio." : "Nenhum item encontrado."}
          </div>
        )}
        {displayed.map(({ item, idx }) => {
          const shopItem = ITEM_LOOKUP.get(item.itemId)
          const rankCat  = item.effectiveRankCategory ?? item.rankCategory ?? "cat-0"
          const catDisplay = rankCat === "cat-0" ? "0" : rankCat.slice(4)
          const isWeapon = item.category?.startsWith("arma") || item.category === "explosivo"
          const mods = item.modifications ?? []
          const modNames = mods.map(id => WEAPON_MODS.find(m => m.id === id)?.name ?? id)
          const isOpen = expanded === idx

          return (
            <div key={idx} className="border border-border/15 rounded-lg bg-background/20 hover:border-border/25 transition-colors">
              <button type="button" onClick={() => setExpanded(isOpen ? null : idx)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left">
                <ChevronDown className={`w-3.5 h-3.5 text-primary/50 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-foreground/85 leading-tight">{item.itemName}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {isWeapon && shopItem?.damage ? (
                      <>
                        <span className="text-[10px] text-foreground/45">
                          Dano: <span className="text-foreground/75 font-semibold">{shopItem.damage}</span>
                        </span>
                        {shopItem.critical && (
                          <span className="text-[10px] text-foreground/45">
                            Crítico: <span className="text-foreground/75 font-semibold">{shopItem.critical}</span>
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] text-foreground/45">
                          Categoria: <span className="text-primary/80 font-semibold">{catDisplay}</span>
                        </span>
                        {item.slots !== undefined && (
                          <span className="text-[10px] text-foreground/45">
                            Espaços: <span className="text-foreground/70 font-semibold">{item.slots}</span>
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {isWeapon && !readOnly && (
                  <div className="w-4 h-4 border border-border/35 rounded shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-3 pb-3 pt-2 border-t border-border/10 space-y-2">
                  {shopItem?.description && (
                    <p className="text-[11px] text-foreground/60 leading-relaxed">{shopItem.description}</p>
                  )}
                  {shopItem?.defense !== undefined && (
                    <div className="flex gap-3">
                      <span className="text-[10px] text-foreground/45">
                        Defesa: <span className="text-foreground/75 font-semibold">+{shopItem.defense}</span>
                      </span>
                      {shopItem.penalty !== undefined && shopItem.penalty !== 0 && (
                        <span className="text-[10px] text-foreground/45">
                          Penalidade: <span className="text-red-400/75 font-semibold">{shopItem.penalty}</span>
                        </span>
                      )}
                    </div>
                  )}
                  {shopItem?.properties && shopItem.properties.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {shopItem.properties.map(prop => (
                        <span key={prop} className="text-[9px] px-1.5 py-0.5 rounded border border-border/25 bg-background/30 text-foreground/50">
                          {prop}
                        </span>
                      ))}
                    </div>
                  )}
                  {modNames.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {modNames.map(name => (
                        <span key={name} className="text-[9px] font-semibold px-1.5 py-0.5 rounded border bg-primary/8 text-primary/60 border-primary/20">
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Editable fields */}
                  <div className="flex items-center gap-3 pt-0.5">
                    <span className="text-[10px] text-foreground/45">Espaços:</span>
                    <input
                      type="number"
                      defaultValue={item.slots ?? 1}
                      min={0}
                      readOnly={readOnly}
                      onChange={e => {
                        const v = parseInt(e.target.value, 10)
                        if (!isNaN(v)) onUpdateItem(idx, { slots: v })
                      }}
                      className="w-12 border border-border/25 rounded px-2 py-0.5 text-center bg-background/15 font-mono text-[11px] text-foreground/75 focus:outline-none focus:border-primary/40 disabled:opacity-50"
                    />
                    <span className="text-[10px] text-foreground/45">Categoria:</span>
                    <span className="text-[10px] text-primary/80 font-semibold">{catDisplay}</span>
                  </div>
                  {!readOnly && (
                    <div className="pt-1 flex justify-end">
                      <button type="button"
                        onClick={() => { onRemove(idx); setExpanded(null) }}
                        className="flex items-center gap-1 text-[10px] text-red-400/60 hover:text-red-400 transition-colors border border-red-500/20 hover:border-red-500/40 rounded px-2 py-1">
                        <Trash2 className="w-3 h-3" />
                        Remover
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <AddInventoryModal open={showAdd} onClose={() => setShowAdd(false)}
        onAdd={onAdd} catFilter={addCat} />
    </div>
  )
}

function RituaisTab({ rituais, onUpdate, readOnly }: {
  rituais: OPRitual[]; onUpdate: (next: OPRitual[]) => void; readOnly: boolean
}) {
  const [filter,  setFilter]  = useState("")
  const [showAdd, setShowAdd] = useState(false)

  const filtered = rituais.filter(r => !filter || r.name.toLowerCase().includes(filter.toLowerCase()))

  function addFromDb(def: OPRitualDef) {
    if (rituais.some(r => r.name === def.name)) { toast.error("Ritual já adicionado"); return }
    onUpdate([...rituais, { id: `ritual-${Date.now()}`, name: def.name }])
    toast.success(`"${def.name}" adicionado!`)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrar rituais"
          className="flex-1 h-8 px-3 text-xs bg-transparent border border-border/25 rounded-lg focus:outline-none focus:border-primary/40 text-foreground/60 placeholder:text-foreground/55" />
        {!readOnly && (
          <Button type="button" size="sm" onClick={() => setShowAdd(true)} className="h-8 text-xs gap-1.5 shrink-0">
            <Plus className="h-3.5 w-3.5" />Adicionar
          </Button>
        )}
      </div>

      <div className="space-y-1.5">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground/55 text-sm">
            Nenhum ritual cadastrado.
          </div>
        )}
        {filtered.map(r => (
          <RitualItem key={r.id} ritual={r} readOnly={readOnly}
            onRemove={() => onUpdate(rituais.filter(x => x.id !== r.id))} />
        ))}
      </div>

      <AddRituaisModal open={showAdd} onClose={() => setShowAdd(false)}
        rituais={rituais} onAdd={addFromDb} />
    </div>
  )
}

// ─── SobrevivendoModal ────────────────────────────────────────────────────────

function RuleToggle({ active, onToggle, label, description, accent }: {
  active: boolean
  onToggle: (v: boolean) => void
  label: string
  description: string
  accent: { border: string; bg: string; glow: string; dot: string; text: string }
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!active)}
      className={[
        "w-full text-left rounded-xl border px-4 py-3.5 transition-all duration-200 cursor-pointer group",
        active
          ? `${accent.border} ${accent.bg}`
          : "border-border/20 bg-white/[0.02] hover:bg-white/[0.04] hover:border-border/35",
      ].join(" ")}
      style={active ? { boxShadow: accent.glow } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${active ? accent.dot : "bg-foreground/20"}`} />
            <span className={`text-[13px] font-semibold leading-tight transition-colors ${active ? accent.text : "text-foreground/70"}`}>
              {label}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-foreground/40 pl-3.5">{description}</p>
        </div>
        {/* pill indicator */}
        <div className={[
          "shrink-0 mt-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-widest transition-all",
          active
            ? `${accent.dot} text-black`
            : "bg-foreground/8 text-foreground/30",
        ].join(" ")}>
          {active ? "ON" : "OFF"}
        </div>
      </div>
    </button>
  )
}

function OptionalRulesModal({ open, onClose, nexExpActive, semSanActive, onToggleNexExp, onToggleSemSan }: {
  open: boolean; onClose: () => void
  nexExpActive: boolean; semSanActive: boolean
  onToggleNexExp: (v: boolean) => void; onToggleSemSan: (v: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[360px] p-0 overflow-hidden border-border/20 bg-zinc-950">
        {/* Header com gradiente temático */}
        <div className="relative px-5 pt-5 pb-4 border-b border-white/5"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(15,15,35,0) 60%)" }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4 text-primary/70" />
            </div>
            <div>
              <p className="text-[9px] tracking-[0.2em] uppercase text-primary/50 font-semibold mb-0.5">Suplemento</p>
              <h2 className="text-[15px] font-bold text-foreground/90 leading-tight">Sobrevivendo ao Horror</h2>
              <p className="text-[10px] text-foreground/35 mt-0.5">Regras opcionais — ative individualmente</p>
            </div>
          </div>
        </div>

        {/* Regras */}
        <div className="px-4 py-4 space-y-2.5">
          <RuleToggle
            active={nexExpActive}
            onToggle={onToggleNexExp}
            label="NEX & Experiência"
            description="Separa o Nível de experiência (1–20) do NEX de exposição ao paranormal. PV, PE e SAN passam a ser calculados pelo Nível."
            accent={{
              border: "border-violet-500/30",
              bg: "bg-violet-500/[0.07]",
              glow: "0 0 20px rgba(139,92,246,0.12)",
              dot: "bg-violet-400",
              text: "text-violet-300",
            }}
          />
          <RuleToggle
            active={semSanActive}
            onToggle={onToggleSemSan}
            label="Jogando sem Sanidade"
            description="Funde as barras de Sanidade e Esforço em uma única barra de Determinação (PD), com fórmula própria por classe."
            accent={{
              border: "border-cyan-500/30",
              bg: "bg-cyan-500/[0.07]",
              glow: "0 0 20px rgba(6,182,212,0.12)",
              dot: "bg-cyan-400",
              text: "text-cyan-300",
            }}
          />
        </div>

        {/* Footer hint */}
        <div className="px-4 pb-4">
          <p className="text-[9px] text-foreground/20 text-center tracking-wide">
            Clique em cada card para ativar ou desativar
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── NexChip — dropdown custom para NEX / NVL ────────────────────────────────

function NexChip({ label, value, suffix, options, readOnly, onChange, chipCls }: {
  label: string
  value: string
  suffix: string
  options: { value: string; label: string }[]
  readOnly: boolean
  onChange: (v: string) => void
  chipCls: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div className="flex flex-col items-center">
      <div className="relative" ref={ref}>
        {readOnly ? (
          <div className={`border rounded px-2 py-0.5 bg-background/30 ${chipCls}`}>
            <span className="text-sm font-bold font-mono">{value}{suffix}</span>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              className={`border rounded px-2 py-0.5 flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer ${chipCls}`}>
              <span className="text-sm font-bold font-mono">{value}{suffix}</span>
              <ChevronDown className="w-3 h-3 opacity-50" style={{ transform: open ? "rotate(180deg)" : "" }} />
            </button>
            {open && (
              <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-1 w-20 rounded-lg border border-border/30 bg-zinc-900 shadow-xl overflow-y-auto max-h-52">
                {options.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false) }}
                    className={`w-full px-3 py-1.5 text-center text-xs font-mono hover:bg-white/8 transition-colors cursor-pointer ${opt.value === value ? "text-primary font-bold bg-primary/8" : "text-foreground/70"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <span className="text-[9px] font-semibold tracking-widest text-foreground/40 uppercase mt-0.5">{label}</span>
    </div>
  )
}

// ─── PersonalizacaoModal ──────────────────────────────────────────────────────

function PersonalizacaoModal({ open, onClose, portrait, onSave }: {
  open: boolean; onClose: () => void; portrait: string; onSave: (url: string) => void
}) {
  const [url, setUrl] = useState(portrait)
  useEffect(() => { setUrl(portrait) }, [portrait])

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Personalização</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">URL do retrato do personagem</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..." className="h-8 text-sm mt-1" />
          </div>
          {url && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Prévia" className="h-32 w-32 object-cover rounded-lg border border-border/30" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
            <Button type="button" size="sm" onClick={() => { onSave(url); onClose() }}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── ActiveConditionsPanel ────────────────────────────────────────────────────

function ActiveConditionsPanel({ conditionsJson }: { conditionsJson?: string }) {
  let conditions: ActiveCondition[] = []
  try { conditions = JSON.parse(conditionsJson ?? "[]") } catch { /* ignore */ }
  if (conditions.length === 0) return null

  return (
    <div className="rounded-lg border border-red-900/30 bg-red-950/10 overflow-hidden">
      <div className="px-3 py-1.5 border-b border-red-900/20 flex items-center justify-center gap-1.5">
        <span className="text-red-400/40 text-[10px]">♦</span>
        <span className="text-[9px] font-bold tracking-[0.2em] text-red-300/60 uppercase">Condições</span>
        <span className="text-red-400/40 text-[10px]">♦</span>
      </div>
      <div className="p-2 flex flex-wrap gap-1">
        {conditions.map((ac) => {
          const def = ORDEM_PARANORMAL_CONDITIONS.find((c) => c.id === ac.id)
          if (!def) return null
          return (
            <span key={ac.id}
              title={`${def.shortEffect}${ac.notes ? `\n${ac.notes}` : ""}\n\n${def.description}`}
              className={`inline-flex items-center gap-1 px-1.5 py-px rounded-full border text-[9px] font-semibold ${CONDITION_COLORS[def.category]}`}>
              <span className="opacity-40 text-[7px]">{CONDITION_CATEGORY_LABELS[def.category].toUpperCase()}</span>
              {def.name}
              {ac.notes && <span className="opacity-50">· {ac.notes}</span>}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ─── DiceRollModal ────────────────────────────────────────────────────────────

function DiceRollModal({ result, onReroll, onClose }: {
  result: RollResult | null
  onReroll: () => void
  onClose: () => void
}) {
  if (!result) return null
  const { skillName, attrKey, attrValue, rolls, bonus, best, total } = result
  const isDisadvantage = attrValue === 0

  return (
    <Dialog open={!!result} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <D20Icon className="h-5 w-5 text-primary" />
            {skillName}
            <span className="text-muted-foreground text-sm font-normal">
              — {isDisadvantage ? "2d20 desvantagem" : `${attrValue}d20`} + {bonus}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dados individuais */}
          <div className="flex flex-wrap gap-2 justify-center py-2">
            {rolls.map((r, i) => {
              const isBest = isDisadvantage ? r === Math.min(...rolls) : r === best
              const isHighest = !isDisadvantage && r === 20
              const isLowest = !isDisadvantage && r === 1
              return (
                <div key={i} className={`relative flex items-center justify-center w-12 h-12 rounded-lg border-2 font-bold text-lg transition-all ${
                  isBest
                    ? "border-primary bg-primary/15 text-primary shadow-[0_0_12px_rgba(var(--primary)/0.4)]"
                    : "border-border/30 bg-background/30 text-foreground/50"
                }`}>
                  {r}
                  {isBest && (
                    <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-primary text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold leading-none">
                      ★
                    </span>
                  )}
                  {isHighest && !isDisadvantage && (
                    <span className="absolute -top-1.5 -left-1.5 text-[8px] text-green-400 font-black">20!</span>
                  )}
                  {isLowest && !isDisadvantage && (
                    <span className="absolute -top-1.5 -left-1.5 text-[8px] text-red-400 font-black">1!</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Conta */}
          <div className="rounded-lg border border-border/20 bg-background/20 px-4 py-3 text-center space-y-1">
            <div className="text-xs text-muted-foreground/60">
              {isDisadvantage ? "pior" : "melhor"} dado <span className="font-mono font-bold text-foreground/70">{best}</span>
              {bonus !== 0 && (
                <> + bônus <span className="font-mono font-bold text-foreground/70">{bonus > 0 ? `+${bonus}` : bonus}</span></>
              )}
            </div>
            <div className="text-3xl font-black text-primary" style={{ textShadow: "0 0 20px rgba(var(--primary)/0.5)" }}>
              {total}
            </div>
            <div className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">resultado</div>
          </div>

          {isDisadvantage && (
            <p className="text-[10px] text-amber-400/70 text-center">
              Atributo 0 → 2d20 pegando o pior
            </p>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" className="flex-1 gap-1.5" onClick={onReroll}>
              <D20Icon className="h-3.5 w-3.5" />Rolar novamente
            </Button>
            <Button type="button" size="sm" className="flex-1" onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function OrdemParanormalSheet({ characterId, characterName, initialData, readOnly = false, deleteButton }: Props) {
  const mergedData = { ...defaultOrdemParanormalData(), ...initialData }
  const { register, watch, setValue, reset } = useForm<OrdemParanormalData>({
    defaultValues: mergedData,
  })
  useEffect(() => { reset({ ...defaultOrdemParanormalData(), ...initialData }) }, [initialData, reset])

  // Auto-save
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const sub = watch((data) => {
      if (readOnly) return
      if (isFirstRender.current) { isFirstRender.current = false; return }
      if (saveTimer.current) clearTimeout(saveTimer.current)
      setSaveStatus("idle")
      saveTimer.current = setTimeout(async () => {
        setSaveStatus("saving")
        try {
          const res = await fetch(`/api/characters/${characterId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: characterName, data }),
          })
          if (res.ok) {
            setSaveStatus("saved")
            if (savedTimer.current) clearTimeout(savedTimer.current)
            savedTimer.current = setTimeout(() => setSaveStatus("idle"), 2500)
          } else {
            setSaveStatus("idle")
            toast.error("Erro ao salvar")
          }
        } catch {
          setSaveStatus("idle")
          toast.error("Erro ao salvar")
        }
      }, 1000)
    })
    return () => {
      sub.unsubscribe()
      if (saveTimer.current) clearTimeout(saveTimer.current)
      if (savedTimer.current) clearTimeout(savedTimer.current)
    }
  }, [watch, readOnly, characterId, characterName])

  const num = (f: keyof OrdemParanormalData) => parseInt(watch(f) as string || "0") || 0
  const set = (f: keyof OrdemParanormalData) => (v: number) => setValue(f, String(v))

  // Skills
  const skillsMap = parseSkills(watch("skills"))
  function updateSkill(name: string, entry: SkillEntry) {
    if (readOnly) return
    setValue("skills", JSON.stringify({ ...skillsMap, [name]: entry }))
  }

  // Dice rolling
  const [rollResult, setRollResult] = useState<RollResult | null>(null)
  const [pendingRoll, setPendingRoll] = useState<{ def: OPSkillDef; entry: SkillEntry } | null>(null)

  function executeRoll(def: OPSkillDef, entry: SkillEntry) {
    const attrValue = parseInt(watch(def.attr as keyof OrdemParanormalData) as string || "0") || 0
    const diceCount = attrValue === 0 ? 2 : attrValue
    const rolls = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 20) + 1)
    const best = attrValue === 0 ? Math.min(...rolls) : Math.max(...rolls)
    const bonus = entry.treino + entry.outros
    setRollResult({ skillName: def.name, attrKey: def.attr, attrValue, rolls, bonus, best, total: best + bonus })
    setPendingRoll({ def, entry })
  }

  function rollSkill(def: OPSkillDef, entry: SkillEntry) { executeRoll(def, entry) }
  function reroll() { if (pendingRoll) executeRoll(pendingRoll.def, pendingRoll.entry) }

  // Attacks
  const attacks: OPAttack[] = (() => { try { return JSON.parse(watch("attacks") || "[]") } catch { return [] } })()
  function setAttacks(next: OPAttack[]) { setValue("attacks", JSON.stringify(next)) }

  // Habilidades
  const habilidades = parseHabilidades(watch("habilidades") || "[]")
  function setHabilidades(next: OPHabilidade[]) { setValue("habilidades", JSON.stringify(next)) }

  // Rituais
  const rituais: OPRitual[] = (() => { try { return JSON.parse(watch("rituals") || "[]") } catch { return [] } })()
  function setRituais(next: OPRitual[]) { setValue("rituals", JSON.stringify(next)) }

  // Regras opcionais SaH
  const sahMode    = watch("sobrevivendoMode")  === "true"
  const nexExpMode = watch("nexExperienceMode") === "true"

  // Auto-stats (calcOPStats)
  const computed = calcOPStats({
    nex:         watch("nex")  || "5",
    nivel:       nexExpMode ? (watch("nivel") || "1") : undefined,
    semSanidade: sahMode,
    class:       watch("class") || "",
    str:         watch("str")   || "1",
    dex:         watch("dex")   || "1",
    int:         watch("int")   || "1",
    pres:        watch("pres")  || "1",
    vig:         watch("vig")   || "1",
  })

  // Origem
  const originData = ORDEM_PARANORMAL_ORIGINS.find(
    (o) => o.id === (watch("originId" as keyof OrdemParanormalData) as string)
       || o.name === watch("origin")
  )

  // Inventário (parsed early — used by defense detection below)
  const inventoryItems: InventoryItem[] = (() => { try { return JSON.parse(watch("inventoryItems") || "[]") } catch { return [] } })()

  // Defesa — auto-detectada do inventário
  const dex = num("dex")
  const invShopItems = inventoryItems.map((i) => ITEM_LOOKUP.get(i.itemId)).filter((s): s is ShopItem => !!s)
  const bodyArmors   = invShopItems.filter((s) => s.category === "protecao" && !s.properties?.includes("empunhado (1 mão)"))
  const escudoItem   = invShopItems.find((s) => s.category === "protecao" && s.properties?.includes("empunhado (1 mão)"))
  const reforçadaItem = invShopItems.find((s) => s.category === "modificacao-protecao" && s.id.includes("reforcada"))
  const bestArmor    = bodyArmors.slice().sort((a, b) => (b.defense ?? 0) - (a.defense ?? 0))[0]
  const protecaoEquip = !bestArmor ? "none" : (bestArmor.defense ?? 0) >= 10 ? "pesada" : "leve"
  const escudoOn      = !!escudoItem
  const reforçadaOn   = !!reforçadaItem
  const protecaoBonus    = protecaoEquip === "leve" ? 5 : protecaoEquip === "pesada" ? 10 : 0
  const escudoBonus      = escudoOn ? 2 : 0
  const reforçadaBonus   = protecaoEquip !== "none" && reforçadaOn ? 2 : 0
  const defesaEquipTotal = protecaoBonus + escudoBonus + reforçadaBonus
  const defesaOutros     = num("defesaOutros")
  const defesaCalc       = 10 + dex + defesaEquipTotal + defesaOutros
  const esquiva          = 10 + dex
  const bloqueioAutoRD   = protecaoEquip === "pesada" ? 5 : (protecaoEquip === "leve" || escudoOn) ? 2 : 0
  const bloqueioOverride = watch("bloqueio") || ""
  const bloqueioDisplay  = bloqueioOverride !== "" ? (parseInt(bloqueioOverride) || 0) : bloqueioAutoRD
  // Label descritiva do que foi detectado
  const protecaoLabel = [
    bestArmor ? bestArmor.name : null,
    escudoItem ? escudoItem.name : null,
    reforçadaItem ? "Reforçada" : null,
  ].filter(Boolean).join(" + ") || "Sem proteção"

  // SaH — showSahModal (sahMode e nexExpMode já definidos acima)
  const [showSahModal, setShowSahModal] = useState(false)

  // Patente
  const ppValue = num("pp")
  const derivedPatente = getPatenteForPP(ppValue)

  // Inventário
  const strValue = num("str")
  const carryLimit = computed.carga
  const slotsUsed = inventoryItems.reduce((acc, i) => acc + (i.slots ?? 1), 0)
  const overloaded = slotsUsed > carryLimit

  // Deslocamento
  const deslocamento = parseInt(watch("deslocamento") || "9") || 9
  const squares = Math.round(deslocamento / 1.5)

  // Portrait
  const portrait = watch("portrait") || ""
  const portraitInputRef = useRef<HTMLInputElement>(null)

  function handlePortraitFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setValue("portrait", reader.result as string) }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* Dice roll modal */}
      <DiceRollModal result={rollResult} onReroll={reroll} onClose={() => setRollResult(null)} />

      {/* Hidden file input for portrait upload */}
      <input ref={portraitInputRef} type="file" accept="image/*" className="hidden" onChange={handlePortraitFile} />

      {/* ── Identity bar (full width, above grid) ── */}
      <div className="flex items-center gap-4 mb-4 rounded-lg border border-border/20 bg-background/20 px-4 py-3">
        {/* Portrait */}
        <button
          type="button"
          onClick={() => !readOnly && portraitInputRef.current?.click()}
          title={readOnly ? undefined : "Clique para alterar foto"}
          className={`shrink-0 relative group overflow-hidden rounded-lg border border-border/30 w-14 h-14 ${!readOnly ? "cursor-pointer" : ""}`}
        >
          {portrait ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={portrait} alt="Retrato" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-background/40 flex items-center justify-center text-foreground/30">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          )}
          {!readOnly && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM9 2l-1.83 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm-1 2h8l1.83 2H20v12H4V6h2.17L8 4z"/></svg>
            </div>
          )}
        </button>

        {/* PERSONAGEM / ORIGEM */}
        <div className="flex flex-col gap-1.5 min-w-0" style={{ width: 220 }}>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold tracking-[0.2em] text-foreground/60 uppercase shrink-0 w-[72px]">PERSONAGEM</span>
            <span className="text-xs font-semibold text-foreground/85 truncate">{characterName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold tracking-[0.2em] text-foreground/60 uppercase shrink-0 w-[72px]">ORIGEM</span>
            <Input {...register("origin")} readOnly={readOnly} placeholder="Origem"
              className="h-5 text-xs flex-1 border-0 border-b border-border/20 rounded-none px-0 bg-transparent focus-visible:ring-0 min-w-0" />
          </div>
        </div>

        {/* JOGADOR / CLASSE */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold tracking-[0.2em] text-foreground/60 uppercase shrink-0 w-[52px]">JOGADOR</span>
            <Input {...register("playerName")} readOnly={readOnly} placeholder="Nome do jogador"
              className="h-5 text-xs flex-1 border-0 border-b border-border/20 rounded-none px-0 bg-transparent focus-visible:ring-0 min-w-0" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold tracking-[0.2em] text-foreground/60 uppercase shrink-0 w-[52px]">CLASSE</span>
            <Input {...register("class")} readOnly={readOnly} placeholder="Classe"
              className="h-5 text-xs flex-1 border-0 border-b border-border/20 rounded-none px-0 bg-transparent focus-visible:ring-0 min-w-0"
              list="op-classes-id-top" />
            <datalist id="op-classes-id-top">
              {ORDEM_PARANORMAL_CLASSES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>

        {/* Dinheiro — sempre visível */}
        <div className="shrink-0 ml-auto flex flex-col items-center gap-0.5">
          <div className="border border-border/40 rounded px-2.5 py-0.5 bg-background/30 flex items-center gap-1">
            <span className="text-xs text-foreground/35 font-mono select-none">$</span>
            {readOnly
              ? <span className="text-sm font-bold font-mono text-foreground">
                  {parseInt(watch("dinheiro") || "0").toLocaleString("pt-BR")}
                </span>
              : <Input {...register("dinheiro")} type="number" min={0}
                  className="w-20 h-6 text-sm font-bold font-mono text-center p-0 border-0 bg-transparent focus-visible:ring-0" />
            }
          </div>
          <span className="text-[9px] font-semibold tracking-[0.18em] text-primary/55 uppercase">DINHEIRO</span>
        </div>

        {/* Delete button */}
        {deleteButton && <div className="shrink-0">{deleteButton}</div>}
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_310px_1fr] gap-4 items-start">

        {/* ══ COLUNA ESQUERDA — recursos e atributos ══════════════════════════ */}
        <div className="space-y-3">

          {/* Atributos */}
          <AttributeCircle
            data={{ str: num("str"), dex: num("dex"), int: num("int"), pres: num("pres"), vig: num("vig") }}
            onChange={(key, v) => setValue(key, String(v))}
            readOnly={readOnly}
          />

          {/* Banner Sobrevivendo ao Horror */}
          <button type="button" onClick={() => setShowSahModal(true)}
            className="w-full rounded-lg overflow-hidden border border-border/20 hover:border-primary/20 transition-colors relative h-12">
            {/* Book cover image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/books/op-sobrevivendo-horror.png" alt="Sobrevivendo ao Horror"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <span className={`text-[9px] font-bold tracking-[0.2em] uppercase drop-shadow-sm ${sahMode ? "text-amber-300/80" : "text-white/40"}`}>
                SOBREVIVENDO AO HORROR{sahMode ? " ✓" : ""}
              </span>
            </div>
          </button>

          <OptionalRulesModal
            open={showSahModal} onClose={() => setShowSahModal(false)}
            nexExpActive={nexExpMode} semSanActive={sahMode}
            onToggleNexExp={(v) => setValue("nexExperienceMode", v ? "true" : "")}
            onToggleSemSan={(v) => setValue("sobrevivendoMode",  v ? "true" : "")}
          />

          {/* NEX / NVL / PD / Deslocamento */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* NEX */}
            <NexChip
              label="NEX"
              value={watch("nex") || "5"}
              suffix="%"
              options={["5","10","15","20","25","30","35","40","45","50","55","60","65","70","75","80","85","90","95","99"].map(v => ({ value: v, label: `${v}%` }))}
              readOnly={readOnly}
              onChange={v => setValue("nex", v)}
              chipCls="border-border/40 text-foreground"
            />

            {/* NVL — chip de Nível (modo NEX & Exp) */}
            {nexExpMode && (
              <NexChip
                label="NVL"
                value={watch("nivel") || "1"}
                suffix=""
                options={Array.from({ length: 20 }, (_, i) => String(i + 1)).map(v => ({ value: v, label: v }))}
                readOnly={readOnly}
                onChange={v => setValue("nivel", v)}
                chipCls="border-primary/40 bg-primary/10 text-primary"
              />
            )}

            {/* PD/TURNO — automático via NEX */}
            <div className="flex flex-col items-center">
              <div className="border border-border/40 rounded px-3 py-0.5 bg-background/30">
                <span className="text-sm font-bold font-mono text-foreground">{computed.pdTurno}</span>
              </div>
              <span className="text-[9px] font-semibold tracking-widest text-primary/60 uppercase mt-0.5">PD / TURNO</span>
            </div>

            {/* DESLOCAMENTO — padrão OP: 9m / 6q */}
            <div className="flex flex-col items-center">
              <div className="border border-border/40 rounded px-3 py-0.5 bg-background/30">
                <span className="text-sm font-bold font-mono text-foreground">9 m / 6 q</span>
              </div>
              <span className="text-[9px] font-semibold tracking-widest text-primary/60 uppercase mt-0.5">DESLOCAMENTO</span>
            </div>
          </div>

          {/* Auto-stats chips */}
          <div className="flex items-center gap-2 flex-wrap text-[9px] text-foreground/50">
            <span className="border border-border/30 rounded px-1.5 py-0.5 bg-background/20">
              <span className="text-foreground/40">Carga</span> <span className="font-bold text-foreground/65 font-mono">{computed.carga}</span>
            </span>
            <span className="border border-border/30 rounded px-1.5 py-0.5 bg-background/20">
              <span className="text-foreground/40">Def</span> <span className="font-bold text-foreground/65 font-mono">{computed.defesa}</span>
            </span>
            <span className="border border-border/30 rounded px-1.5 py-0.5 bg-background/20">
              <span className="text-foreground/40">Rituais</span> <span className="font-bold text-foreground/65 font-mono">máx {computed.ritualLimit}</span>
            </span>
          </div>

          {/* Poder da Origem */}
          {originData && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 space-y-1">
              <p className="text-[9px] font-bold tracking-[0.2em] text-primary/60 uppercase">
                ♦ Poder de Origem — {originData.name}
              </p>
              <p className="text-[10px] font-semibold text-primary/80">{originData.powerName}</p>
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed">{originData.powerDescription}</p>
            </div>
          )}

          {/* Trilhas */}
          <div className="space-y-4">
          <ResourceBar label="VIDA"
            icon={<Heart className="h-5 w-5" style={{ color: "#ff7070", filter: "drop-shadow(0 0 3px #ef4444)" }} />}
            current={num("hp")} max={computed.pvMax}
            color="#ef4444" colorLight="#ff8080" colorDark="#8b1010"
            readOnly={readOnly} onCurrentChange={set("hp")} onMaxChange={set("hpMax")} />
          {sahMode ? (
            <ResourceBar label="DETERMINAÇÃO"
              icon={<Brain className="h-5 w-5" style={{ color: "#67e8f9", filter: "drop-shadow(0 0 3px #06b6d4)" }} />}
              current={num("determinacao") || num("sanity")}
              max={num("determinacaoMax") || computed.pdMax}
              color="#06b6d4" colorLight="#a5f3fc" colorDark="#0e7490"
              readOnly={readOnly}
              onCurrentChange={set("determinacao")}
              onMaxChange={set("determinacaoMax")} />
          ) : (
            <>
              <ResourceBar label="SANIDADE"
                icon={<Brain className="h-5 w-5" style={{ color: "#c084fc", filter: "drop-shadow(0 0 3px #7c3aed)" }} />}
                current={num("sanity")} max={computed.sanMax}
                color="#7c3aed" colorLight="#e879f9" colorDark="#6b21a8"
                readOnly={readOnly} onCurrentChange={set("sanity")} onMaxChange={set("sanityMax")} />
              <ResourceBar label="ESFORÇO"
                icon={<Zap className="h-5 w-5" style={{ color: "#93c5fd", filter: "drop-shadow(0 0 3px #3b82f6)" }} />}
                current={num("pe")} max={computed.peMax}
                color="#3b82f6" colorLight="#93c5fd" colorDark="#1e3a8a"
                readOnly={readOnly} onCurrentChange={set("pe")} onMaxChange={set("peMax")} />
            </>
          )}
          </div>

          {/* Defesa */}
          <DefenseSection
            defesa={defesaCalc}
            esquiva={esquiva}
            bloqueioDisplay={bloqueioDisplay}
            bloqueioIsOverride={bloqueioOverride !== ""}
            outros={defesaOutros}
            protecaoLabel={protecaoLabel}
            readOnly={readOnly}
            onOutros={set("defesaOutros")}
            onBloqueioOverride={(v) => setValue("bloqueio", v === null ? "" : String(v))}
          />

          {/* Proteção / Resistências / Proficiências */}
          <div className="space-y-1">
            {(["protecao", "resistencias", "proficiencias"] as const).map((field) => {
              const labels: Record<string, string> = { protecao: "PROTEÇÃO", resistencias: "RESISTÊNCIAS", proficiencias: "PROFICIÊNCIAS" }
              return (
                <div key={field} className="flex items-center gap-2 border-b border-border/10 pb-1">
                  <span className="text-[8px] font-bold tracking-widest text-foreground/60 uppercase w-20 shrink-0">{labels[field]}</span>
                  <Input {...register(field)} readOnly={readOnly} placeholder="—"
                    className="h-5 text-xs border-0 rounded-none px-0 bg-transparent focus-visible:ring-0 flex-1" />
                </div>
              )
            })}
          </div>

          {/* Condições */}
          <ActiveConditionsPanel conditionsJson={watch("conditions")} />

        </div>

        {/* ══ COLUNA CENTRAL — perícias ══════════════════════════════════════ */}
        <div className="border-x border-border/15 px-3">
          <SkillsTable
            skillsMap={skillsMap}
            attrValues={{ str: num("str"), dex: num("dex"), int: num("int"), pres: num("pres"), vig: num("vig") }}
            onUpdate={updateSkill}
            onRoll={rollSkill}
            readOnly={readOnly}
          />
        </div>

        {/* ══ COLUNA DIREITA — meta + tabs ═══════════════════════════════════ */}
        <div className="space-y-3">
          {/* Status de auto-save */}
          {!readOnly && (
            <div className="flex justify-end h-5">
              {saveStatus === "saving" && (
                <span className="text-[10px] text-foreground/35 flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/30" />
                  salvando…
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="text-[10px] text-primary/50 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  salvo
                </span>
              )}
            </div>
          )}

          {/* Tabs principais */}
          <Tabs defaultValue="habilidades" className="w-full">
            <TabsList className="w-full grid grid-cols-5 h-8">
              <TabsTrigger value="combate" className="text-[10px]">COMBATE</TabsTrigger>
              <TabsTrigger value="habilidades" className="text-[10px]">HABILIDADES</TabsTrigger>
              <TabsTrigger value="rituais" className="text-[10px]">RITUAIS</TabsTrigger>
              <TabsTrigger value="inventario" className="text-[10px]">INVENTÁRIO</TabsTrigger>
              <TabsTrigger value="descricao" className="text-[10px]">DESCRIÇÃO</TabsTrigger>
            </TabsList>

            <TabsContent value="combate" className="pt-3">
              <CombateTab attacks={attacks} onAttacksChange={setAttacks} readOnly={readOnly} />
            </TabsContent>

            <TabsContent value="habilidades" className="pt-3">
              <HabilidadesTab habilidades={habilidades} onUpdate={setHabilidades} readOnly={readOnly} />
            </TabsContent>

            <TabsContent value="rituais" className="pt-3">
              <RituaisTab rituais={rituais} onUpdate={setRituais} readOnly={readOnly} />
            </TabsContent>

            <TabsContent value="inventario">
              <InventarioTab
                inventoryItems={inventoryItems}
                onAdd={(shopItem) => {
                  const newItem: InventoryItem = {
                    itemId: shopItem.id,
                    itemName: shopItem.name,
                    price: shopItem.price,
                    category: shopItem.category,
                    rankCategory: shopItem.rankCategory,
                    icon: shopItem.icon,
                    slots: shopItem.slots,
                  }
                  setValue("inventoryItems", JSON.stringify([...inventoryItems, newItem]))
                }}
                onRemove={(idx) => {
                  const updated = inventoryItems.filter((_, i) => i !== idx)
                  setValue("inventoryItems", JSON.stringify(updated))
                }}
                onUpdateItem={(idx, patch) => {
                  const updated = inventoryItems.map((it, i) => i === idx ? { ...it, ...patch } : it)
                  setValue("inventoryItems", JSON.stringify(updated))
                }}
                onSetPP={(pp) => setValue("pp", String(pp))}
                slotsUsed={slotsUsed}
                carryLimit={carryLimit}
                derivedPatente={derivedPatente}
                ppValue={ppValue}
                readOnly={readOnly ?? false}
              />
            </TabsContent>

            <TabsContent value="descricao" className="pt-5">
              <div className="space-y-6">
                {(
                  [
                    { field: "notes",       label: "Anotações",     icon: Activity, placeholder: "Anotações pessoais do agente...",                                                                  rows: 4 },
                    { field: "appearance",  label: "Aparência",     icon: Eye,      placeholder: "Nome, gênero, idade, descrição física...",                                                         rows: 4 },
                    { field: "personality", label: "Personalidade", icon: Brain,    placeholder: "Traços marcantes, opiniões, ideais...",                                                            rows: 4 },
                    { field: "history",     label: "Histórico",     icon: Heart,    placeholder: "Infância, relação com a família, contato com o Paranormal, eventos bons e ruins...",               rows: 5 },
                    { field: "objective",   label: "Objetivo",      icon: Zap,      placeholder: "Por que ele faz parte da Ordem? Porque luta contra o Outro Lado?",                                rows: 4 },
                  ] as Array<{ field: "notes"|"appearance"|"personality"|"history"|"objective"; label: string; icon: React.ElementType; placeholder: string; rows: number }>
                ).map(({ field, label, icon: Icon, placeholder, rows }, i) => (
                  <div key={field} className="space-y-2">
                    {/* Section header */}
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[9px] text-primary/30 select-none tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon className="w-3 h-3 text-primary/50 shrink-0" />
                      <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-foreground/55">
                        {label}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-border/25 to-transparent" />
                    </div>

                    {/* Textarea */}
                    <Textarea
                      {...register(field)}
                      readOnly={readOnly}
                      placeholder={placeholder}
                      style={{ minHeight: `${rows * 1.7}rem` }}
                      className={[
                        "resize-none text-[13px] leading-[1.75] px-4 py-3 rounded-xl",
                        "bg-background/12 border border-border/8",
                        "placeholder:text-foreground/18 text-foreground/80",
                        "transition-all duration-200",
                        "focus:bg-background/22 focus:border-primary/22",
                        "focus:shadow-[0_0_0_3px_rgba(139,92,246,0.07),inset_0_1px_0_rgba(255,255,255,0.03)]",
                        readOnly ? "cursor-default" : "",
                      ].join(" ")}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </form>
  )
}
