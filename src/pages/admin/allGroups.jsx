import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { AiOutlineEdit } from "react-icons/ai";
import Sidebar from "./Sidebar";

export default function AllGroups() {
  const [groups, setGroups] = useState([]);

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
  const navigate = useNavigate();

  const handleDelete = async (groupId) => {
    try {
      console.log(groupId);
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/deleteGroup/${groupId}`
      );
      if (response.status === 200) {
        // If deletion is successful, fetch updated groups
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
  const handleUpdate = async (groupId) => {
    navigate(`/addGroup?groupId=${groupId}`);
  };

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      {/* Sidebar */}
      <div className="w-64  text-white fixed h-full z-10">
        <Sidebar />
      </div>{" "}
      <div className="flex-1 ml-60 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 bg-[#F6F4F0]">
          <h1 className="text-4xl font-bold mb-8 text-center">Groups</h1>
          <Link
            to="/adminDashBoard"
            className="mb-3 flex justify-center text-center hover:text-xl"
          >
            Back
          </Link>
          <div className="ml-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <h2 className="text-xl font-semibold mb-2">
                      {group.groupName}
                    </h2>
                    <AiOutlineEdit
                      className="text-[#2E5077] h-8 w-8 hover:text-blue-500"
                      title="Edit"
                      onClick={() => handleUpdate(group._id)}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{group.description}</span>
                    {/* Add additional details or actions as needed */}
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
