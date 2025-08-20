import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star, Clock, MapPin } from "lucide-react"
import { Button } from "@/presentation/components/ui/button"
import { Card, CardContent } from "@/presentation/components/ui/card"
import { Badge } from "@/presentation/components/ui/badge"
import { Header } from "@/presentation/components/layout/header"
import { Footer } from "@/presentation/components/layout/footer"

const featuredItems = [
  {
    id: "1",
    name: "Salmon & Zucchini Flatbread",
    description: "Fresh salmon with grilled zucchini, ricotta, and herbs",
    price: 17.5,
    image: "/images/salmon-zucchini-flatbread.jpeg",
    popular: true,
  },
  {
    id: "2",
    name: "Beef Carpaccio Platter",
    description: "Thinly sliced raw beef with arugula and parmesan",
    price: 18.5,
    image: "/images/carpaccio-platter.jpeg",
    popular: false,
  },
  {
    id: "3",
    name: "Classic Marinara Pizza",
    description: "Traditional pizza with marinara sauce and mozzarella",
    price: 9.5,
    image: "/images/classic-marinara.jpeg",
    popular: true,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bakery-display-case.jpeg"
            alt="Pizzeria Mirti Interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Authentic Italian
            <span className="block text-yellow-400">Cuisine</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Experience the finest flatbreads, pizzas, and artisan dishes crafted with fresh ingredients and traditional
            recipes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                View Our Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                Make Reservation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Specialties</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most beloved dishes, crafted with passion and the finest ingredients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  {item.popular && (
                    <Badge className="absolute top-3 left-3 bg-yellow-600">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">€{item.price}</span>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in the heart of Rome, Pizzeria Mirti brings together traditional Italian recipes with modern
                culinary techniques. Our passion for authentic flavors and fresh ingredients drives everything we do.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                From our signature flatbreads to our artisan pizzas, every dish is crafted with care and attention to
                detail. We believe that great food brings people together, creating memories that last a lifetime.
              </p>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative h-96">
              <Image
                src="/images/premium-sandwiches.jpeg"
                alt="Chef preparing food"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Service</h3>
              <p className="text-gray-600">
                Quick preparation without compromising on quality. Most orders ready in 15-20 minutes.
              </p>
            </Card>

            <Card className="text-center p-8">
              <Star className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Only the finest ingredients sourced from trusted suppliers across Italy.</p>
            </Card>

            <Card className="text-center p-8">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Prime Location</h3>
              <p className="text-gray-600">
                Located in the heart of Rome, easily accessible with ample parking available.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
