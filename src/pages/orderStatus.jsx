import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/UserContext";
import { Link } from "react-router-dom";

export default function OrderStatus() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userDetail } = useContext(UserContext);
  const [refresh, setRefresh] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

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
          `${process.env.REACT_APP_API_BASE_URL}/getAllOrder`,
          { userId, page: currentPage, limit: ordersPerPage }
        );
        const sortedOrders = sortOrdersByDate(response.data.orders);
        setOrders(sortedOrders);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setError(error.response ? error.response.data.message : "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userDetail, refresh, currentPage]);

  const sortOrdersByDate = (orders) => {
    return orders.slice().sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/orderDelete`,
        { orderId }
      );
      alert(response.data.message);
      const updatedOrders = orders.filter((order) => order._id !== orderId);
      setOrders(updatedOrders);
      setRefresh(!refresh);
    } catch (error) {
      setError(error.response ? error.response.data.message : "Server error");
    }
  };

  const formatDateToIndian = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto bg-[#c4b4a5]">
      <div className="p-4 rounded-lg">
        <div className="mt-32 flex flex-col justify-center">
          <h1 className="text-center font-bold text-4xl text-[#343a40]">
            Order Status
          </h1>
          {orders.length === 0 && (
            <div className="text-black mb-4">No orders found</div>
          )}
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id}>
                <div className="p-4 bg-[#a19182] text-white m-5 lg:m-8 shadow-md rounded-lg mt-2">
                  <h2 className="text-xl font-bold">Order ID: {order._id}</h2>
                  <p>Status: {order.status}</p>
                  <p>Total: Rs {order.totalAmount}</p>
                  <p>Order Date: {formatDateToIndian(order.createdAt)}</p>
                  <ul className="flex flex-row flex-wrap gap-x-4 gap-y-2">
                    {order.products.map((productItem) => (
                      <li
                        key={productItem._id}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="font-medium">
                            Product Name: {productItem.name}
                          </p>
                          <img
                            src={
                              productItem.image
                                ? `${process.env.REACT_APP_API_BASE_URL_IMAGE}/${productItem.image}`
                                : ""
                            }
                            alt={productItem.name}
                            className="w-64 h-48 object-cover mb-4 rounded-md mt-2"
                          />
                          <p>Quantity: {productItem.quantity}</p>
                          <p>Price: Rs {productItem.price}</p>
                          <p>
                            Amount: Rs{" "}
                            {productItem.quantity * productItem.price}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <br />
                  <ul>
                    <li>
                      {order.status.toLowerCase() === "pending" && (
                        <>
                          <p>
                            Please wait, your order will arrive in 30 minutes.
                          </p>
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="bg-red-500 border-2 border-red-500 text-white text-[10px] lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded hover:text-red-500 hover:bg-white duration-500 ease-in-out"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}
                      {order.status.toLowerCase() === "running" && (
                        <p className="text-green-900">
                          You are delivering successfully!
                        </p>
                      )}
                      {order.status.toLowerCase() === "completed" && (
                        <div className="flex justify-between items-center">
                          <p className="text-blue-900">
                            Order completed successfully!
                          </p>
                          {order.rating === null && (
                        <p>
                          Please rate this order{" "}
                          <Link
                            to={`/rating?orderId=${order._id}`}
                            className="text-blue-900 underline"
                          >
                            Rating
                          </Link>
                        </p>
                      )}
                    </div>
                      )}
                    {order.status.toLowerCase() === "declined" && (
                      <>
                        <p className="text-red-600">Order declined.</p>
                        <p className="text-blue-900 capitalize text-sm">
                          Any payment made will be refunded to your account
                          within 7 business days.
                        </p>
                      </>
                    )}
                  </li>
                </ul>
              </div>
              </div>
        ))
        ) : (
        <div className="text-center mt-4">No orders found.</div>
          )}
        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
    </div >
  );
}
