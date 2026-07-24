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
      <section className="bg-blue-100 py-12">
        <div className="container mx-auto">
          <h3 className="text-center text-2xl font-semibold mb-8">
            What we do
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <p>You Register the Complaint</p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <p>
                Our Team Verifies the Complaint and Forwards it to the
                authorities
              </p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <p>The Responsible authorities review the complaint</p>
            </div>
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <p>Your Issue is resolved and the complaint is processed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto py-12">
        <h3 className="text-center text-2xl font-semibold mb-8">
          What our users have to say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg p-6 rounded-lg text-center">
            <p>
              "This is an awesome website. Simplifies the complaint registration
              process. "
            </p>
            <p className="mt-2 font-semibold">- Jason</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg text-center">
            <p>
              "This is an awesome website. Simplifies the complaint registration
              process."
            </p>
            <p className="mt-2 font-semibold">- Jason</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg text-center">
            <input
              type="text"
              placeholder="Write your feedback"
              className="w-full border rounded-lg p-2"
            />
            <button className="bg-blue-500 text-white mt-2 px-6 py-2 rounded-lg hover:bg-blue-600">
              Submit
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg p-6 rounded-lg text-center">
            <h4 className="text-xl font-semibold mb-4">Support Mail</h4>
            <p>
              For any assistance or inquiries about reporting issues using Civic
              Eye, find us at:
            </p>
            <p className="mt-2 font-semibold text-blue-500">
              support@civiceye.com
            </p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg text-center">
            <h4 className="text-xl font-semibold mb-4">Make A Call</h4>
            <p>
              Need immediate assistance or want to report an urgent issue? Give
              us a call:
            </p>
            <p className="mt-2 font-semibold text-blue-500">+123 456 7890</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">
              Phone Numbers
            </h5>
            <p>(123) 456-7890</p>
            <p>(987) 654-3210</p>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">
              Contact Info
            </h5>
            <p>Email: support@civiceye.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h5>
            <p>Home</p>
            <p>Complaints</p>
            <p>Register</p>
            <p>Login</p>
          </div>
        </div>
        <div className="text-center mt-6 text-sm">
          © CivicEye 2025 | Empowering Citizens, Improving Communities
        </div>
      </footer>
    </div>
  );
};
