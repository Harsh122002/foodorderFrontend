import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/UserContext";
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
        `${process.env.REACT_APP_API_BASE_URL}/updateUserDetail`,
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
    <div className="container flex flex-col  items-center justify-center h-[100vh] bg-[#c4b4a5] mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-[#343a40] mt-10 ">Profile</h1>
      <div className=" shadow-lg w-[90%] lg:w-[60%] lg:my-5 rounded-lg p-6 text-white bg-[#a19182]">
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4  ">
            <div className="mb-2 ">
              <label className="block  font-semibold mb-1">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z\s]*$/.test(value)) {
                    handleChange(e);
                  }
                }}
                className="w-full bg-[#a19182] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#343a40]"
                required
              />
              {formData.name?.length === 0 && (
                <p className="text-red-500 text-sm mt-1">
                  Name is required and must contain only letters.
                </p>
              )}
            </div>

            <div className="mb-2">
              <label className="block  font-semibold mb-1">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full p-2 border bg-[#a19182] rounded focus:outline-none focus:ring-2 focus:ring-[#343a40]"
                required
                readOnly
              />
              {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || "") && (
                <p className="text-red-500 text-sm mt-1">
                  Please provide a valid email address.
                </p>
              )}
            </div>

            <div className="mb-2">
              <label className="block  font-semibold mb-1">
                Phone:
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleChange(e);
                  }
                }}
                maxLength={10}
                className="w-full p-2 bg-[#a19182] border rounded focus:outline-none focus:ring-2 focus:ring-[#343a40]"
                required
              />
              {formData.mobile?.length > 0 && formData.mobile.length !== 10 && (
                <p className="text-red-500 text-sm mt-1">
                  Mobile number must be exactly 10 digits.
                </p>
              )}
            </div>

            <div className="mb-2">
              <label className="block  font-semibold mb-1">
                Address:
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full p-2 border bg-[#a19182] rounded focus:outline-none focus:ring-2 focus:ring-[#343a40]"
                required
              />
              {formData.address?.length === 0 && (
                <p className="text-red-500 text-sm mt-1">Address is required.</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 border-2 w-21 border-gray-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-white hover:text-gray-500 duration-500 ease-in-out"
                >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 border-2 w-21 border-blue-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-white hover:text-blue-500 duration-500 ease-in-out"
                >
                Update
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-2">
              <strong className="text-gray-700">Name:</strong>{" "}
              {userDetail?.name || "Please Enter Name"}
            </div>
            <div className="mb-2">
              <strong className="text-gray-700">Email:</strong>{" "}
              {userDetail?.email || "Please Enter Email"}
            </div>
            <div className="mb-2">
              <strong className="text-gray-700">Phone:</strong>{" "}
              {userDetail?.mobile || "Please Enter Mobile Number"}
            </div>
            <div className="mb-2">
              <strong className="text-gray-700">Address:</strong>{" "}
              {userDetail?.address || "Please Enter Address"}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleEdit}
                className="bg-blue-500 border-2 w-20 border-blue-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-white hover:text-blue-500 duration-500 ease-in-out"
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
