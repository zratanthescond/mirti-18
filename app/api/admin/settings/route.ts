import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()

    let settings = await db.collection("restaurant_settings").findOne({})

    // If no settings exist, create default ones
    if (!settings) {
      const defaultSettings = {
        restaurant: {
          name: "Pizzeria Mirti",
          description: "Authentic Italian cuisine with fresh ingredients and traditional recipes",
          address: {
            street: "Via Roma 123",
            city: "Milano",
            postalCode: "20121",
            country: "Italy",
          },
          contact: {
            phone: "+39 02 1234 5678",
            email: "info@pizzeriamirti.com",
            website: "https://pizzeriamirti.com",
          },
          hours: {
            monday: { open: "11:00", close: "23:00", closed: false },
            tuesday: { open: "11:00", close: "23:00", closed: false },
            wednesday: { open: "11:00", close: "23:00", closed: false },
            thursday: { open: "11:00", close: "23:00", closed: false },
            friday: { open: "11:00", close: "24:00", closed: false },
            saturday: { open: "11:00", close: "24:00", closed: false },
            sunday: { open: "12:00", close: "22:00", closed: false },
          },
        },
        delivery: {
          enabled: true,
          radius: 10,
          minimumOrder: 15,
          fee: 3.5,
          freeDeliveryThreshold: 30,
        },
        payment: {
          acceptCash: true,
          acceptCard: true,
          acceptOnline: true,
          taxRate: 0.22,
        },
        notifications: {
          emailOrders: true,
          smsOrders: false,
          emailMarketing: true,
        },
        updatedAt: new Date(),
      }

      await db.collection("restaurant_settings").insertOne(defaultSettings)
      settings = defaultSettings
    }

    return NextResponse.json({
      id: settings._id?.toString(),
      restaurant: settings.restaurant,
      delivery: settings.delivery,
      payment: settings.payment,
      notifications: settings.notifications,
      updatedAt: settings.updatedAt,
    })
  } catch (error) {
    console.error("Settings fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase()
    const data = await request.json()

    const updateData = {
      restaurant: data.restaurant,
      delivery: data.delivery,
      payment: data.payment,
      notifications: data.notifications,
      updatedAt: new Date(),
    }

    const result = await db.collection("restaurant_settings").updateOne({}, { $set: updateData }, { upsert: true })

    return NextResponse.json({
      success: true,
      ...updateData,
    })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
