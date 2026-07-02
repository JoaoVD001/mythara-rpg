"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Check, X, AtSign, User, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"

type UserProfile = {
  id: string
  name: string
  username: string | null
  bio: string | null
  image: string | null
}

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid"

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [saving, setSaving] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data: UserProfile) => {
        setProfile(data)
        setName(data.name)
        setUsername(data.username ?? "")
        setBio(data.bio ?? "")
      })
  }, [])

  const checkUsername = useCallback(async (value: string) => {
    if (!value) { setUsernameStatus("idle"); return }
    if (!/^[a-z0-9_]{3,20}$/.test(value)) { setUsernameStatus("invalid"); return }
    if (value === profile?.username) { setUsernameStatus("available"); return }
    setUsernameStatus("checking")
    const res = await fetch(`/api/users/${value}`)
    setUsernameStatus(res.ok ? "taken" : "available")
  }, [profile?.username])

  function onUsernameChange(value: string) {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9_]/g, "")
    setUsername(cleaned)
    setUsernameStatus("idle")
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => checkUsername(cleaned), 500)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (usernameStatus === "taken" || usernameStatus === "invalid") return
    setSaving(true)
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, bio }),
    })
    setSaving(false)
    if (!res.ok) {
      const body = await res.json()
      toast.error(body.error || "Erro ao salvar")
      return
    }
    const updated = await res.json()
    setProfile(updated)
    toast.success("Perfil atualizado!")
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    )
  }

  const canSave = name.trim() && usernameStatus !== "taken" && usernameStatus !== "invalid" && usernameStatus !== "checking"
  const bioLen = bio.length

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-[Cinzel]">Configurações de perfil</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure como outros usuários te veem na plataforma.
        </p>
      </div>

      {/* Avatar */}
      {profile.image && (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.image} alt={profile.name} className="w-16 h-16 rounded-full object-cover border border-white/10" />
          <div>
            <p className="text-sm font-medium text-foreground">{profile.name}</p>
            <p className="text-xs text-muted-foreground">Avatar gerenciado pelo provedor de login</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Nome de exibição */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="flex items-center gap-1.5 text-sm">
            <User className="h-3.5 w-3.5 text-primary/70" />
            Nome de exibição
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="h-10"
            required
          />
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <Label htmlFor="username" className="flex items-center gap-1.5 text-sm">
            <AtSign className="h-3.5 w-3.5 text-primary/70" />
            Apelido de jogador
          </Label>
          <div className="relative">
            <Input
              id="username"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              placeholder="seu_username"
              maxLength={20}
              className={`h-10 pr-9 font-mono ${
                usernameStatus === "taken" || usernameStatus === "invalid"
                  ? "border-red-500/50 focus-visible:ring-red-500/30"
                  : usernameStatus === "available"
                  ? "border-emerald-500/50 focus-visible:ring-emerald-500/30"
                  : ""
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {usernameStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              {usernameStatus === "available" && <Check className="h-4 w-4 text-emerald-400" />}
              {(usernameStatus === "taken" || usernameStatus === "invalid") && <X className="h-4 w-4 text-red-400" />}
            </div>
          </div>
          <p className={`text-xs ${
            usernameStatus === "taken" || usernameStatus === "invalid" ? "text-red-400" :
            usernameStatus === "available" && username ? "text-emerald-400" :
            "text-muted-foreground"
          }`}>
            {usernameStatus === "taken" && "Este apelido já está em uso"}
            {usernameStatus === "invalid" && "3–20 caracteres: letras minúsculas, números ou _"}
            {usernameStatus === "available" && username && "Apelido disponível ✓"}
            {(usernameStatus === "idle" || (!username && usernameStatus !== "invalid")) && "Usado para que outros jogadores te encontrem"}
          </p>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <Label htmlFor="bio" className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary/70" />
              Bio
            </span>
            <span className={`text-xs font-mono ${bioLen > 140 ? "text-amber-400" : "text-muted-foreground"}`}>
              {bioLen}/160
            </span>
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 160))}
            placeholder="Conte um pouco sobre você..."
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={saving || !canSave} className="min-w-[100px]">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
          </Button>
          {profile.username && (
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
              <Link href={`/u/${profile.username}`}>
                <ExternalLink className="h-3.5 w-3.5" />
                Ver perfil público
              </Link>
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
