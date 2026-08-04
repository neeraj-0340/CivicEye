import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/celogofull.png";
import api from "./api/config";
import toast, { Toaster } from "react-hot-toast";
import ThemeToggle from "./components/ThemeToggle";

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
    <div className="flex items-center justify-center min-h-screen relative p-4" style={{ background: 'var(--background)', color: 'var(--text-primary)' }}>
      <Toaster position="top-right" />
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="shadow-md rounded-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--border)' }}>
          <img src={logo} alt="CivicEye Logo" className="h-9 max-w-full" />
          <p className="mt-4 text-center" style={{ color: 'var(--text-secondary)' }}>Welcome to CivicEye!</p>
          <p className="text-center mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Your platform to report, track, and resolve public issues with ease.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>
            SIGN <span className="text-blue-500">UP</span>
          </h2>
          <form className="mt-6" onSubmit={handlesubmit} noValidate>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                onChange={handlechange}
                placeholder="Full Name"
                className={`form-input ${errors.name ? 'error' : ''}`}
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
                className={`form-input ${errors.mobile ? 'error' : ''}`}
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
                className={`form-input ${errors.age ? 'error' : ''}`}
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
                className={`form-input ${errors.email ? 'error' : ''}`}
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
                className={`form-input ${errors.password ? 'error' : ''}`}
                disabled={submitting}
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-block mt-4"
            >
              {submitting && <span className="spinner" style={{ borderTopColor: 'white' }} />}
              {submitting ? 'Creating Account…' : 'SIGN UP'}
            </button>
          </form>
          <p className="text-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
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
