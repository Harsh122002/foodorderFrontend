import React, { useState,useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";

export default function Delivery() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        `${
          process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"
        }/deliveryBoyRegister`,
        formData
      );

      // Set success message
      setMessage("Registration successful!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
      });
    } catch (error) {
      // Handle errors
      const errorMessage =
        error.response?.data?.message || "An error occurred!";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Clear message or error after a delay
useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white fixed h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 h-screen overflow-y-auto">
        <div className="bg-[#F6F4F0] p-8 w-full">
          {/* Success/Error Messages */}
          {error && (
            <p className="flex justify-center text-red-900 p-1">{error}</p>
          )}
          {message && (
            <p className="flex justify-center text-green-700 p-1">{message}</p>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold mb-10 mt-5 text-center">
            Delivery Boy Register
          </h1>

          {/* Form */}
          <div className="flex justify-center">
            <div className="bg-[#79d7be] w-[40%] p-4 rounded-md">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#2E5077]"
                    placeholder="Enter name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#2E5077]"
                    placeholder="Enter email"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone No
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#2E5077]"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#2E5077]"
                    placeholder="Enter address"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#2E5077]"
                    placeholder="Enter password"
                    required
                  />
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-[#2E5077] ${
                      loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1e4c82]"
                    }`}
                  >
                    {loading ? "Loading..." : "Register"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
