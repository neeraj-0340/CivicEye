import logo from "./assets/celogofull.png";
import React, { useState, useEffect } from "react";
import api from "./api/config";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ThemeToggle from "./components/ThemeToggle";

export const CivicEyeUserprofile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    emailId: "",
    dob: "",
    state: "",
    address: "",
    idProofType: "",
    idProofNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) {
      console.error("User ID or Token missing!");
      alert("User ID or token missing");
      setIsLoading(false);
      return;
    }

    api
      .get(`/user/profile/${userId}`)
      .then((res) => {
        setFormData({
          fullName: res.data.name || "",
          mobileNumber: res.data.mobile || "",
          emailId: res.data.email || "",
          dob: res.data.dob ? res.data.dob.split("T")[0] : "",
          state: res.data.state || "",
          address: res.data.address || "",
          idProofType: res.data.idProofType || "",
          idProofNumber: res.data.idProofNumber || "",
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setIsLoading(false);
      });
  }, [userId, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId || !token) {
      alert("User not authenticated!");
      return;
    }

    setIsLoading(true);
    api
      .put(`/user/profile/update/${userId}`, formData)
      .then(() => {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setIsLoading(false);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', color: 'var(--text-primary)' }} className="py-12 px-4 sm:px-6 lg:px-8">
      <Toaster/>
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-4">
        <button 
          onClick={()=>navigate(-1)}
          className="btn btn-outline btn-sm"
        >
          ← Back
        </button>
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="card overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-purple-600 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-white text-2xl font-bold">User Profile</h1>
                <p className="text-blue-100 mt-1">
                  Manage your personal information
                </p>
              </div>
              <img src={logo} alt="CivicEye Logo" className="h-8 sm:h-10 md:h-12 max-w-full" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="form-input"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter your mobile number"
                      className="form-input"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="emailId"
                      value={formData.emailId}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="form-input"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* ID Proof Number */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      ID Proof Number
                    </label>
                    <input
                      type="text"
                      name="idProofNumber"
                      value={formData.idProofNumber}
                      onChange={handleChange}
                      placeholder="Enter your ID proof number"
                      className="form-input"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                      className="form-input"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* ID Proof Type */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      ID Proof Type
                    </label>
                    <input
                      type="text"
                      name="idProofType"
                      value={formData.idProofType}
                      onChange={handleChange}
                      placeholder="Enter your ID proof type"
                      className="form-input"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      rows="3"
                      className="form-input"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                      </svg>
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
