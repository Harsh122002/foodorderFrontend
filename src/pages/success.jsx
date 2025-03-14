import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "./context/OrderContext"; // Import useOrder hook from your context file
import axios from "axios";

export default function Success() {
  const { orderId } = useOrder(); // Access orderId from OrderContext
  const [loading, setLoading] = useState(false); // State to manage loading state

  async function handleGeneratePdf(orderId) {
    setLoading(true); // Set loading state to true

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/generatePdf`,
        { orderId },
        { responseType: "blob" } // Ensure response type is blob to handle binary data
      );

      console.log("PDF generated successfully:", response);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a new anchor element
      const a = document.createElement("a");
      a.href = url;
      a.download = `order_${orderId}.pdf`; // Set the file name
      document.body.appendChild(a); // Append the anchor to the body
      a.click(); // Programmatically click the anchor to trigger the download
      document.body.removeChild(a); // Remove the anchor from the document

      setLoading(false); // Set loading state to false after downloading
    } catch (error) {
      console.error("Error generating PDF:", error);
      setLoading(false); // Set loading state to false on error
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

      {/* Conditional rendering based on loading state */}
      {loading ? (
        <div className="loader">Loading...</div> // Replace with your loader/spinner component
      ) : (
        <button
          onClick={() => handleGeneratePdf(orderId)} // Pass a function reference here
          className="bg-blue-500 border-2  border-blue-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-white hover:text-blue-500 duration-500 ease-in-out"
          >
          Generate PDF
        </button>
      )}
    </div>
  );
}
