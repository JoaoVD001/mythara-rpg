import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sword, Users, BookOpen, Link2, Layers, Dices } from "lucide-react"
import { db } from "@/lib/db"

const features = [
  {
    icon: Sword,
    title: "Fichas de Personagem",
    description:
      "Fichas completas para Ordem Paranormal RPG e D&D 5e, com todos os campos que você precisa para jogar.",
  },
  {
    icon: Users,
    title: "Gerenciamento de Campanhas",
    description:
      "Crie campanhas, organize seus jogadores e acompanhe o progresso de cada aventura.",
  },
  {
    icon: BookOpen,
    title: "Notas de Sessão",
    description:
      "Registre o que aconteceu em cada sessão e mantenha o histórico da campanha vivo.",
  },
  {
    icon: Link2,
    title: "Convite por Link",
    description:
      "Compartilhe um link único e seus jogadores entram na campanha em segundos, já vinculando a ficha.",
  },
  {
    icon: Layers,
    title: "Múltiplos Sistemas",
    description:
      "Suporte a Ordem Paranormal RPG e D&D 5e, com mais sistemas chegando em breve.",
  },
  {
    icon: Dices,
    title: "Mesa Virtual (Em Breve)",
    description:
      "Rolagem de dados, mapa com grid, tokens e combate em tempo real. Chegando na Fase 2.",
  },
]

export default async function HomePage() {
  const [userCount, characterCount, campaignCount] = await Promise.all([
    db.user.count(),
    db.character.count(),
    db.campaign.count(),
  ])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-display font-bold text-lg tracking-widest text-primary">
            MYTHARA
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild className="glow-primary-sm">
              <Link href="/register">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.55_0.17_145_/_12%),transparent)] pointer-events-none" />
        <div className="relative z-10 text-center space-y-7 max-w-3xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-[2]" />
              <div className="relative p-5 rounded-full border border-primary/30 bg-primary/10 glow-primary">
                <Sword className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-6xl sm:text-7xl font-bold tracking-widest text-foreground leading-tight">
              MYTHARA
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Sua plataforma de RPG online. Crie fichas de personagem, gerencie campanhas e registre suas aventuras — tudo em um só lugar.
            </p>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <Button
              size="lg"
              asChild
              className="glow-primary shadow-lg shadow-primary/20 font-semibold tracking-wide"
            >
              <Link href="/register">Começar gratuitamente</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-border/60">
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/40 py-12 bg-card/30">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-8 text-center px-4">
          <div className="space-y-1">
            <div className="font-display text-4xl font-bold text-primary">{userCount}</div>
            <div className="text-sm text-muted-foreground">Aventureiros</div>
          </div>
          <div className="space-y-1">
            <div className="font-display text-4xl font-bold text-primary">{characterCount}</div>
            <div className="text-sm text-muted-foreground">Personagens</div>
          </div>
          <div className="space-y-1">
            <div className="font-display text-4xl font-bold text-primary">{campaignCount}</div>
            <div className="text-sm text-muted-foreground">Campanhas</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-5xl mx-auto px-4 w-full">
        <h2 className="font-display text-3xl font-bold text-center mb-3 tracking-wider">
          O que você pode fazer
        </h2>
        <p className="text-center text-muted-foreground mb-14">
          Tudo que um grupo de RPG precisa, sem complicação.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="border border-border/50 rounded-xl p-6 space-y-3 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
            >
              <div className="p-2 w-fit rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_50%_50%,oklch(0.55_0.17_145_/_8%),transparent)] pointer-events-none" />
        <div className="relative z-10 space-y-6 max-w-lg mx-auto">
          <h2 className="font-display text-3xl font-bold tracking-wider">
            Pronto para aventurar?
          </h2>
          <p className="text-muted-foreground">
            Crie sua conta grátis e comece sua primeira campanha em minutos.
          </p>
          <Button
            size="lg"
            asChild
            className="glow-primary shadow-lg shadow-primary/20 font-semibold"
          >
            <Link href="/register">Criar conta grátis</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
        <span className="font-display tracking-widest text-primary/60 font-semibold">MYTHARA RPG</span>
        <span className="mx-2">·</span>
        <span>© 2026</span>
        <span className="mx-2">·</span>
        <span>Construído com paixão por RPG</span>
      </footer>
    </div>
  )
}
