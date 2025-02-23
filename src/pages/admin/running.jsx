import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function RunningOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []); // Fetch orders only once when the component mounts

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/all-running-orders`
      );
      if (!response.data) {
        setOrders([]);
      }
      setOrders(response.data);
    } catch (error) {
      setOrders([]);
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again later.");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/update-order-status`,
        { orderId, status: newStatus }
      );
      console.log(response);

      if (response.status === 200) {
        fetchOrders();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      <div className="w-64  fixed h-full z-10">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="min-h-screen bg-[#F6F4F0] font-mono text-[#2E5077] flex flex-col items-center pt-14">
          <h1 className="text-3xl font-bold mb-8 text-[#2E5077]">
            Running Orders Management
          </h1>
          <Link
            to="/adminDashBoard"
            className="mb-4  hover:underline"
          >
            Back
          </Link>

          {orders.length === 0 && (
            <div className="text-black mb-4">No Order</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-[#79D7BE] shadow-lg rounded-lg p-6"
              >
                <div className="mb-4">
                  <div className="font-bold text-gray-700">
                    Order ID: {order.orderId}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status:
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.orderId, e.target.value)
                      }
                      className="mt-2 border bg-transparent rounded px-2 py-1"
                    >
                      {/* <option value="pending">Pending</option> */}
                      <option value="running">Running</option>
                      <option value="completed">Complete</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <strong>Total Amount:</strong> Rs{" "}
                  {order.totalAmount.toFixed(2)}
                </div>
                <div className="text-sm sm:text-base mb-2">
                  Date: {new Date(order.added).toLocaleDateString()}
                </div>
                <div className="mb-4">
                  <strong>Address:</strong> {order.address}
                </div>
                <div className="mb-4">
                  <strong>Products:</strong>
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
                <div>
                  <strong>User Info:</strong>
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
