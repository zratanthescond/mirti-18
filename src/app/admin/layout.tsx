"use client"

import type React from "react"
import Link from "next/link"
import { LogOut, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/src/presentation/components/ui/button"
import { Badge } from "@/src/presentation/components/ui/badge"
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Calendar,
  Menu,
  Bell,
  Search,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Suspense } from "react"

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

const mockAdminUser: AdminUser = {
  id: "admin-1",
  name: "Marco Rossi",
  email: "marco@pizzeriamirti.com",
  role: "Restaurant Manager",
  avatar: "/placeholder.svg?height=40&width=40&text=MR",
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    name: "Menu Management",
    href: "/admin/menu",
    icon: UtensilsCrossed,
    description: "Manage products and specials",
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    description: "View and manage orders",
    badge: "12",
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
    description: "Customer management",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Sales and performance",
  },
  {
    name: "Daily Specials",
    href: "/admin/specials",
    icon: Calendar,
    description: "Manage daily and seasonal specials",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Restaurant settings",
  },
]

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/admin/login")
  }

  return (
    <div className="flex h-full flex-col bg-white shadow-xl">
      {/* Logo and Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/images/pizzeria-mirti-logo.png" alt="Pizzeria Mirti" width={40} height={40} />
          <div>
            <div className="font-heading text-lg text-brown">Pizzeria Mirti</div>
            <div className="text-xs text-gray-500">Admin Panel</div>
          </div>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-6 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-medium transition-colors ${
                    isActive ? "bg-red text-white" : "text-gray-700 hover:text-red hover:bg-red/5"
                  }`}
                  onClick={onClose}
                >
                  <item.icon
                    className={`h-6 w-6 shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-red"}`}
                  />
                  <div className="flex-1">
                    <div>{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                  {item.badge && (
                    <Badge className={`${isActive ? "bg-white text-red" : "bg-red text-white"}`}>{item.badge}</Badge>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start gap-x-3 text-gray-700 hover:text-red hover:bg-red/5"
            onClick={handleLogout}
          >
            <LogOut className="h-6 w-6" />
            Sign out
          </Button>
        </div>
      </nav>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Update the authentication check
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const adminToken = localStorage.getItem("admin_token")
        if (adminToken === "admin_authenticated") {
          setIsAuthenticated(true)
        } else if (pathname !== "/admin/login") {
          router.push("/admin/login")
          return
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  // Add loading state for better UX
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red mx-auto mb-4"></div>
          <p className="text-brown">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 h-full w-80"
            >
              <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="lg:pl-80">
        {/* Top navigation bar */}
        <Suspense fallback={<div>Loading...</div>}>
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>

            {/* Search bar */}
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center max-w-md">
                <Search className="pointer-events-none absolute left-3 h-5 w-5 text-gray-400" />
                <input
                  className="block h-full w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-red focus:ring-1 focus:ring-red sm:text-sm"
                  placeholder="Search..."
                  type="search"
                />
              </div>
            </div>

            {/* Right side of top bar */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red text-xs p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>

              {/* User info */}
              <div className="flex items-center gap-x-3">
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  <Image
                    src={mockAdminUser.avatar || "/placeholder.svg"}
                    alt={mockAdminUser.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium text-gray-900">{mockAdminUser.name}</div>
                  <div className="text-xs text-gray-500">{mockAdminUser.role}</div>
                </div>
              </div>
            </div>
          </div>
        </Suspense>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
