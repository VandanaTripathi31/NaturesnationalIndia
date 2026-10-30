import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

// Builds the Express app without listening or connecting to anything, so
// server.js and the tests can share it. Reads FRONTEND_URL / DASHBOARD_URL at
// call time, so load .env before calling.
export function createApp() {
  const app = express();

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
        const error = new Error("Not allowed by CORS");
        error.statusCode = 403;
        callback(error);
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

  return app;
}
