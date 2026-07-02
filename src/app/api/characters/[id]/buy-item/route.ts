import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import {
  ORDEM_PARANORMAL_ITEMS,
  applyModsToCategory,
  type InventoryItem,
  type OrdemParanormalData,
  type CustomShopItem,
  type OPRankCategory,
} from "@/lib/systems"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const { id } = await params
  const character = await db.character.findUnique({ where: { id } })
  if (!character || character.userId !== session.user.id) {
    return NextResponse.json({ error: "Personagem não encontrado" }, { status: 404 })
  }

  const body = await req.json()
  const data = JSON.parse(character.data) as OrdemParanormalData
  const dinheiro = parseInt(data.dinheiro ?? "0", 10)

  let shopItem: { id: string; name: string; price: number; category: string; rankCategory?: OPRankCategory; icon?: string; slots?: number } | undefined

  if (body.customItem) {
    // Item criado pelo mestre
    const custom = body.customItem as CustomShopItem
    shopItem = { id: custom.id, name: custom.name, price: custom.price, category: custom.category, rankCategory: custom.rankCategory, icon: custom.icon, slots: custom.slots }
  } else if (body.itemId && typeof body.itemId === "string") {
    // Item padrão do sistema — respeita sobrescrita de preço do mestre
    const found = ORDEM_PARANORMAL_ITEMS.find((i) => i.id === body.itemId)
    if (found) {
      const price = typeof body.overridePrice === "number" ? body.overridePrice : found.price
      shopItem = { id: found.id, name: found.name, price, category: found.category, rankCategory: found.rankCategory, icon: found.icon, slots: found.slots }
    }
  }

  if (!shopItem) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 })
  }

  const mode = body.mode === "requisition" ? "requisition" : "market"

  if (mode === "market" && dinheiro < shopItem.price) {
    return NextResponse.json({ error: "Dinheiro insuficiente" }, { status: 400 })
  }

  const currentItems: InventoryItem[] = data.inventoryItems
    ? JSON.parse(data.inventoryItems)
    : []

  const modifications: string[] = Array.isArray(body.modifications) ? body.modifications : []
  const baseRankCategory = shopItem.rankCategory ?? "cat-0"
  const effectiveRankCategory = modifications.length > 0
    ? applyModsToCategory(baseRankCategory, modifications.length)
    : undefined

  const newItem: InventoryItem = {
    itemId: shopItem.id,
    itemName: shopItem.name,
    price: shopItem.price,
    category: shopItem.category,
    rankCategory: shopItem.rankCategory,
    effectiveRankCategory,
    icon: shopItem.icon,
    slots: shopItem.slots,
    ...(modifications.length > 0 ? { modifications } : {}),
  }

  const updatedData: OrdemParanormalData = {
    ...data,
    dinheiro: mode === "market" ? String(dinheiro - shopItem.price) : data.dinheiro ?? "0",
    inventoryItems: JSON.stringify([...currentItems, newItem]),
  }

  const updated = await db.character.update({
    where: { id },
    data: { data: JSON.stringify(updatedData) },
  })

  return NextResponse.json({
    dinheiro: updatedData.dinheiro,
    inventoryItems: updatedData.inventoryItems,
    character: updated,
  })
}
