import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';

export default function ShowDiscount() {
     const [discountData, setDiscountData] = useState([]);

     const fetchData = async () => {
          try {
               const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/allDiscount`);
               setDiscountData(response.data);
          } catch (error) {
               console.error("Error fetching discount data:", error);
          }
     };

     const handleDelete = async (id) => {
          try {
               await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/discountDelete/${id}`);
               setDiscountData(discountData.filter((discount) => discount._id !== id));
          } catch (error) {
               console.error("Error deleting discount:", error);
          }
     };

     useEffect(() => {
          fetchData();
     }, []);

    

     return (
          <div className="flex max-h-screen bg-[#F6F4F0] font-mono text-[#2E5077]">
               <Sidebar />
               <div className="flex-1 overflow-y-auto">
                    <div className="container mx-auto px-4 py-8 bg-[#F6F4F0]">
                         <h1 className="text-4xl font-bold mb-8 text-center">All Discounts</h1>
                         <Link
                              to="/adminDashBoard"
                              className="mb-3 flex justify-center text-center hover:text-xl"
                         >
                              Back
                         </Link>
                         <div className="mt-8">
                              {discountData.length > 0 ? (
                                   <ul>
                                        {discountData.map((discount) => (
                                             <li key={discount._id} className="mb-4">
                                                  <div className="max-w-[60%] m-auto p-4 bg-[#79D7BE] rounded shadow flex flex-col  gap-6 capitalize">

                                                       <div className=' flex flex-wrap justify-between items-center '>
                                                            <div>
                                                                 <h2 className="text-2xl font-semibold">Discount Name: {discount.discountName}</h2>
                                                                 <p className="text-lg">Description: {discount.couponDescription}</p>
                                                                 <p className="text-lg">Discount: {discount.discountPercentage}%</p>
                                                                 <p className="text-lg">
                                                                      Products: {discount.productName && discount.productName.length > 0 ? discount.productName.join(', ') : 'N/A'}
                                                                 </p>
                                                                 <p className="text-lg">Coupon Code: {discount.couponCode}</p>
                                                                 <p className="text-lg">
                                                                      Groups: {discount.groupName && discount.groupName.length > 0 ? discount.groupName.join(', ') : 'N/A'}
                                                                 </p>
                                                                 <p className="text-lg">Start Date: {new Date(discount.startDate).toLocaleDateString()}</p>
                                                                 <p className="text-lg">End Date: {new Date(discount.endDate).toLocaleDateString()}</p>
                                                            </div>
                                                            <img src={`http://localhost:5000/${discount.imagePath}`} alt={discount.discountName} className="w-36 h-36" />

                                                       </div>
                                                       <div className="flex flex-row gap-2">
                                                            <Link
                                                                 to={`/discount?id=${discount._id}`}
                                                                 className="px-4 py-2 flex justify-center  bg-blue-500 text-white rounded hover:bg-blue-600"
                                                            >
                                                                 Edit
                                                            </Link>
                                                            <button
                                                                 onClick={() => handleDelete(discount._id)}
                                                                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                            >
                                                                 Delete
                                                            </button>
                                                       </div>
                                                  </div>
                                             </li>
                                        ))}
                                   </ul>
                              ) : (
                                   <p className="text-center">No discounts available.</p>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
}
