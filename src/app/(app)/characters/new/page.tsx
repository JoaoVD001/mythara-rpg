"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ChevronDown, ChevronUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ORDEM_PARANORMAL_BOOKS,
  ORDEM_PARANORMAL_CLASSES_DATA,
  defaultOrdemParanormalData,
  type OPOrigin,
  type OPClass,
} from "@/lib/systems"

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Step = "attributes" | "origin" | "class" | "final"

const STEPS: { key: Step; label: string }[] = [
  { key: "attributes", label: "Atributos" },
  { key: "origin", label: "Origem" },
  { key: "class", label: "Classe" },
  { key: "final", label: "Toques Finais" },
]

type Attrs = { str: number; dex: number; int: number; pres: number; vig: number }

const ATTR_LABELS: { key: keyof Attrs; label: string; full: string }[] = [
  { key: "str",  label: "FOR", full: "Força" },
  { key: "dex",  label: "AGI", full: "Agilidade" },
  { key: "int",  label: "INT", full: "Intelecto" },
  { key: "pres", label: "PRE", full: "Presença" },
  { key: "vig",  label: "VIG", full: "Vigor" },
]

// ─── Cabeçalho de etapas ─────────────────────────────────────────────────────

function StepHeader({ current, onNavigate }: { current: Step; onNavigate: (s: Step) => void }) {
  const idx = STEPS.findIndex((s) => s.key === current)
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center">
          <button
            type="button"
            onClick={() => onNavigate(step.key)}
            className="flex flex-col items-center gap-1"
          >
            <span
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                i === idx
                  ? "text-primary"
                  : i < idx
                  ? "text-foreground/50"
                  : "text-foreground/30"
              }`}
            >
              {step.label}
            </span>
          </button>
          {i < STEPS.length - 1 && (
            <div className={`w-16 sm:w-24 h-px mx-3 ${i < idx ? "bg-primary/40" : "bg-border/40"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Step 1: Atributos ───────────────────────────────────────────────────────

function StepAttributes({ attrs, onChange }: { attrs: Attrs; onChange: (a: Attrs) => void }) {
  const BASE = 1
  const POINTS_TOTAL = 4
  const MAX_ATTR = 3
  const MIN_ATTR = 0

  const spent = Object.values(attrs).reduce((acc, v) => acc + (v - BASE), 0)
  const remaining = POINTS_TOTAL - spent

  function adjust(key: keyof Attrs, delta: number) {
    const next = attrs[key] + delta
    if (next < MIN_ATTR || next > MAX_ATTR) return
    if (delta > 0 && remaining <= 0) return
    onChange({ ...attrs, [key]: next })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
          Quando você cria um personagem, todos os seus atributos começam em{" "}
          <strong className="text-foreground">1</strong> e você recebe{" "}
          <strong className="text-foreground">4 pontos</strong> para distribuir entre eles como
          quiser. Você também pode reduzir um atributo para{" "}
          <strong className="text-foreground">0</strong> para receber 1 ponto adicional. O valor
          máximo inicial é <strong className="text-foreground">3</strong>.
        </p>
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border ${
            remaining === 0
              ? "bg-primary/10 border-primary/40 text-primary"
              : remaining < 0
              ? "bg-destructive/10 border-destructive/40 text-destructive"
              : "bg-muted/40 border-border/50 text-foreground"
          }`}
        >
          Pontos restantes: {remaining}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {ATTR_LABELS.map(({ key, label, full }) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">{full}</span>
            <div className="relative flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-border/50 bg-card/60">
              <span className="text-2xl font-bold tabular-nums">{attrs[key]}</span>
              <span className="text-[9px] tracking-widest text-muted-foreground uppercase">{label}</span>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => adjust(key, -1)}
                disabled={attrs[key] <= MIN_ATTR}
                className="w-7 h-7 rounded border border-border/60 bg-muted/40 hover:bg-muted/80 disabled:opacity-30 text-sm flex items-center justify-center"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => adjust(key, 1)}
                disabled={attrs[key] >= MAX_ATTR || remaining <= 0}
                className="w-7 h-7 rounded border border-border/60 bg-muted/40 hover:bg-muted/80 disabled:opacity-30 text-sm flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Step 2: Origem ──────────────────────────────────────────────────────────

function OriginCard({
  origin,
  selected,
  onSelect,
}: {
  origin: OPOrigin
  selected: boolean
  onSelect: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-colors ${
        selected ? "border-primary/60 bg-primary/5" : "border-border/50 bg-card/40"
      }`}
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
          <span className="font-semibold text-sm">{origin.name}</span>
          {origin.grantedSkills.length > 0 && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              {origin.grantedSkills.join(", ")}
              {origin.chooseSkillFrom && origin.chooseSkillFrom.length > 0 && " + 1 à escolha"}
            </span>
          )}
        </button>
        <Button
          type="button"
          size="sm"
          variant={selected ? "default" : "outline"}
          className="shrink-0 h-7 text-xs"
          onClick={onSelect}
        >
          {selected ? <><Check className="h-3 w-3 mr-1" />Escolhida</> : "Escolher"}
        </Button>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-border/30 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{origin.description}</p>

          {origin.grantedSkills.length > 0 && (
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">
                Perícias concedidas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {origin.grantedSkills.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary">
                    {s}
                  </span>
                ))}
                {origin.chooseSkillFrom && origin.chooseSkillFrom.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 border border-border/40 text-muted-foreground">
                    + 1 de: {origin.chooseSkillFrom.join(", ")}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="border border-border/40 rounded-lg p-3 bg-background/30">
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-1">
              ♦ {origin.powerName}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{origin.powerDescription}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function StepOrigin({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const [activeBookId, setActiveBookId] = useState(ORDEM_PARANORMAL_BOOKS[0].id)
  const [search, setSearch] = useState("")

  const activeBook = ORDEM_PARANORMAL_BOOKS.find((b) => b.id === activeBookId)!
  const filtered = activeBook.origins.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        O que seu personagem fazia antes de se envolver com o paranormal?{" "}
        <strong className="text-foreground">
          Ao escolher uma origem, você recebe perícias treinadas e um poder da origem.
        </strong>
      </p>

      {/* Seletor de livros */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
          Fonte
        </p>
        <div className="flex gap-4 flex-wrap">
          {ORDEM_PARANORMAL_BOOKS.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => { setActiveBookId(book.id); setSearch("") }}
              style={{ width: 120, height: 160, flexShrink: 0 }}
              className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                activeBookId === book.id
                  ? "border-primary shadow-[0_0_16px_rgba(22,163,74,0.4)] scale-105"
                  : "border-border/40 opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.coverImage}
                alt={book.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              {activeBookId === book.id && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Conteúdo oficial de Ordem Paranormal.{" "}
          <span className="text-primary/70">{activeBook.origins.length} origens disponíveis</span>
        </p>
      </div>

      {/* Busca */}
      <div className="relative">
        <Input
          placeholder="Buscar origem..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Lista de origens */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhuma origem encontrada.</p>
        ) : (
          filtered.map((origin) => (
            <OriginCard
              key={origin.id}
              origin={origin}
              selected={selected === origin.id}
              onSelect={() => onSelect(origin.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Step 3: Classe ──────────────────────────────────────────────────────────

function StepClass({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ORDEM_PARANORMAL_CLASSES_DATA.map((cls) => (
          <ClassCard key={cls.id} cls={cls} selected={selected === cls.id} onSelect={() => onSelect(cls.id)} />
        ))}
      </div>
    </div>
  )
}

function ClassCard({ cls, selected, onSelect }: { cls: OPClass; selected: boolean; onSelect: () => void }) {
  return (
    <div
      className={`flex flex-col border rounded-lg overflow-hidden transition-all ${
        selected ? "border-primary/60 bg-primary/5 shadow-[0_0_20px_rgba(22,163,74,0.08)]" : "border-border/50 bg-card/40"
      }`}
    >
      <div className={`px-4 py-3 border-b ${selected ? "border-primary/30 bg-primary/10" : "border-border/30 bg-card/60"}`}>
        <h3 className="font-bold text-lg">{cls.name}</h3>
        <p className="text-xs text-primary mt-0.5">{cls.role}</p>
      </div>
      <div className="p-4 flex-1">
        {cls.description.split("\n\n").map((p, i) => (
          <p key={i} className={`text-sm text-muted-foreground leading-relaxed ${i > 0 ? "mt-3" : ""}`}>
            {p}
          </p>
        ))}
      </div>
      <div className="p-4 pt-0">
        <Button
          type="button"
          onClick={onSelect}
          variant={selected ? "default" : "outline"}
          className="w-full"
        >
          {selected ? <><Check className="h-4 w-4 mr-2" />Escolhida</> : "Escolher"}
        </Button>
      </div>
    </div>
  )
}

// ─── Step 4: Toques Finais ───────────────────────────────────────────────────

type FinalData = {
  characterName: string
  playerName: string
  age: string
  appearance: string
  personality: string
  history: string
}

function StepFinal({ data, onChange }: { data: FinalData; onChange: (d: FinalData) => void }) {
  function set(field: keyof FinalData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...data, [field]: e.target.value })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Até aqui, você definiu as características mecânicas de sua ficha — mas um bom personagem é
        mais do que apenas números. Agora, vamos trabalhar na descrição de seu agente.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs tracking-widest uppercase text-muted-foreground">Personagem</Label>
          <Input value={data.characterName} onChange={set("characterName")} placeholder="Nome do personagem" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs tracking-widest uppercase text-muted-foreground">Jogador</Label>
          <Input value={data.playerName} onChange={set("playerName")} placeholder="Nome do jogador" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs tracking-widest uppercase text-muted-foreground">Idade</Label>
        <Input value={data.age} onChange={set("age")} placeholder="Ex: 28" className="max-w-[120px]" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs tracking-widest uppercase text-muted-foreground">Aparência</Label>
        <Textarea
          value={data.appearance}
          onChange={set("appearance")}
          placeholder="Nome, gênero, idade, descrição física..."
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs tracking-widest uppercase text-muted-foreground">Personalidade</Label>
        <Textarea
          value={data.personality}
          onChange={set("personality")}
          placeholder="Traços marcantes, opiniões, ideais..."
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs tracking-widest uppercase text-muted-foreground">Histórico</Label>
        <Textarea
          value={data.history}
          onChange={set("history")}
          placeholder="Infância, relação com a família, contato com o Paranormal, eventos bons e ruins..."
          rows={4}
        />
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function NewCharacterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("attributes")
  const [loading, setLoading] = useState(false)

  const [attrs, setAttrs] = useState<Attrs>({ str: 1, dex: 1, int: 1, pres: 1, vig: 1 })
  const [originId, setOriginId] = useState("")
  const [classId, setClassId] = useState("")
  const [finalData, setFinalData] = useState<FinalData>({
    characterName: "",
    playerName: "",
    age: "",
    appearance: "",
    personality: "",
    history: "",
  })

  const stepIdx = STEPS.findIndex((s) => s.key === step)

  function canAdvance() {
    if (step === "attributes") {
      const spent = Object.values(attrs).reduce((acc, v) => acc + (v - 1), 0)
      return spent <= 4
    }
    if (step === "origin") return originId !== ""
    if (step === "class") return classId !== ""
    if (step === "final") return finalData.characterName.trim() !== ""
    return true
  }

  function advance() {
    if (stepIdx < STEPS.length - 1) setStep(STEPS[stepIdx + 1].key)
  }

  function back() {
    if (stepIdx > 0) setStep(STEPS[stepIdx - 1].key)
  }

  async function finalize() {
    if (!finalData.characterName.trim()) {
      toast.error("Informe o nome do personagem")
      return
    }

    const origin = ORDEM_PARANORMAL_BOOKS.flatMap((b) => b.origins).find((o) => o.id === originId)
    const cls = ORDEM_PARANORMAL_CLASSES_DATA.find((c) => c.id === classId)

    const baseData = defaultOrdemParanormalData()
    const characterData = {
      ...baseData,
      playerName: finalData.playerName,
      age: finalData.age,
      origin: origin?.name ?? "",
      class: cls?.name ?? "",
      str: String(attrs.str),
      dex: String(attrs.dex),
      int: String(attrs.int),
      pres: String(attrs.pres),
      vig: String(attrs.vig),
      notes: [
        finalData.appearance && `**Aparência:** ${finalData.appearance}`,
        finalData.personality && `**Personalidade:** ${finalData.personality}`,
        finalData.history && `**Histórico:** ${finalData.history}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
      skills: origin
        ? JSON.stringify(Object.fromEntries(origin.grantedSkills.map((s) => [s, true])))
        : JSON.stringify({}),
    }

    setLoading(true)
    const res = await fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: finalData.characterName,
        system: "ordem-paranormal",
        data: characterData,
      }),
    })
    setLoading(false)

    if (!res.ok) {
      const body = await res.json()
      toast.error(body.error || "Erro ao criar ficha")
      return
    }

    const character = await res.json()
    toast.success("Ficha criada!")
    router.push(`/characters/${character.id}`)
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <StepHeader current={step} onNavigate={setStep} />

      <div className="min-h-[400px]">
        {step === "attributes" && <StepAttributes attrs={attrs} onChange={setAttrs} />}
        {step === "origin"     && <StepOrigin selected={originId} onSelect={setOriginId} />}
        {step === "class"      && <StepClass selected={classId} onSelect={setClassId} />}
        {step === "final"      && <StepFinal data={finalData} onChange={setFinalData} />}
      </div>

      <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/40">
        <Button variant="outline" onClick={back} disabled={stepIdx === 0}>
          Anterior
        </Button>

        {step !== "final" ? (
          <Button onClick={advance} disabled={!canAdvance()}>
            Próximo
          </Button>
        ) : (
          <Button onClick={finalize} disabled={loading || !canAdvance()}>
            {loading ? "Criando..." : "Finalizar"}
          </Button>
        )}
      </div>
    </div>
  )
}
