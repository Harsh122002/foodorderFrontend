import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

export default function AddProduct() {
  const [groupName, setGroupName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(""); // New state for price
  const [groupOptions, setGroupOptions] = useState([]);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const token = localStorage.getItem("token");

  const productId = useQuery().get("productId");

  useEffect(() => {
    const fetchGroupItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/getAllGroup`
        );
        // Assuming response.data is an array of group objects
        setGroupOptions(response.data); // Set all group options
      } catch (error) {
        console.error("Error fetching group items", error);
      }
    };

    fetchGroupItems();
  }, []);

  useEffect(() => {
    const fetchProductItems = async (productId) => {
      if (productId) {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/updateProduct`,
            { productId }
          );
          const data = response.data;
          setProductName(data.productName || "");
          setPrice(data.price || "");
          setGroupName(data.groupName || "");
          setDescription(data.description || "");
          setImageFile(data.filePath || null);
        } catch (error) {
          console.error("Error fetching group:", error);
          alert("Failed to fetch group. Please try again.");
        }
      }
    };
    fetchProductItems(productId);
  }, []);

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file));
    }
  };

  const handleGroupChange = (e) => {
    setGroupName(e.target.value); // Update selected group name
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value); // Update price
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (productId) {
      const formData = new FormData();
      formData.append("productId", productId);

      formData.append("productName", productName);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      formData.append("groupName", groupName); // Include selected group name in form data
      formData.append("price", price); // Include price in form data
      formData.append("description", description); //
      try {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/update-Proudct`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Product added successfully!");
        navigate("/adminDashBoard");
      } catch (error) {
        console.error("Error adding product", error);
        alert("Failed to add product. Please try again.");
      }
    } else {
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("imageFile", imageFile);
      formData.append("groupName", groupName); // Include selected group name in form data
      formData.append("price", price); // Include price in form data
      formData.append("description", description); // Include description in form data
      try {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/addProduct`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Product added successfully!");
        navigate("/adminDashBoard");
      } catch (error) {
        console.error("Error adding product", error);
        alert("Failed to add product. Please try again.");
      }
    }
  };

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      <Sidebar />
      <div className="flex flex-col justify-center items-center w-full text-[#2E5077] bg-[#F6F4F0]">
        <h2 className="text-3xl font-bold font-mono text-[#2E5077]  mb-6">
          Add Product
        </h2>

        <div className="w-1/3 mx-auto p-6 bg-[#79D7BE] rounded-md shadow-md mt-5 mb-5">
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
                className="mt-1 block w-full px-3 bg-transparent py-2 border border-[#2E5077] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={productName !== null ? productName : productName}
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
                className="mt-1 block w-full px-3 bg-transparent py-2 border border-[#2E5077] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={handleGroupChange}
                value={groupName !== null ? groupName : groupName} // Ensure `groupName` is a single value
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
                className="mt-1 block w-full px-3 py-2 bg-transparent border border-[#2E5077] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={price !== null ? price : price}
                onChange={handlePriceChange}
                required
                min="0"
                step="1"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                className="mt-1 block w-full px-3 py-2 bg-transparent border border-[#2E5077] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={description !== null ? description : description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {productId ? (
              <div className="mb-4">
                <label
                  htmlFor="imageFile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="mt-1 block w-full px-3 py-2 border border-[#2E5077] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            ) : (
              <div className="mb-4">
                <label
                  htmlFor="imageFile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="mt-1 block w-full px-3 py-2 border border-[#2E5077] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            )}
            {imageFile && productId && (
              <div className="mt-4 flex justify-center">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL_IMAGE}/${imageFile}`}
                  alt="Uploaded Preview"
                  className="w-28 h-16 object-cover rounded-md mb-3"
                />
              </div>
            )}
            {imageFile && !productId && (
              <div className="mt-4 flex justify-center">
                <img
                  src={imageFile}
                  alt="Uploaded Preview"
                  className="w-28 h-16 object-cover rounded-md mb-3"
                />
              </div>
            )}
            {productId ? (
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Update
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Submit
              </button>
            )}

            {"  "}
            <Link
              to="/adminDashBoard"
              className="text-lg text-[#2E5077] hover:underline block sm:inline-block mb-2 sm:mb-0"
            >
              Back
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
