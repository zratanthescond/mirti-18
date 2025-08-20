import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()

    await client.connect()
    const db = client.db("pizzeria_mirti")

    await db
      .collection("orders")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { status, updatedAt: new Date() } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  } finally {
    await client.close()
  }
}
