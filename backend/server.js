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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.DASHBOARD_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

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
