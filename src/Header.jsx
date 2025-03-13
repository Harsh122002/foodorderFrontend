import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const currentPath = location.pathname;
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
        className="fixed container max-w-full px-4 sm:px-8 md:px-12 h-28 bg-[#343a40] flex items-center justify-between rounded-bl-full z-30"
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
            className="hidden relative group lg:block text-lg text-white"
          >
            Home
            <span
              className={`absolute left-0 bottom-0 h-1 rounded-md bg-[#affc41] transition-all duration-300 ${currentPath === '/dashboard' ? 'w-12' : 'w-0'
                } group-hover:w-12 group-focus:w-12`}
            ></span>
          </Link>
          {isLoggedIn && (
            <Link
              to="/orderStatus"
              className="hidden relative group lg:block text-lg text-white "
            >
              Status
              <span
              className={`absolute left-0 bottom-0 h-1 rounded-md bg-[#affc41] transition-all duration-300 ${currentPath === '/orderStatus' ? 'w-[51px]' : 'w-0'
                } group-hover:w-[51px] group-focus:w-[51px]
              
                `}
            ></span>
            </Link>
          )}
          <Link
            to="/about"
            className="hidden relative group lg:block text-lg text-white "
          >
            About
            <span
              className={`absolute left-0 bottom-0 h-1 rounded-md bg-[#affc41] transition-all duration-300 ${currentPath === '/about' ? 'w-12' : 'w-0'
                } group-hover:w-12 group-focus:w-12`}
            ></span>
          </Link>
          {isLoggedIn && (
            <Link
              to="/profile"
              className="hidden relative group lg:block text-lg text-white "
            >
              Profile
              <span
              className={`absolute left-0 bottom-0 h-1 rounded-md bg-[#affc41] transition-all duration-300 ${currentPath === '/profile' ? 'w-[51px]' : 'w-0'
                } group-hover:w-[51px] group-focus:w-[51px]`}
            ></span>
            </Link>
          )}
        </nav>

        <div className="flex items-center lg:space-x-4 space-x-2 relative">
          {isLoggedIn && (
            <div className="relative">
              <img
                src="/cart.png"
                alt="Shopping Cart"
                className="lg:w-9 lg:h-9 w-5 h-5 rounded cursor-pointer"
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
          <button
            onClick={(e) => toggleDropdown(e)}
            className="block lg:hidden text-white text-2xl"
          >
            <IoMenu className="lg:text-4xl" />
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
