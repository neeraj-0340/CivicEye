import api from './api/config';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle';

export const CivicEyeLoginPage = () => {

  const navigate = useNavigate();
  const [logindata, setLogindata] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const change = (event) => {
    const { name, value } = event.target;
    setLogindata({ ...logindata, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!logindata.email?.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(logindata.email)) e.email = 'Enter a valid email address.';
    if (!logindata.password?.trim()) e.password = 'Password is required.';
    return e;
  };

  const submit = async (event) => {
    event.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    try {
      const response = await api.post('/user/login', logindata);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("name", response.data.name);
      
      toast.success(response.data.message || 'Login successful!');
      setTimeout(() => {
        if (response.data.role === "admin") {
          navigate('/overview');
        } else {
          navigate('/userhome');
        }
      }, 600);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative" style={{ background: 'var(--background)', color: 'var(--text-primary)' }}>
      <Toaster position="top-right" />
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="shadow-md rounded-lg flex w-3/4 max-w-4xl overflow-hidden border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {/* Left Section */}
        <div className="p-8 flex flex-col justify-center items-center border-r" style={{ borderColor: 'var(--border)' }}>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Civic<span className="text-blue-500">EYE</span>
          </h1>
          <p className="mt-4 text-center" style={{ color: 'var(--text-secondary)' }}>Welcome to CivicEye!</p>
          <p className="text-center mt-2" style={{ color: 'var(--text-muted)' }}>
            Your platform to report, track, and resolve public issues with ease.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>
            SIGN <span className="text-blue-500">IN</span>
          </h2>
          <form className="mt-6" onSubmit={submit} noValidate>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="email"
                id="email"
                name="email"
                onChange={change}
                value={logindata.email}
                placeholder="Email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                disabled={submitting}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <input
                type="password"
                id="password"
                name="password"
                onChange={change}
                value={logindata.password}
                placeholder="Password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                disabled={submitting}
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            <div className="text-right mt-2">
              <a href="#" className="text-blue-500 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-block mt-4"
            >
              {submitting && <span className="spinner" style={{ borderTopColor: 'white' }} />}
              {submitting ? 'Signing In…' : 'SIGN IN'}
            </button>
          </form>
          <p className="text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
            Do not Have an Account?{' '}
            <Link to="/signup" className="text-blue-500 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
