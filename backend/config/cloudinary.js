import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();

  if (cloudinaryUrl) {
    if (!cloudinaryUrl.toLowerCase().startsWith("cloudinary://")) {
      throw new Error(
        "CLOUDINARY_URL must start with cloudinary:// (copy it from Cloudinary Console → Settings → API Keys)",
      );
    }

    process.env.CLOUDINARY_URL = cloudinaryUrl;
    cloudinary.config({ secure: true });

    console.log("[Cloudinary] Config loaded from CLOUDINARY_URL");
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(
      "[Cloudinary] Config incomplete — set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend/.env",
    );
    return;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  console.log("[Cloudinary] Config loaded:", {
    cloud_name: cloudName,
    api_key: `${apiKey.slice(0, 4)}***`,
    api_secret: "***",
  });
}

configureCloudinary();

export const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim() || null;

if (uploadPreset) {
  console.log("[Cloudinary] Unsigned upload preset configured:", uploadPreset);
} else {
  console.log(
    "[Cloudinary] Signed upload mode (set CLOUDINARY_UPLOAD_PRESET for unsigned uploads)",
  );
}

export default cloudinary;
