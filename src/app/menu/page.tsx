"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/src/presentation/components/ui/button"
import { Card, CardContent } from "@/src/presentation/components/ui/card"
import { Badge } from "@/src/presentation/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/presentation/components/ui/tabs"
import { useCart } from "@/src/presentation/providers"
import { useToast } from "@/src/presentation/hooks/use-toast"
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  CroissantIcon as Bread,
  UtensilsCrossed,
  Sandwich,
  Pizza,
  Calendar,
  Clock,
  Leaf,
  Snowflake,
  Sun,
  Flower,
} from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  ingredients?: string[]
  popular?: boolean
}

const menuItems: Product[] = [
  // Flatbreads & Focaccia
  {
    id: "flatbread-1",
    name: "Anchovy & Cherry Tomato Flatbread",
    description: "Traditional flatbread topped with fresh anchovies, cherry tomatoes, and aromatic herbs",
    price: 14.5,
    image: "/images/anchovy-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.8,
    ingredients: ["Fresh anchovies", "Cherry tomatoes", "Fresh herbs", "Extra virgin olive oil"],
    popular: true,
  },
  {
    id: "flatbread-2",
    name: "Turkey & Corn Delight",
    description: "Gourmet flatbread with sliced turkey, sweet corn, cherry tomatoes, and creamy sauce",
    price: 13.5,
    image: "/images/turkey-corn-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.7,
    ingredients: ["Premium turkey", "Sweet corn", "Cherry tomatoes", "Mixed greens", "Creamy sauce"],
  },
  {
    id: "flatbread-3",
    name: "Pear & Gorgonzola Flatbread",
    description: "Elegant flatbread featuring thinly sliced pears with creamy gorgonzola cheese",
    price: 15.5,
    image: "/images/pear-gorgonzola-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.9,
    ingredients: ["Fresh pears", "Gorgonzola DOP", "Walnuts", "Honey drizzle"],
    popular: true,
  },
  {
    id: "flatbread-4",
    name: "Bresaola & Arugula Flatbread",
    description: "Premium bresaola with fresh arugula, parmesan shavings, and balsamic reduction",
    price: 16.5,
    image: "/images/bresaola-arugula-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.8,
    ingredients: ["Bresaola della Valtellina", "Wild arugula", "Parmigiano-Reggiano", "Balsamic reduction"],
  },
  {
    id: "flatbread-5",
    name: "Ham & Pesto Flatbread",
    description: "Artisan flatbread with premium ham, homemade basil pesto, and fresh mozzarella",
    price: 14.0,
    image: "/images/ham-pesto-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.6,
    ingredients: ["Premium ham", "Basil pesto", "Fresh mozzarella", "Fresh basil leaves"],
  },
  {
    id: "flatbread-6",
    name: "Caramelized Onion & Seeds",
    description: "Rustic flatbread topped with caramelized onions, mixed cheese, and aromatic seeds",
    price: 12.5,
    image: "/images/caramelized-onion-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.5,
    ingredients: ["Caramelized onions", "Mixed cheese", "Poppy seeds", "Sesame seeds"],
  },
  {
    id: "flatbread-7",
    name: "Salmon & Zucchini Flatbread",
    description: "Gourmet flatbread with smoked salmon, grilled zucchini, and pistachio cream",
    price: 17.5,
    image: "/images/salmon-zucchini-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.9,
    ingredients: ["Smoked salmon", "Grilled zucchini", "Pistachio cream", "Fresh dill"],
    popular: true,
  },
  {
    id: "flatbread-8",
    name: "Ham & Pistachio Flatbread",
    description: "Delicate flatbread with premium ham, pistachio cream, and fresh mozzarella",
    price: 15.0,
    image: "/images/ham-pistachio-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.7,
    ingredients: ["Premium ham", "Pistachio cream", "Fresh mozzarella", "Basil leaves"],
  },
  {
    id: "flatbread-9",
    name: "Ham & Ricotta Flatbread",
    description: "Traditional flatbread topped with premium ham, fresh ricotta, and pistachio garnish",
    price: 14.5,
    image: "/images/ham-ricotta-flatbread.jpeg",
    category: "flatbreads",
    rating: 4.6,
    ingredients: ["Premium ham", "Fresh ricotta", "Crushed pistachios", "Black pepper"],
  },

  // Pizzas
  {
    id: "pizza-1",
    name: "Classic Marinara",
    description: "Traditional Neapolitan pizza with rich tomato sauce, garlic, oregano, and extra virgin olive oil",
    price: 9.5,
    image: "/images/classic-marinara.jpeg",
    category: "pizzas",
    rating: 4.8,
    ingredients: ["San Marzano tomatoes", "Garlic", "Oregano", "Extra virgin olive oil"],
    popular: true,
  },
  {
    id: "pizza-2",
    name: "Roasted Pepper Pizza",
    description: "Rustic pizza topped with roasted yellow peppers, tomato sauce, and Mediterranean herbs",
    price: 12.5,
    image: "/images/pepper-pizza.jpeg",
    category: "pizzas",
    rating: 4.6,
    ingredients: ["Roasted yellow peppers", "Tomato sauce", "Mozzarella", "Fresh herbs"],
  },

  // Sandwiches
  {
    id: "sandwich-1",
    name: "Artisan Sandwich Selection",
    description: "Premium selection of gourmet sandwiches with various artisan breads and Italian meats",
    price: 11.5,
    image: "/images/artisan-sandwiches.jpeg",
    category: "sandwiches",
    rating: 4.8,
    ingredients: ["Artisan breads", "Premium Italian meats", "Fresh vegetables", "Gourmet condiments"],
    popular: true,
  },
  {
    id: "sandwich-2",
    name: "Premium Italian Sandwiches",
    description: "Handcrafted sandwiches with seeded and plain breads, filled with finest Italian cured meats",
    price: 10.5,
    image: "/images/premium-sandwiches.jpeg",
    category: "sandwiches",
    rating: 4.7,
    ingredients: ["Seeded artisan bread", "Premium Italian meats", "Fresh condiments"],
  },

  // Deli Specialties
  {
    id: "deli-1",
    name: "Beef Carpaccio Platter",
    description: "Thinly sliced premium beef carpaccio with lemon, arugula, and Parmigiano-Reggiano shavings",
    price: 18.5,
    image: "/images/carpaccio-platter.jpeg",
    category: "deli",
    rating: 4.9,
    ingredients: ["Premium beef carpaccio", "Fresh lemon", "Wild arugula", "Parmigiano-Reggiano"],
    popular: true,
  },

  // Baked Specialties
  {
    id: "baked-1",
    name: "Stuffed Calzones",
    description: "Traditional baked calzones filled with ricotta, herbs, and premium ingredients",
    price: 9.5,
    image: "/images/stuffed-calzones.jpeg",
    category: "baked",
    rating: 4.7,
    ingredients: ["Fresh ricotta", "Mixed herbs", "Mozzarella", "Italian spices"],
  },
  {
    id: "baked-2",
    name: "Pistachio Stuffed Bread",
    description: "Artisan stuffed bread with premium ham filling and crushed pistachio topping",
    price: 11.5,
    image: "/images/pistachio-stuffed-bread.jpeg",
    category: "baked",
    rating: 4.8,
    ingredients: ["Premium ham", "Fresh ricotta", "Crushed pistachios", "Artisan bread"],
    popular: true,
  },
]

const dailySpecials: Record<string, Product[]> = {
  Monday: [
    {
      id: "special-mon-1",
      name: "Monday Morning Focaccia",
      description: "Start your week with our signature rosemary focaccia, topped with cherry tomatoes and sea salt",
      price: 8.5,
      image: "/images/caramelized-onion-flatbread.jpeg",
      category: "special",
      rating: 4.9,
      ingredients: ["Fresh rosemary", "Cherry tomatoes", "Sea salt", "Extra virgin olive oil"],
      popular: true,
    },
  ],
  Tuesday: [
    {
      id: "special-tue-1",
      name: "Truffle Tuesday Flatbread",
      description: "Luxurious flatbread with truffle cream, wild mushrooms, and aged parmesan",
      price: 19.5,
      image: "/images/ham-pistachio-flatbread.jpeg",
      category: "special",
      rating: 4.8,
      ingredients: ["Truffle cream", "Wild mushrooms", "Aged parmesan", "Fresh thyme"],
      popular: true,
    },
  ],
  Wednesday: [
    {
      id: "special-wed-1",
      name: "Midweek Mortadella Special",
      description: "Premium mortadella with pistachio cream, fresh burrata, and micro greens",
      price: 16.5,
      image: "/images/ham-ricotta-flatbread.jpeg",
      category: "special",
      rating: 4.7,
      ingredients: ["Premium mortadella", "Pistachio cream", "Fresh burrata", "Micro greens"],
    },
  ],
  Thursday: [
    {
      id: "special-thu-1",
      name: "Throwback Thursday Pizza",
      description: "Classic Margherita with San Marzano tomatoes, buffalo mozzarella, and fresh basil",
      price: 13.5,
      image: "/images/classic-marinara.jpeg",
      category: "special",
      rating: 4.9,
      ingredients: ["San Marzano tomatoes", "Buffalo mozzarella", "Fresh basil", "Extra virgin olive oil"],
      popular: true,
    },
  ],
  Friday: [
    {
      id: "special-fri-1",
      name: "Friday Fish Special",
      description: "Smoked salmon flatbread with cream cheese, capers, and red onion",
      price: 18.5,
      image: "/images/salmon-zucchini-flatbread.jpeg",
      category: "special",
      rating: 4.8,
      ingredients: ["Smoked salmon", "Cream cheese", "Capers", "Red onion", "Fresh dill"],
      popular: true,
    },
  ],
  Saturday: [
    {
      id: "special-sat-1",
      name: "Saturday Sharing Platter",
      description: "Mixed antipasti platter with cured meats, cheeses, and marinated vegetables",
      price: 24.5,
      image: "/images/carpaccio-platter.jpeg",
      category: "special",
      rating: 4.9,
      ingredients: ["Assorted cured meats", "Italian cheeses", "Marinated vegetables", "Olives"],
      popular: true,
    },
  ],
  Sunday: [
    {
      id: "special-sun-1",
      name: "Sunday Family Calzone",
      description: "Large family-sized calzone filled with ricotta, mozzarella, and your choice of toppings",
      price: 21.5,
      image: "/images/pistachio-stuffed-bread.jpeg",
      category: "special",
      rating: 4.8,
      ingredients: ["Fresh ricotta", "Mozzarella", "Choice of toppings", "Italian herbs"],
    },
  ],
}

const seasonalSpecials: Record<string, Product[]> = {
  spring: [
    {
      id: "seasonal-spring-1",
      name: "Spring Asparagus Flatbread",
      description: "Fresh asparagus with lemon ricotta, mint, and prosciutto di Parma",
      price: 17.5,
      image: "/images/bresaola-arugula-flatbread.jpeg",
      category: "seasonal",
      rating: 4.8,
      ingredients: ["Fresh asparagus", "Lemon ricotta", "Fresh mint", "Prosciutto di Parma"],
      popular: true,
    },
  ],
  summer: [
    {
      id: "seasonal-summer-1",
      name: "Summer Caprese Flatbread",
      description: "Heirloom tomatoes, fresh mozzarella di bufala, basil, and balsamic glaze",
      price: 15.5,
      image: "/images/turkey-corn-flatbread.jpeg",
      category: "seasonal",
      rating: 4.9,
      ingredients: ["Heirloom tomatoes", "Mozzarella di bufala", "Fresh basil", "Balsamic glaze"],
      popular: true,
    },
  ],
  autumn: [
    {
      id: "seasonal-autumn-1",
      name: "Autumn Pumpkin & Sage Flatbread",
      description: "Roasted pumpkin with crispy sage, gorgonzola, and toasted walnuts",
      price: 16.5,
      image: "/images/pear-gorgonzola-flatbread.jpeg",
      category: "seasonal",
      rating: 4.7,
      ingredients: ["Roasted pumpkin", "Crispy sage", "Gorgonzola", "Toasted walnuts"],
    },
  ],
  winter: [
    {
      id: "seasonal-winter-1",
      name: "Winter Comfort Flatbread",
      description: "Braised short rib with caramelized onions, aged pecorino, and rosemary",
      price: 19.5,
      image: "/images/anchovy-flatbread.jpeg",
      category: "seasonal",
      rating: 4.8,
      ingredients: ["Braised short rib", "Caramelized onions", "Aged pecorino", "Fresh rosemary"],
      popular: true,
    },
  ],
}

const getDayOfWeek = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[new Date().getDay()]
}

const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return "spring"
  if (month >= 6 && month <= 8) return "summer"
  if (month >= 9 && month <= 11) return "autumn"
  return "winter"
}

const getSeasonIcon = (season: string) => {
  switch (season) {
    case "spring":
      return <Flower className="w-5 h-5 text-green" />
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

const currentDay = getDayOfWeek()
const currentSeason = getCurrentSeason()
const todaysSpecials = dailySpecials[currentDay] || []
const seasonalItems = seasonalSpecials[currentSeason] || []

export default function MenuPage() {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const { state, dispatch } = useCart()
  const { toast } = useToast()

  const filterProductsByCategory = (category: string) => {
    return menuItems.filter((product) => product.category === category)
  }

  const updateQuantity = (productId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change),
    }))
  }

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      },
    })

    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} added to your cart.`,
    })

    setQuantities((prev) => ({
      ...prev,
      [product.id]: 0,
    }))
  }

  return (
    <div className="relative min-h-screen py-16">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream to-cream/80 -z-10"></div>
      <div className="absolute inset-0 opacity-5 bread-pattern -z-10"></div>
      <div className="grain-overlay"></div>

      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading text-gradient-brown mb-4">Our Menu</h1>
          <div className="h-1 w-24 bg-red mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore our selection of authentic Italian bakery and deli products, made with traditional recipes and the
            finest ingredients.
          </p>
        </motion.div>

        {/* Daily & Seasonal Specials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-heading text-gradient-brown mb-4">Today's Specials</h2>
            <div className="h-1 w-16 bg-red mx-auto mb-4"></div>
            <div className="flex items-center justify-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red" />
                <span className="font-medium">{currentDay}</span>
              </div>
              <div className="flex items-center gap-2">
                {getSeasonIcon(currentSeason)}
                <span className="font-medium capitalize">{currentSeason} Selection</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Daily Special */}
            <Card className="bg-gradient-to-br from-red/5 to-red/10 border-red/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red text-white px-3 py-1 rounded-full text-sm font-medium">Daily Special</div>
                  <div className="flex items-center gap-1 text-red">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Today Only</span>
                  </div>
                </div>

                {todaysSpecials.map((special) => (
                  <div key={special.id} className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={special.image || "/placeholder.svg"}
                        alt={special.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-heading text-brown mb-2">{special.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{special.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red">€{special.price.toFixed(2)}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent border-red text-red hover:bg-red hover:text-white"
                              onClick={() => updateQuantity(special.id, -1)}
                              disabled={(quantities[special.id] || 0) <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{quantities[special.id] || 0}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent border-red text-red hover:bg-red hover:text-white"
                              onClick={() => updateQuantity(special.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            onClick={() => addToCart(special)}
                            disabled={(quantities[special.id] || 0) <= 0}
                            className="bg-red hover:bg-red-dark btn-hover-slide"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Seasonal Special */}
            <Card className="bg-gradient-to-br from-green/5 to-green/10 border-green/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green text-white px-3 py-1 rounded-full text-sm font-medium">Seasonal Special</div>
                  <div className="flex items-center gap-1 text-green">
                    {getSeasonIcon(currentSeason)}
                    <span className="text-sm capitalize">{currentSeason} Limited</span>
                  </div>
                </div>

                {seasonalItems.map((seasonal) => (
                  <div key={seasonal.id} className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={seasonal.image || "/placeholder.svg"}
                        alt={seasonal.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-heading text-brown mb-2">{seasonal.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{seasonal.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green">€{seasonal.price.toFixed(2)}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent border-green text-green hover:bg-green hover:text-white"
                              onClick={() => updateQuantity(seasonal.id, -1)}
                              disabled={(quantities[seasonal.id] || 0) <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{quantities[seasonal.id] || 0}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent border-green text-green hover:bg-green hover:text-white"
                              onClick={() => updateQuantity(seasonal.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            onClick={() => addToCart(seasonal)}
                            disabled={(quantities[seasonal.id] || 0) <= 0}
                            className="bg-green hover:bg-green/90 btn-hover-slide text-white"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Weekly Schedule Preview */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-heading text-brown mb-4 text-center">This Week's Daily Specials</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {Object.entries(dailySpecials).map(([day, specials]) => (
                  <div
                    key={day}
                    className={`text-center p-3 rounded-lg transition-all ${
                      day === currentDay ? "bg-red text-white shadow-md" : "bg-cream/50 text-gray-700 hover:bg-cream"
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">{day}</div>
                    <div className="text-xs opacity-80">{specials[0]?.name.split(" ").slice(0, 2).join(" ")}...</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bakery Display Case Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="relative h-64 md:h-80">
              <Image
                src="/images/bakery-display-case.jpeg"
                alt="Pizzeria Mirti Bakery Display Case"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl md:text-3xl font-heading mb-2">Fresh Daily Selection</h2>
                <p className="text-lg opacity-90">Artisan breads, flatbreads, and specialties made fresh every day</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <Tabs defaultValue="flatbreads" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-cream/50 backdrop-blur-sm">
            <TabsTrigger
              value="flatbreads"
              className="flex items-center gap-2 data-[state=active]:bg-brown data-[state=active]:text-white"
            >
              <Bread className="h-4 w-4" />
              <span className="hidden sm:inline">Flatbreads</span>
            </TabsTrigger>
            <TabsTrigger
              value="pizzas"
              className="flex items-center gap-2 data-[state=active]:bg-brown data-[state=active]:text-white"
            >
              <Pizza className="h-4 w-4" />
              <span className="hidden sm:inline">Pizzas</span>
            </TabsTrigger>
            <TabsTrigger
              value="sandwiches"
              className="flex items-center gap-2 data-[state=active]:bg-brown data-[state=active]:text-white"
            >
              <Sandwich className="h-4 w-4" />
              <span className="hidden sm:inline">Sandwiches</span>
            </TabsTrigger>
            <TabsTrigger
              value="deli"
              className="flex items-center gap-2 data-[state=active]:bg-brown data-[state=active]:text-white"
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span className="hidden sm:inline">Deli & Baked</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flatbreads" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filterProductsByCategory("flatbreads").map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden card-hover bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <div className="relative h-48 img-hover-zoom">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {product.popular && <Badge className="bg-red text-cream">Popular</Badge>}
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-heading mb-2 text-brown">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{product.description}</p>

                        {product.ingredients && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 font-medium mb-1">Ingredients:</p>
                            <p className="text-xs text-gray-600">{product.ingredients.join(", ")}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red">€{product.price.toFixed(2)}</span>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent border-brown text-brown hover:bg-brown hover:text-cream"
                              onClick={() => updateQuantity(product.id, -1)}
                              disabled={(quantities[product.id] || 0) <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{quantities[product.id] || 0}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent border-brown text-brown hover:bg-brown hover:text-cream"
                              onClick={() => updateQuantity(product.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            onClick={() => addToCart(product)}
                            disabled={(quantities[product.id] || 0) <= 0}
                            className="bg-brown hover:bg-brown-light btn-hover-slide"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pizzas" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filterProductsByCategory("pizzas").map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden card-hover bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <div className="relative h-48 img-hover-zoom">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {product.popular && <Badge className="bg-red text-cream">Popular</Badge>}
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-heading mb-2 text-brown">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{product.description}</p>

                        {product.ingredients && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 font-medium mb-1">Ingredients:</p>
                            <p className="text-xs text-gray-600">{product.ingredients.join(", ")}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red">€{product.price.toFixed(2)}</span>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent border-brown text-brown hover:bg-brown hover:text-cream"
                              onClick={() => updateQuantity(product.id, -1)}
                              disabled={(quantities[product.id] || 0) <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{quantities[product.id] || 0}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent border-brown text-brown hover:bg-brown hover:text-cream"
                              onClick={() => updateQuantity(product.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            onClick={() => addToCart(product)}
                            disabled={(quantities[product.id] || 0) <= 0}
                            className="bg-brown hover:bg-brown-light btn-hover-slide"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sandwiches" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filterProductsByCategory("sandwiches").map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden card-hover bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <div className="relative h-48 img-hover-zoom">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {product.popular && <Badge className="bg-red text-cream">Popular</Badge>}
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-heading mb-2 text-brown">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{product.description}</p>

                        {product.ingredients && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 font-medium mb-1">Ingredients:</p>
                            <p className="text-xs text-gray-600">{product.ingredients.join(", ")}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red">€{product.price.toFixed(2)}</span>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent border-brown text-brown hover:bg-brown hover:text-cream"
                              onClick={() => updateQuantity(product.id, -1)}
                              disabled={(quantities[product.id] || 0) <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{quantities[product.id] || 0}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent border-brown text-brown hover:bg-brown hover:text-cream"
                              onClick={() => updateQuantity(product.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            onClick={() => addToCart(product)}
                            disabled={(quantities[product.id] || 0) <= 0}
                            className="bg-brown hover:bg-brown-light btn-hover-slide"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deli" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...filterProductsByCategory("deli"), ...filterProductsByCategory("baked")].map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden card-hover bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <div className="relative h-48 img-hover-zoom">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {product.popular && <Badge className="bg-red text-cream">Popular</Badge>}
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-heading mb-2 text-brown">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{product.description}</p>

                        {product.ingredients && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 font-medium mb-1">Ingredients:</p>
                            <p className="text-xs text-gray-600">{product.ingredients.join(", ")}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red">€{product.price.toFixed(2)}</span>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent border-brown text-brown hover:bg-brown hover:text-cream"
                              onClick={() => updateQuantity(product.id, -1)}
                              disabled={(quantities[product.id] || 0) <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{quantities[product.id] || 0}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent border-brown text-brown hover:bg-brown hover:text-cream"
                              onClick={() => updateQuantity(product.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            onClick={() => addToCart(product)}
                            disabled={(quantities[product.id] || 0) <= 0}
                            className="bg-brown hover:bg-brown-light btn-hover-slide"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Cart Summary */}
        {state.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-red" />
              <div>
                <p className="font-medium">{state.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                <p className="text-sm text-gray-600">Total: €{state.total.toFixed(2)}</p>
              </div>
              <Button asChild className="bg-red hover:bg-red-dark">
                <a href="/cart">View Cart</a>
              </Button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-heading text-gradient-brown mb-4 text-center">Artisan Quality</h2>
          <p className="text-gray-700 mb-6 text-center">
            Every flatbread, pizza, and sandwich is handcrafted daily using traditional Italian techniques and the
            finest imported ingredients. We offer gluten-free options and can accommodate various dietary needs.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
