import api from './api/config';
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export const CivicEyeLoginPage = () => {

  const navigate =useNavigate();

    const [logindata,setLogindata]=useState('');

    const change =(event) =>{
      setLogindata({...logindata,[event.target.name]:event.target.value})
    }

    const submit = async (event) =>{
      event.preventDefault()
      try {
        console.table(logindata)
        const response = await api.post('/user/login',logindata);

        console.log(response);

        localStorage.setItem("token",response.data.token);
        localStorage.setItem("id",response.data.id);
        localStorage.setItem("name",response.data.name);
        console.log(response.data);
        
        
        setTimeout(() => {
          if (response.data.role == "admin") {
            navigate('/overview');
          }else{
            navigate('/userhome');
          } 
          toast.success(response.data.message)
        }, );
        
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
      }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster/>
      <div className="bg-white shadow-md rounded-lg flex w-3/4 max-w-4xl overflow-hidden">
        {/* Left Section */}
        <div className=" p-8 flex flex-col justify-center items-center border-r">
          <h1 className="text-3xl font-bold text-gray-700">
            Civic<span className="text-blue-500">EYE</span>
          </h1>
          <p className="mt-4 text-gray-600 text-center">Welcome to CivicEye!</p>
          <p className="text-gray-500 text-center mt-2">
            Your platform to report, track, and resolve public issues with ease.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-700 text-center">
            SIGN <span className="text-blue-500">IN</span>
          </h2>
          <form className="mt-6" onSubmit={submit}>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                onChange={change}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mt-4">
              <input
                type="password"
                id="password"
                name="password"
                onChange={change}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="text-right mt-2">
              <a href="#" className="text-blue-500 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600">
              SIGN IN
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Do not Have an Account?{' '}
            <Link to="/signup">
            <a href="#" className="text-blue-500 font-semibold hover:underline">
              Sign up
            </a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
