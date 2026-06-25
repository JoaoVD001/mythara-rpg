"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { DnD5eData, DND5E_CLASSES } from "@/lib/systems"

type Props = {
  characterId: string
  characterName: string
  initialData: DnD5eData
  readOnly?: boolean
}

const ABILITY_LABELS: { key: keyof DnD5eData; label: string }[] = [
  { key: "str", label: "FOR" },
  { key: "dex", label: "DES" },
  { key: "con", label: "CON" },
  { key: "int", label: "INT" },
  { key: "wis", label: "SAB" },
  { key: "cha", label: "CAR" },
]

const SAVING_THROW_LABELS = ["FOR", "DES", "CON", "INT", "SAB", "CAR"]

const SKILL_LABELS = [
  "Acrobacia",
  "Adestrar Animais",
  "Arcanismo",
  "Atletismo",
  "Atuação",
  "Enganação",
  "Furtividade",
  "História",
  "Intimidação",
  "Intuição",
  "Investigação",
  "Medicina",
  "Natureza",
  "Percepção",
  "Persuasão",
  "Prestidigitação",
  "Religião",
  "Sobrevivência",
]

function modifier(score: number) {
  return Math.floor((score - 10) / 2)
}

function modStr(score: number) {
  const m = modifier(score)
  return m >= 0 ? `+${m}` : `${m}`
}

export function DnD5eSheet({
  characterId,
  characterName,
  initialData,
  readOnly = false,
}: Props) {
  const { register, handleSubmit, watch, setValue, reset } =
    useForm<DnD5eData>({ defaultValues: initialData })

  useEffect(() => {
    reset(initialData)
  }, [initialData, reset])

  const values = watch()

  const savingThrows: string[] = (() => {
    try {
      return JSON.parse(values.savingThrows || "[]")
    } catch {
      return []
    }
  })()

  const proficiencies: string[] = (() => {
    try {
      return JSON.parse(values.proficiencies || "[]")
    } catch {
      return []
    }
  })()

  function toggleSavingThrow(label: string) {
    if (readOnly) return
    const updated = savingThrows.includes(label)
      ? savingThrows.filter((s) => s !== label)
      : [...savingThrows, label]
    setValue("savingThrows", JSON.stringify(updated))
  }

  function toggleProficiency(skill: string) {
    if (readOnly) return
    const updated = proficiencies.includes(skill)
      ? proficiencies.filter((s) => s !== skill)
      : [...proficiencies, skill]
    setValue("proficiencies", JSON.stringify(updated))
  }

  async function onSave(data: DnD5eData) {
    const res = await fetch(`/api/characters/${characterId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: characterName, data }),
    })
    if (res.ok) {
      toast.success("Ficha salva!")
    } else {
      toast.error("Erro ao salvar")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="space-y-1">
          <Label>Raça</Label>
          <Input {...register("race")} readOnly={readOnly} placeholder="Ex: Humano" />
        </div>
        <div className="space-y-1">
          <Label>Classe</Label>
          <Input
            {...register("class")}
            readOnly={readOnly}
            list="dnd-classes"
            placeholder="Ex: Guerreiro"
          />
          <datalist id="dnd-classes">
            {DND5E_CLASSES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div className="space-y-1">
          <Label>Subclasse</Label>
          <Input {...register("subclass")} readOnly={readOnly} placeholder="Subclasse" />
        </div>
        <div className="space-y-1">
          <Label>Nível</Label>
          <Input {...register("level")} readOnly={readOnly} type="number" min={1} max={20} />
        </div>
        <div className="space-y-1">
          <Label>Antecedente</Label>
          <Input {...register("background")} readOnly={readOnly} placeholder="Ex: Nobre" />
        </div>
        <div className="space-y-1">
          <Label>Alinhamento</Label>
          <Input {...register("alignment")} readOnly={readOnly} placeholder="Ex: Leal e Bom" />
        </div>
        <div className="space-y-1">
          <Label>XP</Label>
          <Input {...register("xp")} readOnly={readOnly} type="number" />
        </div>
        <div className="space-y-1">
          <Label>Bônus de Proficiência</Label>
          <Input {...register("profBonus")} readOnly={readOnly} type="number" />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Atributos</h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {ABILITY_LABELS.map(({ key, label }) => {
            const score = parseInt(values[key] as string) || 10
            return (
              <div key={key} className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground uppercase">{label}</span>
                <Input
                  {...register(key)}
                  readOnly={readOnly}
                  className="w-16 text-center font-bold text-lg"
                  type="number"
                />
                <span className="text-sm text-muted-foreground">{modStr(score)}</span>
              </div>
            )
          })}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Testes de Resistência</h3>
          <div className="flex flex-wrap gap-2">
            {SAVING_THROW_LABELS.map((label) => (
              <Badge
                key={label}
                variant={savingThrows.includes(label) ? "default" : "outline"}
                className={readOnly ? "" : "cursor-pointer select-none"}
                onClick={() => toggleSavingThrow(label)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Combate</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">CA</Label>
              <Input {...register("ac")} readOnly={readOnly} className="text-center" type="number" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Iniciativa</Label>
              <Input {...register("initiative")} readOnly={readOnly} className="text-center" type="number" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Deslocamento</Label>
              <Input {...register("speed")} readOnly={readOnly} className="text-center" type="number" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">PV Máx</Label>
              <Input {...register("hpMax")} readOnly={readOnly} className="text-center" type="number" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">PV Atual</Label>
              <Input {...register("hp")} readOnly={readOnly} className="text-center" type="number" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">PV Temp</Label>
              <Input {...register("hpTemp")} readOnly={readOnly} className="text-center" type="number" />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Perícias com Proficiência</h3>
        <div className="flex flex-wrap gap-2">
          {SKILL_LABELS.map((skill) => (
            <Badge
              key={skill}
              variant={proficiencies.includes(skill) ? "default" : "outline"}
              className={readOnly ? "" : "cursor-pointer select-none"}
              onClick={() => toggleProficiency(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Inventário</Label>
          <Textarea
            {...register("inventory")}
            readOnly={readOnly}
            placeholder="Itens e equipamentos..."
            rows={5}
          />
        </div>
        <div className="space-y-1">
          <Label>Habilidades e Traços</Label>
          <Textarea
            {...register("features")}
            readOnly={readOnly}
            placeholder="Habilidades de classe, raça, antecedente..."
            rows={5}
          />
        </div>
        <div className="space-y-1">
          <Label>Magias</Label>
          <Textarea
            {...register("spells")}
            readOnly={readOnly}
            placeholder="Liste suas magias..."
            rows={5}
          />
        </div>
        <div className="space-y-1">
          <Label>Notas</Label>
          <Textarea
            {...register("notes")}
            readOnly={readOnly}
            placeholder="Anotações gerais..."
            rows={5}
          />
        </div>
      </div>

      {!readOnly && (
        <Button type="submit" className="w-full sm:w-auto">
          Salvar Ficha
        </Button>
      )}
    </form>
  )
}
