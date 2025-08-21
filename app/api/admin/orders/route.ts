import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (status && status !== "all") {
      query.status = status
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customerInfo.name": { $regex: search, $options: "i" } },
        { "customerInfo.email": { $regex: search, $options: "i" } },
      ]
    }

    const [orders, total] = await Promise.all([
      db.collection("orders").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection("orders").countDocuments(query),
    ])

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        customerInfo: order.customerInfo,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        deliveryFee: order.deliveryFee,
        total: order.total,
        status: order.status,
        orderType: order.orderType,
        deliveryAddress: order.deliveryAddress,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        notes: order.notes,
        estimatedReadyTime: order.estimatedReadyTime,
        actualReadyTime: order.actualReadyTime,
        deliveredAt: order.deliveredAt,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Orders API error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const data = await request.json()

    // Generate order number
    const orderCount = await db.collection("orders").countDocuments()
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, "0")}`

    const order = {
      orderNumber,
      customerId: data.customerId ? new ObjectId(data.customerId) : undefined,
      customerInfo: data.customerInfo,
      items: data.items.map((item: any) => ({
        ...item,
        menuItemId: new ObjectId(item.menuItemId),
      })),
      subtotal: data.subtotal,
      tax: data.tax,
      deliveryFee: data.deliveryFee || 0,
      total: data.total,
      status: "pending",
      orderType: data.orderType,
      deliveryAddress: data.deliveryAddress,
      paymentStatus: "pending",
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      estimatedReadyTime: data.estimatedReadyTime ? new Date(data.estimatedReadyTime) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("orders").insertOne(order)

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...order,
        customerId: order.customerId?.toString(),
        items: order.items.map((item) => ({
          ...item,
          menuItemId: item.menuItemId.toString(),
        })),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
