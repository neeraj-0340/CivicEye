import mongoose from "mongoose";

export async function connectDB() {
    try {
        // Support both DB_URL (legacy) and MONGO_URI (standard) env variables
        const url = process.env.DB_URL || process.env.MONGO_URI;
        if (!url) {
            throw new Error("Database connection string is not defined. Set DB_URL or MONGO_URI.");
        }
        await mongoose.connect(url);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to database:", error.message);
        throw error;
    }
}