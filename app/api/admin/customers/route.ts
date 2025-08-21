import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ]
    }

    const [customers, total] = await Promise.all([
      db.collection("customers").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection("customers").countDocuments(query),
    ])

    // Enrich customer data with recent order info
    const enrichedCustomers = await Promise.all(
      customers.map(async (customer) => {
        const recentOrders = await db
          .collection("orders")
          .find({ customerId: customer._id })
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray()

        return {
          id: customer._id.toString(),
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          addresses: customer.addresses || [],
          preferences: customer.preferences || { favoriteItems: [], dietaryRestrictions: [], allergies: [] },
          totalOrders: customer.totalOrders || 0,
          totalSpent: customer.totalSpent || 0,
          loyaltyPoints: customer.loyaltyPoints || 0,
          createdAt: customer.createdAt,
          lastOrderAt: customer.lastOrderAt,
          recentOrders: recentOrders.map((order) => ({
            id: order._id.toString(),
            orderNumber: order.orderNumber,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt,
          })),
        }
      }),
    )

    return NextResponse.json({
      customers: enrichedCustomers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Customers API error:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const data = await request.json()

    const customer = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      addresses: data.addresses || [],
      preferences: {
        favoriteItems: [],
        dietaryRestrictions: data.dietaryRestrictions || [],
        allergies: data.allergies || [],
      },
      orderHistory: [],
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      createdAt: new Date(),
    }

    const result = await db.collection("customers").insertOne(customer)

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...customer,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Customer creation error:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
