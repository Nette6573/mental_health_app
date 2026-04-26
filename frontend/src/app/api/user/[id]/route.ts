import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("hopepath_user") // Replace with your DB name

    const userId = params.id

    // Get user profile
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get mood entries
    const moodEntries = await db
      .collection("moods")
      .find({ user_id: userId })
      .sort({ logged_at: -1 })
      .limit(30)
      .toArray()

    // Get journal entries
    const journalEntries = await db
      .collection("journals")
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(20)
      .toArray()

    // Get sessions
    const sessions = await db
      .collection("sessions")
      .find({ user_id: userId })
      .sort({ scheduled_at: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json({
      user: {
        ...user,
        id: user._id.toString(),
        _id: undefined,
      },
      moodEntries: moodEntries.map(entry => ({
        ...entry,
        id: entry._id.toString(),
        _id: undefined,
      })),
      journalEntries: journalEntries.map(entry => ({
        ...entry,
        id: entry._id.toString(),
        _id: undefined,
      })),
      sessions: sessions.map(session => ({
        ...session,
        id: session._id.toString(),
        _id: undefined,
      })),
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("hopepath_user") //  DB name

    const userId = params.id
    const updates = await request.json()

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...updates, updated_at: new Date().toISOString() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}