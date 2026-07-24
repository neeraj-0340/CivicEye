import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/celogofull.png";
import api from "./api/config";
import toast, { Toaster } from "react-hot-toast";

export const CivicEyeSignUp = () => {
  const navigate = useNavigate();
  const [signupdata, setsignupdata] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handlechange = (event) => {
    const { name, value } = event.target;
    setsignupdata({ ...signupdata, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!signupdata.name?.trim()) e.name = 'Full name is required.';
    if (!signupdata.mobile?.trim()) e.mobile = 'Mobile number is required.';
    else if (!/^\d{10}$/.test(signupdata.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number.';
    if (!signupdata.age) e.age = 'Date of birth is required.';
    if (!signupdata.email?.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(signupdata.email)) e.email = 'Enter a valid email address.';
    if (!signupdata.password?.trim()) e.password = 'Password is required.';
    else if (signupdata.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handlesubmit = async (event) => {
    event.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    try {
      let response = await api.post("/user/register", signupdata);
      toast.success(response.data.message || 'Registration successful!');
      setTimeout(() => { navigate("/login"); }, 1000);
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="bg-white shadow-md rounded-lg flex overflow-hidden">
        {/* Left Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center items-center border-r">
          <img src={logo} alt="CivicEye Logo" className="h-9" />
          <p className="mt-4 text-gray-600 text-center">Welcome to CivicEye!</p>
          <p className="text-gray-500 text-center mt-2">
            Your platform to report, track, and resolve public issues with ease.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-700 text-center">
            SIGN <span className="text-blue-500">UP</span>
          </h2>
          <form className="mt-6" onSubmit={handlesubmit} noValidate>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                onChange={handlechange}
                placeholder="Full Name"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.name ? 'border-red-400' : ''}`}
                disabled={submitting}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="mobile"
                onChange={handlechange}
                placeholder="Mobile Number"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.mobile ? 'border-red-400' : ''}`}
                disabled={submitting}
              />
              {errors.mobile && <p className="form-error">{errors.mobile}</p>}
            </div>
            <div className="mb-3">
              <input
                type="date"
                name="age"
                onChange={handlechange}
                placeholder="Date of Birth"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.age ? 'border-red-400' : ''}`}
                disabled={submitting}
              />
              {errors.age && <p className="form-error">{errors.age}</p>}
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                onChange={handlechange}
                placeholder="Email"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? 'border-red-400' : ''}`}
                disabled={submitting}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                onChange={handlechange}
                placeholder="Password (min 6 characters)"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? 'border-red-400' : ''}`}
                disabled={submitting}
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <span className="spinner" style={{ borderTopColor: 'white' }} />}
              {submitting ? 'Creating Account…' : 'SIGN UP'}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
