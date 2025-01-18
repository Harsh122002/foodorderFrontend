import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { checkSessionExpiration } from "../../utils/session";
import Sidebar from "./Sidebar";

export default function AddGroup() {
  const [groupName, setGroupName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const token = localStorage.getItem("token");

  const groupId = useQuery().get("groupId");
  const fetchGroup = async (groupId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/updateGroup`,
        { groupId }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching group:", error);
      alert("Failed to fetch group. Please try again.");
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroup(groupId).then(
        (data) => {
          if (data) {
            setGroupName(data.groupName || "");
            setImageFile(data.filePath || null);
          }
        },
        (error) => {
          console.error("Error fetching group:", error);
        }
      );
    }
  }, []);

  const navigate = useNavigate();

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file));
    }
  };
  const sessionValid = checkSessionExpiration();
  if (!sessionValid) {
    navigate("/login");
    return;
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event.type);

    if (groupId) {
      // Update group API call
      const formData = new FormData();
      formData.append("groupId", groupId);
      formData.append("groupName", groupName);
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/update-Group`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          alert("Group updated successfully!");
          setGroupName("");
          setImageFile(null);
          navigate("/adminDashBoard");
        }
      } catch (error) {
        console.error("Error updating group:", error);
        alert("Failed to update group. Please try again.");
      }
      return;
    } else {
      const formData = new FormData();
      formData.append("groupName", groupName);
      formData.append("imageFile", imageFile);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/addGroupItem`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
        alert("Group added successfully!");

        // Reset form state if needed
        setGroupName("");
        setImageFile(null);
        navigate("/adminDashBoard");
      } catch (error) {
        console.error("Error adding group:", error);
        alert("Failed to add group. Please try again.");
      }
    }
  };

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      <Sidebar />
      <div className="flex flex-col justify-center items-center w-full text-[#2E5077] bg-[#F6F4F0]">
        <h2 className="text-3xl font-bold font-sans text-[#2E5077]  mb-6">Add Group</h2>

        <div className="w-1/3 mx-auto p-6 bg-[#79D7BE] rounded-md shadow-md mt-5 mb-5">
          <form onSubmit={handleSubmit}>
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
                className="mt-1 block w-full bg-transparent px-3 py-2 border border-[#2E5077] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={groupName !== null ? groupName : groupName}
                onChange={handleGroupNameChange}
                required
              />
            </div>
            <div>
              {groupId ? (
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
                    onChange={handleImageChange}
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
                    onChange={handleImageChange}
                    className="mt-1 block w-full px-3 py-2 border border-[#2E5077] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              )}

              {imageFile && groupId && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL_IMAGE}/${imageFile}`}
                    alt="Uploaded Preview"
                    className="w-28 h-16 object-cover rounded-md mb-3"
                  />
                </div>
              )}
              {imageFile && !groupId && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={imageFile}
                    alt="Default preview"
                    className="w-28 h-16 object-contain rounded-md mb-3"
                  />
                </div>
              )}
            </div>
            {groupName ? (
              <button
                type="update"
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
