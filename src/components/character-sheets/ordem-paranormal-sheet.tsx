"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrdemParanormalData, ORDEM_PARANORMAL_SKILLS, ORDEM_PARANORMAL_CLASSES } from "@/lib/systems"

type Props = {
  characterId: string
  characterName: string
  initialData: OrdemParanormalData
  readOnly?: boolean
}

// ─── Panel com cabeçalho gótico ─────────────────────────────────────────────
function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col border border-border/50 rounded-lg overflow-hidden bg-card/40 backdrop-blur-sm ${className}`}>
      <div className="relative flex items-center justify-center py-2 px-4 bg-card/60 border-b border-border/50">
        <span className="text-primary/60 text-xs mr-2">♦</span>
        <h2 className="font-[family-name:var(--font-cinzel-decorative)] text-xs font-bold tracking-[0.2em] text-foreground/90 uppercase">
          {title}
        </h2>
        <span className="text-primary/60 text-xs ml-2">♦</span>
      </div>
      <div className="p-3 flex-1">{children}</div>
    </div>
  )
}

// ─── Controle de +/- ────────────────────────────────────────────────────────
function Stepper({
  value,
  onChange,
  min = 0,
  max = 999,
  readOnly = false,
  size = "md",
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  readOnly?: boolean
  size?: "sm" | "md" | "lg"
}) {
  const btnCls = size === "lg"
    ? "w-7 h-7 text-base"
    : size === "sm"
    ? "w-5 h-5 text-xs"
    : "w-6 h-6 text-sm"
  const valCls = size === "lg"
    ? "w-10 text-xl font-bold"
    : size === "sm"
    ? "w-6 text-xs font-semibold"
    : "w-8 text-sm font-bold"

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={readOnly || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`${btnCls} rounded border border-border/60 bg-muted/40 hover:bg-muted/80 disabled:opacity-30 transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground`}
      >
        −
      </button>
      <span className={`${valCls} text-center tabular-nums`}>{value}</span>
      <button
        type="button"
        disabled={readOnly || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`${btnCls} rounded border border-border/60 bg-muted/40 hover:bg-muted/80 disabled:opacity-30 transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground`}
      >
        +
      </button>
    </div>
  )
}

// ─── Trilha de dano (PV / Sanidade / PE) ────────────────────────────────────
function TrailCard({
  label,
  icon,
  current,
  max,
  onCurrentChange,
  onMaxChange,
  color,
  readOnly,
}: {
  label: string
  icon: string
  current: number
  max: number
  onCurrentChange: (v: number) => void
  onMaxChange: (v: number) => void
  color: string
  readOnly: boolean
}) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0

  return (
    <div className="border border-border/40 rounded-lg p-3 space-y-2 bg-background/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>máx</span>
          <input
            type="number"
            value={max}
            readOnly={readOnly}
            onChange={(e) => onMaxChange(Number(e.target.value))}
            className="w-10 h-5 text-center text-xs bg-muted/40 border border-border/50 rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>

      <div className="flex items-center justify-between">
        <Stepper value={current} onChange={onCurrentChange} min={0} max={max} readOnly={readOnly} size="lg" />
        <span className="text-xs text-muted-foreground tabular-nums">
          {current} / {max}
        </span>
      </div>
    </div>
  )
}

// ─── Atributo com stepper ────────────────────────────────────────────────────
function AttrBox({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  readOnly: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </span>
      <div className="border border-border/50 rounded-lg p-1.5 bg-background/40">
        <Stepper value={value} onChange={onChange} min={0} max={5} readOnly={readOnly} size="sm" />
      </div>
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────
export function OrdemParanormalSheet({ characterId, characterName, initialData, readOnly = false }: Props) {
  const { register, handleSubmit, watch, setValue, reset } = useForm<OrdemParanormalData>({
    defaultValues: initialData,
  })

  useEffect(() => { reset(initialData) }, [initialData, reset])

  // Helpers para campos numéricos
  const num = (field: keyof OrdemParanormalData) => Number(watch(field) || 0)
  const set = (field: keyof OrdemParanormalData) => (v: number) => setValue(field, String(v))

  // Perícias
  const skillsRaw = watch("skills")
  const skills: Record<string, boolean> = (() => {
    try { return JSON.parse(skillsRaw || "{}") } catch { return {} }
  })()
  function toggleSkill(skill: string) {
    if (readOnly) return
    setValue("skills", JSON.stringify({ ...skills, [skill]: !skills[skill] }))
  }

  async function onSave(data: OrdemParanormalData) {
    const res = await fetch(`/api/characters/${characterId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: characterName, data }),
    })
    if (res.ok) toast.success("Ficha salva!")
    else toast.error("Erro ao salvar")
  }

  return (
    <form onSubmit={handleSubmit(onSave)}>
      {/* Layout: 3 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-3">

        {/* ── COLUNA ESQUERDA ─── */}
        <div className="flex flex-col gap-3">
          <Panel title="Minha Persona">
            <div className="space-y-3">
              {/* Avatar placeholder */}
              <div className="flex justify-center mb-3">
                <div className="w-20 h-20 rounded-full border-2 border-primary/40 bg-primary/5 flex items-center justify-center text-primary/30">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">Jogador</Label>
                <Input {...register("playerName")} readOnly={readOnly} placeholder="Nome do jogador" className="h-7 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">Idade</Label>
                  <Input {...register("age")} readOnly={readOnly} placeholder="28" className="h-7 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">NEX (%)</Label>
                  <Input {...register("nex")} readOnly={readOnly} type="number" min={5} max={99} className="h-7 text-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">Origem</Label>
                <Input {...register("origin")} readOnly={readOnly} placeholder="Ex: Acadêmico" className="h-7 text-sm" />
              </div>
            </div>
          </Panel>

          <Panel title="Classe & Subclasse">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">Classe</Label>
                <Input
                  {...register("class")}
                  readOnly={readOnly}
                  placeholder={ORDEM_PARANORMAL_CLASSES.join(" / ")}
                  list="op-classes"
                  className="h-7 text-sm"
                />
                <datalist id="op-classes">
                  {ORDEM_PARANORMAL_CLASSES.map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] tracking-widest uppercase text-muted-foreground">Subclasse / Trilha</Label>
                <Input {...register("subclass")} readOnly={readOnly} placeholder="Subclasse" className="h-7 text-sm" />
              </div>
            </div>
          </Panel>

          <Panel title="Perícias" className="flex-1">
            <div className="flex flex-wrap gap-1.5">
              {ORDEM_PARANORMAL_SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`text-[10px] tracking-wide px-2 py-0.5 rounded border transition-colors ${
                    skills[skill]
                      ? "bg-primary/20 border-primary/60 text-primary font-semibold"
                      : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </Panel>
        </div>

        {/* ── COLUNA CENTRAL ─── */}
        <div className="flex flex-col gap-3">
          <Panel title="Trilhas de Dano">
            <div className="space-y-3">
              <TrailCard
                label="Pontos de Vida"
                icon="❤"
                current={num("hp")}
                max={num("hpMax")}
                onCurrentChange={set("hp")}
                onMaxChange={set("hpMax")}
                color="#dc2626"
                readOnly={readOnly}
              />
              <TrailCard
                label="Sanidade"
                icon="🧠"
                current={num("sanity")}
                max={num("sanityMax")}
                onCurrentChange={set("sanity")}
                onMaxChange={set("sanityMax")}
                color="#7c3aed"
                readOnly={readOnly}
              />
              <TrailCard
                label="Esforço"
                icon="⚡"
                current={num("pe")}
                max={num("peMax")}
                onCurrentChange={set("pe")}
                onMaxChange={set("peMax")}
                color="#d97706"
                readOnly={readOnly}
              />
            </div>
          </Panel>

          <Panel title="Atributos">
            <div className="grid grid-cols-5 gap-2 justify-items-center py-2">
              <AttrBox label="FOR" value={num("str")} onChange={set("str")} readOnly={readOnly} />
              <AttrBox label="AGI" value={num("dex")} onChange={set("dex")} readOnly={readOnly} />
              <AttrBox label="INT" value={num("int")} onChange={set("int")} readOnly={readOnly} />
              <AttrBox label="PRE" value={num("pres")} onChange={set("pres")} readOnly={readOnly} />
              <AttrBox label="VIG" value={num("vig")} onChange={set("vig")} readOnly={readOnly} />
            </div>
          </Panel>
        </div>

        {/* ── COLUNA DIREITA ─── */}
        <div className="flex flex-col gap-3">
          <Panel title="Anotações" className="flex-1">
            <Tabs defaultValue="inventory" className="h-full flex flex-col">
              <TabsList className="w-full grid grid-cols-3 h-7 mb-3">
                <TabsTrigger value="inventory" className="text-[10px] tracking-wide">Inventário</TabsTrigger>
                <TabsTrigger value="rituals" className="text-[10px] tracking-wide">Rituais</TabsTrigger>
                <TabsTrigger value="notes" className="text-[10px] tracking-wide">Notas</TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="flex-1 mt-0">
                <Textarea
                  {...register("inventory")}
                  readOnly={readOnly}
                  placeholder="Itens carregados..."
                  className="h-full min-h-[200px] text-sm resize-none"
                />
              </TabsContent>

              <TabsContent value="rituals" className="flex-1 mt-0">
                <Textarea
                  {...register("rituals")}
                  readOnly={readOnly}
                  placeholder="Liste seus rituais..."
                  className="h-full min-h-[200px] text-sm resize-none"
                />
              </TabsContent>

              <TabsContent value="notes" className="flex-1 mt-0">
                <Textarea
                  {...register("notes")}
                  readOnly={readOnly}
                  placeholder="Anotações gerais..."
                  className="h-full min-h-[200px] text-sm resize-none"
                />
              </TabsContent>
            </Tabs>
          </Panel>
        </div>
      </div>

      {!readOnly && (
        <div className="mt-4 flex justify-end">
          <Button type="submit" className="px-8">
            Salvar Ficha
          </Button>
        </div>
      )}
    </form>
  )
}
