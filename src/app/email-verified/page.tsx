"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EmailVerifiedPage() {
  const router = useRouter()

  useEffect(() => {
    const channel = new BroadcastChannel("mythara-auth")
    channel.postMessage({ type: "email-verified" })
    channel.close()
  }, [])

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 border border-primary/20 p-5">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display tracking-wide">
            Email verificado!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sua conta está ativa. Você já pode acessar todos os recursos do Mythara RPG.
          </p>
        </div>

        <Button asChild className="w-full">
          <Link href="/dashboard">Ir para o Dashboard</Link>
        </Button>

        <p className="text-xs text-muted-foreground">
          Esta aba pode ser fechada com segurança.
        </p>
      </div>
    </main>
  )
}
