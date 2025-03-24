import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TotalAmountContext } from "./context/TotalAmountContext";
import { CartContext } from "./context/CartContext";
import { useOrder } from "./context/OrderContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const OrderPlace = () => {
  const { totalAmount, setTotalAmount } = useContext(TotalAmountContext);
  const { cart, removeFromCart1 } = useContext(CartContext);
  const { setOrderId } = useOrder();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [discount, setDiscountData] = useState([]);
  const [showDiscount, setShowDiscount] = useState({});
  console.log("showDiscount", showDiscount);

  console.log(discount?.discountName);
  console.log(cart);

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
        fetchDiscount();
       
        const { name, mobile ,address} = response.data;
        formik.setValues((prevValues) => ({
          ...prevValues,
          name: name || "",
          address: address || "",
          mobileNumber: mobile || "",
        }));
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

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
      removeFromCart1();
      navigate("/success");
      return response;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    mobileNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    paymentMethod: Yup.string().required("Payment method is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      mobileNumber: "",
      coupcode: "",
      paymentMethod: "cash",
    },
    validationSchema,
    onSubmit: async (values) => {
      const orderData = {
        userId: localStorage.getItem("userId"),
        name: values?.name || '',
        address: values?.address || '',
        mobileNumber: values?.mobileNumber || '',
        products: cart?.map((item) => ({
          productId: item?.productId || '',
          name: item?.name || '',
          quantity: item?.qty || 0,
          price: item?.price || 0,
        })) || [],
        totalAmount: totalAmount || 0,
        paymentMethod: values?.paymentMethod || '',
        discountName: showDiscount?.discountName || '',
        discountPercentage: showDiscount?.discountPercentage || 0,
        couponCode: showDiscount?.couponCode || '',
      };
      
      try {
        const token = localStorage.getItem("token");

        if (values.paymentMethod === "cash") {
          const response = await placeOrder(orderData, token);

          if (response.status === 201) {
            const { orderId } = response.data;
            setOrderId(orderId);
          } else {
            console.error("Order placement failed", response);
          }
        } else if (values.paymentMethod === "online") {
          setIsLoading(false);
          initiateRazorpayPayment(orderData, token);
        }
      } catch (error) {
        console.error("Error placing order:", error);
      }
    },
  });

  const initiateRazorpayPayment = async (orderData, token) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/payment`,
        { totalAmount: totalAmount, currency: "INR" }
      );

      const { data } = response;
      setIsLoading(false);

      const options = {
        key: "rzp_test_PmPFQvT5b2a9Qp",
        amount: data.data.amount,
        currency: data.data.currency,
        name: "Food Order",
        description: "Payment for Order",
        image: "/logo.png",
        order_id: data.orderId,
        handler: async function (response) {
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
            setIsLoading(false);
            navigate("/success");
          } else {
            console.error("Order placement failed", response);
          }
        },
        prefill: {
          name: formik.values.name,
          contact: formik.values.mobileNumber,
        },
        notes: {
          address: formik.values.address,
        },
        theme: {
          color: "#F37254",
        },
      };

      if (typeof window.Razorpay === "function") {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        console.error("Razorpay script not loaded.");
        setTimeout(() => {
          if (typeof window.Razorpay === "function") {
            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();
          } else {
            console.error("Razorpay script not loaded after retry.");
          }
          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      setIsLoading(false);
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
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };
  const fetchDiscount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/allDiscount`
      );

      const currentDate = new Date();
      const filteredDiscounts = response.data.filter((discount) => {
        return new Date(discount.endDate) >= currentDate;
      });

      setDiscountData(filteredDiscounts);
    } catch (error) {
      console.error("Error fetching discount:", error);
    }
  };

  const checkDiscount = (cart, discountData) => {
    console.log("Cart Data:", cart);
    console.log("Discount Data:", discountData);

    const cartProduct = cart.map((val) => val.name);
    const disProduct = discountData.map((val) => ({
      productName: val.productName.flat(),
      discountName: val.discountName,
      discountPercentage: val.discountPercentage,
      couponCode: val.couponCode
    }));

    for (const discount of disProduct) {
      const allProductsMatch = cartProduct.every((product) =>
        discount.productName.includes(product)
      );

      if (allProductsMatch) {
        return {
          isDiscountApplied: true,
          discountName: discount.discountName,
          discountPercentage: discount.discountPercentage,
          couponCode: discount.couponCode
        };
      }
    }

    return { isDiscountApplied: false };
  };
  useEffect(() => {
    const result = checkDiscount(cart, discount);
    console.log("Discount Result:", result);
  
    if (result?.discountPercentage) {
      const discountAmount = (totalAmount * result.discountPercentage) / 100;
      console.log("Discount Amount:", discountAmount);
      
      setTotalAmount((prevTotal) => prevTotal - discountAmount);
      setShowDiscount(result);
    } else {
      console.warn("No valid discount applied:", result);
      setShowDiscount(null);
    }
  }, [discount]);
  






  return (
    <div className="container mx-auto p-4 lg:px-[15%] bg-[#c4b4a5] text-white ">
      <h2 className="text-3xl flex justify-center font-bold mb-4 mt-32 text-[#343a40]">Place Your Order</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full p-2 bg-[#a19182] focus:ring-[#343a40] rounded-md"
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full p-2 bg-[#a19182] focus:ring-[#343a40] rounded-md"
          />
          {formik.touched.address && formik.errors.address ? (
            <div className="text-red-500 text-sm">{formik.errors.address}</div>
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium">Mobile Number</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formik.values.mobileNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full p-2 bg-[#a19182] focus:ring-[#343a40] rounded-md"
          />
          {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
            <div className="text-red-500 text-sm">{formik.errors.mobileNumber}</div>
          ) : null}
        </div>
        <div className="overflow-x-auto">
          <label className="block text-sm font-medium mb-2">Products</label>
          <table className="min-w-full table-auto bg-[#a19182] focus:ring-[#343a40] rounded-md">
            <thead className="bg-[#a19182]">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium ">Sr.No</th>
                <th className="px-4 py-2 text-left text-sm font-medium ">Product</th>
                <th className="px-4 py-2 text-left text-sm font-medium ">Qty</th>
                <th className="px-4 py-2 text-left text-sm font-medium ">Price (Rs.)</th>
                <th className="px-4 py-2 text-left text-sm font-medium ">Total (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2 text-sm ">{index + 1}</td>
                  <td className="px-4 py-2 text-sm flex flex-wrap gap-1 ">
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
                  <td className="px-4 py-2 text-sm ">{item.qty}</td>
                  <td className="px-4 py-2 text-sm ">{item.price}</td>
                  <td className="px-4 py-2 text-sm ">{item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showDiscount?.isDiscountApplied && (
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium mt-2">Coupon Code</label>
            <p className="mt-1 p-2 focus:ring-[#343a40] bg-[#a19182] rounded-md">
              {showDiscount.couponCode}
            </p>
            <label className="block text-sm font-medium mt-2">Discount Name</label>

            <p className="mt-1 p-2 focus:ring-[#343a40] bg-[#a19182] rounded-md">
              {showDiscount.discountName}</p>
            <label className="block text-sm font-medium mt-2">Discount Percentage</label>

            <p className="mt-1 p-2 focus:ring-[#343a40] bg-[#a19182] rounded-md">
              {showDiscount.discountPercentage}%</p>
          </div>
        )}



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
                checked={formik.values.paymentMethod === "cash"}
                onChange={formik.handleChange}
                className="form-radio"
              />
              <span className="ml-2">Cash</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={formik.values.paymentMethod === "online"}
                onChange={formik.handleChange}
                className="form-radio"
              />
              <span className="ml-2">Online</span>
            </label>
          </div>
          {formik.touched.paymentMethod && formik.errors.paymentMethod ? (
            <div className="text-red-500 text-sm">{formik.errors.paymentMethod}</div>
          ) : null}
        </div>
        {isLoading && <div className="loader">Loading...</div>}
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
