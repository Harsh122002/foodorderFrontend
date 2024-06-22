import React from "react";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-6xl font-serif font-bold mb-5 text-emerald-500">
        Admin
      </div>
      <div className="space-y-4">
        <div className="flex flex-nowrap">
          <button className="bg-blue-500 w-48 h-16 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-2xl">
            Button 1
          </button>
        </div>
        <div className="flex flex-nowrap">
          <button className="bg-blue-500 w-48 h-16 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-2xl">
            Button 2
          </button>
        </div>
        <div className="flex flex-nowrap">
          <button className="bg-blue-500 w-48 h-16 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-2xl">
            Button 3
          </button>
        </div>
      </div>
    </div>
  );
}
