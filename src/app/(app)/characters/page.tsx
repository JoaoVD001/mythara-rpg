import { auth } from "@/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { SYSTEM_LABELS } from "@/lib/systems"

export default async function CharactersPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const characters = await db.character.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fichas de Personagem</h1>
          <p className="text-muted-foreground">
            {characters.length} ficha{characters.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/characters/new">
            <Plus className="h-4 w-4 mr-2" />
            Nova Ficha
          </Link>
        </Button>
      </div>

      {characters.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-muted-foreground">
            Você ainda não tem fichas de personagem.
          </p>
          <Button asChild>
            <Link href="/characters/new">Criar primeira ficha</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((char) => (
            <Link key={char.id} href={`/characters/${char.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{char.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">
                    {SYSTEM_LABELS[char.system] ?? char.system}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
