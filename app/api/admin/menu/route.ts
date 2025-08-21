import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { MenuItem } from "@/lib/models/menu"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (category && category !== "all") {
      query.category = category
    }
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const [items, total] = await Promise.all([
      db.collection("menu_items").find(query).sort({ category: 1, name: 1 }).skip(skip).limit(limit).toArray(),
      db.collection("menu_items").countDocuments(query),
    ])

    return NextResponse.json({
      items: items.map((item) => ({
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
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Menu API error:", error)
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const data = await request.json()

    const menuItem: Omit<MenuItem, "_id"> = {
      name: data.name,
      description: data.description,
      price: Number.parseFloat(data.price),
      category: data.category,
      image: data.image,
      available: data.available ?? true,
      popular: data.popular ?? false,
      ingredients: data.ingredients || [],
      allergens: data.allergens || [],
      nutritionalInfo: data.nutritionalInfo,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("menu_items").insertOne(menuItem)

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...menuItem,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Menu creation error:", error)
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 })
  }
}
