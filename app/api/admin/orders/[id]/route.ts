import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(params.id),
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customerId: order.customerId?.toString(),
      customerInfo: order.customerInfo,
      items: order.items.map((item: any) => ({
        ...item,
        menuItemId: item.menuItemId.toString(),
      })),
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
    })
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const data = await request.json()

    const updateData: any = {
      updatedAt: new Date(),
    }

    // Handle status updates
    if (data.status) {
      updateData.status = data.status

      // Set timestamps based on status
      if (data.status === "ready" && !updateData.actualReadyTime) {
        updateData.actualReadyTime = new Date()
      }
      if (data.status === "delivered") {
        updateData.deliveredAt = new Date()
      }
    }

    // Handle other updates
    if (data.estimatedReadyTime) {
      updateData.estimatedReadyTime = new Date(data.estimatedReadyTime)
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes
    }
    if (data.paymentStatus) {
      updateData.paymentStatus = data.paymentStatus
    }

    const result = await db.collection("orders").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Fetch updated order
    const updatedOrder = await db.collection("orders").findOne({
      _id: new ObjectId(params.id),
    })

    return NextResponse.json({
      id: updatedOrder!._id.toString(),
      orderNumber: updatedOrder!.orderNumber,
      customerId: updatedOrder!.customerId?.toString(),
      customerInfo: updatedOrder!.customerInfo,
      items: updatedOrder!.items.map((item: any) => ({
        ...item,
        menuItemId: item.menuItemId.toString(),
      })),
      subtotal: updatedOrder!.subtotal,
      tax: updatedOrder!.tax,
      deliveryFee: updatedOrder!.deliveryFee,
      total: updatedOrder!.total,
      status: updatedOrder!.status,
      orderType: updatedOrder!.orderType,
      deliveryAddress: updatedOrder!.deliveryAddress,
      paymentStatus: updatedOrder!.paymentStatus,
      paymentMethod: updatedOrder!.paymentMethod,
      notes: updatedOrder!.notes,
      estimatedReadyTime: updatedOrder!.estimatedReadyTime,
      actualReadyTime: updatedOrder!.actualReadyTime,
      deliveredAt: updatedOrder!.deliveredAt,
      createdAt: updatedOrder!.createdAt,
      updatedAt: updatedOrder!.updatedAt,
    })
  } catch (error) {
    console.error("Order update error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()

    // Instead of deleting, mark as cancelled
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status: "cancelled",
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Order cancellation error:", error)
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
  }
}
