import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET() {
  try {
    await client.connect()
    const db = client.db("pizzeria_mirti")

    const specials = await db.collection("specials").find({}).toArray()

    return NextResponse.json({ specials })
  } catch (error) {
    console.error("Error fetching specials:", error)
    return NextResponse.json({ error: "Failed to fetch specials" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(request: NextRequest) {
  try {
    const specialData = await request.json()

    await client.connect()
    const db = client.db("pizzeria_mirti")

    const result = await db.collection("specials").insertOne({
      ...specialData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const special = await db.collection("specials").findOne({ _id: result.insertedId })

    return NextResponse.json({ special })
  } catch (error) {
    console.error("Error creating special:", error)
    return NextResponse.json({ error: "Failed to create special" }, { status: 500 })
  } finally {
    await client.close()
  }
}
