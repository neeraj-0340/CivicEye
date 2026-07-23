import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/celogofull.png";
import api from "./api/config";
import toast, { Toaster } from "react-hot-toast";

export const CivicEyeSignUp = () => {
  const navigate = useNavigate();
  const [signupdata, setsignupdata] = useState({});

  const handlechange = (event) => {
    setsignupdata({ ...signupdata, [event.target.name]: event.target.value });
  };

  const handlesubmit = async (event) => {
    event.preventDefault();
    try {
      console.table(signupdata);
      let response = await api.post(
        "/user/register",
        signupdata
      );
      console.log(response.data);
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <div className="bg-white shadow-md rounded-lg flex   overflow-hidden">
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
          <form className="mt-6" onSubmit={handlesubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                onChange={handlechange}
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="mobile"
                onChange={handlechange}
                placeholder="Mobile Number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                name="age"
                onChange={handlechange}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) =>
                  e.target.value === "" ? (e.target.type = "text") : null
                }
                placeholder="Date of Birth"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                onChange={handlechange}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                onChange={handlechange}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600">
              SIGN UP
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
