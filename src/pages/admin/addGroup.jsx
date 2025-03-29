import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { checkSessionExpiration } from "../../utils/session";
import Sidebar from "./Sidebar";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddGroup() {
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const useQuery = () => new URLSearchParams(useLocation().search);
  const groupId = useQuery().get("groupId");

  const sessionValid = checkSessionExpiration();
  useEffect(() => {
    if (!sessionValid) {
      navigate("/login");
    }
  }, [sessionValid, navigate]);

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
      fetchGroup(groupId).then((data) => {
        if (data) {
          formik.setValues({
            groupName: data.groupName || "",
            imageFile: data.filePath || null,
          });          // setExistingImage(data.filePath || null);
          setImagePreview(`http://localhost:5000/${data.filePath}`);
        }
      });
    }
  }, [groupId]);

  const formik = useFormik({
    initialValues: {
      groupName: "",
      imageFile: null,
    },
    validationSchema: Yup.object({
      groupName: Yup.string()
        .required("Group name is required")
        .min(3, "Group name must be at least 3 characters"),
      imageFile: groupId
        ? Yup.mixed()
        : Yup.mixed().required("Image is required").test(
            "fileType",
            "Unsupported File Format",
            (value) =>
              !value || (value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
          ),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("groupName", values.groupName);
      if (groupId) formData.append("groupId", groupId);
      if (values.imageFile) formData.append("imageFile", values.imageFile);

      try {
        const endpoint = groupId
          ? `${process.env.REACT_APP_API_BASE_URL}/update-Group`
          : `${process.env.REACT_APP_API_BASE_URL}/addGroup`;

        const response = await axios.post(endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          alert(groupId ? "Group updated successfully!" : "Group added successfully!");
          navigate("/adminDashBoard");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit form. Please try again.");
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("imageFile", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      <Sidebar />
      <div className="flex flex-col justify-center items-center w-full text-[#2E5077] bg-[#F6F4F0]">
        <h2 className="text-3xl font-bold font-sans mb-6">{groupId ? "Update" : "Add"} Category</h2>

        <div className="w-1/3 mx-auto p-6 bg-[#79D7BE] rounded-md shadow-md mt-5 mb-5">
          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            {/* Group Name Field */}
            <div className="mb-4">
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                Group Name
              </label>
              <input
                type="text"
                id="groupName"
                name="groupName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.groupName}
                className="mt-1 block w-full bg-transparent px-3 py-2 border border-[#2E5077] rounded-md shadow-sm focus:outline-none"
              />
              {formik.touched.groupName && formik.errors.groupName && (
                <div className="text-red-500 text-xs">{formik.errors.groupName}</div>
              )}
            </div>

            {/* Image Upload Field */}
            <div className="mb-4">
              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                onChange={handleImageChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full px-3 py-2 border border-[#2E5077] rounded-md shadow-sm focus:outline-none"
              />
              {formik.touched.imageFile && formik.errors.imageFile && (
                <div className="text-red-500 text-xs">{formik.errors.imageFile}</div>
              )}
            </div>

            {/* Image Preview */}
            {(imagePreview || existingImage) && (
              <div className="mt-4 flex justify-center">
                <img
                  src={imagePreview || `${process.env.REACT_APP_API_BASE_URL_IMAGE}/${imagePreview}`}
                  alt="Preview"
                  className="w-28 h-16 object-cover rounded-md mb-3"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {groupId ? "Update" : "Submit"}
            </button>

            {/* Back Button */}
            <Link
              to="/adminDashBoard"
              className="ml-4 text-lg text-[#2E5077] hover:underline inline-block"
            >
              Back
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
