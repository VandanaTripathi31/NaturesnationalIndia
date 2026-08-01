import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, ".env"), quiet: true });

await import("./config/cloudinary.js");
await import("./utils/cloudinaryUpload.js").then(({ verifyCloudinaryUploadAccess }) =>
  verifyCloudinaryUploadAccess(),
);

const { default: express } = await import("express");
const { default: cors } = await import("cors");
const { dbConnection } = await import("./dbConnection.js");
const { default: authRoutes } = await import("./src/routes/authRoutes.js");
const { default: categoryRoutes } = await import("./src/routes/categoryRoutes.js");
const { default: productRoutes } = await import("./src/routes/productRoutes.js");
const { default: publicRoutes } = await import("./src/routes/publicRoutes.js");
const { default: enquiryRoutes } = await import("./src/routes/enquiryRoutes.js");
const { errorHandler, notFoundHandler } = await import(
  "./src/middleware/errorMiddleware.js"
);

const app = express();
const PORT = process.env.PORT || 5000;

// Build the CORS allow-list from env. Supports comma-separated values in a
// single variable (e.g. FRONTEND_URL="https://a.com,https://b.com") and
// normalizes away trailing slashes so "https://site.com/" matches the
// browser-sent origin "https://site.com". A misconfigured origin here is the
// classic cause of "works locally but every API call fails in production",
// so if no allow-list is configured we fall back to reflecting the request
// origin rather than blocking every request.
const allowedOrigins = [process.env.FRONTEND_URL, process.env.DASHBOARD_URL]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((value) => value.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Non-browser clients (curl, server-to-server) send no Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalized = origin.replace(/\/+$/, "");
      if (allowedOrigins.length === 0 || allowedOrigins.includes(normalized)) {
        callback(null, true);
        return;
      }

      console.warn(`[cors] Blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/enquiries", enquiryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App running at ${PORT}`);
});

dbConnection();
