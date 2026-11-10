
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { adminAuth } from "@/lib/firebase-admin";



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // Verify Firebase owner login
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const token = authorization.slice(7);
    const decodedToken = await adminAuth.verifyIdToken(token);

    if (
      !process.env.ADMIN_UID ||
      decodedToken.uid !== process.env.ADMIN_UID
    ) {
      return NextResponse.json(
        { error: "You are not authorized to upload." },
        { status: 403 }
      );
    }

    // Validate image
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Only JPG, PNG or WEBP images up to 5 MB are allowed." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${bytes.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "the-gift-jammers/products",
      resource_type: "image",
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { error: "Upload failed or authentication was invalid." },
      { status: 500 }
    );
  }
}