import streamifier from "streamifier";
import cloudinary, { uploadPreset } from "../config/cloudinary.js";

const DEFAULT_FOLDER = "natures-national/categories";

const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
  "base64",
);

function enhanceUploadError(error) {
  if (error?.http_code !== 403) {
    return error;
  }

  const message = uploadPreset
    ? "Cloudinary upload denied (403). Verify CLOUDINARY_UPLOAD_PRESET is an unsigned preset and your API key has upload permissions in Cloudinary Console → Settings → API Keys → Assign Roles."
    : "Cloudinary upload denied (403). Your API key can reach the Admin API but is not allowed to upload. In Cloudinary Console → Settings → API Keys → select your key → Assign Roles → grant upload access (e.g. Master Admin or a custom role with Upload assets). Alternatively, create an unsigned upload preset and set CLOUDINARY_UPLOAD_PRESET in backend/.env.";

  const enhanced = new Error(message);
  enhanced.http_code = 403;
  enhanced.name = error.name ?? "CloudinaryUploadError";
  enhanced.cause = error;
  return enhanced;
}

function createUploadStream(options, buffer) {
  return new Promise((resolve, reject) => {
    const handleResult = (error, result) => {
      if (error) {
        console.error("[Cloudinary] Upload error:", {
          message: error.message,
          http_code: error.http_code,
          name: error.name,
        });
        reject(enhanceUploadError(error));
        return;
      }

      console.log("[Cloudinary] Upload response:", {
        public_id: result.public_id,
        url: result.secure_url,
        bytes: result.bytes,
      });

      resolve({
        public_id: result.public_id,
        url: result.secure_url,
      });
    };

    const uploadStream = uploadPreset
      ? cloudinary.uploader.unsigned_upload_stream(
          uploadPreset,
          options,
          handleResult,
        )
      : cloudinary.uploader.upload_stream(options, handleResult);

    uploadStream.on("error", (streamError) => {
      console.error("[Cloudinary] Upload stream error:", streamError.message);
      reject(streamError);
    });

    const readStream = streamifier.createReadStream(buffer);

    readStream.on("error", (readError) => {
      console.error("[Cloudinary] Read stream error:", readError.message);
      reject(readError);
    });

    readStream.pipe(uploadStream);
  });
}

function uploadWithStream(options, buffer) {
  return createUploadStream(options, buffer);
}

export function uploadImageBuffer(buffer, folder = DEFAULT_FOLDER) {
  console.log("[Cloudinary] Buffer exists:", Boolean(buffer));
  console.log("[Cloudinary] Buffer size:", buffer?.length ?? 0);
  console.log(
    "[Cloudinary] Upload mode:",
    uploadPreset ? `unsigned (${uploadPreset})` : "signed",
  );

  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
    return Promise.reject(new Error("Invalid or empty image buffer"));
  }

  if (uploadPreset) {
    return createUploadStream(
      {
        folder,
        resource_type: "image",
      },
      buffer,
    );
  }

  return uploadWithStream(
    {
      folder,
      resource_type: "image",
    },
    buffer,
  );
}

export async function deleteImage(publicId) {
  if (!publicId) return;

  try {
    console.log("Deleting:", publicId);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    console.log("Cloudinary destroy result:", result);

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Unexpected delete result: ${result.result}`);
    }

    return result;
  } catch (err) {
    console.error("FULL DELETE ERROR");
    console.dir(err, { depth: null });

    throw err;
  }
}
export async function deleteImages(publicIds = []) {
  await Promise.all(
    publicIds.filter(Boolean).map((publicId) => deleteImage(publicId)),
  );
}

export async function uploadMultipleImageBuffers(
  buffers,
  folder = "natures-national/products",
) {
  const uploads = [];

  for (const buffer of buffers) {
    uploads.push(await uploadImageBuffer(buffer, folder));
  }

  return uploads;
}

export async function verifyCloudinaryUploadAccess() {
  const runtimeConfig = cloudinary.config();

  if (!runtimeConfig?.api_key || !runtimeConfig?.api_secret) {
    console.warn(
      "[Cloudinary] Skipping upload verification — config incomplete",
    );
    return false;
  }

  try {
    await cloudinary.api.ping();
    console.log("[Cloudinary] Ping OK");

    if (uploadPreset) {
      await uploadWithStream(
        {
          upload_preset: uploadPreset,
          folder: "natures-national/_verify",
          resource_type: "image",
          unsigned: true,
        },
        TINY_PNG,
      );
    } else {
      await uploadWithStream(
        {
          folder: "natures-national/_verify",
          resource_type: "image",
        },
        TINY_PNG,
      );
    }

    console.log("[Cloudinary] Upload access verified");
    return true;
  } catch (error) {
    const uploadError =
      error?.http_code === 403 ? enhanceUploadError(error) : error;

    console.error(
      "[Cloudinary] Upload verification failed:",
      uploadError.message,
    );
    return false;
  }
}
