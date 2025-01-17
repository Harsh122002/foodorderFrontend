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
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // New state for pagination
  const [itemsPerPage] = useState(6); // Number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsAndGroups = async () => {
      try {
        const [productResponse, groupResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/getAllProduct`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/getAllGroup`),
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
  }, []); // Include navigate in the dependency array

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

    const isSessionValid = checkSessionExpiration(navigate);
    if (!isSessionValid) {
      alert("Session Expired");
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
        `${process.env.REACT_APP_API_BASE_URL}/getProductsByGroup/${groupId}`
      );
      setProducts(response.data);
      setSelectedGroup(groupId);
      setCurrentPage(1); // Reset to page 1 when group changes
      setQuantities(Array(response.data.length).fill(0)); // Reset quantities when group changes
    } catch (error) {
      console.error("Error fetching products by group:", error);
    }
  };

  const resetProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/getAllProduct`
      );
      setProducts(response.data);
      setSelectedGroup(null);
      setCurrentPage(1); // Reset to page 1 when resetting products
      setQuantities(Array(response.data.length).fill(0)); // Reset quantities when resetting products
    } catch (error) {
      console.error("Error resetting products:", error);
    }
  };

  // Calculate the products to be displayed on the current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Create page numbers for pagination controls
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-wrap justify-center bg-slate-200">
      <div className="w-full p-4 flex overflow-x-auto mt-28 whitespace-nowrap space-x-4 lg:justify-center">
        <div className="mb-2 inline-block">
          <button
            className={`w-16 h-16 bg-white rounded-full overflow-hidden shadow-lg mx-auto mb-2 flex items-center justify-center ${
              selectedGroup === null ? "border-2 border-blue-500" : ""
            }`}
            onClick={resetProducts}
            style={{ cursor: "pointer" }}
          >
            <img
              className="w-14 h-14 object-cover rounded-full bg-blue-900"
              src="/ALL.png"
              alt="All"
            />
          </button>
          <div className="text-sm font-semibold text-center">All</div>
        </div>

        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-2 inline-block">
            <button
              className={`w-16 h-16 bg-white rounded-full overflow-hidden shadow-lg mx-auto mb-2 flex items-center justify-center ${
                selectedGroup === group._id
                  ? "bg-gray-200 border-2 border-blue-500"
                  : ""
              }`}
              onClick={() => fetchProductsByGroup(group._id)}
              style={{ cursor: "pointer" }}
            >
              <img
                className="w-14 h-14 object-cover rounded-full"
                src={
                  `${process.env.REACT_APP_API_BASE_URL_IMAGE}/${group.filePath}` ||
                  "/back.png"
                }
                alt={group.groupName}
              />
            </button>
            <div className="text-sm font-semibold text-center">
              {group.groupName}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center w-full md:w-3/4 lg:w-4/5">
        {currentProducts.map((product, index) => (
          <div
            key={index}
            className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 p-4 mx-auto"
          >
            <div className="w-60 h-60 rounded overflow-hidden shadow-lg mx-auto">
              <img
                className="w-full h-32 p-4"
                src={
                  `${process.env.REACT_APP_API_BASE_URL_IMAGE}/${product.filePath}` ||
                  "/back.png"
                }
                alt={product.productName}
              />
              <div className="ml-2 text-nowrap hover:text-2xl">
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
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-10 hover:bg-blue-700 hover:translate-y-1 hover:shadow-lg hover:shadow-blue-500/50 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="w-full flex justify-center mt-4 mb-4">
        <nav>
          <ul className="flex space-x-2">
            {pageNumbers.map((number) => (
              <li key={number}>
                <button
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 border rounded ${
                    currentPage === number
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
