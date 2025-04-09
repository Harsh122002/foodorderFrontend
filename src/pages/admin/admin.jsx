import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userDetail } = useContext(UserContext);

  const navigate = useNavigate();
   useEffect(() => {
        if (userDetail?.status === "online" && userDetail.role ==="admin") {
          navigate("/adminDashBoard");
        }
      }, [userDetail, navigate]);
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
        window.location.href = "/adminDashBoard";
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
    <div className="min-h-screen flex items-center justify-center bg-[#F6F4F0] font-mono text-[#2E5077]">
      <div className="bg-[#79D7BE] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
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
            className="bg-blue-500 border-2 w-full border-blue-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-white hover:text-blue-500 duration-500 ease-in-out"
          >
            Login
          </button>
          <div className="flex justify-between mt-4">
            <a
              href="/lbResetpassword"
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
