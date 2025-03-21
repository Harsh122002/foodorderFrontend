import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "./context/CartContext";
import { UserContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
     const { addToCart } = useContext(CartContext);
     const { userDetail } = useContext(UserContext);
     console.log(userDetail);

     const [groups, setGroups] = useState([]);
     const [selectedGroup, setSelectedGroup] = useState(null);
     const [quantities, setQuantities] = useState([]);
     const [products, setProducts] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
     const [discounts, setDiscount] = useState([]);
     const [totalPages, setTotalPages] = useState(0);
     const navigate = useNavigate();
     discounts.forEach(discount => {
          console.log(`${process.env.REACT_APP_API_BASE_URL_IMAGE}/${discount.imagePath || "back.png"}`);
     });

     useEffect(() => {
          if (userDetail?.role && userDetail.role === 'admin') {
               navigate("/login");
          }
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

          fetchGroups();
          fetchDiscount();
     }, []);



     useEffect(() => {
          fetchProducts();
     }, [currentPage]);

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

     const paginate = (pageNumber) => setCurrentPage(pageNumber);

     const handleAddToCart = (index) => {
          const product = products[index];
          const qty = quantities[index];
          if (!userDetail) {
               alert("Please Login to add product to cart");
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
               setTotalPages(0);
               setSelectedGroup(groupId);
               setQuantities(Array(response.data.length).fill(0));
          } catch (error) {
               console.error("Error fetching products by group:", error);
          }
     };

     const fetchProducts = async () => {
          try {
               const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/getAllProduct/${currentPage}`
               );
               setProducts(response.data.products);
               setTotalPages(response.data.totalPages);
               setQuantities(new Array(response.data.products.length).fill(0));
          } catch (error) {
               console.error("Error fetching products:", error);
          }
     };

     const resetProducts = async () => {
          fetchProducts();
          setSelectedGroup(null);
     };

     const fetchDiscount = async () => {
          try {
               const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/allDiscount`
               );
               setDiscount(response.data);
          } catch (error) {
               console.error("Error fetching discount:", error);
          }
     }

     return (
          <div className="pt-32 w-full bg-[#c4b4a5] ">
               <div className="max-w-[90%] mx-auto  bg-[#c4b4a5] rounded-md flex flex-col gap-8">
                    <img
                         src="../Group.png"
                         alt="Group 1"
                         className="w-full rounded-lg  h-96 mx-4 my-4 "
                    />
                    {discounts.length > 0 && (
                         <>
                              {/* Section Title */}
                              <h1 className="relative text-2xl pl-4 pb-1 font-medium group bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-violet-500">
                                   Discount
                                   <span className="absolute left-4 bottom-0 w-0 h-1 rounded-md bg-gradient-to-r from-gray-600 to-violet-500 transition-all duration-300 group-hover:w-16"></span>
                              </h1>

                              {/* Discount Cards */}
                              <div className="flex flex-row h-96 px-5 overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                   {discounts.map((discount, index) => {
                                        const currentDate = new Date();
                                        const endDate = new Date(discount.endDate);

                                        if (endDate >= currentDate) {
                                             return (
                                                  <div
                                                       key={index}
                                                       className="w-full rounded-lg overflow-hidden shadow-lg text-white relative"
                                                  >
                                                       <img
                                                            src={`${process.env.REACT_APP_API_BASE_URL_IMAGE}/${discount.imagePath || "back.png"}`}
                                                            alt=""
                                                            className="w-full h-[26rem]"
                                                       />
                                                       <div className="absolute top-5 left-2 flex flex-col gap-5 w-[95%] text-[#343a40]">
                                                            <p className="capitalize text-end">
                                                                 <span className="bg-white/50 px-2 py-2 rounded-md text-4xl backdrop: font-bold">
                                                                      {discount.discountName}
                                                                 </span>
                                                            </p>
                                                            <p className="w-48">
                                                                 <span className="bg-white/50 rounded-md px-1 py-1 font-medium flex flex-col gap-1">
                                                                      <span className="text-xl font-bold">Product:</span>
                                                                      {discount.productName.map((val, index) => (
                                                                           <span key={index} className="text-center">{val}</span>
                                                                      ))}
                                                                 </span>
                                                            </p>
                                                            <p className="text-center">
                                                                 <span className="bg-white/50 px-2 py-2 rounded-md text-xl font-bold">
                                                                      Coupon Code: {discount.couponCode}
                                                                 </span>
                                                            </p>
                                                            <p className="mt-5">
                                                                 <span className="bg-white/50 px-2 py-2 rounded-md">
                                                                      Start Date: {new Date(discount.startDate).toLocaleDateString()}
                                                                 </span>
                                                            </p>
                                                            <p className="mt-5">
                                                                 <span className="bg-white/50 px-2 py-2 rounded-md">
                                                                      End Date: {new Date(discount.endDate).toLocaleDateString()}
                                                                 </span>
                                                            </p>
                                                       </div>
                                                  </div>
                                             );
                                        }
                                        return null;
                                   })}
                              </div>

                         </>
                    )}





                    <h1 className="relative  text-2xl pl-4 pb-1 font-medium group bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-violet-500">
                         Select Categories
                         <span className="absolute   left-4 bottom-0 w-0 h-1 rounded-md bg-gradient-to-r from-gray-600 to-violet-500 transition-all duration-300 group-hover:w-32"></span>
                    </h1>

                    <div className="flex flex-row overflow-auto justify-evenly">
                         <div className="mb-2 inline-block">
                              <button
                                   className={`w-16 h-16 bg-white rounded-full overflow-hidden shadow-lg mx-auto mb-2 flex items-center justify-center ${selectedGroup === null ? "border-2 border-blue-500" : ""
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
                              <div className="text-lg capitalize text-[#343a40] font-medium text-center">All</div>
                         </div>
                         {groups.map((group, groupIndex) => (
                              <div key={groupIndex} className="mb-2 ">
                                   <button
                                        className={`w-16 h-16 bg-white cursor-pointer rounded-full overflow-hidden shadow-lg mx-auto mb-2 flex items-center justify-center ${selectedGroup === group._id
                                             ? "bg-gray-200 border-2 border-blue-500"
                                             : ""
                                             }`}
                                        onClick={() => fetchProductsByGroup(group._id)}
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
                                   <div className="text-lg capitalize text-[#343a40] font-medium text-center">
                                        {group.groupName}
                                   </div>
                              </div>
                         ))}
                    </div>
                    <h1 className="relative mb-5 text-2xl pl-4 font-medium group bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-violet-500">
                         Select Products
                         <span className="absolute   left-4 bottom-0 w-0 h-1 rounded-md bg-gradient-to-r from-gray-600 to-violet-500 transition-all duration-300 group-hover:w-32"></span>
                    </h1>
                    <div className="flex flex-wrap">
                         {Array.isArray(products) &&
                              products.map((product, index) => (
                                   <div
                                        key={index}
                                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 mx-auto "
                                   >
                                        <div className="w-60 h-60 rounded overflow-hidden text-white shadow-lg bg-[#a19182] mx-auto">
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
                                                  <span className="mx-2 ">{quantities[index]}</span>
                                                  <button
                                                       onClick={() => incrementQty(index)}
                                                       className="bg-green-500 text-white px-2 py-1 rounded"
                                                  >
                                                       +
                                                  </button>
                                                  <button
                                                       onClick={() => handleAddToCart(index)}
                                                       className="bg-blue-500 text-white px-4 py-2 rounded ml-10 hover:bg-blue-700 hover:translate-y-1 hover:shadow-lg hover:shadow-blue-500/50 transition"
                                                       disabled={quantities[index] === 0}
                                                  >
                                                       Add to Cart
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              ))}
                    </div>
                    <div className="w-full flex justify-center mt-4 mb-4">
                         <nav>
                              <ul className="flex space-x-2">
                                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                        <li key={number}>
                                             <button
                                                  onClick={() => paginate(number)}
                                                  className={`px-4 py-2 border rounded ${currentPage === number
                                                       ? "bg-blue-500 text-white"
                                                       : "bg-gray-300"
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
          </div>
     );
}
