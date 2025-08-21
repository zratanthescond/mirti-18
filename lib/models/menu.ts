import type { ObjectId } from "mongodb"

export interface MenuItem {
  _id?: ObjectId
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
  popular: boolean
  ingredients?: string[]
  allergens?: string[]
  nutritionalInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface MenuCategory {
  _id?: ObjectId
  name: string
  description: string
  displayOrder: number
  active: boolean
}
