"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Hash, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function JoinByCodeInput() {
  const [code, setCode] = useState("")
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = code.trim()
    if (trimmed) router.push(`/campaigns/join/${trimmed}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-sm">
      <div className="relative flex-1">
        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código de convite..."
          className="pl-9 h-9 text-sm bg-background/60 border-primary/20 focus-visible:border-primary/50 font-mono"
          aria-label="Código de convite da campanha"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <Button
        type="submit"
        disabled={!code.trim()}
        size="sm"
        variant="outline"
        className="h-9 shrink-0 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
        aria-label="Entrar com código"
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Entrar</span>
      </Button>
    </form>
  )
}
