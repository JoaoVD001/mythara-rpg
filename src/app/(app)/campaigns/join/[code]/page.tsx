"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

type Character = { id: string; name: string; system: string }
type Campaign = { id: string; name: string; system: string }

export default function JoinCampaignPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const router = useRouter()
  const { data: session } = useSession()
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

  async function handleJoin() {
    if (!campaign) return
    setJoining(true)
    const res = await fetch(`/api/campaigns/${campaign.id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId: selectedCharacter || null }),
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="max-w-sm mx-auto pt-16 text-center space-y-4">
        <p className="text-destructive">{error || "Campanha não encontrada."}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Voltar ao início
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Entrar na Campanha</CardTitle>
          <CardDescription>
            Você foi convidado para: <strong>{campaign.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {characters.length > 0 ? (
            <div className="space-y-2">
              <Label>Vincular Personagem (opcional)</Label>
              <Select onValueChange={(v) => setSelectedCharacter(v ?? "")} value={selectedCharacter}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um personagem..." />
                </SelectTrigger>
                <SelectContent>
                  {characters.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Mostrando fichas compatíveis com o sistema desta campanha.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Você não tem fichas compatíveis com este sistema. Você pode entrar
              sem personagem e vincular depois.
            </p>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/dashboard")}
            >
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleJoin} disabled={joining}>
              {joining ? "Entrando..." : "Entrar na Campanha"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
