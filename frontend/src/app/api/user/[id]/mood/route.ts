import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const client = await clientPromise
    const db = client.db("hopepath_user") // Fixed: removed the colon typo

    const moodData = await request.json()

    const moodEntry = {
      user_id: id,
      mood: moodData.mood,
      energy_level: moodData.energy_level || null,
      sleep_quality: moodData.sleep_quality || null,
      anxiety_level: moodData.anxiety_level || null,
      notes: moodData.notes || null,
      activities: moodData.activities || [],
      logged_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    const result = await db.collection("moods").insertOne(moodEntry)

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error logging mood:", error)
    return NextResponse.json({ error: "Failed to log mood" }, { status: 500 })
  }
}