import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

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

      const response = await axios.get(
        `http://localhost:5001/user/details/${id}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

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
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5001/user/ban/${userId}`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

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
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5001/user/restore/${userId}`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

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
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <p className="text-center text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Details</h2>
        <button
          onClick={() => navigate("/usermanagement")}
          className="text-white hover:bg-blue-800 rounded-2xl bg-blue-600 px-2 py-1"
        >
          Back to User Management
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-medium">{user.mobile}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-medium">{user.address || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">ID Proof</p>
          <p className="font-medium">
            {user.idProofType && user.idProofNumber
              ? `${user.idProofType}: ${user.idProofNumber}`
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="font-medium">{user.role}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Reports</p>
          <p className="font-medium">{user.reports}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium">
            {user.deletestate ? "Banned" : "Active"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        {!user.deletestate && (
          <button
            onClick={() => handleBan(user._id)}
            disabled={deleting}
            className="text-white hover:bg-red-800 rounded-2xl bg-red-600 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Banning..." : "Ban User"}
          </button>
        )}
        {user.deletestate && (
          <button
            onClick={() => handleRestore(user._id)}
            disabled={restoring}
            className="text-white hover:bg-green-800 rounded-2xl bg-green-600 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {restoring ? "Restoring..." : "Restore User"}
          </button>
        )}
      </div>
    </div>
  );
};