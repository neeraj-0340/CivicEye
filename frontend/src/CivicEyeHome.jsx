import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/celogofull.png";
import ThemeToggle from "./components/ThemeToggle";

export const CivicEyeHome = () => {
  const scrollToBottom = () => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header className="shadow-md sticky top-0 z-50" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between py-4 px-6 gap-x-10">
          <img src={logo} alt="CivicEye Logo" className="h-6" />
          <nav className="flex items-center gap-6" style={{ color: 'var(--text-secondary)' }}>
            <Link to="/complaintlist" className="hover:text-blue-500">
              My Complaints
            </Link>
            <button onClick={scrollToBottom} className="hover:text-blue-500">
              Contact
            </button>
            <ThemeToggle />
            <Link to="/login">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-semibold">
                Login
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: "url('/hero-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4"></h2>
            <p className="text-xl mb-6">
              Make Your Voice Heard! <br></br>Report Problems, Help Your City,
              and Earn Rewards!
            </p>
            <Link to="/signup">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto py-12">
        <h3 className="text-center text-2xl font-semibold mb-8">
          Complaint Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <p className="text-xl font-semibold">Complaints registered</p>
            <p className="text-3xl font-bold">1002</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <p className="text-xl font-semibold">Reports filed</p>
            <p className="text-3xl font-bold">992</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <p className="text-xl font-semibold">Rewards distributed</p>
            <p className="text-3xl font-bold">886</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <p className="text-xl font-semibold">Impact made</p>
            <p className="text-3xl font-bold">.......</p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-12" style={{ background: 'var(--surface)' }}>
        <div className="container mx-auto">
          <h3 className="text-center text-2xl font-semibold mb-8" style={{ color: 'var(--text-primary)' }}>
            What We Do
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="card p-6">
              <p style={{ color: 'var(--text-primary)' }}>1. Register the Complaint</p>
            </div>
            <div className="card p-6">
              <p style={{ color: 'var(--text-primary)' }}>
                2. Verification & Forwarding to Authorities
              </p>
            </div>
            <div className="card p-6">
              <p style={{ color: 'var(--text-primary)' }}>3. Authority Review</p>
            </div>
            <div className="card p-6">
              <p style={{ color: 'var(--text-primary)' }}>4. Resolution & Status Update</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto py-12">
        <h3 className="text-center text-2xl font-semibold mb-8" style={{ color: 'var(--text-primary)' }}>
          What Our Users Have to Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <p style={{ color: 'var(--text-secondary)' }}>
              "This platform makes reporting civic issues so fast and transparent."
            </p>
            <p className="mt-2 font-semibold" style={{ color: 'var(--text-primary)' }}>- Resident User</p>
          </div>
          <div className="card p-6 text-center">
            <p style={{ color: 'var(--text-secondary)' }}>
              "Real-time status updates helped track our community complaint to resolution."
            </p>
            <p className="mt-2 font-semibold" style={{ color: 'var(--text-primary)' }}>- Local Citizen</p>
          </div>
          <div className="card p-6 text-center">
            <input
              type="text"
              placeholder="Write your feedback"
              className="form-input mb-3"
            />
            <Link to="/login" className="btn btn-primary btn-block">
              Submit Feedback
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12" style={{ background: 'var(--surface)' }}>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          <div className="card p-6 text-center">
            <h4 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Support Email</h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              For assistance or inquiries about reporting issues using CivicEye:
            </p>
            <p className="mt-2 font-semibold text-blue-500">
              support@civiceye.com
            </p>
          </div>
          <div className="card p-6 text-center">
            <h4 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Make A Call</h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              Need immediate assistance or want to report an urgent issue? Give us a call:
            </p>
            <p className="mt-2 font-semibold text-blue-500">+123 456 7890</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }} className="py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-6">
          <div>
            <h5 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Support Line
            </h5>
            <p>(123) 456-7890</p>
            <p>(987) 654-3210</p>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Contact Info
            </h5>
            <p>Email: support@civiceye.com</p>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              CivicEye Platform
            </h5>
            <p>© CivicEye 2025 | Empowering Citizens</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
