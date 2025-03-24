import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddProduct() {
  const [groupOptions, setGroupOptions] = useState([]);
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
        setGroupOptions(response.data);
      } catch (error) {
        console.error("Error fetching group items", error);
      }
    };

    fetchGroupItems();
  }, []);

  const formik = useFormik({
    initialValues: {
      productName: "",
      groupName: "",
      price: "",
      description: "",
      imageFile: null,
    },
    validationSchema: Yup.object({
      productName: Yup.string().required("Product Name is required"),
      groupName: Yup.string().required("Group Name is required"),
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be greater than or equal to 0"),
      description: Yup.string().required("Description is required"),
      imageFile: productId
        ? Yup.mixed()
        : Yup.mixed()
            .required("Image is required")
            .test(
              "fileType",
              "Unsupported File Format",
              (value) =>
                !value ||
                (value &&
                  ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
            ),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("groupName", values.groupName);
      formData.append("price", values.price);
      formData.append("description", values.description);
      formData.append("imageFile", values.imageFile);

      try {
        if (productId) {
          formData.append("productId", productId);
          await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/updateProduct`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          alert("Product updated successfully!");
        } else {
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
        }
        navigate("/adminDashBoard");
      } catch (error) {
        console.error("Error submitting product", error);
        alert("Failed to submit product. Please try again.");
      }
    },
  });

  useEffect(() => {
    const fetchProductItems = async (productId) => {
      if (productId) {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/updateProduct`,
            { productId }
          );
          const data = response.data;
          formik.setValues({
            productName: data.productName || "",
            groupName: data.groupName || "",
            price: data.price || "",
            description: data.description || "",
            imageFile: data.filePath || null,
          });
        } catch (error) {
          console.error("Error fetching group:", error);
          alert("Failed to fetch group. Please try again.");
        }
      }
    };
    fetchProductItems(productId);
  }, [productId]);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("imageFile", file);
    }
  };

  return (
    <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
      <Sidebar />
      <div className="flex flex-col justify-center items-center w-full text-[#2E5077] bg-[#F6F4F0]">
        <h2 className="text-3xl font-bold font-mono text-[#2E5077] mb-6">
          Add Product
        </h2>

        <div className="w-1/3 mx-auto p-6 bg-[#79D7BE] rounded-md shadow-md mt-5 mb-5">
          <form onSubmit={formik.handleSubmit}>
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
                {...formik.getFieldProps("productName")}
              />
              {formik.touched.productName && formik.errors.productName ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.productName}
                </div>
              ) : null}
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
                {...formik.getFieldProps("groupName")}
              >
                <option value="">Select a Group</option>
                {groupOptions.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.groupName}
                  </option>
                ))}
              </select>
              {formik.touched.groupName && formik.errors.groupName ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.groupName}
                </div>
              ) : null}
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
                {...formik.getFieldProps("price")}
                min="0"
                step="1"
              />
              {formik.touched.price && formik.errors.price ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.price}
                </div>
              ) : null}
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
                {...formik.getFieldProps("description")}
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.description}
                </div>
              ) : null}
            </div>
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
              {formik.touched.imageFile && formik.errors.imageFile ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.imageFile}
                </div>
              ) : null}
            </div>
            {formik.values.imageFile && productId && (
              <div className="mt-4 flex justify-center">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL_IMAGE}/${formik.values.imageFile}`}
                  alt="Uploaded Preview"
                  className="w-28 h-16 object-cover rounded-md mb-3"
                />
              </div>
            )}
            {formik.values.imageFile && !productId && (
              <div className="mt-4 flex justify-center">
                <img
                  src={URL.createObjectURL(formik.values.imageFile)}
                  alt="Uploaded Preview"
                  className="w-28 h-16 object-cover rounded-md mb-3"
                />
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {productId ? "Update" : "Submit"}
            </button>
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
