import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/config";
import toast, { Toaster } from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";

export const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false); // New state for restore action

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view user details");
        setLoading(false);
        return;
      }

      const response = await api.get(`/user/details/${id}`);

      setUser(response.data);
      setLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch user details. Please try again."
      );
      setLoading(false);
    }
  };

  const handleBan = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to ban this user? They will lose access temporarily."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await api.put(`/user/deleted/${userId}`, {});

      toast.success("User banned successfully");
      // Refresh user details to reflect updated deletestate
      await fetchUserDetails();
      setDeleting(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to ban user. Please try again."
      );
      setDeleting(false);
    }
  };

  const handleRestore = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to restore this user? They will regain access."
      )
    ) {
      return;
    }

    try {
      setRestoring(true);
      await api.put(`/user/restore/${userId}`, {});

      toast.success("User restored successfully");
      // Refresh user details to reflect updated deletestate
      await fetchUserDetails();
      setRestoring(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to restore user. Please try again."
      );
      setRestoring(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-100 text-red-700 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 card">
        <p className="text-center" style={{ color: 'var(--text-muted)' }}>User not found</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', padding: '2.5rem 1rem' }}>
      <div className="max-w-2xl mx-auto p-6 card" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <Toaster />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>User Details</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ThemeToggle />
            <button
              onClick={() => navigate("/usermanagement")}
              className="btn btn-primary btn-sm min-h-[44px]"
            >
              Back to Users
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Name</p>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Email</p>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.email}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Phone</p>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.mobile}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Address</p>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.address || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>ID Proof</p>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {user.idProofType && user.idProofNumber
                ? `${user.idProofType}: ${user.idProofNumber}`
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Role</p>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.role}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Status</p>
            <p className="font-medium">
              {user.deletestate ? <span className="badge badge-rejected">Banned</span> : <span className="badge badge-resolved">Active</span>}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          {!user.deletestate && (
            <button
              onClick={() => handleBan(user._id)}
              disabled={deleting}
              className="btn btn-danger btn-sm"
            >
              {deleting ? "Banning..." : "Ban User"}
            </button>
          )}
          {user.deletestate && (
            <button
              onClick={() => handleRestore(user._id)}
              disabled={restoring}
              className="btn btn-primary btn-sm"
            >
              {restoring ? "Restoring..." : "Restore User"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};