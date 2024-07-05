import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getAllProducts"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/deleteProduct/${productId}`
      );
      // After successful deletion, fetch updated products
      fetchProducts();
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-lg relative"
          >
            <button
              onClick={() => handleDelete(product._id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center focus:outline-none"
            >
              X
            </button>
            <img
              className="w-full h-64 object-cover"
              src={`http://localhost:5000/${product.filePath}`}
              alt={product.productName}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                {product.productName}
              </h2>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price: Rs.{product.price}</span>
                {/* Add additional details or actions as needed */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
