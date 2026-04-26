import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const client = await clientPromise
    const db = client.db("hopepath_user")

    const user = await db.collection("users").findOne({ _id: new ObjectId(id) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const moodEntries = await db
      .collection("moods")
      .find({ user_id: id })
      .sort({ logged_at: -1 })
      .toArray()

    const sessions = await db
      .collection("sessions")
      .find({ user_id: id })
      .sort({ scheduled_at: -1 })
      .toArray()

    const journalEntries = await db
      .collection("journals")
      .find({ user_id: id })
      .sort({ created_at: -1 })
      .toArray()

    return NextResponse.json({
      user: {
        user: {
          id: user._id.toString(),
          email: user.email,
          first_name: user.first_name || null,
          last_name: user.last_name || null,
          avatar_url: user.avatar_url || null,
          role: user.role || "user",
          faith_based_enabled: user.faith_based_enabled ?? false,
          notifications_enabled: user.notifications_enabled ?? true,
          mood_reminders_enabled: user.mood_reminders_enabled ?? false,
          is_active: user.is_active ?? true,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
        moodEntries: moodEntries.map(entry => ({
          id: entry._id.toString(),
          ...entry,
          _id: undefined,
        })),
        sessions: sessions.map(session => ({
          id: session._id.toString(),
          ...session,
          _id: undefined,
        })),
        journalEntries: journalEntries.map(entry => ({
          id: entry._id.toString(),
          title: entry.title,
          content: entry.content,
          mood: entry.mood || null,
          is_private: entry.is_private ?? false,
          created_at: entry.created_at,
        })),
      },
    })
  } catch (error) {
    console.error("Error fetching user details:", error)
    return NextResponse.json({ error: "Failed to fetch user details" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const client = await clientPromise
    const db = client.db("hopepath_user")

    const updates = await request.json()

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
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