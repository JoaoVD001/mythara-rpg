"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sword, Star, UserCheck, Loader2, AlertCircle } from "lucide-react"
import { getPatenteForPP, type OrdemParanormalData } from "@/lib/systems"

type Member = {
  id: string
  role: string
  user: { id: string; name: string; image: string | null }
  character: { id: string; name: string; system: string; data: string } | null
}

type MyCharacter = { id: string; name: string }

function LinkCharacterSelect({
  campaignId, memberId, characters, currentCharacterId,
}: {
  campaignId: string; memberId: string; characters: MyCharacter[]; currentCharacterId?: string
}) {
  const router = useRouter()
  const [selected, setSelected] = useState(currentCharacterId ?? "")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const res = await fetch(`/api/campaigns/${campaignId}/members/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId: (selected && selected !== "none") ? selected : null }),
    })
    setSaving(false)
    if (!res.ok) { toast.error("Erro ao vincular personagem"); return }
    toast.success(selected ? "Personagem vinculado!" : "Personagem desvinculado")
    router.refresh()
  }

  return (
    <div className="mt-2 pt-2 border-t border-white/6 flex items-center gap-2">
      <UserCheck className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="flex-1 h-7 text-xs bg-black/20 border-white/10">
          <SelectValue placeholder="— sem personagem —" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">— sem personagem —</SelectItem>
          {characters.map((c) => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        disabled={saving || selected === (currentCharacterId ?? "")}
        onClick={handleSave}
        className="h-7 px-3 text-xs shrink-0"
      >
        {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Salvar"}
      </Button>
    </div>
  )
}

// ─── Painel de PP (GM only) ──────────────────────────────────────────────────

function PPPanel({ campaignId, memberId, initialPP, initialPatenteName }: {
  campaignId: string; memberId: string; initialPP: number; initialPatenteName: string
}) {
  const [pp, setPP] = useState(initialPP)
  const [patenteName, setPatenteName] = useState(initialPatenteName)
  const [manualPP, setManualPP] = useState(String(initialPP))
  const [isPending, startTransition] = useTransition()

  async function applyDelta(delta: number) {
    startTransition(async () => {
      const res = await fetch(`/api/campaigns/${campaignId}/members/${memberId}/pp`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      })
      if (res.ok) {
        const data = await res.json()
        setPP(data.pp); setPatenteName(data.patenteName); setManualPP(String(data.pp))
        if (data.patenteName !== patenteName) toast.success(`Promovido para ${data.patenteName}!`)
      } else {
        toast.error("Erro ao atualizar PP")
      }
    })
  }

  async function applyManual() {
    const val = parseInt(manualPP, 10)
    if (isNaN(val) || val < 0) return
    startTransition(async () => {
      const res = await fetch(`/api/campaigns/${campaignId}/members/${memberId}/pp`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pp: val }),
      })
      if (res.ok) {
        const data = await res.json()
        setPP(data.pp); setPatenteName(data.patenteName); setManualPP(String(data.pp))
        if (data.patenteName !== patenteName) toast.success(`Promovido para ${data.patenteName}!`)
        else toast.success("PP atualizado!")
      } else {
        toast.error("Erro ao atualizar PP")
      }
    })
  }

  return (
    <div className="mt-2 pt-2 border-t border-primary/10 space-y-2">
      <div className="flex items-center gap-2">
        <Star className="h-3 w-3 text-primary/50" />
        <span className="text-[11px] font-semibold text-primary/70">{patenteName}</span>
        <span className="text-[10px] text-muted-foreground/50 ml-auto font-mono">{pp} PP</span>
      </div>
      {/* Botões rápidos */}
      <div className="grid grid-cols-4 gap-1">
        {[
          { label: "+10", delta: 10, cls: "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15" },
          { label: "+2",  delta: 2,  cls: "text-emerald-400/70 border-emerald-500/20 hover:bg-emerald-500/10" },
          { label: "−2",  delta: -2, cls: "text-red-400/80 border-red-500/20 hover:bg-red-500/10" },
          { label: "−5",  delta: -5, cls: "text-red-400 border-red-500/30 hover:bg-red-500/15" },
        ].map(({ label, delta, cls }) => (
          <button key={label} type="button" disabled={isPending} onClick={() => applyDelta(delta)}
            className={`h-6 rounded border text-[10px] font-bold transition-colors disabled:opacity-40 ${cls}`}>
            {label}
          </button>
        ))}
      </div>
      {/* Edição manual */}
      <div className="flex gap-1">
        <input type="number" min="0" value={manualPP} onChange={(e) => setManualPP(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyManual()}
          disabled={isPending}
          className="flex-1 h-6 text-xs bg-black/30 border border-primary/20 rounded px-2 text-muted-foreground focus:outline-none focus:border-primary/50 disabled:opacity-40"
          placeholder="PP manual" />
        <button type="button" disabled={isPending} onClick={applyManual}
          className="h-6 px-2 rounded border border-primary/30 text-[10px] text-primary hover:bg-primary/10 transition-colors disabled:opacity-40">
          OK
        </button>
      </div>
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────

export function MembersList({
  members, currentUserId, isGm, campaignId, myMemberId, myCharacters, campaignSystem,
}: {
  members: Member[]
  currentUserId: string
  isGm: boolean
  campaignId?: string
  myMemberId?: string
  myCharacters?: MyCharacter[]
  campaignSystem?: string
}) {
  return (
    <div className="space-y-3">
      {members.map((member) => {
        const initials = member.user.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()

        let pp = 0
        let patenteName = "Recruta"
        if (member.character?.data) {
          try {
            const charData = JSON.parse(member.character.data) as OrdemParanormalData
            pp = parseInt(charData.pp ?? "0", 10)
            patenteName = getPatenteForPP(pp).name
          } catch { /* ignore */ }
        }

        return (
          <div key={member.id} className="p-3 rounded-lg border border-border/50 bg-card/40">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={member.user.image ?? undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{member.user.name}</span>
                  {member.user.id === currentUserId && (
                    <span className="text-xs text-muted-foreground">(você)</span>
                  )}
                  {member.role === "gm" && <Badge className="text-xs">Mestre</Badge>}
                </div>
                {member.character ? (
                  <Link href={`/characters/${member.character.id}`}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-0.5">
                    <Sword className="h-3 w-3" />
                    {member.character.name}
                  </Link>
                ) : (
                  <span className="text-xs text-muted-foreground">Sem personagem vinculado</span>
                )}
              </div>
            </div>

            {/* Vincular personagem — para o próprio usuário */}
            {member.user.id === currentUserId && myMemberId && myCharacters && campaignId && (
              myCharacters.length > 0 ? (
                <LinkCharacterSelect
                  campaignId={campaignId}
                  memberId={myMemberId}
                  characters={myCharacters}
                  currentCharacterId={member.character?.id}
                />
              ) : !isGm && (
                <div className="mt-2 pt-2 border-t border-white/6 flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-400/80">
                    Você precisa{" "}
                    <Link href="/characters/new" className="underline hover:text-amber-300 transition-colors">
                      criar um personagem
                    </Link>
                    {campaignSystem ? ` de ${campaignSystem === "ordem-paranormal" ? "Ordem Paranormal" : campaignSystem}` : ""} para vincular a esta campanha.
                  </p>
                </div>
              )
            )}

            {/* Painel de PP — apenas GM, para membros não-GM com personagem */}
            {isGm && member.role !== "gm" && member.character && campaignId && (
              <PPPanel
                campaignId={campaignId}
                memberId={member.id}
                initialPP={pp}
                initialPatenteName={patenteName}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
