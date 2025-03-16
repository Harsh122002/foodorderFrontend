import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Declined() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/all-declined-orders`
      ); // Assuming the endpoint to fetch running orders
      setOrders(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
           <div className="w-64  fixed h-full z-10">
             <Sidebar />
           </div>
           <div className="flex-1 ml-64 overflow-y-auto">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-serif font-bold mb-10 mt-5  text-center">
          Decliened Orders Management
        </div>
        <Link to="/adminDashBoard" className="mb-3 hover:text-xl">
          Back
          </Link>
          {orders.length === 0 && (
            <div>No declined orders found.</div>
          )  
          }
        <div className="pl-1 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-[#79D7BE] shadow-lg rounded-lg p-6 flex flex-col justify-between"
            >
              <div className="text-sm sm:text-base font-semibold mb-2">
                <span>Order ID: {order.orderId}</span>
                <div>Status: {order.status}</div>
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
    </div></div>
  );
}
