import { NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase/firebaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json()
    if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 })
    // Delete from Firebase Auth
    await adminAuth.deleteUser(uid)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("delete-user error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
