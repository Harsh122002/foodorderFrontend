import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { checkSessionExpiration } from "../utils/session";

export const Dashboard = () => {
  const { addToCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState([]);
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // State to hold selected group ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsAndGroups = async () => {
      try {
        const [productResponse, groupResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/getAllProduct"),
          axios.get("http://localhost:5000/api/auth/getAllGroup"),
        ]);

        const productsData = productResponse.data;
        const groupsData = groupResponse.data;

        setProducts(productsData);
        setGroups(groupsData);
        setQuantities(Array(productsData.length).fill(0));
      } catch (error) {
        console.error("Error fetching products or groups:", error);
      }
    };

    fetchProductsAndGroups();
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

    // Check if token exists in local storage
    const isSessionValid = checkSessionExpiration(navigate);
    if (!isSessionValid) {
      alert("Session Expired");
      // Redirect to login page if session is not valid
      navigate("/login");
      return;
    }

    if (qty > 0) {
      addToCart({
        id: product.id,
        name: product.productName,
        qty,
        image: product.filePath,
        price: product.price,
      });
      alert(`Added ${qty} ${product.productName}(s) to cart!`);
    }
  };

  const fetchProductsByGroup = async (groupId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/getProductsByGroup/${groupId}`
      );
      setProducts(response.data);
      setSelectedGroup(groupId); // Set selected group ID
    } catch (error) {
      console.error("Error fetching products by group:", error);
    }
  };

  const resetProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getAllProduct"
      );
      setProducts(response.data);
      setSelectedGroup(null); // Reset selected group ID
    } catch (error) {
      console.error("Error resetting products:", error);
    }
  };

  return (
    <div className="flex flex-wrap justify-center">
      {/* Left Column */}
      <div className="flex flex-col items-center w-full sm:w-auto md:w-1/4 lg:w-1/5 p-4">
        <div className="mb-4">
          {/* All Button */}
          <button
            className="w-24 h-24 bg-white rounded-full overflow-hidden shadow-lg mx-auto mb-2 flex items-center justify-center"
            onClick={resetProducts}
          >
            All
          </button>
        </div>

        {/* Group Images Section */}
        <div className="flex flex-col items-center">
          {groups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="w-24 h-24 bg-white rounded-full overflow-hidden shadow-lg mx-auto mb-2 flex items-center justify-center"
              onClick={() => fetchProductsByGroup(group.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                className="w-20 h-20 object-cover rounded-full"
                src={`http://localhost:5000/${group.filePath}` || "/back.png"}
                alt={group.groupName}
              />
              <div className="text-xl font-semibold">{group.groupName}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-wrap justify-center w-full md:w-3/4 lg:w-4/5">
        {products.map((product, index) => (
          <div
            key={index}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 mx-auto"
          >
            <div className="w-60 h-60 rounded overflow-hidden shadow-lg mx-auto">
              <img
                className="w-full h-32 p-4"
                src={`http://localhost:5000/${product.filePath}` || "/back.png"}
                alt={product.productName}
              />
              <div className="ml-2 text-xl hover:text-2xl">
                {product.productName}
              </div>
              <div className="ml-2 text-sm">Price: Rs.{product.price}</div>
              <div className="flex justify-left items-center ml-2 mt-2 text-sm">
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
    </div>
  );
};
