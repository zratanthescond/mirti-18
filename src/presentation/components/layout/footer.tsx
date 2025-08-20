"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brown/90 to-brown z-0"></div>
      <div className="absolute inset-0 opacity-5 bread-pattern z-0"></div>

      <div className="container px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="flex flex-col items-center md:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Image
                src="/images/pizzeria-mirti-logo.png"
                alt="Pizzeria Mirti Logo"
                width={150}
                height={150}
                className="mb-4"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-sm text-cream/80 text-center md:text-left"
            >
              Authentic Italian bakery and deli products made with traditional recipes and the finest ingredients since
              1970.
            </motion.p>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xl font-heading mb-4 text-center md:text-left text-cream"
            >
              Quick Links
            </motion.h3>
            <ul className="space-y-2 text-center md:text-left">
              {[
                { name: "Home", href: "/" },
                { name: "Menu", href: "/menu" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <Link href={link.href} className="text-cream/80 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xl font-heading mb-4 text-center md:text-left text-cream"
            >
              Opening Hours
            </motion.h3>
            <ul className="space-y-2 text-center md:text-left">
              {["Monday - Thursday: 7am - 8pm", "Friday - Saturday: 7am - 9pm", "Sunday: 8am - 7pm"].map(
                (hours, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    className="text-cream/80"
                  >
                    {hours}
                  </motion.li>
                ),
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xl font-heading mb-4 text-center md:text-left text-cream"
            >
              Contact Us
            </motion.h3>
            <ul className="space-y-2 text-center md:text-left">
              {["Via Roma 123", "00100 Roma, Italy", "+39 06 1234 5678", "info@pizzeriamirti.com"].map(
                (contact, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    className="text-cream/80"
                  >
                    {contact}
                  </motion.li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="mt-12 pt-8 border-t border-cream/20 flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex space-x-4 mb-4 md:mb-0"
          >
            {[
              { icon: <Facebook className="h-6 w-6" />, label: "Facebook" },
              { icon: <Instagram className="h-6 w-6" />, label: "Instagram" },
              { icon: <Twitter className="h-6 w-6" />, label: "Twitter" },
            ].map((social, index) => (
              <Link
                key={social.label}
                href="#"
                className="text-cream/80 hover:text-white transition-colors transform hover:scale-110 duration-300"
              >
                {social.icon}
                <span className="sr-only">{social.label}</span>
              </Link>
            ))}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-sm text-cream/80"
          >
            &copy; {new Date().getFullYear()} Pizzeria Mirti. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
