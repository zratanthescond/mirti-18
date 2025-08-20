import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/presentation/providers"
import { Toaster } from "@/presentation/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pizzeria Mirti - Authentic Italian Cuisine",
  description:
    "Experience the finest Italian flatbreads, pizzas, and artisan dishes at Pizzeria Mirti. Fresh ingredients, traditional recipes, modern presentation.",
  keywords: ["pizza", "italian", "restaurant", "flatbread", "authentic", "cuisine"],
  authors: [{ name: "Pizzeria Mirti" }],
  openGraph: {
    title: "Pizzeria Mirti - Authentic Italian Cuisine",
    description: "Experience the finest Italian flatbreads, pizzas, and artisan dishes",
    type: "website",
    locale: "en_US",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
