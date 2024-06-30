import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TotalAmountContext } from "./TotalAmountContext";

export default function OrderPlace() {
  const totalAmount = useContext(TotalAmountContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobileNumber: "",
    paymentMethod: "cash",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.paymentMethod === "cash") {
      navigate("/success");
    } else {
      navigate("/onlinePayment");
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
