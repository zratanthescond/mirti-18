"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Star, Clock } from "lucide-react"

const menuItems = [
  // Flatbreads
  {
    id: "1",
    name: "Bresaola & Arugula",
    description: "Bresaola, fresh arugula, Parmigiano-Reggiano, lemon zest, extra virgin olive oil",
    price: 18.0,
    image: "/images/bresaola-arugula-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.9,
    prepTime: "10-12 min",
    popular: true,
  },
  {
    id: "2",
    name: "Ham & Pesto",
    description: "Prosciutto di Parma, house-made basil pesto, fresh mozzarella, cherry tomatoes",
    price: 16.5,
    image: "/images/ham-pesto-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.7,
    prepTime: "10-12 min",
  },
  {
    id: "3",
    name: "Salmon & Zucchini",
    description: "Smoked salmon, grilled zucchini, cream cheese, capers, fresh dill",
    price: 19.5,
    image: "/images/salmon-zucchini-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.8,
    prepTime: "12-14 min",
  },
  {
    id: "4",
    name: "Pear & Gorgonzola",
    description: "Sliced pears, gorgonzola cheese, walnuts, honey drizzle, arugula",
    price: 17.0,
    image: "/images/pear-gorgonzola-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.6,
    prepTime: "10-12 min",
  },
  {
    id: "5",
    name: "Turkey & Corn",
    description: "Roasted turkey, sweet corn, red onions, mozzarella, BBQ sauce drizzle",
    price: 16.0,
    image: "/images/turkey-corn-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.5,
    prepTime: "12-14 min",
  },
  {
    id: "6",
    name: "Caramelized Onion",
    description: "Caramelized onions, goat cheese, fresh thyme, balsamic glaze",
    price: 15.5,
    image: "/images/caramelized-onion-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.4,
    prepTime: "10-12 min",
  },

  // Pizzas
  {
    id: "7",
    name: "Margherita Classica",
    description: "San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil",
    price: 14.5,
    image: "/images/classic-marinara.jpeg",
    category: "pizzas",
    rating: 4.8,
    prepTime: "12-15 min",
    popular: true,
  },
  {
    id: "8",
    name: "Quattro Stagioni",
    description: "Tomato sauce, mozzarella, ham, mushrooms, artichokes, olives",
    price: 18.5,
    image: "/images/pepper-pizza.jpeg",
    category: "pizzas",
    rating: 4.7,
    prepTime: "14-16 min",
  },

  // Antipasti
  {
    id: "9",
    name: "Carpaccio di Manzo",
    description: "Thinly sliced raw beef, arugula, capers, Parmigiano shavings, lemon",
    price: 22.0,
    image: "/images/carpaccio-platter.jpeg",
    category: "antipasti",
    rating: 4.9,
    prepTime: "8-10 min",
    popular: true,
  },

  // Sandwiches
  {
    id: "10",
    name: "Panino Caprese",
    description: "Fresh mozzarella, tomatoes, basil, balsamic glaze on ciabatta",
    price: 12.5,
    image: "/images/artisan-sandwiches.jpeg",
    category: "sandwiches",
    rating: 4.6,
    prepTime: "8-10 min",
  },
  {
    id: "11",
    name: "Prosciutto & Fig",
    description: "Prosciutto di Parma, fresh figs, arugula, brie cheese on focaccia",
    price: 15.0,
    image: "/images/premium-sandwiches.jpeg",
    category: "sandwiches",
    rating: 4.8,
    prepTime: "10-12 min",
  },

  // Calzones
  {
    id: "12",
    name: "Calzone Classico",
    description: "Ricotta, mozzarella, ham, mushrooms, tomato sauce on the side",
    price: 16.5,
    image: "/images/stuffed-calzones.jpeg",
    category: "calzones",
    rating: 4.7,
    prepTime: "15-18 min",
  },
]

const categories = [
  { id: "all", name: "All Items", count: menuItems.length },
  { id: "flatbreads", name: "Flatbreads", count: menuItems.filter((item) => item.category === "flatbreads").length },
  { id: "pizzas", name: "Pizzas", count: menuItems.filter((item) => item.category === "pizzas").length },
  { id: "antipasti", name: "Antipasti", count: menuItems.filter((item) => item.category === "antipasti").length },
  { id: "sandwiches", name: "Sandwiches", count: menuItems.filter((item) => item.category === "sandwiches").length },
  { id: "calzones", name: "Calzones", count: menuItems.filter((item) => item.category === "calzones").length },
]

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const { addItem } = useCart()
  const { toast } = useToast()

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleAddToCart = (item: (typeof menuItems)[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our authentic Italian dishes, crafted with the finest ingredients and traditional recipes
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-sm">
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="card-hover overflow-hidden">
                    <div className="relative h-64">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      {item.popular && <Badge className="absolute top-4 left-4 bg-red-600">Popular</Badge>}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{item.name}</CardTitle>
                        <span className="text-2xl font-bold text-red-600">€{item.price}</span>
                      </div>
                      <CardDescription className="text-gray-600">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{item.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{item.prepTime}</span>
                        </div>
                      </div>
                      <Button onClick={() => handleAddToCart(item)} className="w-full bg-red-600 hover:bg-red-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No items found matching your search.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
