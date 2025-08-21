import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/pizzeria-mirti-logo.png"
                alt="Pizzeria Mirti"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-heading text-xl font-bold text-red-400">Pizzeria Mirti</span>
            </div>
            <p className="text-gray-300 text-sm">
              Authentic Italian cuisine crafted with passion since 1970. Experience the finest flatbreads, pizzas, and
              artisan dishes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-red-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-300 hover:text-red-400 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-300 hover:text-red-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-red-400 transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-400" />
                <span className="text-gray-300 text-sm">123 Italian Street, Downtown District</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-400" />
                <span className="text-gray-300 text-sm">(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-400" />
                <span className="text-gray-300 text-sm">info@pizzeriamirti.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-red-400" />
                <span>Mon-Thu: 11:00 AM - 10:00 PM</span>
              </li>
              <li className="ml-6">Fri-Sat: 11:00 AM - 11:00 PM</li>
              <li className="ml-6">Sunday: 12:00 PM - 9:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Pizzeria Mirti. All rights reserved. Made with ❤️ for authentic Italian cuisine.
          </p>
        </div>
      </div>
    </footer>
  )
}
