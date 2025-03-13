import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Rating() {
  const [selectedRating, setSelectedRating] = useState(0);
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const OrderId = useQuery().get("orderId");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log("OrderId:", OrderId);

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  const onSubmit = async (data) => {
    const formData = { ...data, rating: selectedRating, orderId: OrderId };
    console.log("Form Data:", formData);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/updateRating`,
        formData
      );

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
    <div className="flex flex-col align-items-center justify-center h-[100vh] bg-gray-100">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4 mt-16 text-center text-blue-600">
          Rate Your Order
        </h1>
        <div className="bg-white p-6 text-center rounded shadow-lg max-w-md w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="text-center">
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

            {selectedRating === 0 && (
              <p className="text-red-500 mb-2">Please select a rating</p>
            )}

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

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const Star = ({ starId, selected, handleStarClick }) => {
  return (
    <span
      className={`cursor-pointer text-4xl transition duration-200 ${selected ? "text-yellow-400" : "text-gray-300"
        }`}
      onClick={handleStarClick}
    >
      ★
    </span>
  );
};
