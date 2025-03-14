import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TotalAmountContext } from "./context/TotalAmountContext";
import { CartContext } from "./context/CartContext"; // Add this line
import { useOrder } from "./context/OrderContext"; // Add this line

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
          `${process.env.REACT_APP_API_BASE_URL}/getUserDetail`,
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

  const placeOrder = async (orderData, token) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/orderDetail`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      removeFromCart1(); // Clear the cart after placing the order
      navigate("/success"); // Redirect to success page
      return response; // Return the response for further processing
    } catch (error) {
      console.error("Error placing order:", error);
      throw error; // Propagate the error to the caller
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.address) {
      alert("Please fill in the address.");
      return; // Stops the function execution if the address is empty
    }

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

      // Handle cash payments directly
      if (formData.paymentMethod === "cash") {
        const response = await placeOrder(orderData, token);

        if (response.status === 201) {
          const { orderId } = response.data;
          setOrderId(orderId);
         
        } else {
          console.error("Order placement failed", response);
        }
      } else if (formData.paymentMethod === "online") {
        setIsLoading(false);
        // For online payments, skip the API call and directly initiate Razorpay
        initiateRazorpayPayment(orderData, token);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const initiateRazorpayPayment = async (orderData, token) => {
    setIsLoading(true); // Show loader
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/payment`,
        { totalAmount: totalAmount, currency: "INR" }
      );

      const { data } = response;
      setIsLoading(false);

      const options = {
        key: "rzp_test_PmPFQvT5b2a9Qp", // Replace with your actual Razorpay key
        amount: data.amount,
        currency: data.currency,
        name: "Food Order",
        description: "Payment for Order",
        image: "/logo.png", // Replace with your company logo
        order_id: data.orderId,

        handler: async function (response) {
          // After successful payment, verify payment on backend
          verifyPayment(
            data.orderId,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
          const res = await placeOrder(orderData, token);
          if (response.status === 201) {
            const { orderId } = res.data;
            setOrderId(orderId);
            removeFromCart1();
            setIsLoading(false); // Clear the cart after placing the order
            navigate("/success"); // Redirect to success page
          } else {
            console.error("Order placement failed", response);
          }
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
        `${process.env.REACT_APP_API_BASE_URL}/verify`,
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
    <div className="container mx-auto p-4 lg:px-[15%] bg-[#c4b4a5] text-white ">
      <h2 className="text-3xl flex justify-center font-bold mb-4 mt-32 text-[#343a40]">Place Your Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full  p-2  bg-[#a19182] focus:ring-[#343a40] rounded-md"
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
            className="mt-1 block w-full p-2 bg-[#a19182] focus:ring-[#343a40] rounded-md"
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
            className="mt-1 block w-full p-2 bg-[#a19182] focus:ring-[#343a40] rounded-md"
            required
          />
        </div>
        <div className="overflow-x-auto">
          <label className="block text-sm font-medium mb-2">Products</label>
          <table className="min-w-full table-auto bg-[#a19182] focus:ring-[#343a40] rounded-md">
            <thead className="bg-[#a19182]">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium ">
                  Sr.No
                </th>

                <th className="px-4 py-2 text-left text-sm font-medium ">
                  Product
                </th>

                <th className="px-4 py-2 text-left text-sm font-medium ">
                  Qty
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium ">
                  Price (Rs.)
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium ">
                  Total (Rs.)
                </th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2 text-sm ">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm  flex flex-wrap gap-1 ">
                    <span>
                      <img
                          src={
                            item.image
                              ? `${process.env.REACT_APP_API_BASE_URL_IMAGE}/${item.image}`
                              : "/back.png"
                          }
                        alt="Item"
                        className="inline-block w-6 h-6 mr-1 rounded-full"
                      />
                    </span>{" "}
                    {item.name}
                  </td>
                  <td className="px-4 py-2 text-sm ">
                    {item.qty}
                  </td>
                  <td className="px-4 py-2 text-sm ">
                    {item.price}
                  </td>
                  <td className="px-4 py-2 text-sm ">
                    {item.price * item.qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <label className="block text-sm font-medium">Total Amount</label>
          <p className="mt-1 p-2 focus:ring-[#343a40] bg-[#a19182] rounded-md">
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
                className="form-radio "
              />
              <span className="ml-2">Online</span>
            </label>
          </div>
        </div>
        {isLoading && <div className="loader">Loading...</div>} {/* Loader */}
        <button
          type="submit"
          className="bg-green-500 border-2 border-green-500 mt-4 text-white text-[10px] lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded hover:text-green-500 hover:bg-white duration-500 ease-in-out"
          disabled={cart.length === 0}
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default OrderPlace;
