import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/adminLogin`,
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

        // Redirect to the dashboard page
        navigate("/adminDashBoard");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
          <div className="mb-4">
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
          <div className="flex justify-between mt-4">
            <a
              href="/resetpassword"
              className="underline hover:text-indigo-500"
            >
              Resend Password
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
