import express from "express";
import { addFeedback, getAcceptedFeedback, getAllFeedback, getFeedbackByStatus, getFeedbackCountByStatus, updateFeedbackStatus } from "../controllers/feedbackController.js";
import auth from "../middleware/auth.js";

const feedbackrouter = express.Router();

// Route to add feedback
feedbackrouter.post("/add", addFeedback);

// Route to get all feedback
feedbackrouter.get("/all",auth, getAllFeedback);
feedbackrouter.get("/allaccepted",auth, getAcceptedFeedback);

feedbackrouter.put("/updatestatus",auth,updateFeedbackStatus)
feedbackrouter.put("/status/:status",auth,getFeedbackByStatus)
feedbackrouter.get("/countbystatus",auth,getFeedbackCountByStatus)

export default feedbackrouter;
