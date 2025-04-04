import express from "express"
import { connectDB } from "./utilies/db.js";
import cors from 'cors';
import UserRouter from "./routes/Userrouter.js";
import ComplaintRouter from "./routes/Complaintrouter.js";
import feedbackrouter from "./routes/Feedbackrouter.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json());
app.use(cors())
app.use("/user", UserRouter)
app.use("/complaint", ComplaintRouter)
app.use("/feedback", feedbackrouter)
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 5002;


connectDB().then(() => { 
    app.listen(port, () => {
        console.log(`running in the server:${port}`);
    })
})