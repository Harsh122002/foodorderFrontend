import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import DeliveryHeader from "./deliveryHeader";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { getCoordinatesFromAddress } from "../../utils/session";
export default function BoyDashBoard() {
  const { userDetail } = useContext(UserContext);
  const [accessOrder, setAccessOrder] = useState([]);
  const navigate = useNavigate();
  const [customerCoords, setCustomerCoords] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  useEffect(() => {
    if (userDetail?.role === "admin") {
      navigate("/adminDashboard");
    } else if (userDetail?.role === "user") {
      navigate("/");
    }
  }, [userDetail, navigate]);

  // initial fetch

  //   intervalId = setInterval(() => {
  //     fetchAccessOrder();
  //   }, 30000); // fetch every 30 seconds
  // }

  // return () => {
  //   if (intervalId) clearInterval(intervalId); 

  useEffect(() => {
    if (userDetail?.name) {
      setUserCoords({
        lat: userDetail.location.latitude,
        lng: userDetail.location.longitude,
      });

      fetchAccessOrder();
    }
  }, [userDetail?.name]);




  const fetchAccessOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/fetchOrderByBoyName`,
        { boyName: userDetail?.name }
      );
      setAccessOrder(response.data);
    } catch (error) {
      console.error("Error fetching access order:", error);
    }
  };


  const ChangeStatus = async (orderId, status, userName) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/update-order-status`,
        {
          orderId,
          status,
          boyName: userName,
        }
      );
      console.log("Response from server:", response.data);
      setAccessOrder((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      )

      alert("Order status updated");
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleComplete = async (orderId, paymentMethod, userName) => {
    if (paymentMethod === "cash") {
      const isConfirmed = window.confirm("Have you received the cash?");
      if (isConfirmed) {
        await ChangeStatus(orderId, "completed", userName);
        fetchAccessOrder();

      }
    } else if (paymentMethod === "online") {
      await ChangeStatus(orderId, "completed", userName);
      fetchAccessOrder();

    }
  };

  const handleDecline = (orderId, userName) => {
    console.log("Order declined:", orderId);
    ChangeStatus(orderId, "declined", userName);
  };

  const handleViewMap = async (address) => {
    try {
      const result = await getCoordinatesFromAddress(address);
      console.log("Coordinates from API:", result);

      // Validate coordinates
      if (!result || !result.latitude || !result.longitude) {
        console.log("Invalid coordinates from API:", result);
        alert("Could not fetch valid coordinates for the address.");
        return;
      }

      // Set customer coordinates
      const coords = { latitude: result.latitude, longitude: result.longitude };
      setCustomerCoords(coords);

      // Ensure both user and customer coordinates are available
      if (userCoords && coords) {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${coords.latitude},${coords.longitude}&travelmode=driving`;
        window.open(url, "_blank");
      } else {
        alert("Coordinates not available yet!");
      }

    } catch (error) {
      console.error("Error getting coordinates:", error);
      alert("Something went wrong while fetching location.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f0eb]">
      <DeliveryHeader />

      <main className="max-w-5xl mx-auto pt-24">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          All Running Orders
        </h1>

        {accessOrder.length > 0 && userDetail.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 m-auto justify-center items-center md:items-start w-[95%]">
            {accessOrder.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-md rounded-xl p-6 transition hover:shadow-lg w-[99%]"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Order ID: <span className="text-indigo-600">{order.id}</span>
                  </h2>
                  <div className="flex  items-center gap-2">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${order.status === "running"
                        ? "bg-yellow-200 text-yellow-800"
                        : order.status === "completed"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {order.status}
                    </span>
                    {order.status === "completed" && <FaCheckCircle size={20} color="green" />}
                    {order.status === "declined" && <FaTimesCircle size={20} color="red" />}

                  </div>
                </div>

                <p className="text-gray-600"><strong>Customer:</strong> {order.user?.name || "N/A"}</p>
                <p className="text-gray-600"><strong>Email:</strong> {order.user?.email || "N/A"}</p>
                <p className="text-gray-600"><strong>Phone:</strong> {order.user?.phone || "N/A"}</p>
                <p className="text-gray-600"><strong>Address:</strong> {order.address}</p>
                <p className="text-gray-600"><strong>Payment:</strong> {order.paymentMethod}</p>
                <p className="text-gray-600"><strong>Total Amount:</strong> ₹{order.totalAmount}</p>

                <div className="mt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Products:</h3>
                  <ul className="space-y-2">
                    {order.products.map((product, index) => (
                      <li
                        key={index}
                        className="border p-3 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="text-gray-800 font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {product.quantity} | Price: ₹{product.price}
                          </p>
                        </div>
                        {product.filePath && (
                          <img
                            src={`http://localhost:5000/${product.filePath}`}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buttons for Completed and Declined */}
                <div className="flex gap-4 mt-6 justify-end">
                  <button
                    onClick={() => handleDecline(order.id, order.userDetail?.name)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleComplete(order.id, order.paymentMethod, userDetail?.name)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => { handleViewMap(order.address) }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    View on Map
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg mt-10">
            No orders found.
          </div>
        )}
      </main>
    </div>
  );
}
