import type { ObjectId } from "mongodb"

export interface OrderItem {
  menuItemId: ObjectId
  name: string
  price: number
  quantity: number
  specialInstructions?: string
}

export interface Order {
  _id?: ObjectId
  orderNumber: string
  customerId?: ObjectId
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  orderType: "pickup" | "delivery"
  deliveryAddress?: {
    street: string
    city: string
    postalCode: string
    instructions?: string
  }
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod?: string
  notes?: string
  estimatedReadyTime?: Date
  actualReadyTime?: Date
  deliveredAt?: Date
  createdAt: Date
  updatedAt: Date
}
