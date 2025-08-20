import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const specialData = await request.json()

    await client.connect()
    const db = client.db("pizzeria_mirti")

    await db
      .collection("specials")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { ...specialData, updatedAt: new Date() } })

    const special = await db.collection("specials").findOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({ special })
  } catch (error) {
    console.error("Error updating special:", error)
    return NextResponse.json({ error: "Failed to update special" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    await client.connect()
    const db = client.db("pizzeria_mirti")

    await db
      .collection("specials")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { ...updates, updatedAt: new Date() } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating special:", error)
    return NextResponse.json({ error: "Failed to update special" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await client.connect()
    const db = client.db("pizzeria_mirti")

    await db.collection("specials").deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting special:", error)
    return NextResponse.json({ error: "Failed to delete special" }, { status: 500 })
  } finally {
    await client.close()
  }
}
