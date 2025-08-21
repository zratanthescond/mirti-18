import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, MapPin, Phone } from "lucide-react"

const featuredItems = [
  {
    id: "1",
    name: "Margherita Classica",
    description: "Fresh mozzarella, San Marzano tomatoes, basil, extra virgin olive oil",
    price: 14.5,
    image: "/images/classic-marinara.jpeg",
    category: "Pizza",
    rating: 4.8,
    prepTime: "12-15 min",
  },
  {
    id: "2",
    name: "Bresaola & Arugula Flatbread",
    description: "Bresaola, fresh arugula, Parmigiano-Reggiano, lemon zest",
    price: 18.0,
    image: "/images/bresaola-arugula-flatbread.jpeg",
    category: "Flatbread",
    rating: 4.9,
    prepTime: "10-12 min",
  },
  {
    id: "3",
    name: "Carpaccio di Manzo",
    description: "Thinly sliced beef, arugula, capers, Parmigiano shavings",
    price: 22.0,
    image: "/images/carpaccio-platter.jpeg",
    category: "Antipasti",
    rating: 4.7,
    prepTime: "8-10 min",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bakery-display-case.jpeg"
            alt="Pizzeria Mirti Interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            Benvenuti alla
            <span className="block text-yellow-400">Pizzeria Mirti</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up opacity-90">
            Authentic Italian cuisine crafted with passion since 1970
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/menu">View Our Menu</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              <Link href="#about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-4">Chef's Recommendations</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our most beloved dishes, crafted with the finest Italian ingredients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <Card key={item.id} className="card-hover overflow-hidden">
                <div className="relative h-64">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  <Badge className="absolute top-4 left-4 bg-red-600">{item.category}</Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    <span className="text-2xl font-bold text-red-600">€{item.price}</span>
                  </div>
                  <CardDescription className="text-gray-600">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.prepTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/menu">View Full Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 text-lg mb-6">
                Since 1970, Pizzeria Mirti has been serving authentic Italian cuisine in the heart of the city. Our
                family recipes have been passed down through generations, combining traditional techniques with the
                finest imported ingredients.
              </p>
              <p className="text-gray-600 text-lg mb-8">
                From our wood-fired pizzas to our artisanal flatbreads, every dish is crafted with passion and attention
                to detail. We believe in the Italian philosophy of using simple, high-quality ingredients to create
                extraordinary flavors.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">50+</div>
                  <div className="text-gray-600">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">100%</div>
                  <div className="text-gray-600">Fresh Ingredients</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/ham-pesto-flatbread.jpeg"
                alt="Chef preparing food"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-4">Visit Us Today</h2>
            <p className="text-gray-300 text-lg">Experience authentic Italian dining in a warm, welcoming atmosphere</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-4 text-red-400" />
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">
                  123 Italian Street
                  <br />
                  Downtown District
                  <br />
                  City, State 12345
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-4 text-red-400" />
                <CardTitle>Hours</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">
                  Mon-Thu: 11:00 AM - 10:00 PM
                  <br />
                  Fri-Sat: 11:00 AM - 11:00 PM
                  <br />
                  Sunday: 12:00 PM - 9:00 PM
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-4 text-red-400" />
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">
                  Phone: (555) 123-4567
                  <br />
                  Email: info@pizzeriamirti.com
                  <br />
                  Reservations Welcome
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
