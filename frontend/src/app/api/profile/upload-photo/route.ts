import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const photoType = formData.get("photoType") as string; // "profile" or "cover"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: `hopepath/providers/${photoType}_photos`,
      resource_type: "image",
      // Auto crop and resize profile photos to a square
      ...(photoType === "profile" && {
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
      }),
      // Resize cover photos to wide format
      ...(photoType === "cover" && {
        transformation: [{ width: 1200, height: 400, crop: "fill" }],
      }),
    });

    console.log(`${photoType} photo uploaded:`, result.secure_url);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });

  } catch (error: any) {
    console.error("Photo upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
