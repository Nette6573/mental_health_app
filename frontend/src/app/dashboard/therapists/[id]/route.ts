import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Therapist from "@/models/Therapist"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const therapist = await Therapist.findById(params.id)

    if (!therapist) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(therapist)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}