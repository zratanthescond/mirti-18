"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const { toast } = useToast()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
      return
    }
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id)
    toast({
      title: "Item removed",
      description: `${name} has been removed from your cart.`,
    })
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)

    // Simulate checkout process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Order placed successfully!",
      description: "Thank you for your order. We'll prepare it right away.",
    })

    clearCart()
    setIsCheckingOut(false)
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some delicious items from our menu to get started.</p>
          <Button asChild size="lg">
            <Link href="/menu">Browse Menu</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/menu">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-gray-600">Review your items and proceed to checkout</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Cart Items ({state.itemCount})
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearCart()
                      toast({
                        title: "Cart cleared",
                        description: "All items have been removed from your cart.",
                      })
                    }}
                  >
                    Clear Cart
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg?height=80&width=80"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                      <p className="text-lg font-bold text-red-600">€{item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">€{(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>€{(state.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>€3.50</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>€{(state.total * 1.1 + 3.5).toFixed(2)}</span>
                </div>

                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>

                <div className="text-sm text-gray-600 text-center">
                  <p>Estimated delivery: 25-35 minutes</p>
                  <p>Free delivery on orders over €30</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
