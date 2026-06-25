"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"

export function CampaignInvite({
  campaignId,
  inviteCode,
}: {
  campaignId: string
  inviteCode: string
}) {
  const [copied, setCopied] = useState(false)
  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/campaigns/join/${inviteCode}`
      : `/campaigns/join/${inviteCode}`

  async function copyLink() {
    await navigator.clipboard.writeText(joinUrl)
    setCopied(true)
    toast.success("Link copiado!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Link de Convite</CardTitle>
        <CardDescription>
          Compartilhe este link com seus jogadores para eles entrarem na campanha.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input value={joinUrl} readOnly className="font-mono text-sm" />
          <Button variant="outline" size="icon" onClick={copyLink}>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Código: <span className="font-mono font-medium">{inviteCode}</span>
        </p>
      </CardContent>
    </Card>
  )
}
