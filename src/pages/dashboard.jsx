import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "./CartContext";

export const Dashboard = () => {
  const { addToCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/getAllProduct"
        );
        const data = response.data;
        setProducts(data);
        setQuantities(Array(data.length).fill(0));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

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

  const handleAddToCart = (index) => {
    const product = products[index];
    const qty = quantities[index];
    if (qty > 0) {
      addToCart({
        id: product.id,
        name: product.productName,
        qty,
        image: product.image,
      });
    }
  };

  return (
    <div className="flex flex-wrap justify-center ">
      {products.map((product, index) => (
        <div
          key={index}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 mx-auto"
        >
          <div className="w-60 h-60 rounded overflow-hidden shadow-lg mx-auto">
            <img
              className="w-full h-32"
              src={product.image || "/back.png"}
              alt="Product"
            />
            <div className="ml-2 text-xl hover:text-2xl">
              {product.productName}
            </div>
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
              <button
                onClick={() => handleAddToCart(index)}
                className="bg-blue-500 text-white px-4 py-2 rounded ml-10 hover:bg-blue-700 transform hover:translate-y-1 hover:shadow-lg hover:shadow-blue-500/50 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
