import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()

    // Get current date ranges
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Aggregate dashboard statistics
    const [todayOrders, monthOrders, lastMonthOrders, totalCustomers, recentOrders, popularItems, lowStockItems] =
      await Promise.all([
        // Today's orders
        db
          .collection("orders")
          .aggregate([
            { $match: { createdAt: { $gte: startOfDay } } },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: "$total" },
                pendingOrders: {
                  $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                },
                completedOrders: {
                  $sum: { $cond: [{ $in: ["$status", ["delivered", "ready"]] }, 1, 0] },
                },
              },
            },
          ])
          .toArray(),

        // This month's orders
        db
          .collection("orders")
          .aggregate([
            { $match: { createdAt: { $gte: startOfMonth } } },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: "$total" },
              },
            },
          ])
          .toArray(),

        // Last month's orders for comparison
        db
          .collection("orders")
          .aggregate([
            {
              $match: {
                createdAt: {
                  $gte: startOfLastMonth,
                  $lte: endOfLastMonth,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: "$total" },
              },
            },
          ])
          .toArray(),

        // Total customers
        db
          .collection("customers")
          .countDocuments(),

        // Recent orders
        db
          .collection("orders")
          .find({})
          .sort({ createdAt: -1 })
          .limit(10)
          .toArray(),

        // Popular menu items
        db
          .collection("orders")
          .aggregate([
            { $unwind: "$items" },
            {
              $group: {
                _id: "$items.menuItemId",
                name: { $first: "$items.name" },
                totalOrdered: { $sum: "$items.quantity" },
                revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
              },
            },
            { $sort: { totalOrdered: -1 } },
            { $limit: 5 },
          ])
          .toArray(),

        // Low stock items (placeholder - you'd implement inventory tracking)
        db
          .collection("menu_items")
          .find({ available: false })
          .limit(5)
          .toArray(),
      ])

    const todayStats = todayOrders[0] || { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, completedOrders: 0 }
    const monthStats = monthOrders[0] || { totalOrders: 0, totalRevenue: 0 }
    const lastMonthStats = lastMonthOrders[0] || { totalOrders: 0, totalRevenue: 0 }

    // Calculate growth percentages
    const revenueGrowth =
      lastMonthStats.totalRevenue > 0
        ? ((monthStats.totalRevenue - lastMonthStats.totalRevenue) / lastMonthStats.totalRevenue) * 100
        : 0

    const orderGrowth =
      lastMonthStats.totalOrders > 0
        ? ((monthStats.totalOrders - lastMonthStats.totalOrders) / lastMonthStats.totalOrders) * 100
        : 0

    const averageOrderValue = monthStats.totalOrders > 0 ? monthStats.totalRevenue / monthStats.totalOrders : 0

    return NextResponse.json({
      stats: {
        totalRevenue: monthStats.totalRevenue,
        totalOrders: monthStats.totalOrders,
        totalCustomers,
        averageOrderValue,
        pendingOrders: todayStats.pendingOrders,
        completedOrders: todayStats.completedOrders,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        orderGrowth: Math.round(orderGrowth * 100) / 100,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order._id,
        orderNumber: order.orderNumber,
        customerName: order.customerInfo.name,
        items: order.items.map((item) => item.name),
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      })),
      popularItems,
      lowStockItems: lowStockItems.map((item) => ({
        id: item._id,
        name: item.name,
        category: item.category,
      })),
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
