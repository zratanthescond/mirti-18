import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET() {
  try {
    await client.connect()
    const db = client.db("pizzeria_mirti")

    const settings = await db.collection("settings").findOne({ type: "restaurant" })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settingsData = await request.json()

    await client.connect()
    const db = client.db("pizzeria_mirti")

    await db.collection("settings").updateOne(
      { type: "restaurant" },
      {
        $set: {
          ...settingsData,
          type: "restaurant",
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  } finally {
    await client.close()
  }
}
