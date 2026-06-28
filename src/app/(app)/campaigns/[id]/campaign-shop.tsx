"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { ShoppingBag, Package, Shield, Sword, Car, ChevronDown, ChevronUp } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ORDEM_PARANORMAL_ITEMS,
  CATEGORY_LABELS,
  gameIconUrl,
  type ShopItem,
  type ShopItemCategory,
  type ShopConfig,
} from "@/lib/systems"

const CATEGORY_ICONS: Record<ShopItemCategory, React.ReactNode> = {
  "arma-simples": <Sword className="h-4 w-4" />,
  "arma-fogo":    <Sword className="h-4 w-4" />,
  "protecao":     <Shield className="h-4 w-4" />,
  "equipamento":  <Package className="h-4 w-4" />,
  "veiculo":      <Car className="h-4 w-4" />,
}

const ITEMS_BY_SYSTEM: Record<string, ShopItem[]> = {
  "ordem-paranormal": ORDEM_PARANORMAL_ITEMS,
}

type Props = {
  campaignId: string
  system: string
  isGm: boolean
  initialEnabled: boolean
  initialConfig: ShopConfig
}

export function CampaignShop({ campaignId, system, isGm, initialEnabled, initialConfig }: Props) {
  const [shopEnabled, setShopEnabled] = useState(initialEnabled)
  const [config, setConfig] = useState<ShopConfig>(initialConfig)
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(["arma-fogo", "equipamento"]))
  const [isPending, startTransition] = useTransition()

  const items = ITEMS_BY_SYSTEM[system] ?? []
  const categories = [...new Set(items.map((i) => i.category))]

  function toggleCategory(cat: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  function isDisabled(id: string) {
    return config.disabled.includes(id)
  }

  function toggleItem(id: string) {
    setConfig((prev) => {
      const disabled = prev.disabled.includes(id)
        ? prev.disabled.filter((d) => d !== id)
        : [...prev.disabled, id]
      return { ...prev, disabled }
    })
  }

  function toggleShop(enabled: boolean) {
    setShopEnabled(enabled)
    startTransition(async () => {
      const res = await fetch(`/api/campaigns/${campaignId}/shop`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopEnabled: enabled }),
      })
      if (!res.ok) toast.error("Erro ao atualizar mercado")
    })
  }

  function saveConfig() {
    startTransition(async () => {
      const res = await fetch(`/api/campaigns/${campaignId}/shop`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopConfig: config }),
      })
      if (res.ok) toast.success("Mercado salvo!")
      else toast.error("Erro ao salvar")
    })
  }

  const enabledCount = items.length - config.disabled.length

  if (!isGm && !shopEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground text-sm">O mercado ainda não foi aberto pelo Mestre.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">Mercado da Campanha</h3>
            <p className="text-xs text-muted-foreground">
              {enabledCount} de {items.length} itens disponíveis
            </p>
          </div>
        </div>

        {isGm && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={shopEnabled}
                onCheckedChange={toggleShop}
                disabled={isPending}
              />
              <span className="text-sm text-muted-foreground">
                {shopEnabled ? "Visível aos jogadores" : "Oculto aos jogadores"}
              </span>
            </div>
            <Button size="sm" onClick={saveConfig} disabled={isPending}>
              Salvar
            </Button>
          </div>
        )}
      </div>

      {/* Aviso para jogadores */}
      {!isGm && (
        <p className="text-xs text-muted-foreground border border-border/40 rounded-lg p-3 bg-muted/20">
          Itens disponibilizados pelo Mestre. Preços em dólares ($).
        </p>
      )}

      {/* Lista por categoria */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat)
          const catEnabled = catItems.filter((i) => !isDisabled(i.id)).length
          const isOpen = openCategories.has(cat)

          return (
            <div key={cat} className="border border-border/40 rounded-xl overflow-hidden">
              {/* Cabeçalho da categoria */}
              <button
                type="button"
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center justify-between px-4 py-3 bg-card/60 hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-primary">{CATEGORY_ICONS[cat]}</span>
                  <span className="font-semibold text-sm">{CATEGORY_LABELS[cat]}</span>
                  <Badge variant="secondary" className="text-xs h-5">
                    {catEnabled}/{catItems.length}
                  </Badge>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {/* Itens */}
              {isOpen && (
                <div className="divide-y divide-border/30">
                  {catItems.map((item) => {
                    const disabled = isDisabled(item.id)
                    if (!isGm && disabled) return null

                    return (
                      <div
                        key={item.id}
                        className={`px-4 py-3 flex items-start gap-3 transition-colors ${
                          disabled ? "opacity-40" : ""
                        }`}
                      >
                        {/* Toggle (só GM) */}
                        {isGm && (
                          <Switch
                            checked={!disabled}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="mt-0.5 shrink-0"
                          />
                        )}

                        {/* Ícone do item */}
                        {item.icon && (
                          <div className="w-8 h-8 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={gameIconUrl(item.icon)}
                              alt=""
                              className="w-5 h-5 opacity-80"
                              style={{ filter: "invert(1) sepia(1) saturate(2) hue-rotate(90deg)" }}
                            />
                          </div>
                        )}

                        {/* Info do item */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{item.name}</span>
                            {item.damage && (
                              <Badge variant="outline" className="text-[10px] h-4 text-destructive border-destructive/40">
                                {item.damage} {item.damageType}
                              </Badge>
                            )}
                            {item.defense !== undefined && (
                              <Badge variant="outline" className="text-[10px] h-4 text-primary border-primary/40">
                                +{item.defense} DEF
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            {item.description}
                          </p>
                          {item.properties && item.properties.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.properties.map((p) => (
                                <span
                                  key={p}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          )}
                          {item.range && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Alcance: {item.range}
                            </p>
                          )}
                          {item.penalty && (
                            <p className="text-[10px] text-amber-500 mt-1">
                              Penalidade AGI: {item.penalty}
                            </p>
                          )}
                        </div>

                        {/* Preço e peso */}
                        <div className="text-right shrink-0">
                          <p className="font-bold text-sm text-primary">
                            ${item.price.toLocaleString("pt-BR")}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{item.weight} kg</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
