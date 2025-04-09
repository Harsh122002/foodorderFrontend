import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import Sidebar from "./Sidebar";

export default function AllGroups() {
  const [groups, setGroups] = useState([]);
  const [visibleProductsGroupId, setVisibleProductsGroupId] = useState(null);
  const [productsByGroup, setProductsByGroup] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/getAllGroup`
      );
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleShowProducts = async (groupId) => {
    // Toggle logic
    if (visibleProductsGroupId === groupId) {
      setVisibleProductsGroupId(null);
      return;
    }

    // If products already fetched, just toggle
    if (productsByGroup[groupId]) {
      setVisibleProductsGroupId(groupId);
    } else {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/getProductsByGroupId/${groupId}`
        );
        setProductsByGroup((prev) => ({
          ...prev,
          [groupId]: response.data,
        }));
        setVisibleProductsGroupId(groupId);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  };

  const handleDelete = async (groupId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/deleteGroup/${groupId}`
      );
      if (response.status === 200) {
        fetchGroups();
        alert("Group deleted successfully.");
      } else {
        alert("Failed to delete group.");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete group.");
    }
  };

  const handleUpdate = (groupId) => {
    navigate(`/addGroup?groupId=${groupId}`);
  };

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      <div className="w-64 fixed h-full z-10">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 bg-[#F6F4F0]">
          <h1 className="text-4xl font-bold mb-8 text-center">Categories</h1>
          <Link
            to="/adminDashBoard"
            className="mb-3 flex justify-center text-center hover:text-xl"
          >
            Back
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, index) => (
              <div
                key={index}
                className="bg-[#79D7BE] rounded-lg overflow-hidden shadow-lg relative"
              >
                <button
                  onClick={() => handleDelete(group._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center focus:outline-none"
                >
                  X
                </button>

                <img
                  className="w-full h-64 object-cover"
                  src={`http://localhost:5000/${group.filePath}`}
                  alt={group.groupName}
                />

                <div className="p-4">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold mb-2">
                        {group.groupName}
                      </h2>
                      <button
                        className="text-sm text-blue-900 underline hover:text-blue-600"
                        onClick={() => handleShowProducts(group._id)}
                      >
                        {visibleProductsGroupId === group._id
                          ? "Hide Products"
                          : "Show Products"}
                      </button>
                    </div>
                    <AiOutlineEdit
                      className="text-[#2E5077] h-8 w-8 hover:text-blue-500 cursor-pointer"
                      title="Edit"
                      onClick={() => handleUpdate(group._id)}
                    />
                  </div>

                  {(visibleProductsGroupId === group._id &&
                    productsByGroup[group._id] &&
                    productsByGroup[group._id].length > 0) ? (
                    <div className="mt-4 p-3 bg-white bg-opacity-80 rounded shadow">
                      <h3 className="text-lg font-semibold mb-2">Products:</h3>
                      <ul className="list-disc list-inside text-gray-800">
                        {productsByGroup[group._id].map((product, idx) => (
                          <li key={idx}>{product.productName}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}


                  <div className="mt-4 text-sm text-gray-700">
                    {group.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
