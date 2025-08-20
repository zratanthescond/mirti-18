"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/src/presentation/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/src/presentation/components/ui/sheet"
import { Menu, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/src/presentation/providers"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { state } = useCart()
  const cartCount = state.items.length

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Image
              src="/images/pizzeria-mirti-logo.png"
              alt="Pizzeria Mirti Logo"
              width={isScrolled ? 80 : 100}
              height={isScrolled ? 80 : 100}
              className="transition-all duration-500"
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { name: "Home", href: "/" },
            { name: "Menu", href: "/menu" },
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
          ].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Link
                href={item.href}
                className={`font-heading text-lg transition-colors relative group ${
                  isScrolled ? "text-brown" : "text-brown drop-shadow-md"
                }`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button asChild className="bg-red hover:bg-red-dark btn-hover-slide">
              <Link href="/menu">Order Now</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative"
          >
            <Link href="/cart">
              <Button
                variant="outline"
                size="icon"
                className="border-brown text-brown hover:bg-brown/10 bg-transparent"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </motion.div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link href="/cart">
            <Button
              variant="outline"
              size="icon"
              className="border-brown text-brown hover:bg-brown/10 relative bg-transparent"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className={isScrolled ? "text-brown" : "text-brown"} />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-cream">
              <div className="flex flex-col h-full">
                <div className="flex justify-center mb-8 mt-4">
                  <Image src="/images/pizzeria-mirti-logo.png" alt="Pizzeria Mirti Logo" width={120} height={120} />
                </div>
                <nav className="flex flex-col items-center space-y-6 flex-grow justify-center">
                  {[
                    { name: "Home", href: "/" },
                    { name: "Menu", href: "/menu" },
                    { name: "About", href: "/about" },
                    { name: "Contact", href: "/contact" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="font-heading text-xl text-brown hover:text-red transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="flex justify-center mb-8">
                  <Button asChild className="bg-red hover:bg-red-dark text-white w-full btn-hover-slide">
                    <Link href="/menu">Order Now</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
