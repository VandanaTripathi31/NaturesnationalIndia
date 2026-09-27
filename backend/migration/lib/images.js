import { magentoImageUrl } from "./transform.js";

// Resolve a Magento media path into the { public_id, url } shape the Mongo
// schemas store. IMAGE_MODE=reference (default) just points at the existing
// Magento URL; IMAGE_MODE=cloudinary uploads a copy to Cloudinary.
let cloudinary = null;

async function getCloudinary() {
  if (cloudinary) return cloudinary;
  const mod = await import("cloudinary");
  cloudinary = mod.v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

export async function resolveImage(pathValue, folder) {
  const url = magentoImageUrl(pathValue);
  if (!url) return null;

  if ((process.env.IMAGE_MODE || "reference") !== "cloudinary") {
    return { public_id: "", url };
  }

  const cld = await getCloudinary();
  const res = await cld.uploader.upload(url, {
    folder: folder || "naturesnational/migrated",
    use_filename: true,
    unique_filename: false,
    overwrite: false,
  });
  return { public_id: res.public_id, url: res.secure_url };
}
