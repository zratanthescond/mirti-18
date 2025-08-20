import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Header } from "@/src/presentation/components/layout/header"
import { Footer } from "@/src/presentation/components/layout/footer"
import { CartProvider } from "@/src/presentation/providers"
import { Toaster } from "@/src/presentation/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Pizzeria Mirti - Authentic Italian Cuisine",
  description: "Experience authentic Italian cuisine with traditional recipes and the finest ingredients since 1970.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
