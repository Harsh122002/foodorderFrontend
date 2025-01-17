import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { checkSessionExpiration } from "../utils/session";
import DashboardCard from "./dashboardCard";
import Loader from "./loader";
import Sidebar from "./Sidebar"; // Sidebar component

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderStatuses, setOrderStatuses] = useState({
    pending: 0,
    running: 0,
    completed: 0,
    declined: 0,
  });
  const [userCount, setUserCount] = useState(0);
  const [groups, setGroups] = useState([]);
  const [products, setProducts] = useState([]);
  const [allAmount, setAllAmount] = useState(0);

  useEffect(() => {
    const isSessionValid = checkSessionExpiration(navigate);
    if (!isSessionValid) {
      navigate("/admin");
      return;
    }
    // Call the fetchData function when component loads
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const isSessionValid = checkSessionExpiration(navigate);
    if (!isSessionValid) {
      // alert("Session Expired");
      navigate("/admin");
      return;
    }

    try {
      const [
        orderStatusesResponse,
        userCountResponse,
        groupsResponse,
        productsResponse,
        allAmountResponse,
      ] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/order-statuses`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/user-count`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/getAllGroup`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/getAllProduct`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/getTotalAmount`),
      ]);

      setOrderStatuses(orderStatusesResponse.data);
      setUserCount(userCountResponse.data.userCount);
      setGroups(groupsResponse.data);
      setProducts(productsResponse.data);
      setAllAmount(allAmountResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // // Navigation Handlers
  // const handleGroupAdd = () => navigate("/addGroup");
  // const handleProductAdd = () => navigate("/addProduct");
  // const handleProductManage = () => navigate("/productManage");
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   sessionStorage.removeItem("token");
  //   navigate("/login");
  // };

  // Show loader while fetching data
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Component */}
      <Sidebar className="fixed"/>

      {/* Main Dashboard Content */}
      <div className="flex-1 bg-gray-100 p-8">
        <div className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-10 mt-5 text-emerald-500 text-center">
          Admin Dashboard
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          <DashboardCard
            count={orderStatuses.pending}
            title="Pending"
            color="text-yellow-500"
            link="/pending"
          />
          <DashboardCard
            count={orderStatuses.running}
            title="Running"
            color="text-blue-500"
            link="/running"
          />
          <DashboardCard
            count={orderStatuses.completed}
            title="Complete"
            color="text-green-500"
            link="/complete"
          />
          <DashboardCard
            count={orderStatuses.declined}
            title="Declined"
            color="text-red-500"
            link="/declined"
          />
          <DashboardCard
            count={groups.length}
            title="Groups"
            color="text-purple-500"
            link="/allGroups"
          />
          <DashboardCard
            count={products.length}
            title="Products"
            color="text-purple-500"
            link="/allProducts"
          />
          <DashboardCard
            count={userCount}
            title="Registered Users"
            color="text-purple-500"
            link="/registeredUsers"
          />
          <DashboardCard
            count={
              typeof allAmount === "object" ? "No Earn" : `Rs. ${allAmount}`
            }
            title="Total Earn"
            color="text-purple-500"
            link="#"
          />
        </div>
      </div>
    </div>
  );
}
