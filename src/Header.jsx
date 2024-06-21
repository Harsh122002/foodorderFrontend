import React from "react";

export default function HeaderFunction() {
  return (
    <div
      className="container max-w-full px-16 h-28 flex items-center justify-between rounded-bl-full "
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
          className="h-12 w-12 rounded-2xl"
        />
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300  to-violet-500">
          Food Order
        </h2>
      </div>
      <nav className="flex space-x-8">
        <a href="#home" className="text-lg text-white hover:text-blue-500">
          Home
        </a>
        <a
          href="#order-status"
          className="text-lg text-white hover:text-blue-500"
        >
          Order Status
        </a>
        <a href="#about" className="text-lg text-white hover:text-blue-500">
          About
        </a>
      </nav>

      <div className="flex items-center space-x-4">
        <img src="/cart.png" alt="Shopping Cart" className="w-8 h-8 rounded" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </div>
    </div>
  );
}
