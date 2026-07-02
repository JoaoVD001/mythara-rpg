"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Sword, Users, LayoutDashboard, LogOut, UserPlus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/characters", label: "Fichas", icon: Sword },
  { href: "/campaigns", label: "Campanhas", icon: Users },
]

function FriendRequestsBadge() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let cancelled = false
    async function poll() {
      const res = await fetch("/api/friends/requests")
      if (!cancelled && res.ok) {
        const data = await res.json()
        setCount(Array.isArray(data) ? data.length : 0)
      }
    }
    poll()
    const interval = setInterval(poll, 30_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  return (
    <Link href="/friends"
      className="relative flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      aria-label="Amigos">
      <UserPlus className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-1 leading-none">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  )
}

function CampaignInvitesBadge() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let cancelled = false
    async function poll() {
      const res = await fetch("/api/campaigns/invites")
      if (!cancelled && res.ok) {
        const data = await res.json()
        setCount(Array.isArray(data) ? data.length : 0)
      }
    }
    poll()
    const interval = setInterval(poll, 30_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  if (count === 0) return null

  return (
    <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-1 leading-none pointer-events-none">
      {count > 9 ? "9+" : count}
    </span>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <header className="border-b border-border/50 bg-background/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="font-display font-bold text-base tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            MYTHARA
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/")
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all duration-150",
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/25 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {href === "/campaigns" && <CampaignInvitesBadge />}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          {session?.user && <FriendRequestsBadge />}
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full ring-1 ring-border hover:ring-primary/40 transition-all"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image ?? undefined} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                  {initials ?? "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-2">
              <p className="font-medium text-sm">{session?.user?.name}</p>
              <p className="text-muted-foreground text-xs truncate">{session?.user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
