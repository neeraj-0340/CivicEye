import mongoose from "mongoose";

export async function connectDB() {
    try {
        const url = process.env.DB_URL;
        if (!url) {
            throw new Error("DB_URL is not defined in environment variables.");
        }
        await mongoose.connect(url);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to database:", error.message);
        throw error;
    }
}