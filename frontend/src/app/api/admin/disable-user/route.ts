import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/firebaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const { uid, disable } = await req.json()
    if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 })
    await adminAuth.updateUser(uid, { disabled: disable })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("disable-user error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
