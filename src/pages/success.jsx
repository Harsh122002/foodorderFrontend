import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "./context/OrderContext";
import axios from "axios";

export default function Success() {
  const { orderId } = useOrder();
  const [loading, setLoading] = useState(false);

  async function handleGeneratePdf(orderId) {
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/generatePdf`,
        { orderId },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `order_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setLoading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#c4b4a5]">
      <img src="/isuccess.png" alt="Success" className="max-w-full mb-4" />
      <p className="text-xl mb-4 text-white">You have placed your order successfully!</p>

      {orderId && (
        <div className="mb-2">
          <p>Your Order ID: {orderId}</p>
        </div>
      )}

      <Link to="/" className="text-blue-900 mb-2 hover:underline duration-300 ease-in-out">
        Home
      </Link>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <button
          onClick={() => handleGeneratePdf(orderId)}
          className="bg-blue-500 border-2  border-blue-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-white hover:text-blue-500 duration-500 ease-in-out"
        >
          Generate PDF
        </button>
      )}
    </div>
  );
}
