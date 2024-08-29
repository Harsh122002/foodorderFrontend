import React from "react";
import ActionButton from "./actionButton"; // Reusable button component

export default function Sidebar({
  handleGroupAdd,
  handleProductAdd,
  handleProductManage,
  handleLogout,
}) {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col items-center space-y-4 pt-10">
      <h2 className="text-3xl font-bold mb-8">Admin Menu</h2>
      <ActionButton
        onClick={handleGroupAdd}
        color="bg-blue-500"
        hoverColor="bg-blue-600"
        label="Add Food Group"
        customClasses="w-full text-left px-4"
      />
      <ActionButton
        onClick={handleProductAdd}
        color="bg-green-500"
        hoverColor="bg-green-600"
        label="Add Product"
        customClasses="w-full text-left px-4"
      />
      <ActionButton
        onClick={handleProductManage}
        color="bg-red-500"
        hoverColor="bg-red-600"
        label="Manage Orders"
        customClasses="w-full text-left px-4"
      />
      <ActionButton
        onClick={handleLogout}
        color="bg-gray-500"
        hoverColor="bg-gray-600"
        label="Logout"
        customClasses="w-full text-left px-4"
      />
    </div>
  );
}
