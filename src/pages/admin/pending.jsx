import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
export default function ProductManagementPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/all-pending-orders`
      );
      if (!response.data) {
        setOrders([]);
      }
      setOrders(response.data);
    } catch (error) {
      setOrders([]);
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
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077] ">
      <div className="w-64  fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="min-h-screen bg-[#F6F4F0] font-mono text-[#2E5077] flex flex-col items-center justify-center pt-5">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-serif font-bold mb-10   text-center">
            Pending Orders
          </div>
          <Link
            to="/adminDashBoard"
            className="mb-3 hover:text-xl transform transition-transform duration-300"
          >
            Back
          </Link>
          <div className="pl-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-[#79D7BE] shadow-lg rounded-lg p-2 flex flex-col justify-between"
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
                  Date: {new Date(order.added).toLocaleDateString()}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
