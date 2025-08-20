"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card"
import { Button } from "@/presentation/components/ui/button"
import { Badge } from "@/presentation/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs"
import { Clock, CheckCircle, AlertCircle, XCircle, Phone, MapPin, User, CreditCard, Banknote } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Customer {
  name: string
  email: string
  phone: string
  address: string
}

interface Order {
  _id: string
  customer: Customer
  items: OrderItem[]
  total: number
  status: string
  orderTime: string
  estimatedTime: string
  notes?: string
  paymentMethod: string
  deliveryFee: number
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("all")

  const statusOptions = [
    { value: "all", label: "All Orders", count: 0 },
    { value: "pending", label: "Pending", count: 0 },
    { value: "preparing", label: "Preparing", count: 0 },
    { value: "ready", label: "Ready", count: 0 },
    { value: "delivered", label: "Delivered", count: 0 },
    { value: "cancelled", label: "Cancelled", count: 0 },
  ]

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "preparing":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = selectedStatus === "all" ? orders : orders.filter((order) => order.status === selectedStatus)

  // Update status counts
  statusOptions.forEach((option) => {
    if (option.value === "all") {
      option.count = orders.length
    } else {
      option.count = orders.filter((order) => order.status === option.value).length
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
        <p className="text-muted-foreground">Track and manage all customer orders in real-time.</p>
      </div>

      {/* Status Tabs */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList className="grid w-full grid-cols-6">
          {statusOptions.map((option) => (
            <TabsTrigger key={option.value} value={option.value} className="relative">
              {option.label}
              {option.count > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {option.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedStatus} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No {selectedStatus === "all" ? "" : selectedStatus} orders found.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <Card key={order._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <CardTitle className="text-lg">Order #{order._id.slice(-6)}</CardTitle>
                          <CardDescription>{new Date(order.orderTime).toLocaleString()}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <span className="text-2xl font-bold text-orange-600">€{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Customer Info */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Customer Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Name:</strong> {order.customer.name}
                          </p>
                          <p className="flex items-center">
                            <Phone className="mr-2 h-3 w-3" />
                            {order.customer.phone}
                          </p>
                          <p className="flex items-start">
                            <MapPin className="mr-2 h-3 w-3 mt-0.5" />
                            {order.customer.address}
                          </p>
                          <p className="flex items-center">
                            {order.paymentMethod === "Credit Card" ? (
                              <CreditCard className="mr-2 h-3 w-3" />
                            ) : (
                              <Banknote className="mr-2 h-3 w-3" />
                            )}
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span>€{(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                          ))}
                          {order.deliveryFee > 0 && (
                            <div className="flex justify-between text-sm border-t pt-2">
                              <span>Delivery Fee</span>
                              <span>€{order.deliveryFee.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold border-t pt-2">
                            <span>Total</span>
                            <span>€{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">
                          <strong>Notes:</strong> {order.notes}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      {order.status === "pending" && (
                        <Button
                          onClick={() => updateOrderStatus(order._id, "preparing")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Start Preparing
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          onClick={() => updateOrderStatus(order._id, "ready")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Ready
                        </Button>
                      )}
                      {order.status === "ready" && (
                        <Button
                          onClick={() => updateOrderStatus(order._id, "delivered")}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          Mark Delivered
                        </Button>
                      )}
                      {(order.status === "pending" || order.status === "preparing") && (
                        <Button variant="destructive" onClick={() => updateOrderStatus(order._id, "cancelled")}>
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
