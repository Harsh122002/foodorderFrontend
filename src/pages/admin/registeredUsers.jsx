import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function RegisteredUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      <div className="w-64  fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
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
                  className="bg-[#79D7BE] rounded-lg overflow-hidden shadow-lg p-6"
                >
                  <h2 className="text-xl font-semibold mb-2 ">{user.name}</h2>
                  <div className=" mb-1">Email: {user.email}</div>
                  <div className=" mb-1">Address: {user.address}</div>
                  <div className=" mb-1">Mobile: {user.mobile}</div>
                  <div className=" mb-1">Role: {user.role}</div>
                  <div className=" mb-1">
                    Registered Date: {new Date(user.added).toLocaleDateString()}
                  </div>
                  {user.update === null ? null : (
                    <div className="text-gray-600">
                      Profile Update Date: 0
                      {new Date(user.update).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
