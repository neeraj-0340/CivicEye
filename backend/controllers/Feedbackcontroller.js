import feedback from "../model/FeedbackSchema.js";
import { getPagination, buildPaginationMeta } from '../utils/paginate.js';
import mongoose from "mongoose";

export const addFeedback = async (req, res) => {
    try {
        const { userId, description, status } = req.body;

        if (!userId || !description) {
            return res.status(400).json({ message: "User ID and description are required" });
        }

        const newFeedback = new feedback({
            userId,
            description,
            timestamp: new Date().toISOString(),
            status: status || "pending" // Use provided status or default to "pending"
        });

        await newFeedback.save();
        res.status(201).json({ message: "Feedback submitted successfully", feedback: newFeedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error submitting feedback", error });
    }
};

export const getAllFeedback = async (req, res) => {
    try {
        if (req.query.page || req.query.limit) {
            const { search, status: statusFilter } = req.query;
            const filter = {};
            if (statusFilter && statusFilter !== 'all') filter.status = statusFilter;
            if (search) {
                filter.$or = [
                    { description: { $regex: search, $options: 'i' } },
                ];
            }
            const { page, limit, skip } = getPagination(req.query);
            const [total, feedbacks] = await Promise.all([
                feedback.countDocuments(filter),
                feedback.find(filter).populate('userId', 'name email').sort({ timestamp: -1 }).skip(skip).limit(limit),
            ]);
            return res.status(200).json({
                success: true,
                data: feedbacks,
                pagination: buildPaginationMeta(total, page, limit),
            });
        }
        // Legacy
        const feedbacks = await feedback.find().populate("userId", "name email");
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving feedback", error });
    }
};
export const getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Feedback ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        const feedbackItem = await feedback.findById(id).populate("userId", "name email");

        if (!feedbackItem) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json(feedbackItem);
    } catch (error) {
        console.error("Error retrieving feedback by ID:", error);
        res.status(500).json({ message: "Error retrieving feedback details", error: error.message });
    }
};

export const updateFeedbackStatus = async (req, res) => {
    try {
        const feedbackId = req.params.id || req.body.feedbackId;
        const { status } = req.body;

        if (!feedbackId || !status) {
            return res.status(400).json({ message: "Feedback ID and status are required" });
        }

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        const updatedFeedback = await feedback.findByIdAndUpdate(
            feedbackId,
            { status },
            { new: true }
        ).populate("userId", "name email");

        if (!updatedFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({
            message: "Feedback status updated successfully",
            feedback: updatedFeedback
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating feedback status", error: error.message });
    }
};

export const getFeedbackByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const feedbacks = await feedback.find({ status }).populate("userId", "name email");
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving feedback", error });
    }
};

export async function getFeedbackCountByStatus(req, res) {
    try {
        const feedbackList = await feedback.find({}); // Assuming `feedback` is your Feedback model
        const statusCounts = {
            pending: 0,
            accepted: 0,
            rejected: 0,
        };

        feedbackList.forEach((fb) => {
            if (statusCounts.hasOwnProperty(fb.status)) {
                statusCounts[fb.status]++;
            }
        });

        return res.status(200).json(statusCounts);
    } catch (error) {
        console.error("Error fetching feedback stats:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getAcceptedFeedback = async (req, res) => {
    try {
        const feedbacks = await feedback
            .find({ status: "accepted" })
            .populate("userId", "name email");
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving accepted feedback", error });
    }
};