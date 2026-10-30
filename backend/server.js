import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, ".env"), quiet: true });

await import("./config/cloudinary.js");
// Not awaited: it uploads a test image, which would delay every cold start.
import("./utils/cloudinaryUpload.js").then(({ verifyCloudinaryUploadAccess }) =>
  verifyCloudinaryUploadAccess(),
);

const { createApp } = await import("./src/app.js");
const { dbConnection } = await import("./dbConnection.js");

const app = createApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App running at ${PORT}`);
});

dbConnection();

// Surface SMTP problems in the deploy logs at boot (non-blocking).
const { verifyMailer } = await import("./src/utils/mailer.js");
verifyMailer();
