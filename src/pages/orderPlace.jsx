import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TotalAmountContext } from "./TotalAmountContext";
import { CartContext } from "./CartContext";
import axios from "axios";
import { useOrder } from "./OrderContext";

export default function OrderPlace() {
  const totalAmount = useContext(TotalAmountContext);
  const { cart, removeFromCart1 } = useContext(CartContext);
  const { setOrderId } = useOrder(); // Destructure setOrderId from useOrder hook
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobileNumber: "",
    paymentMethod: "cash",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const response = await axios.post(
          "http://localhost:5000/api/auth/getUserDetail",
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { name, mobile } = response.data;
        setFormData((prevFormData) => ({
          ...prevFormData,
          name: name || "",
          mobileNumber: mobile || "",
        }));
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      userId: localStorage.getItem("userId"),
      name: formData.name,
      address: formData.address,
      mobileNumber: formData.mobileNumber,
      products: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.qty,
        price: item.price,
      })),
      totalAmount: totalAmount,
      paymentMethod: formData.paymentMethod,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/auth/orderDetail",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const { orderId } = response.data;
        setOrderId(orderId); // Set orderId using setOrderId from useOrder
        removeFromCart1();
        if (formData.paymentMethod === "cash") {
          navigate("/success");
        } else {
          navigate("/onlinePayment");
        }
      } else {
        console.error("Order placement failed", response);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Mobile Number</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Products</label>
          <ul className="border border-gray-300 rounded-md p-2">
            {cart.map((item) => (
              <li key={item.index} className="flex justify-between">
                <span>{item.name}</span>
                <span>Qty: {item.qty}</span>
                <span>Price: Rs. {item.price}</span>
                <span>Total: Rs. {item.price * item.qty}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="block text-sm font-medium">Total Amount</label>
          <p className="mt-1 p-2 border border-gray-300 rounded-md">
            Rs. {totalAmount.toFixed(2)}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium">Payment Method</label>
          <div className="mt-1">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === "cash"}
                onChange={handleChange}
                className="form-radio"
              />
              <span className="ml-2">Cash</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={formData.paymentMethod === "online"}
                onChange={handleChange}
                className="form-radio"
              />
              <span className="ml-2">Online</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
