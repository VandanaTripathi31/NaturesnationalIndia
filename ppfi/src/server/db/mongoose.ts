import mongoose from "mongoose";

import { getServerEnv } from "@/config/env";

/**
 * Cached Mongoose connection.
 *
 * Next.js hot-reloads and serverless invocations would otherwise open a new
 * connection on every request, exhausting the connection pool. We memoise the
 * connection promise on the Node global so it survives module reloads.
 */

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    const { MONGODB_URI } = getServerEnv();
    mongoose.set("strictQuery", true);
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
