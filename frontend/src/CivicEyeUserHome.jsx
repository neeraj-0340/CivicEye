import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/celogofull.png";
import api from "./api/config";
import toast, { Toaster } from "react-hot-toast";
import ThemeToggle from "./components/ThemeToggle";

export const CivicEyeUserHome = () => {
  const navigate = useNavigate();
  const userid = localStorage.getItem("id");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [feedback, setFeedback] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [latestFeedbacks, setLatestFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      if (!userid) return;
      const response = await api.get(`/user/viewuser/${userid}`);
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
      const response = await api.get("/feedback/allaccepted");
      const raw = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      const sortedFeedbacks = raw
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 3);

      const formattedFeedbacks = sortedFeedbacks.map((item) => ({
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
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/complaint/alllist");
        const raw = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        const formattedComplaints = raw.map((item) => ({
          id: item._id,
          date: new Date(item.createdAt).toLocaleDateString("en-GB"),
          description: item.description,
          location: item.location,
          uploader: item.userId?.name || "User",
          type: item.type,
          status: item.status || "Pending",
          proof: item.proof,
        }));

        setComplaints(formattedComplaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setError("Failed to fetch complaints");
      } finally {
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
        console.error("Error loading data:", error);
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
      userId: userid,
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      if (!feedback.description || feedback.description.trim() === "") {
        toast.error("Please enter your feedback");
        return;
      }

      const response = await api.post("/feedback/add", {
        userId: userid,
        description: feedback.description,
      });

      toast.success(response.data.message || "Feedback submitted successfully");
      setFeedback({});
      fetchLatestFeedback();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const scrollToAbout = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Dynamic statistics calculated from real backend complaint data
  const totalComplaintsCount = complaints.length;
  const pendingComplaintsCount = complaints.filter(
    (c) => (c.status || "").toLowerCase() === "pending"
  ).length;
  const resolvedComplaintsCount = complaints.filter(
    (c) => (c.status || "").toLowerCase() === "resolved"
  ).length;
  const inProgressComplaintsCount = complaints.filter(
    (c) => (c.status || "").toLowerCase() === "in progress"
  ).length;

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <Toaster position="top-right" />

      {/* Navigation Bar */}
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }} className="shadow-md sticky top-0 z-50">
        <div className="mx-auto flex items-center justify-between py-4 px-6">
          <img
            src={logo}
            alt="CivicEye Logo"
            className="h-8 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />

          <nav className="hidden md:flex items-center space-x-8 font-medium" style={{ color: 'var(--text-secondary)' }}>
            <Link to="/complaintlist" className="hover:text-blue-500 transition-colors py-2">
              My Complaints
            </Link>
            <button onClick={scrollToAbout} className="hover:text-blue-500 transition-colors py-2 focus:outline-none">
              About
            </button>
            <button onClick={scrollToBottom} className="hover:text-blue-500 transition-colors py-2 focus:outline-none">
              Contact
            </button>
          </nav>

          {/* Theme Toggle & Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <div className="relative">
              <button
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="font-medium hidden md:block" style={{ color: 'var(--text-primary)' }}>
                  {userData.name || "Account"}
                </span>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 shadow-lg rounded-lg border py-1 z-10"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <Link
                    to="/userprofile"
                    className="flex items-center px-4 py-2 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      toast.success("Logged out successfully");
                      navigate("/login");
                    }}
                    className="flex items-center w-full text-left px-4 py-2 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {loading && (
          <div className="container mx-auto py-16 px-6 text-center">
            <div className="skeleton" style={{ height: '200px', width: '100%', borderRadius: '1rem' }} />
          </div>
        )}
        {error && (
          <div className="container mx-auto py-16 px-6 text-center" style={{ color: 'var(--danger-text)' }}>
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && (
          <>
            {/* Hero Banner */}
            <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 h-96">
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-3xl px-6">
                  <h1 className="text-4xl font-bold mb-4">Make Your Voice Heard!</h1>
                  <p className="text-xl mb-8">
                    Report Problems, Help Your City, and Track Resolutions in Real Time.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                      to="/registercomplaint"
                      className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
                    >
                      Register a Complaint
                    </Link>
                    <Link
                      to="/complaintlist"
                      className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-700 font-medium py-3 px-6 rounded-lg transition-all duration-300"
                    >
                      Track Existing Complaints
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Dynamic Dashboard Statistics */}
            <section className="container mx-auto py-16 px-6">
              <h3 className="text-center text-3xl font-bold mb-12" style={{ color: 'var(--text-primary)' }}>
                System Impact & Live Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Total Complaints */}
                <div className="card shadow-xl rounded-xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
                  <div className="bg-blue-600 h-2"></div>
                  <div className="p-6">
                    <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Total Complaints
                    </p>
                    <p className="text-4xl font-bold text-blue-500">{totalComplaintsCount}</p>
                  </div>
                </div>

                {/* Pending Complaints */}
                <div className="card shadow-xl rounded-xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
                  <div className="bg-yellow-500 h-2"></div>
                  <div className="p-6">
                    <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Pending Complaints
                    </p>
                    <p className="text-4xl font-bold text-yellow-500">{pendingComplaintsCount}</p>
                  </div>
                </div>

                {/* In Progress Complaints */}
                <div className="card shadow-xl rounded-xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
                  <div className="bg-cyan-500 h-2"></div>
                  <div className="p-6">
                    <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      In Progress
                    </p>
                    <p className="text-4xl font-bold text-cyan-500">{inProgressComplaintsCount}</p>
                  </div>
                </div>

                {/* Resolved Complaints */}
                <div className="card shadow-xl rounded-xl overflow-hidden transform transition-transform hover:scale-105 duration-300">
                  <div className="bg-green-600 h-2"></div>
                  <div className="p-6">
                    <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Resolved Complaints
                    </p>
                    <p className="text-4xl font-bold text-green-500">{resolvedComplaintsCount}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16" style={{ background: 'var(--surface)' }}>
              <div className="container mx-auto px-6">
                <h3 className="text-center text-3xl font-bold mb-12" style={{ color: 'var(--text-primary)' }}>
                  How It Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="card p-6 text-center flex flex-col items-center transform transition-transform hover:scale-105 duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-4">
                      <span className="text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full mb-3 font-semibold">
                      Step 1
                    </span>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Register the Complaint
                    </p>
                  </div>

                  <div className="card p-6 text-center flex flex-col items-center transform transition-transform hover:scale-105 duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-4">
                      <span className="text-2xl font-bold text-blue-600">2</span>
                    </div>
                    <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full mb-3 font-semibold">
                      Step 2
                    </span>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Verification & Processing
                    </p>
                  </div>

                  <div className="card p-6 text-center flex flex-col items-center transform transition-transform hover:scale-105 duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-4">
                      <span className="text-2xl font-bold text-blue-600">3</span>
                    </div>
                    <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full mb-3 font-semibold">
                      Step 3
                    </span>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Authority Action
                    </p>
                  </div>

                  <div className="card p-6 text-center flex flex-col items-center transform transition-transform hover:scale-105 duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-4">
                      <span className="text-2xl font-bold text-blue-600">4</span>
                    </div>
                    <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full mb-3 font-semibold">
                      Step 4
                    </span>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Issue Resolved
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials & Feedback Section */}
            <section className="container mx-auto py-16 px-6">
              <h3 className="text-center text-3xl font-bold mb-12" style={{ color: 'var(--text-primary)' }}>
                Citizen Feedback & Experience
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestFeedbacks.length > 0 ? (
                  latestFeedbacks.map((feedbackItem) => (
                    <div key={feedbackItem.id} className="card p-6 relative">
                      <div className="absolute -top-4 left-6 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold">
                        "
                      </div>
                      <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
                        {feedbackItem.description}
                      </p>
                      <div className="mt-6 flex items-center">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {feedbackItem.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {feedbackItem.userName}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {feedbackItem.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center" style={{ color: 'var(--text-muted)' }}>
                    <p>No feedback available yet.</p>
                  </div>
                )}

                {/* Feedback Submission Form */}
                <div className="card p-6">
                  <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                    Share Your Experience
                  </p>
                  <textarea
                    placeholder="Write your feedback here..."
                    name="description"
                    value={feedback.description || ""}
                    onChange={handlechange}
                    className="form-input mb-4"
                    rows="3"
                  />
                  <button
                    className="btn btn-primary btn-block"
                    onClick={handlesubmit}
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="py-16" style={{ background: 'var(--surface)' }}>
              <div className="container mx-auto px-6">
                <h3 className="text-center text-3xl font-bold mb-12" style={{ color: 'var(--text-primary)' }}>
                  Get in Touch
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="card p-8 text-center flex flex-col items-center">
                    <h4 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Support Email
                    </h4>
                    <p className="text-blue-500 font-medium mb-4">support@civiceye.com</p>
                    <a href="mailto:support@civiceye.com" className="btn btn-outline btn-sm">
                      Send an Email
                    </a>
                  </div>
                  <div className="card p-8 text-center flex flex-col items-center">
                    <h4 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Support Helpline
                    </h4>
                    <p className="text-blue-500 font-medium mb-4">+123 456 7890</p>
                    <a href="tel:+1234567890" className="btn btn-outline btn-sm">
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }} className="pt-12 pb-6">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="mb-8">
                    <img src={logo} alt="CivicEye Logo" className="h-8 mb-4" />
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Empowering citizens to report issues and improve their communities through technology.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Contact Info
                    </h5>
                    <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <p>Phone: (123) 456-7890</p>
                      <p>Email: support@civiceye.com</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Quick Links
                    </h5>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link to="/userhome" className="hover:text-blue-500 transition-colors">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link to="/complaintlist" className="hover:text-blue-500 transition-colors">
                          Complaints
                        </Link>
                      </li>
                      <li>
                        <Link to="/signup" className="hover:text-blue-500 transition-colors">
                          Register
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      CivicEye Platform
                    </h5>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Transparent, fast, and community-driven incident management.
                    </p>
                  </div>
                </div>
                <div className="border-t mt-10 pt-6 text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <p>© CivicEye 2025 | Empowering Citizens, Improving Communities</p>
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
