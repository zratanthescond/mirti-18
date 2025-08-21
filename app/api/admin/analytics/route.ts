import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(request.url)

    const period = searchParams.get("period") || "30" // days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(period))

    // Revenue analytics
    const revenueData = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $in: ["delivered", "ready"] },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ])
      .toArray()

    // Popular items
    const popularItems = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.name",
            totalOrdered: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { totalOrdered: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    // Customer analytics
    const customerStats = await db
      .collection("customers")
      .aggregate([
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            avgTotalSpent: { $avg: "$totalSpent" },
            avgTotalOrders: { $avg: "$totalOrders" },
          },
        },
      ])
      .toArray()

    // Order status distribution
    const orderStatusDistribution = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    // Peak hours analysis
    const peakHours = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: { $hour: "$createdAt" },
            orders: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray()

    // Category performance
    const categoryPerformance = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "menu_items",
            localField: "items.menuItemId",
            foreignField: "_id",
            as: "menuItem",
          },
        },
        { $unwind: "$menuItem" },
        {
          $group: {
            _id: "$menuItem.category",
            totalOrdered: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { revenue: -1 } },
      ])
      .toArray()

    return NextResponse.json({
      period: Number.parseInt(period),
      revenue: {
        daily: revenueData.map((item) => ({
          date: `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`,
          revenue: item.revenue,
          orders: item.orders,
        })),
        total: revenueData.reduce((sum, item) => sum + item.revenue, 0),
        totalOrders: revenueData.reduce((sum, item) => sum + item.orders, 0),
      },
      popularItems: popularItems.map((item) => ({
        name: item._id,
        quantity: item.totalOrdered,
        revenue: item.revenue,
      })),
      customers: customerStats[0] || {
        totalCustomers: 0,
        avgTotalSpent: 0,
        avgTotalOrders: 0,
      },
      orderStatus: orderStatusDistribution.map((item) => ({
        status: item._id,
        count: item.count,
      })),
      peakHours: peakHours.map((item) => ({
        hour: item._id,
        orders: item.orders,
        revenue: item.revenue,
      })),
      categories: categoryPerformance.map((item) => ({
        category: item._id,
        quantity: item.totalOrdered,
        revenue: item.revenue,
      })),
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
