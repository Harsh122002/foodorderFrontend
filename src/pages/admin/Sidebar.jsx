import React from "react";
import { useNavigate } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaList, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleGroupAdd = () => navigate("/addGroup");
  const handleGoHome = () => navigate("/adminDashBoard");
  const handleProductAdd = () => navigate("/addProduct");
  const handleRegisterManage = () => navigate("/registeredUsers");
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/admin");
  };

  const handleNavigate = (status) => {
    navigate(`/orders/${status}`); // Adjust your routes accordingly
  };

  const buttons = [
    {
      label: "Home",
      icon: <MdHome />,
      onClick: handleGoHome,
    },
    {
      label: "Add Food Group",
      icon: <IoMdAdd />,
      onClick: handleGroupAdd,
    },
    {
      label: "Add Product",
      icon: <IoMdAdd />,
      onClick: handleProductAdd,
    },
    {
      label: "Manage Orders",
      icon: <FaList />,
      isDropdown: true,
    },
    {
      label: "Register Users",
      icon: <FaUser />,
      onClick: handleRegisterManage,
    },
    {
      label: "Logout",
      icon: <FiLogOut />,
      onClick: handleLogout,
    },
  ];

  const orderStatuses = [
    { label: "Pending", status: "pending" },
    { label: "Declined", status: "declined" },
    { label: "Running", status: "running" },
    { label: "Completed", status: "completed" },
  ];

  return (
    <div className="min-w-64 h-screen bg-[#2c527c] text-[#F6F4F0] flex flex-col items-center space-y-1 pt-10">
      <h2 className="text-3xl font-bold font-serif text-[#F6F4F0] mb-8">
        HR FOODS
      </h2>
      {buttons.map((button, index) => (
        <div
          key={index}
          className={`w-full ml-16 ${
            button.isDropdown ? "relative group" : ""
          }`}
        >
          <button
            className="w-full sm:w-48 h-16 flex gap-2 items-center justify-start hover:bg-[#3b6b93] active:scale-90 transition-all px-4"
            onClick={button.onClick}
          >
            {button.icon && <span className="text-xl">{button.icon}</span>}
            <span>{button.label}</span>
          </button>
          {/* Dropdown for Manage Orders */}
          {button.isDropdown && (
            <div className="absolute hidden group-hover:block w-full sm:w-48 bg-[#3b6b93] mt-1 rounded-md shadow-lg">
              {orderStatuses.map((order, idx) => (
                <button
                  key={idx}
                  className="w-full h-12 flex items-center justify-start px-4 hover:bg-[#4d7aab] transition-all"
                  onClick={() => handleNavigate(order.status)}
                >
                  {order.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
