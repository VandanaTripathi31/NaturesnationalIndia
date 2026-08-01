import mongoose from "mongoose";

// Connects mongoose so the migration can reuse the app's real models
// (../../src/models/*), guaranteeing the imported data obeys the exact
// same schema/validation the running site expects.
export async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set");

  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB || undefined,
  });

  return mongoose.connection;
}

export async function disconnectMongo() {
  await mongoose.connection.close();
}
