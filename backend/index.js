import 'dotenv/config';
import express from "express";
import { connectDB } from "./utilies/db.js";
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import UserRouter from "./routes/Userrouter.js";
import ComplaintRouter from "./routes/Complaintrouter.js";
import feedbackrouter from "./routes/Feedbackrouter.js";
import StatsRouter from "./routes/Statsrouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Express body parsers (urlencoded) – placed before CORS
app.use(express.urlencoded({ extended: true }));

// Parse allowed origins from environment variables (supporting comma-separated lists)
const parseOrigins = (envVar) => envVar ? envVar.split(',').map(url => url.trim()).filter(Boolean) : [];

const envOrigins = [
    ...parseOrigins(process.env.CLIENT_URL),
    ...parseOrigins(process.env.FRONTEND_URL),
    ...parseOrigins(process.env.ALLOWED_ORIGINS)
];

const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5001',
    'http://localhost:5002',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
];

const allowedOrigins = Array.from(new Set([...envOrigins, ...defaultOrigins]));

app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests without origin (e.g., server-to-server, mobile apps, Postman)
        if (!origin) {
            return callback(null, true);
        }

        // Allow any Vercel domain (*.vercel.app) for preview branch builds and production deployments
        if (origin.endsWith('.vercel.app') || /\.vercel\.app$/i.test(origin)) {
            return callback(null, true);
        }

        // Allow explicitly whitelisted origins
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow all origins during development
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        // Gracefully disallow origins without throwing an Express 500 error on preflight
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Origin', 'Accept'],
    optionsSuccessStatus: 200
}));

// Health Check Endpoint for deployment verification
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use("/user", UserRouter);
app.use("/complaint", ComplaintRouter);
app.use("/feedback", feedbackrouter);
app.use("/stats", StatsRouter);
app.use('/uploads', express.static(uploadsDir));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

const port = process.env.PORT || 5001;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`CivicEye backend running on port: ${port}`);
    });
}).catch((err) => {
    console.error("Failed to start server due to DB connection failure:", err.message);
    process.exit(1);
});