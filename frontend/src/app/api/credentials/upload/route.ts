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
    const documentType = formData.get("documentType") as string;
    const providerId = formData.get("providerId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: `hopepath/providers/${providerId}`,
      resource_type: "auto",
    });

    console.log("Cloudinary upload success:", result.secure_url);

    // Build a viewable URL
    // For PDFs: add fl_attachment so browser downloads it instead of blank page
    // For images: use the direct URL
    const isPdf = result.format === "pdf";
    const viewUrl = isPdf
      ? result.secure_url.replace("/upload/", "/upload/fl_attachment/")
      : result.secure_url;

    return NextResponse.json({
      success: true,
      url: result.secure_url,    // original URL stored in Firebase
      viewUrl,                   // URL used when clicking View
      publicId: result.public_id,
      format: result.format,
      documentType,
    });

  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
