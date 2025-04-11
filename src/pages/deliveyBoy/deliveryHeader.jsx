import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { IoMenu } from 'react-icons/io5';

export default function DeliveryHeader() {
  const { isLoggedIn, logout, userDetail } = useContext(UserContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/deliveryBoyLogin");
  };

  const handleLogout = () => {
    logout();
    navigate("/deliveryBoyLogin");
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Top Header */}
      <div className="flex fixed w-full flex-row items-center justify-between bg-[#343a40] py-5 px-6 text-white z-20">
        <IoMenu className="text-4xl cursor-pointer" onClick={toggleDrawer} />
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

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-[#c4b4a5] text-white shadow-lg transform ${isDrawerOpen ? "translate-x-0" : "-translate-x-64"
          } transition-transform duration-300 ease-in-out z-40`}
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
          <Link to="/" onClick={closeDrawer} className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/boyProfile" onClick={closeDrawer} className="hover:text-gray-300">
            Profile
          </Link>
          <Link to="/AllCompletedOrders" onClick={closeDrawer} className="hover:text-gray-300">
            All-Completed-orders
          </Link>
          <button onClick={handleLogout} className="text-left hover:text-gray-300">
            Logout
          </button>
        </nav>
      </div>

      {/* Overlay to close drawer when clicking outside */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30"
          onClick={closeDrawer}
        ></div>
      )}
    </>
  );
}
