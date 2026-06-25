"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, BookOpen } from "lucide-react"

type GameSession = {
  id: string
  title: string
  notes: string | null
  date: Date
}

export function SessionsList({
  campaignId,
  sessions: initialSessions,
  isGm,
}: {
  campaignId: string
  sessions: GameSession[]
  isGm: boolean
}) {
  const [sessions, setSessions] = useState(initialSessions)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  async function createSession() {
    if (!title.trim()) {
      toast.error("Título é obrigatório")
      return
    }

    setLoading(true)
    const res = await fetch(`/api/campaigns/${campaignId}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, notes }),
    })
    setLoading(false)

    if (!res.ok) {
      const body = await res.json()
      toast.error(body.error || "Erro ao criar sessão")
      return
    }

    const newSession = await res.json()
    setSessions((prev) => [newSession, ...prev])
    setTitle("")
    setNotes("")
    setOpen(false)
    toast.success("Sessão registrada!")
  }

  return (
    <div className="space-y-4">
      {isGm && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Sessão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Sessão</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label>Título</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Sessão 01 — A Chegada"
                />
              </div>
              <div className="space-y-1">
                <Label>Notas (opcional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Resumo do que aconteceu na sessão..."
                  rows={5}
                />
              </div>
              <Button className="w-full" onClick={createSession} disabled={loading}>
                {loading ? "Salvando..." : "Salvar Sessão"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">
          Nenhuma sessão registrada ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <Card key={s.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  {s.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </CardHeader>
              {s.notes && (
                <CardContent>
                  <p className="text-sm whitespace-pre-line">{s.notes}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
