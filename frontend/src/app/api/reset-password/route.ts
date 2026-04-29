import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/firebaseAdmin"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 })
    const link = await adminAuth.generatePasswordResetLink(email)
    // In production you'd send this via email service
    // For now Firebase Auth will send the reset email directly
    return NextResponse.json({ success: true, link })
  } catch (error: any) {
    console.error("reset-password error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
