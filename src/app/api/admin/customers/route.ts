import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const client = new MongoClient(
  "mongodb://root:gI1LfzCG0X9Mb5K6aOgbrr3ORCjskW4VXIrIAS34vIQMuG4XAnYX4P5cDpt2cCXP@54.37.254.81:20199/?directConnection=true",
)

export async function GET() {
  try {
    await client.connect()
    const db = client.db("pizzeria_mirti")

    const customers = await db.collection("customers").find({}).toArray()

    return NextResponse.json({ customers })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  } finally {
    await client.close()
  }
}
