import React from "react";
import { Link } from "react-router-dom";

export default function DashboardCard({ count, title, color, link }) {
  return (
    <Link to={link} className="w-full sm:w-64">
      <div
        className={`bg-[#79D7BE] shadow-lg rounded-lg p-6 h-32 flex flex-col items-center justify-center font-sans  text-[#2E5077] hover:scale-110 active:scale-70 transform transition-transform duration-300`}
      >
        <div className="text-3xl font-semibold ">{count}</div>
        <div className="text-lg">{title}</div>
      </div>
    </Link>
  );
}
