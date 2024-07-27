import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
export default function ProductManagementPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/all-pending-orders"
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log(`Updating order ${orderId} to status ${newStatus}`);
      const response = await axios.post(
        "http://localhost:5000/api/auth/update-order-status",
        { orderId, status: newStatus }
      );
      console.log("Response from server:", response.data);

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
      window.location.reload();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-10 mt-5 text-emerald-500 text-center">
        Orders Management
      </div>
      <Link to="/adminDashBoard" className="mb-3 hover:text-xl">
        Back
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between"
          >
            <div className="text-sm sm:text-base font-semibold mb-2">
              <span>Order ID: {order.orderId}</span> |<span>Status: </span>
              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(order.orderId, e.target.value)
                }
                className="border rounded px-2 py-1"
              >
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="complete">Complete</option>
                <option value="declined">Declined</option>
              </select>
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
                    {product.name} - Quantity: {product.quantity} - Price: Rs
                    {product.price.toFixed(2)} - Total Price: Rs
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
    </div>
  );
}
