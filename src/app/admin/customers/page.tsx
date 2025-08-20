"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/card"
import { Badge } from "@/src/presentation/components/ui/badge"
import { Button } from "@/src/presentation/components/ui/button"
import { Input } from "@/src/presentation/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/presentation/components/ui/tabs"
import { useToast } from "@/src/presentation/hooks/use-toast"
import { Search, Filter, Eye, Mail, Phone, MapPin, Calendar, Star, ShoppingBag, Ban, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate: string
  status: "active" | "inactive" | "blocked"
  loyaltyPoints: number
  favoriteItems: string[]
}

export default function CustomersManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers")
      const data = await response.json()
      setCustomers(data.customers || [])
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateCustomerStatus = async (customerId: string, status: Customer["status"]) => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setCustomers(customers.map((c) => (c._id === customerId ? { ...c, status } : c)))
        toast({
          title: "Customer updated",
          description: `Customer status changed to ${status}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      })
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesTab = selectedTab === "all" || customer.status === selectedTab
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    return matchesTab && matchesSearch
  })

  const customerTabs = [
    { id: "all", name: "All Customers", count: customers.length },
    { id: "active", name: "Active", count: customers.filter((c) => c.status === "active").length },
    { id: "inactive", name: "Inactive", count: customers.filter((c) => c.status === "inactive").length },
    { id: "blocked", name: "Blocked", count: customers.filter((c) => c.status === "blocked").length },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-heading text-brown">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage customer accounts and view customer insights.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-brown">{customers.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-brown">{customers.filter((c) => c.status === "active").length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-brown">
                  €
                  {customers.length > 0
                    ? (customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-brown">
                  €{customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          {customerTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-xs sm:text-sm">
              {tab.name}
              <Badge variant="secondary" className="ml-2">
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg text-brown">{customer.name}</CardTitle>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                      </div>
                      <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Orders</p>
                        <p className="font-medium">{customer.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Spent</p>
                        <p className="font-medium">€{customer.totalSpent.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Order</p>
                        <p className="font-medium">€{customer.averageOrderValue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Loyalty Points</p>
                        <p className="font-medium">{customer.loyaltyPoints}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{customer.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(customer.joinDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCustomer(customer)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>

                      {customer.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCustomerStatus(customer._id, "blocked")}
                          className="text-red hover:text-red-dark"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}

                      {customer.status === "blocked" && (
                        <Button
                          size="sm"
                          onClick={() => updateCustomerStatus(customer._id, "active")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-brown">Customer Details - {selectedCustomer.name}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedCustomer(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-brown mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>{selectedCustomer.address}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-brown mb-3">Order Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-xl font-bold text-brown">{selectedCustomer.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="text-xl font-bold text-brown">€{selectedCustomer.totalSpent.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Average Order</p>
                        <p className="text-xl font-bold text-brown">€{selectedCustomer.averageOrderValue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Loyalty Points</p>
                        <p className="text-xl font-bold text-brown">{selectedCustomer.loyaltyPoints}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-brown mb-3">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={getStatusColor(selectedCustomer.status)}>{selectedCustomer.status}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Join Date</p>
                      <p className="font-medium">{new Date(selectedCustomer.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Order</p>
                      <p className="font-medium">{new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {selectedCustomer.favoriteItems.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-brown mb-3">Favorite Items</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.favoriteItems.map((item, index) => (
                        <Badge key={index} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
