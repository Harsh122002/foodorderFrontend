import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { MdOutlineCancel } from "react-icons/md";
export default function ProductManagementPage() {
  const [orders, setOrders] = useState([]);
  const [assign, setAssign] = useState(false);
  const [boys, setBoys] = useState([]);
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

  const fetchBoy = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/boy`);

      // Ensure response data exists
      if (!response.data || !Array.isArray(response.data.availableBoys)) {
        setBoys([]); // Set empty array if data is invalid
        return;
      }

      setBoys(response.data.availableBoys); // Set the valid array

    } catch (err) {
      console.error("Error fetching boys:", err);
      setBoys([]); // Set empty array in case of an error
    }
  };

  useEffect(() => {
    fetchBoy();
  }, [assign])

  const handleStatusChange = async (orderId, newStatus,boyId="null",boylatitude,boylongitude) => {
    try {
      console.log(`Updating order ${orderId} to status ${newStatus}`);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/update-order-status`,
        { orderId, status: newStatus,deliveryBoyName:boyId,boylatitude,boylongitude }
      );
      console.log("Response from server:", response.data);

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
        setAssign(false);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077] ">
      <div className="w-64  fixed h-full z-10">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 overflow-y-auto relative ">
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
          <div className="pl-1 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-[#79D7BE] shadow-lg rounded-lg p-2 flex flex-col justify-between "
              >
                <div className="flex flex-col gap-1">
                  {/* <div className="text-sm sm:text-base font-semibold mb-2">
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
                        <option value="completed">Complete</option>
                        <option value="declined">Declined</option>
                      </select>
                    </div>
                  </div> */}
                  <div className="text-sm sm:text-base mb-2">
                    Status: {order.status}
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
                          {product.name}{" "}
                          <div> Quantity: {product.quantity}</div>{" "}
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
                </div>
                <div className="text-sm sm:text-base">
                  <div className="font-semibold">User:</div>
                  <div>Username: {order.user.username}</div>
                  <div>Email: {order.user.email}</div>
                </div>
                <div className="flex flex-row gap-1 justify-between">
                  <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={() => setAssign(true)}
                  >
                    Assign Order
                  </button>
                  <button type="button" className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    onClick={() => { handleStatusChange(order.orderId, "declined") }}
                  >
                    Declined Order
                  </button>
                  {assign && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-[#79D7BE] p-5 rounded-lg shadow-lg w-80">
                        <button className="flex justify-start"
                          onClick={() => setAssign(false)}
                        >
                          <MdOutlineCancel className="w-5 h-5 text-red-600 rounded-md hover:scale-110"
                          />
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Select Delivery Boy</h2>
                        <ul className="space-y-2">
                          {boys?.map((boy) => (
                            <li
                              key={boy._id}
                              className="flex justify-between items-center border-b py-2"
                            >
                              <span>{boy.name}</span>
                              <button
                                onClick={() =>{ handleStatusChange(order.orderId, "running",boy.name,boy.location.latitude,boy.location.longitude) }}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"                              >
                                Assign
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
