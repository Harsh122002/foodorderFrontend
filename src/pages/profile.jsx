import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { checkSessionExpiration } from "../utils/session";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { userDetail, setUserDetail } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...userDetail });
  const navigate = useNavigate();

  useEffect(() => {
    const isSessionValid = checkSessionExpiration(navigate);
    if (!isSessionValid) {
      // Redirect to login if the session has expired
      window.location.reload("/login");
    }
  }, [navigate]);
  if (!userDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({ ...userDetail });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/auth/updateUserDetail",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDetail(response.data);
      setEditMode(false);
    } catch (error) {
      console.error(
        "Error updating user details:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center mt-32">Profile</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-1">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-1">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-1">
                Phone:
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-1">
                Address:
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-2">
              <strong className="text-gray-700">Name:</strong> {userDetail.name}
            </div>
            <div className="mb-2">
              <strong className="text-gray-700">Email:</strong>{" "}
              {userDetail.email}
            </div>
            <div className="mb-2">
              <strong className="text-gray-700">Phone:</strong>{" "}
              {userDetail.mobile}
            </div>
            <div className="mb-2">
              <strong className="text-gray-700">Address:</strong>{" "}
              {userDetail.address}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
