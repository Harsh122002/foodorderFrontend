import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddProduct() {
  const [groupName, setGroupName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(""); // New state for price
  const [groupOptions, setGroupOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/getAllGroup"
        );
        // Assuming response.data is an array of group objects
        setGroupOptions(response.data); // Set all group options
      } catch (error) {
        console.error("Error fetching group items", error);
      }
    };

    fetchGroupItems();
  }, []);

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleGroupChange = (e) => {
    setGroupName(e.target.value); // Update selected group name
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value); // Update price
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("imageFile", imageFile);
    formData.append("groupName", groupName); // Include selected group name in form data
    formData.append("price", price); // Include price in form data
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:5000/api/auth/addProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Product added successfully!");
      navigate("/adminDashBoard");
    } catch (error) {
      console.error("Error adding product", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md mt-5 mb-5">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <form onSubmit={handleSubmit}>
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
            onChange={handleProductNameChange}
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
          <select
            id="groupName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleGroupChange}
            value={groupName} // Ensure `groupName` is a single value
            required
          >
            <option value="">Select a Group</option>
            {groupOptions.map((item) => (
              <option key={item._id} value={item._id}>
                {item.groupName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={price}
            onChange={handlePriceChange}
            required
            min="0"
            step="1"
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
            onChange={handleImageFileChange}
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
