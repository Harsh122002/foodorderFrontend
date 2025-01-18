import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function ProductManage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/all-pending-orders`
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
        `${process.env.REACT_APP_API_BASE_URL}/update-order-status`,
        { orderId, status: newStatus }
      );
      console.log("Response from server:", response.data);

      if (response.status === 200) {
        // Remove the order if its status is "completed" or "declined"
        if (
          newStatus === "complete" ||
          newStatus === "declined" ||
          newStatus === "running"
        ) {
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.orderId !== orderId)
          );
        } else {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.orderId === orderId
                ? { ...order, status: newStatus }
                : order
            )
          );
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      <div className="w-64 bg-gray-800 text-white fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 overflow-y-auto"></div>
      <div className="min-h-screen bg-[#F6F4F0] font-mono text-[#2E5077] flex flex-col items-center justify-center">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-serif font-bold mb-10 mt-5  text-center">
          Orders Management
        </div>
        <Link
          to="/adminDashBoard"
          className="mb-3 hover:text-xl transform transition-transform duration-300"
        >
          Back
        </Link>
        <div className="pl-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-[#79D7BE] shadow-lg rounded-lg p-6 flex flex-col justify-between"
              >
                <div className="text-sm sm:text-base font-semibold mb-2">
                  <span>Order ID: {order.orderId}</span>{" "}
                  <div>
                    Status:
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.orderId, e.target.value)
                      }
                      className="border bg-transparent rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="running">Running</option>
                      <option value="complete">Complete</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
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
                        {product.name} <div> Quantity: {product.quantity}</div>{" "}
                        <div>
                          Price: Rs
                          {product.price.toFixed(2)}{" "}
                        </div>
                        <div>
                          Total Price: Rs
                          {product.totalPrice.toFixed(2)}
                        </div>
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
            ))
          ) : (
            <div className="text-lg font-semibold text-gray-500">
              No orders to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
