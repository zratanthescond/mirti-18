import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const customer = await db.collection("customers").findOne({
      _id: new ObjectId(params.id),
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Get customer's order history
    const orders = await db.collection("orders").find({ customerId: customer._id }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
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
      orders: orders.map((order) => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        items: order.items,
        total: order.total,
        status: order.status,
        orderType: order.orderType,
        createdAt: order.createdAt,
      })),
    })
  } catch (error) {
    console.error("Customer fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const data = await request.json()

    const updateData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      addresses: data.addresses || [],
      preferences: {
        favoriteItems: data.preferences?.favoriteItems || [],
        dietaryRestrictions: data.preferences?.dietaryRestrictions || [],
        allergies: data.preferences?.allergies || [],
      },
    }

    const result = await db.collection("customers").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: params.id,
      ...updateData,
    })
  } catch (error) {
    console.error("Customer update error:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()

    // Check if customer has orders
    const orderCount = await db.collection("orders").countDocuments({
      customerId: new ObjectId(params.id),
    })

    if (orderCount > 0) {
      return NextResponse.json({ error: "Cannot delete customer with existing orders" }, { status: 400 })
    }

    const result = await db.collection("customers").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Customer deletion error:", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}
