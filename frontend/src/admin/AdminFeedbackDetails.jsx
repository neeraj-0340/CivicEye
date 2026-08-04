import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/config";
import toast, { Toaster } from "react-hot-toast";
import AdminSidebar, { AdminMobileHeader } from "../components/AdminSidebar";

export const AdminFeedbackDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const response = await api.get(`/feedback/view/${id}`);
        setFeedback(response.data);
      } catch (err) {
        console.error("Error fetching feedback details:", err);
        setError(err.response?.data?.message || "Failed to load feedback details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFeedbackDetails();
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await api.put(`/feedback/update-status/${id}`, {
        status: newStatus,
      });
      setFeedback(response.data);
      toast.success(`Feedback status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating feedback status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="admin-layout">
      <Toaster position="top-right" />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <AdminMobileHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="Feedback Details" />

        {/* Header */}
        <div style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Feedback Details
            </h1>
          </div>
          <button
            onClick={() => navigate("/feedbackmanagement")}
            className="btn btn-primary btn-sm"
          >
            Back to Feedback List
          </button>
        </div>

        <div className="admin-content">
          {loading && (
            <div className="card p-8 text-center">
              <p style={{ color: 'var(--text-muted)' }}>Loading feedback details…</p>
            </div>
          )}
          {error && (
            <div className="card p-8 text-center" style={{ color: 'var(--danger-text)' }}>
              <p>{error}</p>
              <button
                onClick={() => navigate("/feedbackmanagement")}
                className="btn btn-outline btn-sm mt-4"
              >
                Go Back
              </button>
            </div>
          )}
          {!loading && !error && feedback && (
            <div className="card p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>User Name</p>
                  <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {feedback.userId?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Status</p>
                  <span className={`badge ${
                    feedback.status === 'accepted' ? 'badge-accepted' :
                    feedback.status === 'rejected' ? 'badge-rejected' : 'badge-pending'
                  }`}>
                    {feedback.status || 'pending'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>User Email</p>
                  <p className="text-base" style={{ color: 'var(--text-primary)' }}>
                    {feedback.userId?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Submitted Date</p>
                  <p className="text-base" style={{ color: 'var(--text-primary)' }}>
                    {new Date(feedback.timestamp).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Feedback Description</p>
                <p className="text-base leading-relaxed p-4 rounded-lg border" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  {feedback.description}
                </p>
              </div>

              <div className="border-t mt-6 pt-6 flex flex-col sm:flex-row gap-3" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => handleStatusUpdate('accepted')}
                  className="btn btn-primary btn-sm"
                >
                  Accept Feedback
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  className="btn btn-danger btn-sm"
                >
                  Reject Feedback
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackDetails;