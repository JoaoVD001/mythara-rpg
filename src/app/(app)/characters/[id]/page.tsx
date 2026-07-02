import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { OrdemParanormalSheet } from "@/components/character-sheets/ordem-paranormal-sheet"
import { DnD5eSheet } from "@/components/character-sheets/dnd5e-sheet"
import {
  SYSTEM_LABELS,
  OrdemParanormalData,
  DnD5eData,
  defaultOrdemParanormalData,
  defaultDnD5eData,
} from "@/lib/systems"
import { DeleteCharacterButton } from "./delete-button"

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { id } = await params
  const character = await db.character.findUnique({ where: { id } })

  if (!character) notFound()
  if (character.userId !== session.user.id) notFound()

  let data: OrdemParanormalData | DnD5eData
  try {
    data = JSON.parse(character.data)
  } catch {
    data =
      character.system === "ordem-paranormal"
        ? defaultOrdemParanormalData()
        : defaultDnD5eData()
  }

  const isOP = character.system === "ordem-paranormal"

  return (
    <div className="space-y-6">
      {!isOP && (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{character.name}</h1>
              <Badge variant="secondary" className="mt-1">
                {SYSTEM_LABELS[character.system] ?? character.system}
              </Badge>
            </div>
            <DeleteCharacterButton characterId={character.id} />
          </div>
          <Separator />
        </>
      )}

      {isOP ? (
        <OrdemParanormalSheet
          characterId={character.id}
          characterName={character.name}
          initialData={data as OrdemParanormalData}
          deleteButton={<DeleteCharacterButton characterId={character.id} />}
        />
      ) : (
        <DnD5eSheet
          characterId={character.id}
          characterName={character.name}
          initialData={data as DnD5eData}
        />
      )}
    </div>
  )
}
