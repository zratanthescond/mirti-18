import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const client = new MongoClient(
  "mongodb://root:gI1LfzCG0X9Mb5K6aOgbrr3ORCjskW4VXIrIAS34vIQMuG4XAnYX4P5cDpt2cCXP@54.37.254.81:20199/?directConnection=true",
)

export async function GET() {
  try {
    await client.connect()
    const db = client.db("pizzeria_mirti")

    const products = await db.collection("products").find({}).toArray()

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    await client.connect()
    const db = client.db("pizzeria_mirti")

    const result = await db.collection("products").insertOne({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const product = await db.collection("products").findOne({ _id: result.insertedId })

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  } finally {
    await client.close()
  }
}
