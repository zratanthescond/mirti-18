"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/src/presentation/components/ui/button"
import { Card, CardContent } from "@/src/presentation/components/ui/card"
import { Badge } from "@/src/presentation/components/ui/badge"
import { Star, Clock, MapPin, Phone, Award, Heart, Utensils } from "lucide-react"

export default function HomePage() {
  const featuredProducts = [
    {
      id: "1",
      name: "Anchovy & Cherry Tomato Flatbread",
      description: "Traditional flatbread with fresh anchovies and aromatic herbs",
      price: "€14.50",
      image: "/images/anchovy-flatbread.jpeg",
      category: "Flatbreads",
    },
    {
      id: "2",
      name: "Artisan Sandwich Selection",
      description: "Premium gourmet sandwiches with various artisan breads",
      price: "€11.50",
      image: "/images/artisan-sandwiches.jpeg",
      category: "Sandwiches",
    },
    {
      id: "3",
      name: "Salmon & Zucchini Flatbread",
      description: "Gourmet flatbread with smoked salmon and pistachio cream",
      price: "€17.50",
      image: "/images/salmon-zucchini-flatbread.jpeg",
      category: "Specialties",
    },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Background elements */}
      <div className="grain-overlay"></div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/ham-pesto-flatbread.jpeg"
            alt="Pizzeria Mirti Flatbread"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brown/80 via-brown/60 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center text-cream max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Image
              src="/images/pizzeria-mirti-logo.png"
              alt="Pizzeria Mirti Logo"
              width={200}
              height={200}
              className="mx-auto mb-6 animate-float"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-heading text-gradient-brown mb-6"
          >
            Pizzeria Mirti
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90"
          >
            Authentic Italian bakery and deli products made with traditional recipes and the finest ingredients since
            1970
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Button asChild size="lg" className="bg-red hover:bg-red-dark btn-hover-slide text-lg px-8 py-4">
              <Link href="/menu">Explore Our Menu</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-cream text-cream hover:bg-cream hover:text-brown text-lg px-8 py-4 bg-transparent"
            >
              <Link href="/about">Our Story</Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-cream"
        >
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-cream rounded-full flex justify-center">
              <div className="w-1 h-3 bg-cream rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-b from-cream to-cream/80">
        <div className="absolute inset-0 opacity-5 bread-pattern"></div>

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading text-gradient-brown mb-6">Why Choose Pizzeria Mirti?</h2>
            <div className="h-1 w-24 bg-red mx-auto mb-6"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Experience the authentic taste of Italy with our traditional recipes, premium ingredients, and warm
              hospitality
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Utensils className="w-12 h-12 text-red" />,
                title: "Traditional Recipes",
                description:
                  "Passed down through generations, our authentic Italian recipes maintain the true taste of Italy",
              },
              {
                icon: <Heart className="w-12 h-12 text-green" />,
                title: "Premium Ingredients",
                description: "We source only the finest local and imported ingredients to ensure exceptional quality",
              },
              {
                icon: <Award className="w-12 h-12 text-brown" />,
                title: "Artisan Craftsmanship",
                description: "Every product is handcrafted with passion and expertise by our skilled Italian bakers",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-8 card-hover bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="mb-6 flex justify-center">{feature.icon}</div>
                    <h3 className="text-2xl font-heading mb-4 text-brown">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading text-gradient-brown mb-6">Featured Specialties</h2>
            <div className="h-1 w-24 bg-red mx-auto mb-6"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover our most popular artisan products, crafted daily with authentic Italian techniques
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden card-hover bg-white shadow-lg border-0">
                  <div className="relative h-64 img-hover-zoom">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    <Badge className="absolute top-4 left-4 bg-red text-cream">{product.category}</Badge>
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-heading mb-2 text-brown">{product.name}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-red">{product.price}</span>
                      <Button className="bg-brown hover:bg-brown-light btn-hover-slide">Order Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-brown text-brown hover:bg-brown hover:text-cream bg-transparent"
            >
              <Link href="/menu">View Full Menu</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-gradient-to-b from-cream/50 to-cream">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading text-gradient-brown mb-6">Taste the Tradition</h2>
            <div className="h-1 w-24 bg-red mx-auto mb-6"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Every bite tells a story of Italian heritage and culinary excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "/images/pear-gorgonzola-flatbread.jpeg",
              "/images/bresaola-arugula-flatbread.jpeg",
              "/images/turkey-corn-flatbread.jpeg",
              "/images/caramelized-onion-flatbread.jpeg",
            ].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative h-48 img-hover-zoom rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-brown text-cream">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <MapPin className="w-12 h-12 mx-auto mb-4 text-red" />
              <h3 className="text-xl font-heading mb-2">Visit Us</h3>
              <p className="opacity-90">
                Via Roma 123
                <br />
                00100 Roma, Italy
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Clock className="w-12 h-12 mx-auto mb-4 text-red" />
              <h3 className="text-xl font-heading mb-2">Opening Hours</h3>
              <p className="opacity-90">
                Mon-Thu: 7:00 AM - 8:00 PM
                <br />
                Fri-Sat: 7:00 AM - 9:00 PM
                <br />
                Sun: 8:00 AM - 7:00 PM
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Phone className="w-12 h-12 mx-auto mb-4 text-red" />
              <h3 className="text-xl font-heading mb-2">Contact Us</h3>
              <p className="opacity-90">
                +39 06 1234 5678
                <br />
                info@pizzeriamirti.com
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
