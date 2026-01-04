import mongoose from "mongoose";
import { env } from "./config";

export const connectToDB = async() => {
    try {
        await mongoose.connect("");
        console.log("✅ MongoDB is connected")
    } catch (error) {
        console.error("❌ MongoDB Connection failed");
        process.exit(1);
    }
}