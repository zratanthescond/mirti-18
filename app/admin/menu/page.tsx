"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
  popular: boolean
}

const categories = ["flatbreads", "pizzas", "antipasti", "sandwiches", "calzones"]

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockItems: MenuItem[] = [
        {
          id: "1",
          name: "Bresaola & Arugula",
          description: "Bresaola, fresh arugula, Parmigiano-Reggiano, lemon zest",
          price: 18.0,
          category: "flatbreads",
          image: "/images/bresaola-arugula-flatbread.jpeg",
          available: true,
          popular: true,
        },
        {
          id: "2",
          name: "Margherita Classica",
          description: "San Marzano tomatoes, fresh mozzarella, basil",
          price: 14.5,
          category: "pizzas",
          image: "/images/classic-marinara.jpeg",
          available: true,
          popular: true,
        },
        {
          id: "3",
          name: "Carpaccio di Manzo",
          description: "Thinly sliced raw beef, arugula, capers, Parmigiano",
          price: 22.0,
          category: "antipasti",
          image: "/images/carpaccio-platter.jpeg",
          available: true,
          popular: false,
        },
      ]

      setMenuItems(mockItems)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch menu items",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSaveItem = async (item: Omit<MenuItem, "id">) => {
    try {
      if (editingItem) {
        // Update existing item
        setMenuItems((prev) => prev.map((i) => (i.id === editingItem.id ? { ...item, id: editingItem.id } : i)))
        toast({
          title: "Success",
          description: "Menu item updated successfully",
        })
      } else {
        // Add new item
        const newItem: MenuItem = { ...item, id: Date.now().toString() }
        setMenuItems((prev) => [...prev, newItem])
        toast({
          title: "Success",
          description: "Menu item added successfully",
        })
      }
      setEditingItem(null)
      setIsAddingNew(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      setMenuItems((prev) => prev.filter((item) => item.id !== id))
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant's menu items</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              {item.popular && <Badge className="absolute top-2 left-2 bg-red-600">Popular</Badge>}
              {!item.available && <Badge className="absolute top-2 right-2 bg-gray-600">Unavailable</Badge>}
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <span className="text-xl font-bold text-red-600">€{item.price}</span>
              </div>
              <CardDescription>{item.description}</CardDescription>
              <Badge variant="outline" className="w-fit">
                {item.category}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(isAddingNew || editingItem) && (
        <MenuItemForm
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={() => {
            setIsAddingNew(false)
            setEditingItem(null)
          }}
        />
      )}
    </div>
  )
}

function MenuItemForm({
  item,
  onSave,
  onCancel,
}: {
  item: MenuItem | null
  onSave: (item: Omit<MenuItem, "id">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || 0,
    category: item?.category || "flatbreads",
    image: item?.image || "",
    available: item?.available ?? true,
    popular: item?.popular || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{item ? "Edit Menu Item" : "Add New Menu Item"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="/images/item-name.jpeg"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData((prev) => ({ ...prev, available: e.target.checked }))}
                />
                Available
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => setFormData((prev) => ({ ...prev, popular: e.target.checked }))}
                />
                Popular
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {item ? "Update" : "Add"} Item
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
