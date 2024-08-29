import React from "react";

export default function ActionButton({ onClick, color, hoverColor, label }) {
  return (
    <button
      className={`${color} w-full sm:w-48 h-16 text-white px-4 py-2 rounded-2xl hover:${hoverColor} focus:outline-none focus:ring-2 focus:ring-opacity-50 shadow-2xl`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
