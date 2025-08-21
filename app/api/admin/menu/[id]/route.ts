import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const item = await db.collection("menu_items").findOne({
      _id: new ObjectId(params.id),
    })

    if (!item) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      available: item.available,
      popular: item.popular,
      ingredients: item.ingredients || [],
      allergens: item.allergens || [],
      nutritionalInfo: item.nutritionalInfo,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })
  } catch (error) {
    console.error("Menu item fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const data = await request.json()

    const updateData = {
      name: data.name,
      description: data.description,
      price: Number.parseFloat(data.price),
      category: data.category,
      image: data.image,
      available: data.available,
      popular: data.popular,
      ingredients: data.ingredients || [],
      allergens: data.allergens || [],
      nutritionalInfo: data.nutritionalInfo,
      updatedAt: new Date(),
    }

    const result = await db.collection("menu_items").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: params.id,
      ...updateData,
    })
  } catch (error) {
    console.error("Menu item update error:", error)
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()

    const result = await db.collection("menu_items").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Menu item deletion error:", error)
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 })
  }
}
