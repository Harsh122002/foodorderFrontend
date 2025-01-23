import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { CiEdit } from "react-icons/ci";

export default function RegisteredUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [update, setUpdate] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // To store the selected user's data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    mobile: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/all-users`
      );
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      setError("Error fetching users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user, userId) => {
    setUpdate(true);
    setCurrentUser(userId);
    console.log(currentUser);

    setFormData({
      name: user.name,
      email: user.email,
      address: user.address,
      mobile: user.mobile,
      role: user.role,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/update-user/${currentUser}`,
        formData
      );
      if (response.status === 200) {
        alert("User updated successfully!");
        fetchUsers(); // Refresh the user list
        setUpdate(false); // Close the modal
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };
  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/delete-user/${userId}`,
        
      );
      if (response.status === 200) {
        alert("User Deleted successfully!");
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 overflow-y-auto">
      <div className="min-h-screen bg-[#F6F4F0] font-mono text-[#2E5077] flex flex-col items-center pt-14">
      <h1 className="text-4xl font-bold mb-8 text-center">
            Registered Users
          </h1>
          <Link
            to="/adminDashBoard"
            className="flex justify-center mb-3 text-center hover:text-xl"
          >
            Back
          </Link>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500">
              No registered users found.
            </p>
          ) : (
            <div className="pl-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-[#2E5077]">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-[#79D7BE] rounded-lg overflow-hidden shadow-lg p-6 flex flex-col justify-between relative"
                >
                  <button className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center focus:outline-none active:scale-90"
                    onClick={() => { handleDelete(user._id) }}>
                    X
                  </button>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 ">{user.name}</h2>
                    <div className="mb-1">Email: {user.email}</div>
                    {user.address ? (
                      <div className="mb-1">Address: {user.address}</div>
                    ) : (
                      <div className="mb-1">Address: N/A</div>
                    )}

                    <div className="mb-1">Mobile: {user.mobile}</div>
                    <div className="mb-1">Role: {user.role}</div>
                    <div className="mb-1">
                      Registered Date:{" "}
                      {new Date(user.added).toLocaleDateString()}
                    </div>
                    {user.update && !isNaN(new Date(user.update).getTime()) ? (
                      <div className="">
                        Profile Update Date:{" "}
                        {new Date(user.update).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="">Profile Update Date: N/A</div>
                    )}
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      className="border-[#2E5077] flex gap-2 px-1 py-1 rounded-md bg-transparent hover:scale-105 active:scale-90"
                      onClick={() => handleEditClick(user, user._id)}
                    >
                      <CiEdit className="text-[#2E5077] text-xl" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {update && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#f6f4f0] p-8 rounded-lg w-96">
              <h2 className="text-2xl font-bold mb-4">Update User</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Mobile
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="deliver">Deliver</option>
                  </select>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setUpdate(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
