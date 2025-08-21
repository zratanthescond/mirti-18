import type { ObjectId } from "mongodb"

export interface Customer {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  addresses: Array<{
    id: string
    label: string
    street: string
    city: string
    postalCode: string
    isDefault: boolean
  }>
  preferences: {
    favoriteItems: ObjectId[]
    dietaryRestrictions: string[]
    allergies: string[]
  }
  orderHistory: ObjectId[]
  totalOrders: number
  totalSpent: number
  loyaltyPoints: number
  createdAt: Date
  lastOrderAt?: Date
}
