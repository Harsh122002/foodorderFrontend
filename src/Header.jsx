import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "./pages/context/CartContext";
import { checkSessionExpiration } from "./utils/session";
import { UserContext } from "./pages/context/UserContext";
import ScrollToTopButton from "./utils/scroll";
import { IoMenu } from "react-icons/io5";

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

  const toggleDropdown = (e) => {
    console.log(e.target);
    
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
    <>
      <div
        className="fixed container max-w-full px-4 sm:px-8 md:px-12 h-28  flex  items-center justify-between rounded-bl-full z-30 "
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
            className="lg:h-12 lg:w-12 lg:rounded-2xl rounded-md h-8 w-8"
          />
          <h2 className="text-lg w-36 lg:w-56 lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-violet-500">
            HR FOOD
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

        <div className="flex items-center lg:space-x-4 space-x-2 relative">
          {isLoggedIn && (
            <div className="relative">
              <img
                src="/cart.png"
                alt="Shopping Cart"
                className=" lg:w-9 lg:h-9 w-5 h-5 rounded cursor-pointer"
                onClick={handleCartClick}
              />
              {cartLength > 0 && (
                <sup className="bg-red-500 text-white rounded-full lg:w-5 lg:h-5 w-3 h-3 text-[10px] flex items-center justify-center lg:text-xs absolute -top-1 -right-1">
                  {cartLength}
                </sup>
              )}
            </div>
          )}

          {isLoggedIn && <p className="lg:text-xl text-[10px]" style={{ color: "white" }}>{userDetail.name}</p>}
          {!isLoggedIn ? (
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white text-[10px] lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          )}
        <button
          onClick={(e)=>toggleDropdown(e)}
          className="block lg:hidden text-white text-2xl "
        >
          <IoMenu  className="lg:text-4xl"/>
        </button>
        </div>

        {isDropdownOpen && (
          <div className="absolute top-16 right-4 mt-5 w-48 bg-white rounded-md shadow-lg z-10 lg:hidden">
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
      <ScrollToTopButton />
    </>
  );
}
