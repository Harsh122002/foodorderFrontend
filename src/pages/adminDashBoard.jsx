import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { checkSessionExpiration } from "../utils/session";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orderStatuses, setOrderStatuses] = useState({
    pending: 0,
    running: 0,
    complete: 0,
    declined: 0,
  });
  const [userCount, setUserCount] = useState(0);
  const [groups, setGroups] = useState([]);
  const [products, setProducts] = useState([]);
  const [allAmount, setAllAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const isSessionValid = checkSessionExpiration(navigate);
      if (!isSessionValid) {
        alert("Session Expired");
        navigate("/admin");
        return;
      }

      try {
        // Fetch order statuses from the API
        const orderStatusesResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/order-statuses`
        );
        setOrderStatuses(orderStatusesResponse.data);

        // Fetch user count from the API
        const userCountResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user-count`
        );
        setUserCount(userCountResponse.data.userCount);

        // Fetch all groups from the API
        const groupsResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/getAllGroup`
        );
        setGroups(groupsResponse.data);

        const productsResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/getAllProduct`
        );
        setProducts(productsResponse.data);

        const AllAmountResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/getTotalAmount`
        );
        setAllAmount(AllAmountResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleGroupAdd = () => {
    navigate("/addGroup");
  };

  const handleProductAdd = () => {
    navigate("/addProduct");
  };

  const handleProductManage = () => {
    navigate("/productManage");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-10 mt-5 text-emerald-500 text-center">
        Admin Dashboard
      </div>

      {/* Order Status Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
        {Object.entries(orderStatuses).map(([status, count]) => (
          <Link to={`/${status}`} key={status} className="w-full sm:w-64">
            <div
              className={`bg-white shadow-lg rounded-lg p-6 h-32 flex flex-col items-center justify-center ${
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
          </Link>
        ))}
        <Link to="/allGroups" className="w-full sm:w-64">
          <div className="bg-white shadow-lg rounded-lg p-6 h-32 flex flex-col items-center justify-center text-purple-500">
            <div className="text-2xl font-semibold">{groups.length}</div>
            <div>Groups</div>
          </div>
        </Link>
        <Link to="/allProducts" className="w-full sm:w-64">
          <div className="bg-white shadow-lg rounded-lg p-6 h-32 flex flex-col items-center justify-center text-purple-500">
            <div className="text-2xl font-semibold">{products.length}</div>
            <div>Products</div>
          </div>
        </Link>
        <Link to="/registeredUsers" className="w-full sm:w-64">
          <div className="bg-white shadow-lg rounded-lg p-6 h-32 flex flex-col items-center justify-center text-purple-500">
            <div className="text-2xl font-semibold">{userCount}</div>
            <div>Registered Users</div>
          </div>
        </Link>
        <Link to="/allAmount" className="w-full sm:w-64">
          <div className="bg-white shadow-lg rounded-lg p-6 h-32 flex flex-col items-center justify-center text-purple-500">
            <div className="text-2xl font-semibold">{allAmount}</div>
            <div>Groups</div>
          </div>
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center space-x-4 mb-10">
        <button
          className="bg-blue-500 w-full sm:w-48 h-16 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-2xl"
          onClick={handleGroupAdd}
        >
          Add Food Group
        </button>
        <button
          className="bg-green-500 w-full sm:w-48 h-16 text-white px-4 py-2 rounded-2xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-2xl"
          onClick={handleProductAdd}
        >
          Add Product
        </button>
        <button
          className="bg-red-500 w-full sm:w-48 h-16 text-white px-4 py-2 rounded-2xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-2xl"
          onClick={handleProductManage}
        >
          Manage Orders
        </button>
      </div>

      <button
        className="bg-gray-500 w-full sm:w-48 h-16 text-white px-4 py-2 rounded-2xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-2xl"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
