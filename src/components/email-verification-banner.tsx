"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function EmailVerificationBanner() {
  const router = useRouter()
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const channel = new BroadcastChannel("mythara-auth")
    channel.onmessage = (event) => {
      if (event.data?.type === "email-verified") {
        router.refresh()
      }
    }
    return () => channel.close()
  }, [router])

  if (dismissed) return null

  async function handleResend() {
    setLoading(true)
    try {
      const res = await fetch("/api/resend-verification", { method: "POST" })
      if (res.ok) {
        toast.success("Email de verificação reenviado! Verifique sua caixa de entrada.")
      } else {
        const body = await res.json()
        toast.error(body.error ?? "Erro ao reenviar. Tente novamente.")
      }
    } catch {
      toast.error("Erro ao reenviar. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-2.5 flex items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-2 text-amber-300/90 min-w-0">
        <Mail className="h-4 w-4 shrink-0" />
        <span className="truncate">
          Verifique seu email para ativar todos os recursos da conta.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs border-amber-700/50 text-amber-300 hover:bg-amber-900/30 hover:text-amber-200 bg-transparent"
          onClick={handleResend}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Reenviar email"}
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-600 hover:text-amber-300 transition-colors"
          aria-label="Fechar aviso"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
