"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/card"
import { Button } from "@/src/presentation/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/presentation/components/ui/tabs"
import { TrendingUp, TrendingDown, Euro, ShoppingCart, Users, Download, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

interface AnalyticsData {
  revenue: {
    total: number
    change: number
    daily: Array<{ date: string; amount: number }>
    monthly: Array<{ month: string; amount: number }>
  }
  orders: {
    total: number
    change: number
    byStatus: Array<{ status: string; count: number }>
    byHour: Array<{ hour: number; count: number }>
  }
  customers: {
    total: number
    new: number
    returning: number
    topCustomers: Array<{ name: string; spent: number; orders: number }>
  }
  products: {
    topSelling: Array<{ name: string; sold: number; revenue: number }>
    categories: Array<{ category: string; revenue: number; percentage: number }>
  }
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?period=${selectedPeriod}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/analytics/export?type=${type}&period=${selectedPeriod}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}-analytics-${selectedPeriod}.csv`
      a.click()
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red"></div>
      </div>
    )
  }

  if (!analytics) {
    return <div>Error loading analytics data</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-heading text-brown">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your restaurant's performance and insights.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <Button variant="outline" onClick={() => exportData("revenue")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-brown">€{analytics.revenue.total.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Euro className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {analytics.revenue.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${analytics.revenue.change > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {analytics.revenue.change > 0 ? "+" : ""}
                  {analytics.revenue.change.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-brown">{analytics.orders.total}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {analytics.orders.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${analytics.orders.change > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {analytics.orders.change > 0 ? "+" : ""}
                  {analytics.orders.change.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-brown">{analytics.customers.total}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-sm text-green-600 font-medium">+{analytics.customers.new}</span>
                <span className="text-sm text-gray-500 ml-2">new customers</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-brown">
                    €{(analytics.revenue.total / analytics.orders.total).toFixed(2)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-sm text-gray-500">{analytics.customers.returning} returning customers</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-brown">Daily Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Revenue chart would be displayed here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-brown">Monthly Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.revenue.monthly.slice(0, 6).map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red h-2 rounded-full"
                            style={{
                              width: `${(month.amount / Math.max(...analytics.revenue.monthly.map((m) => m.amount))) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-brown">€{month.amount.toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-brown">Orders by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.orders.byStatus.map((status) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red rounded-full"></div>
                        <span className="text-sm font-medium capitalize">{status.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-brown">{status.count}</span>
                        <span className="text-xs text-gray-500">
                          ({((status.count / analytics.orders.total) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-brown">Peak Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.orders.byHour
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 8)
                    .map((hour) => (
                      <div key={hour.hour} className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {hour.hour}:00 - {hour.hour + 1}:00
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(hour.count / Math.max(...analytics.orders.byHour.map((h) => h.count))) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-brown">{hour.count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-brown">Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.customers.topCustomers.map((customer, index) => (
                  <div key={customer.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brown">€{customer.spent.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">total spent</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-brown">Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.products.topSelling.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-red text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sold} sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brown text-sm">€{product.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-brown">Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.products.categories.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{category.category}</span>
                        <span className="text-sm font-bold text-brown">€{category.revenue.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red h-2 rounded-full" style={{ width: `${category.percentage}%` }}></div>
                      </div>
                      <div className="text-xs text-gray-500 text-right">{category.percentage.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
