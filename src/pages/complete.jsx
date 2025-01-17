import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Complete() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/all-completed-orders`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load completed orders. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
     <div className="flex">
          <Sidebar />
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-10 mt-5 text-emerald-500 text-center">
        Complete Orders Management
      </div>
      <Link to="/adminDashBoard" className="mb-3 text-blue-500 hover:underline">
        Back
      </Link>

      {loading ? (
        <div className="text-gray-500 text-xl">Loading orders...</div>
      ) : error ? (
        <div className="text-red-500 text-xl">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500 text-xl">No completed orders found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between"
            >
              <div className="text-sm sm:text-base font-semibold mb-2">
                <span>Order ID: {order.orderId}</span> |{" "}
                <span>Status: {order.status}</span>
              </div>
              <div className="text-sm sm:text-base mb-2">
                Total Amount: Rs {order.totalAmount.toFixed(2)}
              </div>
              <div className="text-sm sm:text-base mb-2">
                Address: {order.address}
              </div>
              <div className="text-sm sm:text-base mb-4">
                <div className="font-semibold">Products:</div>
                <ul className="list-disc list-inside">
                  {order.products.map((product, index) => (
                    <li key={index}>
                       <img
                        src={`http://localhost:5000/${product.filePath}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover inline-block mr-2"
                      />
                      {product.name} - Quantity: {product.quantity} - Price: Rs{" "}
                      {product.price.toFixed(2)} - Total Price: Rs{" "}
                      {product.totalPrice.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-sm sm:text-base">
                <div className="font-semibold">User:</div>
                <div>Username: {order.user.username}</div>
                <div>Email: {order.user.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
