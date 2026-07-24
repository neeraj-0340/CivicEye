import complaint from '../model/ComplaintSchema.js';
import user from '../model/UserSchema.js';
import feedback from '../model/FeedbackSchema.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /stats/complaints
 * Returns overall complaint stats + monthly counts for the last 12 months.
 */
export async function getComplaintStats(req, res) {
  try {
    const [total, pending, inProgress, resolved, rejected] = await Promise.all([
      complaint.countDocuments({}),
      complaint.countDocuments({ status: 'Pending' }),
      complaint.countDocuments({ status: 'In Progress' }),
      complaint.countDocuments({ status: 'Resolved' }),
      complaint.countDocuments({ status: 'Rejected' }),
    ]);

    // Category distribution
    const categoryCounts = {};
    const allComplaints = await complaint.find({}, 'type status createdAt');
    allComplaints.forEach((c) => {
      const cat = c.type || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Monthly stats for the last 12 months
    const monthly = buildMonthlyStats(allComplaints);

    return sendSuccess(res, {
      totalComplaints: total,
      statusCounts: { Pending: pending, 'In Progress': inProgress, Resolved: resolved, Rejected: rejected },
      categoryCounts,
      monthly,
    });
  } catch (error) {
    console.error('Error fetching complaint stats:', error);
    return sendError(res, 500, 'Server error', error.message);
  }
}

/**
 * GET /stats/users
 * Returns total registered users.
 */
export async function getUserStats(req, res) {
  try {
    const totalUsers = await user.countDocuments({ role: 'user' });
    const activeUsers = await user.countDocuments({ role: 'user', deletestate: false });
    const bannedUsers = await user.countDocuments({ role: 'user', deletestate: true });
    return sendSuccess(res, { totalUsers, activeUsers, bannedUsers });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return sendError(res, 500, 'Server error', error.message);
  }
}

/**
 * GET /stats/feedback
 * Returns total feedback stats.
 */
export async function getFeedbackStats(req, res) {
  try {
    const [totalFeedback, pending, accepted, rejected] = await Promise.all([
      feedback.countDocuments({}),
      feedback.countDocuments({ status: 'pending' }),
      feedback.countDocuments({ status: 'accepted' }),
      feedback.countDocuments({ status: 'rejected' }),
    ]);
    return sendSuccess(res, { totalFeedback, pending, accepted, rejected });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    return sendError(res, 500, 'Server error', error.message);
  }
}

// Helper: build last-12-months monthly complaint counts
function buildMonthlyStats(complaints) {
  const now = new Date();
  const months = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-indexed
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });

    const count = complaints.filter((c) => {
      const cd = new Date(c.createdAt);
      return cd.getFullYear() === year && cd.getMonth() === month;
    }).length;

    months.push({ month: label, count });
  }
  return months;
}
