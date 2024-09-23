import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Rating() {
  // State to track selected star rating
  const [selectedRating, setSelectedRating] = useState(0);
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const OrderId = useQuery().get("orderId"); // Initialize useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Function to handle star click
  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  // Form submit handler

  const onSubmit = async (data) => {
    const formData = { ...data, rating: selectedRating, orderId: OrderId };
    console.log("Form Data:", formData);

    try {
      // Replace the URL with your API endpoint
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/updateRating`,
        formData // Axios automatically converts the object to JSON
      );

      // Handle the response
      console.log("Rating submitted successfully:", response.data);
      alert("Thank you for your feedback!");
      navigate("/");
    } catch (error) {
      console.error(
        "Error submitting rating:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to submit your rating.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-lg max-w-md w-full text-center"
      >
        {/* Star Rating Section */}
        <div className="star-rating mb-4 flex justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              starId={star}
              selected={selectedRating >= star}
              handleStarClick={() => handleStarClick(star)}
            />
          ))}
        </div>

        {/* Show error if no rating selected */}
        {selectedRating === 0 && (
          <p className="text-red-500 mb-2">Please select a rating</p>
        )}

        {/* Description Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Description:
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="border rounded w-full py-2 px-3 text-gray-700"
            placeholder="Write your feedback..."
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

// Star Component
const Star = ({ starId, selected, handleStarClick }) => {
  return (
    <span
      className={`cursor-pointer text-4xl transition duration-200 ${
        selected ? "text-yellow-400" : "text-gray-300"
      }`}
      onClick={handleStarClick}
    >
      ★
    </span>
  );
};
