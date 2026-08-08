import express from "express";
import { addFeedback, getAcceptedFeedback, getAllFeedback, getFeedbackById, getFeedbackByStatus, getFeedbackCountByStatus, updateFeedbackStatus } from "../controllers/Feedbackcontroller.js";
import auth from "../middleware/auth.js";

const feedbackrouter = express.Router();

// Route to add feedback
feedbackrouter.post("/add", addFeedback);

// Route to get all feedback
feedbackrouter.get("/all", auth, getAllFeedback);
feedbackrouter.get("/allaccepted", auth, getAcceptedFeedback);
feedbackrouter.get("/countbystatus", auth, getFeedbackCountByStatus);

// Route to get feedback details by ID
feedbackrouter.get("/view/:id", auth, getFeedbackById);
feedbackrouter.get("/detail/:id", auth, getFeedbackById);
feedbackrouter.get("/:id", auth, getFeedbackById);

// Route to update feedback status
feedbackrouter.put("/updatestatus", auth, updateFeedbackStatus);
feedbackrouter.put("/update-status/:id", auth, updateFeedbackStatus);
feedbackrouter.put("/status/:status", auth, getFeedbackByStatus);

export default feedbackrouter;
