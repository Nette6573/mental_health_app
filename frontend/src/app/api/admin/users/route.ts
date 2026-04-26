import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("hopepath_user") // Replace with your DB name

    const users = await db
      .collection("users")
      .find({})
      .sort({ created_at: -1 })
      .toArray()

    const formattedUsers = users.map(user => ({
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
    }))

    const stats = {
      totalUsers: formattedUsers.length,
      activeUsers: formattedUsers.filter(u => u.is_active).length,
      providers: formattedUsers.filter(u => u.role === "provider").length,
      admins: formattedUsers.filter(u => u.role === "admin").length,
    }

    return NextResponse.json({ users: formattedUsers, stats })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}