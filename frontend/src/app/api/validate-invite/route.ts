import { createClient } from "@/lib/mongo"
import { NextResponse } from "next/server"

// POST - Validate and use an invite code
export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { code } = body

  if (!code) {
    return NextResponse.json({ error: "Invite code required" }, { status: 400 })
  }

  // Find valid invite code (bypass RLS using service role in production)
  const { data: invite, error: fetchError } = await supabase
    .from("admin_invites")
    .select("*")
    .eq("code", code)
    .eq("is_active", true)
    .is("used_by", null)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (fetchError || !invite) {
    return NextResponse.json({ 
      error: "Invalid or expired invite code" 
    }, { status: 400 })
  }

  // Mark invite as used
  const { error: updateInviteError } = await supabase
    .from("admin_invites")
    .update({
      used_by: user.id,
      used_at: new Date().toISOString(),
      is_active: false,
    })
    .eq("id", invite.id)

  if (updateInviteError) {
    return NextResponse.json({ error: updateInviteError.message }, { status: 500 })
  }

  // Update user's role
  const { error: updateProfileError } = await supabase
    .from("profiles")
    .update({ role: invite.role })
    .eq("id", user.id)

  if (updateProfileError) {
    return NextResponse.json({ error: updateProfileError.message }, { status: 500 })
  }

  return NextResponse.json({ 
    success: true, 
    role: invite.role,
    message: `You are now a ${invite.role}!`
  })
}
