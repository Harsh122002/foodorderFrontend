import React, { useState, useEffect } from "react";
import axios from "axios";
import { checkSessionExpiration, startSession } from "../utils/session";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check for token expiration on component mount
    const isSessionValid = checkSessionExpiration();
    if (isSessionValid) {
      // Redirect to the dashboard page if session is valid
      window.location.href = "/dashboard";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        {
          email,
          password,
        }
      );

      alert(res.data.msg || "Login Successfully");

      const token = res.data.token;
      const userId = res.data.userId;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        // Set token expiration (e.g., 1 hour from now)
        const tokenExpiration = new Date();
        tokenExpiration.setHours(tokenExpiration.getHours() + 1); // 1 hour expiry
        localStorage.setItem("tokenExpiration", tokenExpiration);

        sessionStorage.setItem("token", token);
        startSession(token);

        // Redirect to the dashboard page
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        // Server responded with a status other than 200 range
        alert(`Error: ${error.response.data.msg || error.response.statusText}`);
      } else if (error.request) {
        // Request was made but no response was received
        alert("Error: No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg sm:w-full md:w-96 mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            Login
          </button>
          <div className=" sm:flex-auto lg:flex justify-between">
            <a
              href="/resetpassword"
              className="text-sm text-indigo-500 hover:underline block sm:inline-block mb-2 sm:mb-0"
            >
              Resend Password
            </a>
            <a
              href="/register"
              className="text-sm text-indigo-500 hover:underline block sm:inline-block mb-2 sm:mb-0"
            >
              Register
            </a>
            <a
              href="/admin"
              className="text-sm text-indigo-500 hover:underline block sm:inline-block mb-2 sm:mb-0"
            >
              Admin Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
