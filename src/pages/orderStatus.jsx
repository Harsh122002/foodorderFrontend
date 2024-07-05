import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function OrderStatus() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userDetail } = useContext(UserContext);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = userDetail?._id || localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/getAllOrder",
          { userId }
        );
        setOrders(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userDetail]);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/orderDelete`,
        { orderId }
      );
      // Assuming you want to refresh the orders after cancellation
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      setError(error.response ? error.response.data.message : "Server error");
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto">
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order._id}
            className="my-4 p-4 bg-white shadow-md rounded-lg"
          >
            <h2 className="text-xl font-bold">Order ID: {order._id}</h2>
            <p>Status: {order.status}</p>
            <p>Total: Rs {order.totalAmount}</p>
            <h3 className="mt-2">Products:</h3>
            <ul>
              {order.products.map((productItem) => (
                <li
                  key={productItem._id}
                  className="flex items-center justify-between border-b py-2"
                >
                  <div>
                    <p className="font-medium">
                      Product Name: {productItem.name}
                    </p>
                    <p>Quantity: {productItem.quantity}</p>
                    <p>Price: Rs {productItem.price}</p>
                    <p>Amount: Rs {productItem.quantity * productItem.price}</p>
                  </div>
                </li>
              ))}
              <br />
              <li>
                {order.status.toLowerCase() === "pending" && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Cancel Order
                  </button>
                )}
                {order.status.toLowerCase() === "running" && (
                  <p className="text-green-600">
                    You are delivering successfully!
                  </p>
                )}
                {order.status.toLowerCase() === "complete" && (
                  <p className="text-blue-600">Order completed successfully!</p>
                )}
                {order.status.toLowerCase() === "declined" && (
                  <p className="text-red-600">Order declined.</p>
                )}
              </li>
            </ul>
          </div>
        ))
      ) : (
        <div className="text-center mt-4">No orders found.</div>
      )}
    </div>
  );
}
