import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const client = new MongoClient(
  "mongodb://root:gI1LfzCG0X9Mb5K6aOgbrr3ORCjskW4VXIrIAS34vIQMuG4XAnYX4P5cDpt2cCXP@54.37.254.81:20199/?directConnection=true",
)

export async function GET() {
  try {
    await client.connect()
    const db = client.db("pizzeria_mirti")

    // Get current date for calculations
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Fetch recent orders
    const recentOrders = await db.collection("orders").find({}).sort({ orderTime: -1 }).limit(10).toArray()

    // Calculate stats
    const totalOrders = await db.collection("orders").countDocuments()
    const totalRevenue = await db
      .collection("orders")
      .aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }])
      .toArray()

    const totalCustomers = await db.collection("customers").countDocuments()

    // Mock some sample data for demo
    const stats = {
      totalRevenue: totalRevenue[0]?.total || 12450.75,
      revenueChange: 12.5,
      totalOrders: totalOrders || 156,
      ordersChange: 8.2,
      totalCustomers: totalCustomers || 89,
      customersChange: 15.3,
      avgOrderValue: totalRevenue[0]?.total ? totalRevenue[0].total / totalOrders : 79.81,
      avgOrderChange: -2.1,
    }

    // Top products (mock data for now)
    const topProducts = [
      {
        id: "1",
        name: "Salmon & Zucchini Flatbread",
        sales: 24,
        revenue: 420.0,
        change: 15.2,
      },
      {
        id: "2",
        name: "Pear & Gorgonzola Flatbread",
        sales: 18,
        revenue: 279.0,
        change: 8.7,
      },
      {
        id: "3",
        name: "Beef Carpaccio Platter",
        sales: 12,
        revenue: 222.0,
        change: -5.3,
      },
      {
        id: "4",
        name: "Classic Marinara Pizza",
        sales: 32,
        revenue: 304.0,
        change: 22.1,
      },
    ]

    return NextResponse.json({
      stats,
      recentOrders: recentOrders.map((order) => ({
        id: order._id.toString(),
        customer: order.customer?.name || "Unknown Customer",
        items: order.items?.length || 0,
        total: order.total || 0,
        status: order.status || "pending",
        time: order.orderTime ? new Date(order.orderTime).toLocaleString() : "Unknown",
      })),
      topProducts,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  } finally {
    await client.close()
  }
}
