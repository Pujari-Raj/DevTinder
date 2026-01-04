import mongoose from "mongoose";
import { env } from "./config";

export const connectToDB = async () => {
  try {
    await mongoose.connect(env?.MONGODB_URL, { dbName: env?.DB_NAME });
    console.log("✅ MongoDB is connected");
  } catch (error) {
    console.error("❌ MongoDB Connection failed");
    process.exit(1);
  }
};
