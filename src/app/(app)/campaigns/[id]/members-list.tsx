"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sword } from "lucide-react"

type Member = {
  id: string
  role: string
  user: { id: string; name: string; image: string | null }
  character: { id: string; name: string; system: string } | null
}

export function MembersList({
  members,
  currentUserId,
  isGm,
}: {
  members: Member[]
  currentUserId: string
  isGm: boolean
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

        return (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 rounded-lg border"
          >
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
                <Link
                  href={`/characters/${member.character.id}`}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-0.5"
                >
                  <Sword className="h-3 w-3" />
                  {member.character.name}
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Sem personagem vinculado
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
