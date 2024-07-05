import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orderStatuses, setOrderStatuses] = useState({
    pending: 0,
    running: 0,
    complete: 0,
    declined: 0,
  });
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Fetch order statuses from the API
    axios
      .get("http://localhost:5000/api/auth/order-statuses")
      .then((response) => {
        setOrderStatuses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order statuses:", error);
      });

    // Fetch user count from the API
    axios
      .get("http://localhost:5000/api/auth/user-count")
      .then((response) => {
        setUserCount(response.data.userCount);
      })
      .catch((error) => {
        console.error("Error fetching user count:", error);
      });
  }, []);

  const handleGroupAdd = () => {
    navigate("/addGroup");
  };

  const handleProductAdd = () => {
    navigate("/addProduct");
  };

  const handleProductManage = () => {
    navigate("/productManage");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-10 mt-5 text-emerald-500 text-center">
        Admin Dashboard
      </div>

      {/* Order Status Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
        {Object.entries(orderStatuses).map(([status, count]) => (
          <div
            key={status}
            className={`bg-white shadow-lg rounded-lg p-6 w-full sm:w-64 h-32 flex flex-col items-center justify-center ${
              status === "pending"
                ? "text-yellow-500"
                : status === "running"
                ? "text-blue-500"
                : status === "complete"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            <div className="text-2xl font-semibold">{count}</div>
            <div className="capitalize">{status}</div>
          </div>
        ))}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-64 h-32 flex flex-col items-center justify-center text-purple-500">
          <div className="text-2xl font-semibold">{userCount}</div>
          <div>Registered Users</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-nowrap">
          <button
            className="bg-blue-500 w-full sm:w-48 h-16 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-2xl"
            onClick={handleGroupAdd}
          >
            Add Food Group
          </button>
        </div>
        <div className="flex flex-nowrap">
          <button
            className="bg-green-500 w-full sm:w-48 h-16 text-white px-4 py-2 rounded-2xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-2xl"
            onClick={handleProductAdd}
          >
            Add Product
          </button>
        </div>
        <div className="flex flex-nowrap">
          <button
            className="bg-red-500 w-full sm:w-48 h-16 text-white px-4 py-2 rounded-2xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-2xl"
            onClick={handleProductManage}
          >
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
}
