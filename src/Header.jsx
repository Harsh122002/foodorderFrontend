import React, { useState, useEffect } from "react";
import { FaHome, FaListAlt, FaInfoCircle } from "react-icons/fa"; // Example icons from react-icons

export default function HeaderFunction() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    // Check local storage for token on component mount (similar to componentDidMount)
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogin = () => {
    // Simulate login logic and store token in local storage
    localStorage.setItem("token", "your_token_here");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Clear token from local storage on logout
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div
      className="container max-w-full px-4 sm:px-8 md:px-16 h-28 flex flex-wrap items-center justify-between rounded-bl-full"
      style={{
        backgroundImage: `url(/back.png)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center space-x-4">
        <img
          src="/logo.png"
          alt="Company Logo"
          className="h-12 w-12 rounded-2xl"
        />
        <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-violet-500">
          Food Order
        </h2>
      </div>
      <nav className="flex space-x-4 sm:space-x-6 md:space-x-8">
        <a
          href="#home"
          className="hidden lg:block text-lg text-white hover:text-blue-500"
        >
          Home
        </a>
        <a
          href="#order-status"
          className="hidden lg:block text-lg text-white hover:text-blue-500"
        >
          Order Status
        </a>
        <a
          href="#about"
          className="hidden lg:block text-lg text-white hover:text-blue-500"
        >
          About
        </a>
      </nav>
      <div className="flex items-center space-x-4">
        <img
          src="/cart.png"
          alt="Shopping Cart"
          className="w-6 h-6 sm:w-8 sm:h-8 rounded"
        />
        {/* Show only one icon on small and medium screens */}
        <button
          onClick={toggleDropdown}
          className="block lg:hidden text-white text-2xl"
        >
          <FaHome />
        </button>
        {isLoggedIn ? (
          // Show Logout button if logged in
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          // Show Login button if not logged in
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        )}
      </div>
      {isDropdownOpen && (
        <div className="absolute top-16 right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-10 lg:hidden">
          <a
            href="#home"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Home
          </a>
          <a
            href="#order-status"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Order Status
          </a>
          <a
            href="#about"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            About
          </a>
        </div>
      )}
    </div>
  );
}
