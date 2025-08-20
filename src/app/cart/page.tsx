"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/src/presentation/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/card"
import { Input } from "@/src/presentation/components/ui/input"
import { Label } from "@/src/presentation/components/ui/label"
import { Textarea } from "@/src/presentation/components/ui/textarea"
import { Separator } from "@/src/presentation/components/ui/separator"
import { useCart } from "@/src/presentation/providers"
import { useToast } from "@/src/presentation/hooks/use-toast"
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
} from "lucide-react"

interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  notes: string
  deliveryTime: string
}

export default function CartPage() {
  const { state, dispatch } = useCart()
  const { toast } = useToast()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
    deliveryTime: "asap",
  })

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: id })
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      })
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    }
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCheckoutForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCheckingOut(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setOrderPlaced(true)
    setIsCheckingOut(false)
    dispatch({ type: "CLEAR_CART" })

    toast({
      title: "Order placed successfully!",
      description: "We'll prepare your order and contact you soon.",
    })
  }

  const deliveryFee = state.total > 25 ? 0 : 3.5
  const totalWithDelivery = state.total + deliveryFee

  if (orderPlaced) {
    return (
      <div className="relative min-h-screen py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-cream to-cream/80 -z-10"></div>
        <div className="grain-overlay"></div>

        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-6"
                >
                  <CheckCircle className="w-20 h-20 text-green mx-auto mb-4" />
                </motion.div>

                <h1 className="text-3xl font-heading text-brown mb-4">Order Confirmed!</h1>
                <p className="text-gray-600 mb-6">
                  Thank you for your order! We've received your request and will start preparing your delicious Italian
                  specialties right away.
                </p>

                <div className="bg-cream/50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Order Number:</strong> #PM
                    {Math.floor(Math.random() * 10000)
                      .toString()
                      .padStart(4, "0")}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Estimated Preparation Time:</strong> 25-35 minutes
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-brown hover:bg-brown-light">
                    <Link href="/menu">Order Again</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-brown text-brown hover:bg-brown hover:text-cream bg-transparent"
                  >
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  if (state.items.length === 0) {
    return (
      <div className="relative min-h-screen py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-cream to-cream/80 -z-10"></div>
        <div className="grain-overlay"></div>

        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12">
                <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h1 className="text-3xl font-heading text-brown mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8">
                  Looks like you haven't added any delicious Italian specialties to your cart yet.
                </p>
                <Button asChild size="lg" className="bg-red hover:bg-red-dark">
                  <Link href="/menu">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Browse Our Menu
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-cream to-cream/80 -z-10"></div>
      <div className="grain-overlay"></div>

      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-heading text-brown mb-2">Your Cart</h1>
              <p className="text-gray-600">
                {state.items.reduce((sum, item) => sum + item.quantity, 0)} items in your cart
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-brown text-brown hover:bg-brown hover:text-cream bg-transparent"
            >
              <Link href="/menu">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-brown">Order Items</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red hover:text-red-dark hover:bg-red/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-cream/30 rounded-lg"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-heading text-brown mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600">€{item.price.toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-brown text-brown hover:bg-brown hover:text-cream bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-brown text-brown hover:bg-brown hover:text-cream bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <p className="font-bold text-brown">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red hover:text-red-dark hover:bg-red/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Checkout */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-brown">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>€{state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-green" : ""}>
                      {deliveryFee === 0 ? "FREE" : `€${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  {state.total < 25 && (
                    <p className="text-xs text-gray-600">Add €{(25 - state.total).toFixed(2)} more for free delivery</p>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-brown">
                    <span>Total</span>
                    <span>€{totalWithDelivery.toFixed(2)}</span>
                  </div>

                  {!showCheckout && (
                    <Button className="w-full bg-red hover:bg-red-dark" onClick={() => setShowCheckout(true)}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Restaurant Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-brown">Restaurant Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-red" />
                    <div>
                      <p className="text-sm font-medium">Via Roma 123</p>
                      <p className="text-xs text-gray-600">00100 Roma, Italy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-red" />
                    <div>
                      <p className="text-sm font-medium">Open Today</p>
                      <p className="text-xs text-gray-600">7:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-red" />
                    <p className="text-sm">+39 06 1234 5678</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Checkout Form */}
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-brown">Checkout Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={checkoutForm.firstName}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={checkoutForm.lastName}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={checkoutForm.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={checkoutForm.phone}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={checkoutForm.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={checkoutForm.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={checkoutForm.postalCode}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deliveryTime">Preferred Delivery Time</Label>
                    <select
                      id="deliveryTime"
                      name="deliveryTime"
                      value={checkoutForm.deliveryTime}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                    >
                      <option value="asap">As soon as possible</option>
                      <option value="30min">In 30 minutes</option>
                      <option value="1hour">In 1 hour</option>
                      <option value="2hours">In 2 hours</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={checkoutForm.notes}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Any special requests or delivery instructions..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-brown text-brown hover:bg-brown hover:text-cream bg-transparent"
                      onClick={() => setShowCheckout(false)}
                    >
                      Back to Cart
                    </Button>
                    <Button type="submit" disabled={isCheckingOut} className="flex-1 bg-red hover:bg-red-dark">
                      {isCheckingOut ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Place Order - €{totalWithDelivery.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
