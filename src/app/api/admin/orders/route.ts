import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const client = new MongoClient(
  "mongodb://root:gI1LfzCG0X9Mb5K6aOgbrr3ORCjskW4VXIrIAS34vIQMuG4XAnYX4P5cDpt2cCXP@54.37.254.81:20199/?directConnection=true",
)

export async function GET() {
  try {
    await client.connect()
    const db = client.db("pizzeria_mirti")

    const orders = await db.collection("orders").find({}).sort({ orderTime: -1 }).toArray()

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  } finally {
    await client.close()
  }
}
