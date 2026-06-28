import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

console.log("Current .env credentials:");
console.log({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret
    ? config.api_secret.substring(0, 5) + "..."
    : "MISSING",
});

cloudinary.config(config);

// Test both read and write
(async () => {
  try {
    console.log("\n✓ Read test (ping):");
    const ping = await cloudinary.api.ping();
    console.log(ping);

    console.log("\n✓ Write test (get upload presets):");
    const presets = await cloudinary.api.upload_presets();
    console.log("Upload presets available:", presets.presets?.length);
  } catch (error) {
    console.log("\n✗ Error:", error.message, "- HTTP", error.http_code);
  }
})();
