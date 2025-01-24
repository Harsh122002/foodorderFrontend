import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MdHome,
  MdOutlineDeleteOutline,
  MdOutlineIncompleteCircle,
} from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaList, FaUser, FaRunning } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdOutlinePending } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { AiOutlineProduct } from "react-icons/ai";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleGroupAdd = () => navigate("/addGroup");
  const handleGroup = () => navigate("/allGroups");
  const handleProduct = () => navigate("/allProducts");

  const handleGoHome = () => navigate("/adminDashBoard");
  const handleProductAdd = () => navigate("/addProduct");

  const handleRegisterManage = () => navigate("/registeredUsers");
  const handleDeliveryBoys = () => navigate("/deliveryBoy");
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/admin");
  };

  const handleNavigate = (status) => {
    navigate(`/${status}`); // Adjust your routes accordingly
  };

  const buttons = [
    {
      label: "Home",
      icon: <MdHome className="text-2xl" />,
      onClick: handleGoHome,
    },
    {
      label: "Add Category",
      icon: <IoMdAdd className="text-2xl" />,
      onClick: handleGroupAdd,
    },
    {
      label: "Add Product",
      icon: <IoMdAdd className="text-2xl" />,
      onClick: handleProductAdd,
    },
    {
      label: "Category",
      icon: <BiCategory />,
      onClick: handleGroup,
    },
    {
      label: "Products",
      icon: <AiOutlineProduct />,
      onClick: handleProduct,
    },
    {
      label: "Manage Orders",
      icon: <FaList />,
      isDropdown: true,
    },
    {
      label: "Reg-DeliveryBoy",
      icon: <FaUser />,
      onClick: handleDeliveryBoys,
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
    { label: "Pending", status: "pending", icon: <MdOutlinePending /> },
    { label: "Running", status: "running", icon: <FaRunning /> },
    {
      label: "Completed",
      status: "complete",
      icon: <MdOutlineIncompleteCircle />,
    },
    { label: "Declined", status: "declined", icon: <MdOutlineDeleteOutline /> },
  ];

  return (
    <div className="min-w-64 h-screen bg-[#2c527c] text-[#F6F4F0] flex flex-col items-center  space-y-1 pt-10">
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
            className="w-full sm:w-48 h-12 flex gap-2 items-center justify-start hover:scale-105 active:scale-90 transition-all px-4"
            onClick={button.onClick}
          >
            {button.icon && <span className="text-xl">{button.icon}</span>}
            <span>{button.label}</span>
          </button>
          {/* Dropdown for Manage Orders */}
          {button.isDropdown && (
            <div className="absolute ml-44 z-10 mt-0 hidden group-hover:block w-full sm:w-48 bg-[#3b6b93]   rounded-md shadow-lg">
              {orderStatuses.map((order, idx) => (
                <button
                  key={idx}
                  className="w-full sm:w-44 h-12 flex gap-2 items-center justify-start hover:scale-105 active:scale-90 transition-all px-4"
                  onClick={() => handleNavigate(order.status)}
                >
                  {button.icon && (
                    <span className="text-xl ">{order.icon}</span>
                  )}

                  <span>{order.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
