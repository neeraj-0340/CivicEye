import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/celogofull.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const CivicEyeUserHome = () => {
  const navigate = useNavigate();
  const userid = localStorage.getItem("id");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [feedback, setFeedback] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [latestFeedbacks, setLatestFeedbacks] = useState([]); // State for fetched feedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      if (!userid) return;
      const response = await axios.get(
        `http://127.0.0.1:5001/user/viewuser/${userid}`
      );

      if (response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data");
    }
  };

  // Fetch latest feedback
  const fetchLatestFeedback = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        "http://localhost:5001/feedback/allaccepted",
        {
          headers: { "x-auth-token": token },
        }
      );

      const sortedFeedbacks = response.data
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 2);

      // Format the feedback data
      const formattedFeedbacks = sortedFeedbacks
        .filter((item) => item.status == "accepted")
        .map((item) => ({
          id: item._id,
          userName: item.userId?.name || "Anonymous",
          description: item.description,
          timestamp: new Date(item.timestamp).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));

      setLatestFeedbacks(formattedFeedbacks);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setError("Failed to fetch feedback");
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(
          "http://localhost:5001/complaint/alllist",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        const formattedComplaints = response.data.map((item) => ({
          id: item._id,
          date: new Date(item.createdAt).toLocaleDateString(),
          description: item.description,
          location: item.location,
          uploader: item.userId?.name || "User",
          type: item.type,
          status: item.status || "Pending",
          proof: item.proof,
        }));

        setComplaints(formattedComplaints);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setError("Failed to fetch complaints");
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [userData.name]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchUserData(), fetchLatestFeedback()]);
      } catch (error) {
        setError(error, "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    if (!userid) {
      navigate("/home");
    }
  }, [navigate, userid]);

  const handlechange = (e) => {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value,
      userId: userid, // Ensure userId is always set
    });
  };

  // Updated handlesubmit function to match backend requirements
  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to submit feedback");
        return;
      }

      if (!feedback.description || feedback.description.trim() === "") {
        toast.error("Please enter your feedback");
        return;
      }

      const response = await axios.post(
        "http://localhost:5001/feedback/add",
        {
          userId: userid,
          description: feedback.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      toast.success(response.data.message || "Feedback submitted successfully");

      // Reset the feedback description field after successful submission
      setFeedback({
        ...feedback,
        description: "",
      });

      // Refresh the latest feedback after submission
      fetchLatestFeedback();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(error.response?.data?.message || "Failed to send feedback");
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: 1650, behavior: "smooth" });
  };

  const scrollToAbout = () => {
    window.scrollTo({ top: 780, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />
      {/* Navigation */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="mx-auto flex items-center justify-between py-4 px-6">
          <img
            src={logo}
            alt="CivicEye Logo"
            className="h-8"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          <nav className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
            <Link
              to="/complaintlist"
              className="hover:text-blue-600 transition-colors duration-200 py-2"
            >
              My Complaints
            </Link>
            <button
              onClick={scrollToAbout}
              className="hover:text-blue-600 transition-colors duration-200 py-2 focus:outline-none"
            >
              About
            </button>
            <button
              onClick={scrollToBottom}
              className="hover:text-blue-600 transition-colors duration-200 py-2 focus:outline-none"
            >
              Contact
            </button>
          </nav>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-gray-700 font-medium hidden md:block">
                {userData.name || "Account"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-1 z-10">
                <Link
                  to="/userprofile"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("id");
                    localStorage.removeItem("token");
                    setTimeout(() => {
                      toast.success("Logged out successfully");
                      navigate("/login");
                    }, 1000);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm9 2.586L14.586 8H12V5.586zM5 5a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H6z" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {loading && (
          <div className="container mx-auto py-16 px-6 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}
        {error && (
          <div className="container mx-auto py-16 px-6 text-center text-red-500">
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && (
          <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 h-96">
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-3xl px-6">
                  <h1 className="text-4xl font-bold mb-4">
                    Make Your Voice Heard!
                  </h1>
                  <p className="text-xl mb-8">
                    Report Problems, Help Your City, and Earn Rewards!
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                      to="/registercomplaint"
                      className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                    >
                      Register a Complaint
                    </Link>
                    <Link
                      to="/complaintlist"
                      className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-700 font-medium py-3 px-6 rounded-lg transition-all duration-300"
                    >
                      Track Existing Complaint
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto py-16 px-6">
              <h3 className="text-center text-3xl font-bold mb-12 text-gray-800">
                Our Impact in Numbers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-white shadow-xl rounded-xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
                  <div className="bg-blue-600 h-2"></div>
                  <div className="p-6">
                    <p className="text-lg font-medium text-gray-600 mb-2">
                      Complaints Registered
                    </p>
                    <p className="text-4xl font-bold text-blue-600">{complaints.length}</p>
                  </div>
                </div>
                <div className="bg-white shadow-xl rounded-xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
                  <div className="bg-green-600 h-2"></div>
                  <div className="p-6">
                    <p className="text-lg font-medium text-gray-600 mb-2">
                      Reports Filed
                    </p>
                    <p className="text-4xl font-bold text-green-600">992</p>
                  </div>
                </div>
                <div className="bg-white shadow-xl rounded-xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
                  <div className="bg-purple-600 h-2"></div>
                  <div className="p-6">
                    <p className="text-lg font-medium text-gray-600 mb-2">
                      Rewards Distributed
                    </p>
                    <p className="text-4xl font-bold text-purple-600">996</p>
                  </div>
                </div>
                <div className="bg-white shadow-xl rounded-xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
                  <div className="bg-indigo-600 h-2"></div>
                  <div className="p-6">
                    <p className="text-lg font-medium text-gray-600 mb-2">
                      Impact Made
                    </p>
                    <div className="flex items-center justify-center">
                      <p className="text-4xl font-bold text-indigo-600">Huge</p>
                      <span className="text-4xl text-indigo-600 ml-1">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-blue-50 py-16">
              <div className="container mx-auto px-6">
                <h3 className="text-center text-3xl font-bold mb-12 text-gray-800">
                  How It Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="bg-white shadow-lg rounded-xl p-6 text-center flex flex-col items-center transform transition-transform hover:scale-105 duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <span className="inline-block bg-blue-600 text-white text-sm px-2 py-1 rounded-full mb-3">
                      Step 1
                    </span>
                    <p className="font-medium text-gray-800">
                      You Register the Complaint
                    </p>
                  </div>
                  <div className="bg-white shadow-lg rounded-xl p-6 text-center flex flex-col items-center transform transition-transform hover:scale-105 duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="inline-block bg-blue-600 text-white text-sm px-2 py-1 rounded-full mb-3">
                      Step 2
                    </span>
                    <p className="font-medium text-gray-800">
                      Our Team Verifies & Forwards
                    </p>
                  </div>
                  <div className="bg-white shadow-lg rounded-xl p-6 text-center flex flex-col items-center transform transition-transform hover:scale-105 duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <span className="inline-block bg-blue-600 text-white text-sm px-2 py-1 rounded-full mb-3">
                      Step 3
                    </span>
                    <p className="font-medium text-gray-800">
                      Authorities Review
                    </p>
                  </div>
                  <div className="bg-white shadow-lg rounded-xl p-6 text-center flex flex-col items-center transform transition-transform hover:scale-105 duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="inline-block bg-blue-600 text-white text-sm px-2 py-1 rounded-full mb-3">
                      Step 4
                    </span>
                    <p className="font-medium text-gray-800">Issue Resolved</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="container mx-auto py-16 px-6">
              <h3 className="text-center text-3xl font-bold mb-12 text-gray-800">
                What Our Users Say
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestFeedbacks.length > 0 ? (
                  latestFeedbacks.map((feedbackItem) => (
                    <div
                      key={feedbackItem.id}
                      className="bg-white shadow-lg rounded-xl p-6 relative"
                    >
                      <div className="absolute -top-5 left-6 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl">
                        "
                      </div>
                      <p className="text-gray-700 mt-4">
                        {feedbackItem.description}
                      </p>
                      <div className="mt-6 flex items-center">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                          {feedbackItem.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-gray-800">
                            {feedbackItem.userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {feedbackItem.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-500">
                    <p>No feedback available yet.</p>
                  </div>
                )}

                {/* Feedback Form */}
                <div className="bg-white shadow-lg rounded-xl p-6">
                  <p className="font-medium text-gray-800 mb-4">
                    Share Your Experience
                  </p>
                  <textarea
                    placeholder="Write your feedback"
                    name="description"
                    value={feedback.description || ""}
                    onChange={handlechange}
                    className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    rows="3"
                  />
                  <button
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    onClick={handlesubmit}
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gray-100 py-16">
              <div className="container mx-auto px-6">
                <h3 className="text-center text-3xl font-bold mb-12 text-gray-800">
                  Get in Touch
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white shadow-lg rounded-xl p-8 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">
                      Support Email
                    </h4>
                    <p className="text-blue-600 font-medium">
                      support@civiceye.com
                    </p>
                    <button className="mt-6 inline-flex items-center justify-center px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      Send an Email
                    </button>
                  </div>
                  <div className="bg-white shadow-lg rounded-xl p-8 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">
                      Make A Call
                    </h4>
                    <p className="text-blue-600 font-medium">+123 456 7890</p>
                    <button className="mt-6 inline-flex items-center justify-center px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300 pt-12 pb-6 border-t-4 border-blue-600">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="mb-8">
                    <img src={logo} alt="CivicEye Logo" className="h-8 mb-4" />
                    <p className="text-sm text-gray-400">
                      Empowering citizens to report issues and improve their
                      communities through technology.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-4">
                      Contact Info
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>(123) 456-7890</span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>support@civiceye.com</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-4">
                      Quick Links
                    </h5>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          to="/userhome"
                          className="hover:text-blue-400 transition-colors duration-200"
                        >
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/complaintlist"
                          className="hover:text-blue-400 transition-colors duration-200"
                        >
                          Complaints
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/signup"
                          className="hover:text-blue-400 transition-colors duration-200"
                        >
                          Register
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/login"
                          className="hover:text-blue-400 transition-colors duration-200"
                        >
                          Login
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-white mb-4">
                      Stay Connected
                    </h5>
                    <div className="flex space-x-4">
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                      >
                        <svg
                          className="h-5 w-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                      >
                        <svg
                          className="h-5 w-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                      >
                        <svg
                          className="h-5 w-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.066-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
                  <p>
                    © CivicEye 2025 | Empowering Citizens, Improving Communities
                  </p>
                </div>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
};

export default CivicEyeUserHome;
