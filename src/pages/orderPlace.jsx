import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TotalAmountContext } from "./TotalAmountContext";
import { CartContext } from "./CartContext";
import { useOrder } from "./OrderContext";

const OrderPlace = () => {
  const totalAmount = useContext(TotalAmountContext);
  const { cart, removeFromCart1 } = useContext(CartContext);
  const { setOrderId } = useOrder();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobileNumber: "",
    paymentMethod: "cash",
  });
  const [isLoading, setIsLoading] = useState(false); // Loader state

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
        setOrderId(orderId);
        removeFromCart1();

        if (formData.paymentMethod === "cash") {
          navigate("/success");
        } else if (formData.paymentMethod === "online") {
          initiateRazorpayPayment(orderId);
        }
      } else {
        console.error("Order placement failed", response);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const initiateRazorpayPayment = async (orderId) => {
    setIsLoading(true); // Show loader

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/payment",
        { totalAmount: totalAmount, currency: "INR" }
      );

      const { data } = response;

      const options = {
        key: "rzp_test_PmPFQvT5b2a9Qp", // Replace with your actual Razorpay key
        amount: data.amount,
        currency: data.currency,
        name: "Food Order",
        description: "Payment for Order",
        image: "/logo.png", // Replace with your company logo
        order_id: data.orderId,
        handler: function (response) {
          setIsLoading(false); // Hide loader
          navigate("/success");

          // After successful payment, verify payment on backend
          verifyPayment(
            data.orderId,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
        },
        prefill: {
          name: formData.name,
          contact: formData.mobileNumber,
        },
        notes: {
          address: formData.address,
        },
        theme: {
          color: "#F37254",
        },
      };

      // Check if Razorpay object exists in window
      if (typeof window.Razorpay === "function") {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        console.error("Razorpay script not loaded.");
        // Retry loading Razorpay script after a short delay
        setTimeout(() => {
          if (typeof window.Razorpay === "function") {
            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();
          } else {
            console.error("Razorpay script not loaded after retry.");
          }
          setIsLoading(false); // Hide loader after retry
        }, 1000); // Retry after 1 second
      }
    } catch (error) {
      setIsLoading(false); // Hide loader
      console.error("Error initiating Razorpay payment:", error);
    }
  };

  const verifyPayment = async (orderId, paymentId, signature) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify",
        { orderId, paymentId, signature }
      );

      const { status } = response.data;

      if (status === "success") {
        navigate("/success");
      } else {
        console.error("Payment verification failed");
        // Handle payment failure scenario
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      // Handle error scenario
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
        {isLoading && <div className="loader">Loading...</div>} {/* Loader */}
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md"
          disabled={cart.length === 0} // Disable button if cart is empty
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default OrderPlace;
