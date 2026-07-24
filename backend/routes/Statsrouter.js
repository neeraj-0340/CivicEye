import express from 'express';
import { getComplaintStats, getFeedbackStats, getUserStats } from '../controllers/Statscontroller.js';
import auth from '../middleware/auth.js';

const StatsRouter = express.Router();

// All stats endpoints require authentication
StatsRouter.get('/complaints', auth, getComplaintStats);
StatsRouter.get('/users', auth, getUserStats);
StatsRouter.get('/feedback', auth, getFeedbackStats);

export default StatsRouter;
