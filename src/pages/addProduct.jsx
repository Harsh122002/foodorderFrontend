import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AddProduct() {
  const [groupName, setGroupName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [productName, setProductName] = useState("");

  return (
    <div className="max-w-md mx-auto  p-6 bg-white rounded-md shadow-md mt-5 mb-5">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <form>
        <div className="mb-4">
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={productName}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="groupName"
            className="block text-sm font-medium text-gray-700"
          >
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={groupName}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="imageFile"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Product Image
          </label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Submit
        </button>
        {"  "}
        <Link
          to="/adminDashBoard"
          className="text-lg text-indigo-500 hover:underline block sm:inline-block mb-2 sm:mb-0"
        >
          Back
        </Link>
      </form>
    </div>
  );
}
