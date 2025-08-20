"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Search } from "lucide-react"
import { Button } from "@/presentation/components/ui/button"
import { Card, CardContent } from "@/presentation/components/ui/card"
import { Badge } from "@/presentation/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs"
import { Input } from "@/presentation/components/ui/input"
import { Header } from "@/presentation/components/layout/header"
import { Footer } from "@/presentation/components/layout/footer"
import { useCart } from "@/presentation/hooks/use-cart"
import { useToast } from "@/presentation/hooks/use-toast"
import { formatPrice } from "@/presentation/lib/utils"

const menuItems = {
  flatbreads: [
    {
      id: "1",
      name: "Salmon & Zucchini Flatbread",
      description: "Fresh salmon with grilled zucchini, ricotta, and herbs on our signature flatbread",
      price: 17.5,
      image: "/images/salmon-zucchini-flatbread.jpeg",
      popular: true,
      category: "flatbreads",
    },
    {
      id: "2",
      name: "Pear & Gorgonzola Flatbread",
      description: "Sweet pears with creamy gorgonzola, walnuts, and honey drizzle",
      price: 15.5,
      image: "/images/pear-gorgonzola-flatbread.jpeg",
      popular: false,
      category: "flatbreads",
    },
    {
      id: "3",
      name: "Bresaola & Arugula Flatbread",
      description: "Thinly sliced bresaola with fresh arugula, parmesan, and lemon",
      price: 16.5,
      image: "/images/bresaola-arugula-flatbread.jpeg",
      popular: true,
      category: "flatbreads",
    },
    {
      id: "4",
      name: "Ham & Pesto Flatbread",
      description: "Italian ham with basil pesto, cherry tomatoes, and mozzarella",
      price: 14.5,
      image: "/images/ham-pesto-flatbread.jpeg",
      popular: false,
      category: "flatbreads",
    },
  ],
  pizzas: [
    {
      id: "5",
      name: "Classic Marinara Pizza",
      description: "Traditional pizza with our homemade marinara sauce, mozzarella, and fresh basil",
      price: 9.5,
      image: "/images/classic-marinara.jpeg",
      popular: true,
      category: "pizzas",
    },
    {
      id: "6",
      name: "Pepper Pizza",
      description: "Colorful bell peppers with mozzarella, oregano, and olive oil",
      price: 11.5,
      image: "/images/pepper-pizza.jpeg",
      popular: false,
      category: "pizzas",
    },
  ],
  appetizers: [
    {
      id: "7",
      name: "Beef Carpaccio Platter",
      description: "Thinly sliced raw beef with arugula, parmesan shavings, and lemon dressing",
      price: 18.5,
      image: "/images/carpaccio-platter.jpeg",
      popular: false,
      category: "appetizers",
    },
    {
      id: "8",
      name: "Anchovy Flatbread",
      description: "Mediterranean anchovies with capers, olives, and cherry tomatoes",
      price: 13.5,
      image: "/images/anchovy-flatbread.jpeg",
      popular: false,
      category: "appetizers",
    },
  ],
  sandwiches: [
    {
      id: "9",
      name: "Artisan Sandwich Selection",
      description: "Daily selection of gourmet sandwiches with premium ingredients",
      price: 12.5,
      image: "/images/artisan-sandwiches.jpeg",
      popular: true,
      category: "sandwiches",
    },
    {
      id: "10",
      name: "Premium Sandwiches",
      description: "Elevated sandwich experience with imported meats and cheeses",
      price: 15.5,
      image: "/images/premium-sandwiches.jpeg",
      popular: false,
      category: "sandwiches",
    },
  ],
}

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const { dispatch } = useCart()
  const { toast } = useToast()

  const allItems = Object.values(menuItems).flat()

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (item: any) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
      },
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/bakery-display-case.jpeg" alt="Menu" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl">Discover our authentic Italian specialties</p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="flatbreads">Flatbreads</TabsTrigger>
              <TabsTrigger value="pizzas">Pizzas</TabsTrigger>
              <TabsTrigger value="appetizers">Appetizers</TabsTrigger>
              <TabsTrigger value="sandwiches">Sandwiches</TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      {item.popular && <Badge className="absolute top-3 left-3 bg-yellow-600">Popular</Badge>}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{formatPrice(item.price)}</span>
                        <Button onClick={() => addToCart(item)} size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
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
      </section>

      <Footer />
    </div>
  )
}
