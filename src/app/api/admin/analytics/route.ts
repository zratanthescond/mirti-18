import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "7d"

    await client.connect()
    const db = client.db("pizzeria_mirti")

    // Calculate date range based on period
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Fetch orders for the period
    const orders = await db
      .collection("orders")
      .find({
        orderTime: { $gte: startDate, $lte: now },
      })
      .toArray()

    // Fetch customers
    const customers = await db.collection("customers").find({}).toArray()

    // Fetch products
    const products = await db.collection("products").find({}).toArray()

    // Calculate analytics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const previousPeriodOrders = await db
      .collection("orders")
      .find({
        orderTime: {
          $gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
          $lt: startDate,
        },
      })
      .toArray()

    const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.total, 0)
    const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

    const analytics = {
      revenue: {
        total: totalRevenue,
        change: revenueChange,
        daily: [], // Would calculate daily breakdown
        monthly: [], // Would calculate monthly breakdown
      },
      orders: {
        total: orders.length,
        change:
          previousPeriodOrders.length > 0
            ? ((orders.length - previousPeriodOrders.length) / previousPeriodOrders.length) * 100
            : 0,
        byStatus: [
          { status: "pending", count: orders.filter((o) => o.status === "pending").length },
          { status: "preparing", count: orders.filter((o) => o.status === "preparing").length },
          { status: "ready", count: orders.filter((o) => o.status === "ready").length },
          { status: "delivered", count: orders.filter((o) => o.status === "delivered").length },
        ],
        byHour: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          count: orders.filter((o) => new Date(o.orderTime).getHours() === hour).length,
        })),
      },
      customers: {
        total: customers.length,
        new: customers.filter((c) => new Date(c.joinDate) >= startDate).length,
        returning: customers.filter((c) => c.totalOrders > 1).length,
        topCustomers: customers
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 10)
          .map((c) => ({ name: c.name, spent: c.totalSpent, orders: c.totalOrders })),
      },
      products: {
        topSelling: [], // Would calculate from order items
        categories: [], // Would calculate category breakdown
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  } finally {
    await client.close()
  }
}
