import type { ObjectId } from "mongodb"

export interface RestaurantSettings {
  _id?: ObjectId
  restaurant: {
    name: string
    description: string
    address: {
      street: string
      city: string
      postalCode: string
      country: string
    }
    contact: {
      phone: string
      email: string
      website?: string
    }
    hours: {
      [key: string]: {
        open: string
        close: string
        closed: boolean
      }
    }
  }
  delivery: {
    enabled: boolean
    radius: number
    minimumOrder: number
    fee: number
    freeDeliveryThreshold: number
  }
  payment: {
    acceptCash: boolean
    acceptCard: boolean
    acceptOnline: boolean
    taxRate: number
  }
  notifications: {
    emailOrders: boolean
    smsOrders: boolean
    emailMarketing: boolean
  }
  updatedAt: Date
}
