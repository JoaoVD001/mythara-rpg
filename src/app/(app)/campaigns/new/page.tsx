"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ImagePlus, X, Loader2, Sword, ShieldCheck,
  Package, Coins, ChevronRight, BookOpen, Dices
} from "lucide-react"
import { SYSTEMS, SYSTEM_LABELS } from "@/lib/systems"
import Link from "next/link"

// ─── Dados dos sistemas com ícone e cor ──────────────────────────────────────

const SYSTEM_META: Record<string, { icon: React.ReactNode; color: string; desc: string }> = {
  "ordem-paranormal": {
    icon: <ShieldCheck className="h-5 w-5" />,
    color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    desc: "RPG de terror e investigação paranormal",
  },
  "dnd5e": {
    icon: <Dices className="h-5 w-5" />,
    color: "border-violet-500/40 bg-violet-500/10 text-violet-300",
    desc: "O clássico RPG de fantasia medieval",
  },
}

const SHOP_MODES = [
  {
    value: "requisition",
    label: "Requisição",
    desc: "A Ordem fornece itens conforme a patente do agente. Sem custo monetário.",
    icon: <Package className="h-5 w-5" />,
  },
  {
    value: "market",
    label: "Mercado Livre",
    desc: "Jogadores compram itens com dinheiro ($). Preços controlados pelo mestre.",
    icon: <Coins className="h-5 w-5" />,
  },
]

// ─── Preview do card ──────────────────────────────────────────────────────────

function CampaignPreview({
  name, system, description, coverUrl, isGm,
}: {
  name: string; system: string; description: string; coverUrl: string; isGm: boolean
}) {
  const meta = SYSTEM_META[system]
  const systemLabel = SYSTEM_LABELS[system] ?? system

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.03] shadow-lg">
      {/* Cover */}
      <div className="relative h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-black/40 overflow-hidden">
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="capa" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
        {!coverUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sword className="h-10 w-10 text-primary/20" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground leading-tight line-clamp-1">
            {name || "Nome da campanha"}
          </h3>
          {isGm && <Badge className="shrink-0 text-[10px]">Mestre</Badge>}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
        )}
        <div className="flex items-center gap-2 pt-1">
          {meta && (
            <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-md border ${meta.color}`}>
              {meta.icon}
              {systemLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function NewCampaignPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState("")
  const [system, setSystem] = useState("ordem-paranormal")
  const [description, setDescription] = useState("")
  const [shopMode, setShopMode] = useState("requisition")
  const [coverUrl, setCoverUrl] = useState("")
  const [coverPreview, setCoverPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)

  const activePreview = coverPreview || coverUrl

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { toast.error("Selecione uma imagem"); return }
    const reader = new FileReader()
    reader.onload = (e) => { setCoverPreview(e.target?.result as string); setCoverUrl("") }
    reader.readAsDataURL(file)
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [])

  function clearCover() { setCoverPreview(""); setCoverUrl("") }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast.error("Informe o nome da campanha"); return }

    setLoading(true)
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        system,
        description: description.trim() || undefined,
        shopMode,
        coverImage: activePreview || undefined,
      }),
    })
    setLoading(false)

    if (!res.ok) {
      const body = await res.json()
      toast.error(body.error || "Erro ao criar campanha")
      return
    }

    const campaign = await res.json()
    toast.success("Campanha criada!")
    router.push(`/campaigns/${campaign.id}`)
  }

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-0">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <Link href="/campaigns" className="hover:text-foreground transition-colors">Campanhas</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Nova Campanha</span>
      </nav>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* ─── Coluna principal ─────────────────────────────── */}
          <div className="space-y-7">

            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold font-[Cinzel]">Nova Campanha</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configure sua mesa e convide seus jogadores.
              </p>
            </div>

            {/* Cover image */}
            <section className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 flex items-center gap-1.5">
                <ImagePlus className="h-4 w-4 text-primary/60" />
                Imagem de capa
                <span className="text-muted-foreground font-normal">(opcional)</span>
              </label>

              {activePreview ? (
                <div className="relative rounded-xl overflow-hidden h-44 border border-white/10 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={activePreview} alt="capa" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-black/60 border border-white/20 rounded-lg text-xs text-white hover:bg-black/80 transition-colors">
                      Trocar imagem
                    </button>
                    <button type="button" onClick={clearCover}
                      className="w-8 h-8 bg-red-900/60 border border-red-500/30 rounded-lg flex items-center justify-center hover:bg-red-900/80 transition-colors">
                      <X className="h-4 w-4 text-red-300" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  className={`h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
                    dragging
                      ? "border-primary bg-primary/10 scale-[1.01]"
                      : "border-white/15 hover:border-primary/40 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <ImagePlus className="h-6 w-6 text-primary/60" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground/70">Clique para selecionar</p>
                    <p className="text-xs text-muted-foreground">ou arraste uma imagem aqui • JPG, PNG, WebP</p>
                  </div>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileInput} />

              {/* URL alternativa */}
              {!coverPreview && (
                <div className="flex gap-2 items-center">
                  <div className="h-px flex-1 bg-white/8" />
                  <span className="text-[11px] text-muted-foreground">ou cole uma URL</span>
                  <div className="h-px flex-1 bg-white/8" />
                </div>
              )}
              {!coverPreview && (
                <Input
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://..."
                  className="h-9 text-sm bg-black/20 border-white/10 font-mono text-xs"
                />
              )}
            </section>

            {/* Nome */}
            <section className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-foreground/80">
                Nome da Campanha <span className="text-red-400">*</span>
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: A Sombra de Vladok"
                className="h-11 text-base bg-black/20 border-white/10 focus-visible:border-primary/40"
                required
              />
            </section>

            {/* Sistema */}
            <section className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary/60" />
                Sistema de Jogo <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SYSTEMS.map((s) => {
                  const meta = SYSTEM_META[s.value]
                  const active = system === s.value
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSystem(s.value)}
                      className={`relative flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150 ${
                        active
                          ? "border-primary/50 bg-primary/10 shadow-[0_0_20px_-6px] shadow-primary/30"
                          : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className={`mt-0.5 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`}>
                        {meta?.icon}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold ${active ? "text-foreground" : "text-foreground/70"}`}>
                          {s.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {meta?.desc}
                        </p>
                      </div>
                      {active && (
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Descrição */}
            <section className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-foreground/80">
                Descrição
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">(opcional)</span>
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contexto da campanha, tom da história, o que esperar dos jogadores..."
                rows={4}
                className="resize-none bg-black/20 border-white/10 focus-visible:border-primary/40 leading-relaxed"
              />
              <p className="text-[11px] text-muted-foreground">
                Aparece no card da campanha para todos os membros.
              </p>
            </section>

            {/* Modo do mercado */}
            <section className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 flex items-center gap-1.5">
                <Package className="h-4 w-4 text-primary/60" />
                Modo do Mercado
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SHOP_MODES.map((m) => {
                  const active = shopMode === m.value
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setShopMode(m.value)}
                      className={`relative flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150 ${
                        active
                          ? "border-primary/50 bg-primary/10 shadow-[0_0_20px_-6px] shadow-primary/30"
                          : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className={`mt-0.5 shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`}>
                        {m.icon}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold ${active ? "text-foreground" : "text-foreground/70"}`}>
                          {m.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{m.desc}</p>
                      </div>
                      {active && (
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Ações */}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1 h-11"
                onClick={() => router.push("/campaigns")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !name.trim()} className="flex-1 h-11 font-semibold">
                {loading
                  ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Criando...</>
                  : "Criar Campanha"}
              </Button>
            </div>
          </div>

          {/* ─── Preview ──────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 space-y-3 self-start">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Preview do card
            </p>
            <CampaignPreview
              name={name}
              system={system}
              description={description}
              coverUrl={activePreview}
              isGm={true}
            />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              É assim que sua campanha vai aparecer na lista para você e seus jogadores.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
