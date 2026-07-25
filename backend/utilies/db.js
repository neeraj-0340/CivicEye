import mongoose from "mongoose";
import dns from "dns";

// Use reliable DNS servers (Google 8.8.8.8 & Cloudflare 1.1.1.1) to resolve MongoDB Atlas SRV records
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
    // Ignore if environment does not support custom DNS servers
}

export async function connectDB() {
    try {
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