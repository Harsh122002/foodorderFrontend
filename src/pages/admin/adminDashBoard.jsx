import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { checkSessionExpiration } from "../../utils/session";
import DashboardCard from "./dashboardCard";
import Loader from "../loader";
import Sidebar from "./Sidebar"; // Sidebar component

import DynamicChart from "./orderchart";
import AmountChart from "./amountChart";
import { UserContext } from "../context/UserContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { userDetail } = useContext(UserContext);
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
    const handleNavigation = () => {
      if (userDetail?.role === "delivery") {
        navigate("/boyDashBoard");
      } else if (userDetail?.role === "user") {
        navigate("/");
      }
    };

    handleNavigation();
    fetchData();
  }, [userDetail, navigate]);
  

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
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/getAllProductForAdmin  `),
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


  // Show loader while fetching data
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      {/* Sidebar Component */}
      <div className="w-64 bg-gray-800 text-white fixed z-10 h-full">
        <Sidebar />
      </div>
      {/* Main Dashboard Content */}
      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="flex-1 bg-[#F6F4F0] p-8">
          <div className="text-4xl sm:text-5xl font-mono md:text-6xl w-full font-bold mb-10 mt-5 text-[#2E5077] text-center">
            Admin Dashboard
          </div>

          {/* Dashboard cards */}
          <div className="flex flex-row flex-wrap justify-center gap-8 mb-10">
            <DashboardCard
              count={orderStatuses.pending}
              title="Pending"
              link="/pending"
            />
            <DashboardCard
              count={orderStatuses.running}
              title="Running"
              link="/running"
            />
            <DashboardCard
              count={orderStatuses.completed}
              title="Completed"
              link="/complete"
            />
            <DashboardCard
              count={orderStatuses.declined}
              title="Declined"
              link="/declined"
            />
            <DashboardCard
              count={groups.length}
              title="Groups"
              link="/allGroups"
            />
            <DashboardCard
              count={products.length}
              title="Products"
              link="/allProducts"
            />
            <DashboardCard
              count={userCount}
              title="Registered Users"
              link="/registeredUsers"
            />
            <DashboardCard
              count={
                typeof allAmount === "object" ? "No Earn" : `Rs. ${allAmount}`
              }
              title="Total Earn"
              link="#"
            />
          </div>
          <div className="flex flex-col gap-10">
            <DynamicChart />
            <AmountChart />
          </div>
        </div>
      </div>
    </div>
  );
}
