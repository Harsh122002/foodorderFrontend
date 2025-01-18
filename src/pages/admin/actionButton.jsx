import React from "react";

export default function ActionButton({ onClick, label}) {
  return (
    <button
      className={` w-full sm:w-48 h-16 flex gap-2 text-white px-4 py-2`}
      onClick={onClick}
    >
       
      <span>{label}</span> {/* Button label */}
    </button>
  );
}
