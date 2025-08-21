"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Search, Eye, CheckCircle, Clock, Package, Truck } from "lucide-react"

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  orderDate: string
  deliveryAddress?: string
  notes?: string
}

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
  preparing: { color: "bg-blue-100 text-blue-800", icon: Package, label: "Preparing" },
  ready: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Ready" },
  delivered: { color: "bg-gray-100 text-gray-800", icon: Truck, label: "Delivered" },
  cancelled: { color: "bg-red-100 text-red-800", icon: Clock, label: "Cancelled" },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockOrders: Order[] = [
        {
          id: "ORD-001",
          customerName: "Marco Rossi",
          customerEmail: "marco.rossi@email.com",
          customerPhone: "+39 123 456 7890",
          items: [
            { name: "Margherita Pizza", quantity: 1, price: 14.5 },
            { name: "Bresaola Flatbread", quantity: 1, price: 18.0 },
          ],
          total: 32.5,
          status: "preparing",
          orderDate: "2024-01-15T14:30:00Z",
          deliveryAddress: "Via Roma 123, Milano",
          notes: "Extra basil please",
        },
        {
          id: "ORD-002",
          customerName: "Sofia Bianchi",
          customerEmail: "sofia.bianchi@email.com",
          customerPhone: "+39 987 654 3210",
          items: [
            { name: "Carpaccio", quantity: 1, price: 22.0 },
            { name: "Pear & Gorgonzola Flatbread", quantity: 1, price: 17.0 },
          ],
          total: 39.0,
          status: "pending",
          orderDate: "2024-01-15T14:25:00Z",
          deliveryAddress: "Corso Buenos Aires 45, Milano",
        },
        {
          id: "ORD-003",
          customerName: "Giuseppe Verde",
          customerEmail: "giuseppe.verde@email.com",
          customerPhone: "+39 555 123 4567",
          items: [
            { name: "Calzone Classico", quantity: 1, price: 16.5 },
            { name: "Caprese Sandwich", quantity: 1, price: 12.5 },
          ],
          total: 29.0,
          status: "ready",
          orderDate: "2024-01-15T14:20:00Z",
          deliveryAddress: "Piazza Duomo 1, Milano",
        },
      ]

      setOrders(mockOrders)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

      toast({
        title: "Success",
        description: `Order ${orderId} status updated to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-gray-600">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusInfo = statusConfig[order.status]
          const StatusIcon = statusInfo.icon

          return (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <p className="text-gray-600">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                    <span className="text-xl font-bold">€{order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>€{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-1">Delivery Address:</h4>
                    <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                  </div>
                )}

                {order.notes && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-1">Notes:</h4>
                    <p className="text-sm text-gray-600">{order.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>

                  {order.status === "pending" && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, "preparing")}>
                      Start Preparing
                    </Button>
                  )}

                  {order.status === "preparing" && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, "ready")}>
                      Mark Ready
                    </Button>
                  )}

                  {order.status === "ready" && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, "delivered")}>
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found matching your criteria.</p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  )
}

function OrderDetailsModal({
  order,
  onClose,
  onUpdateStatus,
}: {
  order: Order
  onClose: () => void
  onUpdateStatus: (orderId: string, status: Order["status"]) => void
}) {
  const statusInfo = statusConfig[order.status]
  const StatusIcon = statusInfo.icon

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Order Details - {order.id}</CardTitle>
              <CardDescription>{new Date(order.orderDate).toLocaleString()}</CardDescription>
            </div>
            <Badge className={statusInfo.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Name:</strong> {order.customerName}
              </p>
              <p>
                <strong>Email:</strong> {order.customerEmail}
              </p>
              <p>
                <strong>Phone:</strong> {order.customerPhone}
              </p>
              {order.deliveryAddress && (
                <p>
                  <strong>Address:</strong> {order.deliveryAddress}
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-2">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center p-2 bg-red-50 rounded font-bold">
                <span>Total</span>
                <span>€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="font-semibold mb-2">Special Notes</h3>
              <p className="text-sm bg-yellow-50 p-2 rounded">{order.notes}</p>
            </div>
          )}

          {/* Status Update Actions */}
          <div>
            <h3 className="font-semibold mb-2">Update Status</h3>
            <div className="flex gap-2 flex-wrap">
              {order.status === "pending" && (
                <Button
                  size="sm"
                  onClick={() => {
                    onUpdateStatus(order.id, "preparing")
                    onClose()
                  }}
                >
                  Start Preparing
                </Button>
              )}

              {order.status === "preparing" && (
                <Button
                  size="sm"
                  onClick={() => {
                    onUpdateStatus(order.id, "ready")
                    onClose()
                  }}
                >
                  Mark Ready
                </Button>
              )}

              {order.status === "ready" && (
                <Button
                  size="sm"
                  onClick={() => {
                    onUpdateStatus(order.id, "delivered")
                    onClose()
                  }}
                >
                  Mark Delivered
                </Button>
              )}

              {order.status !== "cancelled" && order.status !== "delivered" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onUpdateStatus(order.id, "cancelled")
                    onClose()
                  }}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
