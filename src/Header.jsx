import React, { useState, useEffect, useContext } from "react";
import { FaHome } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "./pages/CartContext";
import { checkSessionExpiration } from "./utils/session";
import { UserContext } from "./pages/UserContext";

export default function HeaderFunction() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartLength, setCartLength] = useState(0);
  const navigate = useNavigate();
  const { cart, removeFromCart1 } = useContext(CartContext);
  const { userDetail, isLoggedIn, logout } = useContext(UserContext);

  useEffect(() => {
    const sessionValid = checkSessionExpiration(navigate);
    setIsDropdownOpen(sessionValid);
  }, [navigate]);

  useEffect(() => {
    setCartLength(cart.length);
  }, [cart]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    removeFromCart1();
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <div
      className="fixed container max-w-full px-4 sm:px-8 md:px-16 h-28 flex flex-wrap items-center justify-between rounded-bl-full "
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
        <Link
          to="/dashboard"
          className="hidden lg:block text-lg text-white hover:text-blue-500"
        >
          Home
        </Link>
        {isLoggedIn && (
          <Link
            to="/orderStatus"
            className="hidden lg:block text-lg text-white hover:text-blue-500"
          >
            Order Status
          </Link>
        )}
        <Link
          to="/about"
          className="hidden lg:block text-lg text-white hover:text-blue-500"
        >
          About
        </Link>
        {isLoggedIn && (
          <Link
            to="/profile"
            className="hidden lg:block text-lg text-white hover:text-blue-500"
          >
            Profile
          </Link>
        )}
      </nav>

      <div className="flex items-center space-x-4 relative">
        {isLoggedIn && (
          <div className="relative">
            <img
              src="/cart.png"
              alt="Shopping Cart"
              className="w-6 h-6 sm:w-8 sm:h-8 rounded cursor-pointer"
              onClick={handleCartClick}
            />
            {cartLength > 0 && (
              <sup className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs absolute -top-1 -right-1">
                {cartLength}
              </sup>
            )}
          </div>
        )}

        <button
          onClick={toggleDropdown}
          className="block lg:hidden text-white text-2xl bg-black"
        >
          <FaHome />
        </button>
        {isLoggedIn && <p style={{ color: "white" }}>{userDetail.name}</p>}
        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>

      {isDropdownOpen && (
        <div className="absolute top-16 right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-10 lg:hidden">
          <Link
            to="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
          {isLoggedIn && (
            <Link
              to="/orderStatus"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Order Status
            </Link>
          )}
          <Link
            to="/about"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            About
          </Link>
          {isLoggedIn && (
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
