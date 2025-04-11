import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import DeliveryHeader from './deliveryHeader';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function AllCompletedOrders() {
  const { userDetail } = useContext(UserContext);
  const [accessOrder, setAccessOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cash, setCash] = useState("");

  // Redirect based on user role
  useEffect(() => {
    if (userDetail?.role === 'admin') {
      navigate('/adminDashboard');
    } else if (userDetail?.role === 'user') {
      navigate('/');
    }
  }, [userDetail, navigate]);

  // Fetch completed orders
  useEffect(() => {
    if (userDetail?.name) {
      fetchData();
    }
  }, [userDetail?.name]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/AllCompletedOrderForUserId`,
        { deliveryBoyName: userDetail?.name }
      );
      console.log(response.data.orders);
      setCash(response.data.totalCashIncome || "0");
      
      setAccessOrder(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching completed orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f0eb]">
      <DeliveryHeader />

      <main className="max-w-5xl mx-auto pt-24">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          All Completed Orders
        </h1>
        <h2 className='text-center'>TotalCash:Rs.{cash}</h2>

        {loading ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            Loading...
          </div>
        ) : accessOrder.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-[95%] m-auto">
            {accessOrder.map((order) => (
              <div
                key={order._id || order.id}
                className="bg-white shadow-md rounded-xl p-6 transition hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">
                    Order ID: <span className="text-indigo-600">{order._id}</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        order.status === 'running'
                          ? 'bg-yellow-200 text-yellow-800'
                          : order.status === 'completed'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {order.status}
                    </span>
                    {order.status === 'completed' && <FaCheckCircle size={20} color="green" />}
                    {order.status === 'declined' && <FaTimesCircle size={20} color="red" />}
                  </div>
                </div>

                <div className="space-y-1 text-gray-600">
                  <p><strong>Customer:</strong> {order.name || 'N/A'}</p>
                  <p><strong>Phone:</strong> {order.mobileNumber || 'N/A'}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Payment:</strong> {order.paymentMethod}</p>
                  <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                </div>

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
                        {product.filePath ? (
                          <img
                            src={`http://localhost:5000/${product.filePath}`}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded-md">
                            N/A
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg mt-10">
            No completed orders found.
          </div>
        )}
      </main>
    </div>
  );
}
