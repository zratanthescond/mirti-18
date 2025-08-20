"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/card"
import { Badge } from "@/src/presentation/components/ui/badge"
import { Button } from "@/src/presentation/components/ui/button"
import { Input } from "@/src/presentation/components/ui/input"
import { Label } from "@/src/presentation/components/ui/label"
import { Textarea } from "@/src/presentation/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/presentation/components/ui/tabs"
import { useToast } from "@/src/presentation/hooks/use-toast"
import { Plus, Edit, Trash2, Calendar, Clock, Leaf, Snowflake, Sun, Flower, Save, X, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Special {
  _id: string
  name: string
  description: string
  price: number
  image: string
  type: "daily" | "seasonal"
  day?: string
  season?: string
  ingredients: string[]
  available: boolean
  popular: boolean
  startDate?: string
  endDate?: string
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const seasons = ["spring", "summer", "autumn", "winter"]

const getSeasonIcon = (season: string) => {
  switch (season) {
    case "spring":
      return <Flower className="w-5 h-5 text-green-600" />
    case "summer":
      return <Sun className="w-5 h-5 text-yellow-500" />
    case "autumn":
      return <Leaf className="w-5 h-5 text-orange-500" />
    case "winter":
      return <Snowflake className="w-5 h-5 text-blue-500" />
    default:
      return <Calendar className="w-5 h-5 text-gray-500" />
  }
}

export default function SpecialsManagement() {
  const [specials, setSpecials] = useState<Special[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSpecial, setEditingSpecial] = useState<Special | null>(null)
  const [selectedTab, setSelectedTab] = useState("daily")
  const [newSpecial, setNewSpecial] = useState<Partial<Special>>({
    name: "",
    description: "",
    price: 0,
    type: "daily",
    ingredients: [],
    available: true,
    popular: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSpecials()
  }, [])

  const fetchSpecials = async () => {
    try {
      const response = await fetch("/api/admin/specials")
      const data = await response.json()
      setSpecials(data.specials || [])
    } catch (error) {
      console.error("Error fetching specials:", error)
      toast({
        title: "Error",
        description: "Failed to load specials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddSpecial = async () => {
    if (!newSpecial.name || !newSpecial.description || !newSpecial.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/admin/specials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSpecial),
      })

      if (response.ok) {
        const data = await response.json()
        setSpecials([...specials, data.special])
        resetForm()
        toast({
          title: "Special added!",
          description: `${newSpecial.name} has been added to specials.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add special",
        variant: "destructive",
      })
    }
  }

  const handleUpdateSpecial = async () => {
    if (!editingSpecial) return

    try {
      const response = await fetch(`/api/admin/specials/${editingSpecial._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSpecial),
      })

      if (response.ok) {
        const data = await response.json()
        setSpecials(specials.map((s) => (s._id === editingSpecial._id ? data.special : s)))
        resetForm()
        toast({
          title: "Special updated!",
          description: "The special has been successfully updated.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update special",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSpecial = async (specialId: string) => {
    try {
      const response = await fetch(`/api/admin/specials/${specialId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSpecials(specials.filter((s) => s._id !== specialId))
        toast({
          title: "Special deleted",
          description: "The special has been removed.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete special",
        variant: "destructive",
      })
    }
  }

  const toggleAvailability = async (specialId: string) => {
    try {
      const special = specials.find((s) => s._id === specialId)
      if (!special) return

      const response = await fetch(`/api/admin/specials/${specialId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !special.available }),
      })

      if (response.ok) {
        setSpecials(specials.map((s) => (s._id === specialId ? { ...s, available: !s.available } : s)))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setNewSpecial({
      name: "",
      description: "",
      price: 0,
      type: "daily",
      ingredients: [],
      available: true,
      popular: false,
    })
    setEditingSpecial(null)
    setShowAddForm(false)
  }

  const handleEditSpecial = (special: Special) => {
    setEditingSpecial(special)
    setNewSpecial(special)
    setShowAddForm(true)
  }

  const filteredSpecials = specials.filter((special) => special.type === selectedTab)

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
          <h1 className="text-3xl font-heading text-brown">Daily & Seasonal Specials</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant's special offerings and seasonal menu items.</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="mt-4 sm:mt-0 bg-red hover:bg-red-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Special
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Daily Specials
            <Badge variant="secondary">{specials.filter((s) => s.type === "daily").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Seasonal Specials
            <Badge variant="secondary">{specials.filter((s) => s.type === "seasonal").length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecials.map((special, index) => (
              <motion.div
                key={special._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`overflow-hidden ${!special.available ? "opacity-60" : ""}`}>
                  <div className="relative h-48">
                    <Image src={special.image || "/placeholder.svg"} alt={special.name} fill className="object-cover" />
                    <div className="absolute top-2 left-2 flex gap-2">
                      {special.popular && <Badge className="bg-red text-white">Popular</Badge>}
                      {!special.available && <Badge variant="secondary">Unavailable</Badge>}
                      {special.day && (
                        <Badge className="bg-blue-600 text-white">
                          <Clock className="w-3 h-3 mr-1" />
                          {special.day}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-heading text-brown mb-2">{special.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{special.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-red">€{special.price.toFixed(2)}</span>
                        <Badge variant="outline" className="capitalize">
                          {special.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAvailability(special._id)}
                        className="flex-1"
                      >
                        {special.available ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Show
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditSpecial(special)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSpecial(special._id)}
                        className="text-red hover:text-red-dark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seasonal" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecials.map((special, index) => (
              <motion.div
                key={special._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`overflow-hidden ${!special.available ? "opacity-60" : ""}`}>
                  <div className="relative h-48">
                    <Image src={special.image || "/placeholder.svg"} alt={special.name} fill className="object-cover" />
                    <div className="absolute top-2 left-2 flex gap-2">
                      {special.popular && <Badge className="bg-red text-white">Popular</Badge>}
                      {!special.available && <Badge variant="secondary">Unavailable</Badge>}
                      {special.season && (
                        <Badge className="bg-green-600 text-white flex items-center gap-1">
                          {getSeasonIcon(special.season)}
                          <span className="capitalize">{special.season}</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-heading text-brown mb-2">{special.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{special.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-red">€{special.price.toFixed(2)}</span>
                        <Badge variant="outline" className="capitalize">
                          {special.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAvailability(special._id)}
                        className="flex-1"
                      >
                        {special.available ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Show
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditSpecial(special)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSpecial(special._id)}
                        className="text-red hover:text-red-dark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Special Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-brown">{editingSpecial ? "Edit Special" : "Add New Special"}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={resetForm}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Special Name *</Label>
                      <Input
                        id="name"
                        value={newSpecial.name || ""}
                        onChange={(e) => setNewSpecial({ ...newSpecial, name: e.target.value })}
                        placeholder="Enter special name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (€) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newSpecial.price || ""}
                        onChange={(e) => setNewSpecial({ ...newSpecial, price: Number.parseFloat(e.target.value) })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newSpecial.description || ""}
                      onChange={(e) => setNewSpecial({ ...newSpecial, description: e.target.value })}
                      placeholder="Enter special description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Special Type</Label>
                      <select
                        id="type"
                        value={newSpecial.type || "daily"}
                        onChange={(e) => setNewSpecial({ ...newSpecial, type: e.target.value as "daily" | "seasonal" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                      >
                        <option value="daily">Daily Special</option>
                        <option value="seasonal">Seasonal Special</option>
                      </select>
                    </div>

                    {newSpecial.type === "daily" && (
                      <div>
                        <Label htmlFor="day">Day</Label>
                        <select
                          id="day"
                          value={newSpecial.day || ""}
                          onChange={(e) => setNewSpecial({ ...newSpecial, day: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                        >
                          <option value="">Select Day</option>
                          {days.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {newSpecial.type === "seasonal" && (
                      <div>
                        <Label htmlFor="season">Season</Label>
                        <select
                          id="season"
                          value={newSpecial.season || ""}
                          onChange={(e) => setNewSpecial({ ...newSpecial, season: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                        >
                          <option value="">Select Season</option>
                          {seasons.map((season) => (
                            <option key={season} value={season}>
                              {season.charAt(0).toUpperCase() + season.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
                    <Input
                      id="ingredients"
                      value={newSpecial.ingredients?.join(", ") || ""}
                      onChange={(e) =>
                        setNewSpecial({
                          ...newSpecial,
                          ingredients: e.target.value
                            .split(",")
                            .map((i) => i.trim())
                            .filter((i) => i),
                        })
                      }
                      placeholder="Ingredient 1, Ingredient 2, Ingredient 3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Special Image</Label>
                    <Input
                      id="image"
                      value={newSpecial.image || ""}
                      onChange={(e) => setNewSpecial({ ...newSpecial, image: e.target.value })}
                      placeholder="Image URL"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newSpecial.popular || false}
                        onChange={(e) => setNewSpecial({ ...newSpecial, popular: e.target.checked })}
                        className="rounded border-gray-300 text-red focus:ring-red"
                      />
                      <span className="text-sm">Mark as Popular</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newSpecial.available !== false}
                        onChange={(e) => setNewSpecial({ ...newSpecial, available: e.target.checked })}
                        className="rounded border-gray-300 text-red focus:ring-red"
                      />
                      <span className="text-sm">Available</span>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={editingSpecial ? handleUpdateSpecial : handleAddSpecial}
                      className="flex-1 bg-red hover:bg-red-dark"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingSpecial ? "Update Special" : "Add Special"}
                    </Button>
                    <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
