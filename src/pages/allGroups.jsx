import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllGroups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getAllGroup"
      );
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleDelete = async (groupId) => {
    try {
      console.log(groupId);
      const response = await axios.delete(
        `http://localhost:5000/api/auth/deleteGroup/${groupId}`
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Groups</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {groups.map((group, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-lg relative"
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
              <h2 className="text-xl font-semibold mb-2">{group.groupName}</h2>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{group.description}</span>
                {/* Add additional details or actions as needed */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
