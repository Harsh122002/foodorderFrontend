import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Discount() {
     const [products, setProducts] = useState([]);
     const [imagePreview, setImagePreview] = useState(null);
     const navigate = useNavigate();
     const useQuery = () => new URLSearchParams(useLocation().search);
     const disCountId = useQuery().get("id");

     useEffect(() => {
          fetchProducts();

     }, []);
     const fetchProductId = async () => {
          try {
               const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/DiscountForId/${disCountId}`
               );
               const discountData = response.data;
               // Set Formik Values with Proper Handling
               formik.setValues({
                    discountName: discountData.discountName || '',
                    discountPercentage: discountData.discountPercentage || '',
                    productName: Array.isArray(discountData.productName) ? discountData.productName : [],
                    groupName: Array.isArray(discountData.groupName) ? discountData.groupName : [],
                    startDate: discountData.startDate ? new Date(discountData.startDate).toISOString().split('T')[0] : '',
                    endDate: discountData.endDate ? new Date(discountData.endDate).toISOString().split('T')[0] : '',
                    couponCode: discountData.couponCode || '',
                    couponDescription: discountData.couponDescription || '',
                    image: discountData.imagePath
                    ? discountData.imagePath
                    : null,               });

               if (discountData.imagePath) {
                    setImagePreview(`${process.env.REACT_APP_API_BASE_URL_IMAGE}/${discountData.imagePath}`);
               }
          } catch (error) {
               console.error('Error fetching discount data:', error);
          }
     };

     useEffect(() => {
          if (disCountId) {
               fetchProductId();
          }
     }, [disCountId]);



     const fetchProducts = async () => {
          try {
               const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/AllDiscountProduct`
               );
               setProducts(response.data.productsWithGroupNames);
          } catch (error) {
               console.error('Error fetching products:', error);
          }
     };


     const formik = useFormik({
          initialValues: {
               discountName: '',
               discountPercentage: '',
               productName: [],
               groupName: [],
               startDate: '',
               endDate: '',
               couponCode: '',
               couponDescription: '',
               image: null,
          },
          validationSchema: Yup.object({
               discountName: Yup.string().required('Discount Name is required'),
               discountPercentage: Yup.number()
                    .required('Discount Percentage is required')
                    .min(1, 'Discount Percentage must be at least 1')
                    .max(100, 'Discount Percentage must be at most 100'),
               productName: Yup.array().min(1, 'At least one Product Name is required'),
               groupName: Yup.array().min(1, 'At least one Group Name is required'),
               startDate: Yup.date().required('Start Date is required'),
               endDate: Yup.date()
                    .required('End Date is required')
                    .min(Yup.ref('startDate'), 'End Date cannot be before Start Date'),
               couponCode: Yup.string().required('Coupon Code is required'),
               couponDescription: Yup.string().required('Coupon Description is required'),
               image: Yup.mixed()
               .test("fileType", "Unsupported File Format", (value) => {
                 if (!value) return true; // Allow empty if no image is uploaded
                 if (typeof value === "string") {
                   // Check if it's an existing image path
                   return /\.(jpeg|jpg|png)$/i.test(value);
                 }
                 // Validate uploaded file type
                 return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
               })
               .required("Image is required"),
             
          }),
          onSubmit: async (values) => {


               try {
                    if (disCountId) {
                         // Update API call
                         const response = await axios.put(
                              `${process.env.REACT_APP_API_BASE_URL}/updateDiscount/${disCountId}`,
                              values,
                              {
                                   headers: {
                                        'Content-Type': 'multipart/form-data',
                                   },
                              }
                         );
                         console.log('Discount updated successfully:', response.data);
                    } else {
                         // Add API call
                         const response = await axios.post(
                              `${process.env.REACT_APP_API_BASE_URL}/addDiscount`,
                              values,
                              {
                                   headers: {
                                        'Content-Type': 'multipart/form-data',
                                   },
                              }
                         );
                         console.log('Discount added successfully:', response.data);
                    }
                    formik.resetForm();
                    setImagePreview(null);

                    navigate("/allDiscount");
               } catch (error) {
                    console.error(error.message);
                    alert(error.message);
               }
          },
     });
     const handleImageChange = (event) => {
          const file = event.target.files[0];
          if (file) {
               formik.setFieldValue("image", file);
               setImagePreview(URL.createObjectURL(file));
          }
     };


     console.log(formik.values.productName);

     // Handle Product Selection
     const handleProductChange = (e) => {
          const { value, checked } = e.target;
          let selectedProducts = [...formik.values.productName];

          if (checked) {
               selectedProducts.push(value);
          } else {
               selectedProducts = selectedProducts.filter((product) => product !== value);
          }

          formik.setFieldValue('productName', selectedProducts);

          // Update GroupName based on selected products
          const selectedGroups = [
               ...new Set(
                    products
                         .filter((product) => selectedProducts.includes(product.productName))
                         .map((product) => product.groupName)
               ),
          ];

          formik.setFieldValue('groupName', selectedGroups);
     };

console.log(formik.values.productName);

     return (
          <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
               <Sidebar />
               <div className="flex-1 overflow-y-auto">
                    <div className="container mx-auto px-4 py-8 bg-[#F6F4F0]">
                         <h1 className="text-4xl font-bold mb-8 text-center">
                              {disCountId ? 'Discount-Update' : 'Discount-Add'}
                         </h1>
                         <Link
                              to="/adminDashBoard"
                              className="mb-3 flex justify-center text-center hover:text-xl"
                         >
                              Back
                         </Link>
                    </div>
                    <div className="w-1/2 mx-auto p-6 bg-[#79D7BE] rounded-md shadow-md mb-5">
                         <form onSubmit={formik.handleSubmit}>
                              <div className="mb-4">
                                   <label className="block text-sm font-bold mb-2" htmlFor="discountName">
                                        Discount Name
                                   </label>
                                   <input
                                        id="discountName"
                                        name="discountName"
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={formik.handleChange}
                                        value={formik.values.discountName}
                                        placeholder="Enter Discount Name"
                                   />
                                   {formik.errors.discountName && formik.touched.discountName && (
                                        <div className="text-red-500 text-sm">{formik.errors.discountName}</div>
                                   )}
                              </div>
                              <div className="mb-4">
                                   <label className="block text-sm font-bold mb-2" htmlFor="discountPercentage">
                                        Discount Percentage
                                   </label>
                                   <input
                                        id="discountPercentage"
                                        name="discountPercentage"
                                        type="number"
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={formik.handleChange}
                                        value={formik.values.discountPercentage}
                                        placeholder="Enter Discount Percentage"
                                   />
                                   {formik.errors.discountPercentage && formik.touched.discountPercentage && (
                                        <div className="text-red-500 text-sm">{formik.errors.discountPercentage}</div>
                                   )}
                              </div>
                              <div className="mb-4">
                                   <label className="block text-sm font-bold mb-2">
                                        Select Products
                                   </label>
                                   <div className="max-h-44 overflow-auto">
                                        {products.map((product) => (
                                             <div key={product.productName} className="flex items-center">
                                                  <input
                                                       type="checkbox"
                                                       id={`product-${product.productName}`}
                                                       name="productName"
                                                       value={product.productName}
                                                       checked={formik.values.productName.includes(product.productName)}
                                                       onChange={handleProductChange}
                                                       className="mr-2"
                                                  />
                                                  <label htmlFor={`product-${product.productName}`}>
                                                       {product.productName}
                                                  </label>
                                             </div>
                                        ))}
                                   </div>
                                   {formik.errors.productName && formik.touched.productName && (
                                        <div className="text-red-500 text-sm">{formik.errors.productName}</div>
                                   )}
                              </div>
                              <div className="mb-4">
                                   <label className="block text-sm font-bold mb-2">
                                        Select Groups
                                   </label>
                                   <div className="max-h-44 overflow-auto">
                                        {[...new Set(products.map((product) => product.groupName))].map((groupName) => {

                                             // Check if any product from the group is selected
                                             const isGroupSelected = products
                                                  .filter((product) => product.groupName === groupName)
                                                  .some((product) => formik.values.productName.includes(product.productName));

                                             return (
                                                  <div key={groupName} className="flex items-center">
                                                       <input
                                                            type="checkbox"
                                                            id={`group-${groupName}`}
                                                            name="groupName"
                                                            value={groupName}
                                                            checked={formik.values.groupName.includes(groupName)}
                                                            onChange={formik.handleChange}
                                                            className={`mr-2 ${isGroupSelected ? 'text-green-500' : 'text-gray-500'}`}
                                                            disabled={!isGroupSelected}
                                                       />
                                                       <label htmlFor={`group-${groupName}`}>
                                                            {groupName}
                                                       </label>
                                                  </div>
                                             );
                                        })}
                                   </div>
                              </div>

                              <div className="mb-4">
                                   <label className="block text-sm font-bold mb-2" htmlFor="startDate">
                                        Start Date
                                   </label>
                                   <input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={formik.handleChange}
                                        value={formik.values.startDate}
                                   />
                                   {formik.errors.startDate && formik.touched.startDate && (
                                        <div className="text-red-500 text-sm">{formik.errors.startDate}</div>
                                   )}
                              </div>
                              <div className="mb-4">
                                   <label className="block text-sm font-bold mb-2" htmlFor="endDate">
                                        End Date
                                   </label>
                                   <input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={formik.handleChange}
                                        value={formik.values.endDate}
                                   />
                                   {formik.errors.endDate && formik.touched.endDate && (
                                        <div className="text-red-500 text-sm">{formik.errors.endDate}</div>
                                   )}
                              </div>
                              <div className="mb-4">
                                   <label className="block text-sm font-bold mb-2" htmlFor="couponCode">
                                        Coupon Code
                                   </label>
                                   <input
                                        id="couponCode"
                                        name="couponCode"
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={formik.handleChange}
                                        value={formik.values.couponCode}
                                        placeholder="Enter Coupon Code"
                                   />
                                   {formik.errors.couponCode && formik.touched.couponCode && (
                                        <div className="text-red-500 text-sm">{formik.errors.couponCode}</div>
                                   )}
                              </div>
                              <div className="mb-4">
                                   <label className="block text-sm font-bold mb-2" htmlFor="couponDescription">
                                        Coupon Description
                                   </label>
                                   <textarea
                                        id="couponDescription"
                                        name="couponDescription"
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={formik.handleChange}
                                        value={formik.values.couponDescription}
                                        placeholder="Enter Coupon Description"
                                   />
                                   {formik.errors.couponDescription && formik.touched.couponDescription && (
                                        <div className="text-red-500 text-sm">{formik.errors.couponDescription}</div>
                                   )}
                              </div>
                              <div className="mb-4">
                                   <label className="block text-sm font-bold mb-2" htmlFor="image">
                                        Upload Image
                                   </label>
                                   <input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        className="w-full px-3 py-2 border rounded-md"
                                        onChange={handleImageChange}
                                   />
                                   {imagePreview && (
                                        <div className="mt-2">
                                             <img
                                                  src={imagePreview}
                                                  alt="Preview"
                                                  className="w-32 h-32 object-cover rounded-md"
                                             />
                                        </div>
                                   )}
                                   {formik.errors.image && formik.touched.image && (
                                        <div className="text-red-500 text-sm">{formik.errors.image}</div>
                                   )}
                              </div>
                              <button
                                   type="submit"
                                   className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                              >
                                   {disCountId ? 'Update' : 'Submit'}
                              </button>
                         </form>
                    </div>
               </div>
          </div>
     );
}
