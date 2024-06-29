import React, { useState } from "react";

export const Dashboard = () => {
  // Initialize state for quantity for each product
  const initialQuantities = Array(8).fill(0);
  const [quantities, setQuantities] = useState(initialQuantities);

  const incrementQty = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] < 4) {
      newQuantities[index]++;
      setQuantities(newQuantities);
    }
  };

  const decrementQty = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 0) {
      newQuantities[index]--;
      setQuantities(newQuantities);
    }
  };
  return (
    <div className="flex flex-wrap justify-center">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 mx-auto"
        >
          <div className="w-60 h-60 rounded overflow-hidden shadow-lg mx-auto">
            <img className="w-full h-32" src="/back.png" alt="Product" />
            <div className="ml-2 text-xl hover:text-2xl">Product Name</div>
            <br />
            <div className="flex justify-left items-center ml-2 mt-2">
              <button
                onClick={() => decrementQty(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                -
              </button>
              <span className="mx-2">{quantities[index]}</span>
              <button
                onClick={() => incrementQty(index)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                +
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded ml-10 hover:bg-blue-700 transform hover:translate-y-1 hover:shadow-lg hover:shadow-blue-500/50 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
