import React from "react";
import { Link } from "react-router-dom";

export default function DashboardCard({ count, title, color, link }) {
  return (
    <Link to={link} className="w-full sm:w-64">
      <div
        className={`bg-white shadow-lg rounded-lg p-6 h-32 flex flex-col items-center justify-center ${color}`}
      >
        <div className="text-2xl font-semibold">{count}</div>
        <div>{title}</div>
      </div>
    </Link>
  );
}
