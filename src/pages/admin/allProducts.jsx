import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AiOutlineEdit } from "react-icons/ai";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/getAllProduct`
      );
      setProducts(response.data);
    } catch (error) {
      setError("Error fetching products.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/deleteProduct/${productId}`
      );
      fetchProducts(); // Fetch updated products after deletion
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };
  const handleUpdate = (productId) => {
    navigate(`/addProduct?productId=${productId}`);
  };
  return (
    <div className="flex h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white fixed h-full z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-56 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 ">
          <h1 className="text-4xl font-bold mb-8 text-center">All Products</h1>
          <Link
            to="/adminDashBoard"
            className="mb-3 flex justify-center text-center hover:text-xl"
          >
            Back
          </Link>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-center">No products available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-[#79D7BE] rounded-lg overflow-hidden shadow-lg relative"
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
                  <div className="p-4 flex flex-col justify-items-stretch">
                    <h2 className="text-xl font-semibold mb-2">
                      {product.productName}
                    </h2>
                    <h6 className="text-xl  font-semibold mb-2">
                      {product.groupDetails.groupName}
                    </h6>
                    <p className="text-lg   mb-2">
                      Price:Rs.{product.price}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                      Description: {product.description}

                      </span>
                      <AiOutlineEdit
                        className="text-[#2E5077] h-8 w-8 hover:text-blue-500"
                        title="Edit"
                        onClick={() => handleUpdate(product._id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
