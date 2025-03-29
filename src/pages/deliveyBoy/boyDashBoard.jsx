import React, { useContext, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function BoyDashBoard() {
  const { isLoggedIn, logout } = useContext(UserContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/deliveryBoyLogin")
  };
  const handleLogout = () => {
    logout();
    navigate("/deliveryBoyLogin")

  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <div className="w-full h-screen bg-[#c4b4a5]">
      <div className="flex flex-row items-center justify-between bg-[#343a40]  max-w-full  py-5 px-6 text-white ">
        <IoMenu className="text-4xl cursor-pointer   " onClick={toggleDrawer} />

        <h1 className="lg:text-4xl text-xl font-bold font-mono">Boy Dashboard</h1>
        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            className="bg-blue-500 border-2 border-blue-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-white hover:text-blue-500 duration-500 ease-in-out"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 border-2 border-red-500 text-white text-[10px] lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded hover:text-red-500 hover:bg-white duration-500 ease-in-out"
            >
            Logout
          </button>
        )}
      </div>
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-[#c4b4a5] text-white shadow-lg transform ${isDrawerOpen ? "translate-x-0" : "-translate-x-64"
          } transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 bg-[#343a40] text-white">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={toggleDrawer} className="text-2xl">
            ✖
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col p-4 space-y-4">
          <Link to="#" className="text-white hover:text-gray-300 cursor-pointer">
            Home
          </Link>
          <Link to="#" className="text-white hover:text-gray-300 cursor-pointer">
            Profile
          </Link>
          <Link to="#" className="text-white hover:text-gray-300 cursor-pointer">
            Settings
          </Link>
          <Link to="#" className="text-white hover:text-gray-300 cursor-pointer">
            Logout
          </Link>
        </nav>
      </div>

      {/* Overlay to close drawer when clicking outside */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 "
          onClick={toggleDrawer}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex items-center justify-center h-full">
        <p className="text-xl text-gray-700">Welcome to your dashboard!</p>
      </main>
    </div>
  );
}
