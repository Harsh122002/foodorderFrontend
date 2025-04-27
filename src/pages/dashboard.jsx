import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "./context/CartContext";
import { UserContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ImageSlider from "./imageSlider";
import Alert from "./alert";

export default function Dashboard() {
     const { addToCart } = useContext(CartContext);
     const { userDetail } = useContext(UserContext);
     console.log(userDetail);

     const [groups, setGroups] = useState([]);
     const[alertMessage, setAlertMessage] = useState(null);
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
          // Check user role and navigate accordingly
          if (userDetail?.role === "admin") {
            navigate("/adminDashboard");
          } else if (userDetail?.role === "delivery") {
            navigate("/boyDashBoard");
          }
      
          // Fetch groups data
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
        }, [userDetail, navigate, setGroups]);



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

     const handleAlert = (message) => {
          setAlertMessage(message);
          setTimeout(() => {
               setAlertMessage(null);
          },5000); // hide alert after 5 seconds
     };

     const handleAddToCart = (index) => {
          const product = products[index];
          const qty = quantities[index];
          if (!userDetail) {
               handleAlert("Please Login to add product to cart");
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
               handleAlert(`Added ${qty} ${product.productName}(s) to cart!`);
          }
     };
     console.log("alertMessage: ", alertMessage);
     

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
        
            const currentDate = new Date();
            const filteredDiscounts = response.data.filter((discount) => {
              return new Date(discount.endDate) >= currentDate;
            });
        
            setDiscount(filteredDiscounts);
          } catch (error) {
            console.error("Error fetching discount:", error);
          }
        };
     const [currentIndex, setCurrentIndex] = useState(0);
     const nextSlide = () => {
          setCurrentIndex((prev) => {
               console.log("Next Slide: ", (prev + 1) % discounts.length);
               return (prev + 1) % discounts.length;
          });
     };

     const prevSlide = () => {
          setCurrentIndex((prev) => {
               console.log("Previous Slide: ", (prev - 1 + discounts.length) % discounts.length);
               return (prev - 1 + discounts.length) % discounts.length;
          });
     };


     return (
          <div className="pt-32 w-full bg-[#c4b4a5] relative ">
               <div className="max-w-[90%] mx-auto  bg-[#c4b4a5] rounded-md flex flex-col gap-8">
                    {alertMessage && (

                         <Alert message={alertMessage}  />
                    )}
                    {/* <div className="relative w-full">
                         <img
                              src="../Group.png"
                              alt="Group 1"
                              className="w-full rounded-lg h-[32rem] mx-4 my-4 z-0"
                         />
                         <p className="absolute top-10 left-10 capitalize z-10 max-w-96 text-[#2dd343] font-bold bg-black/30 px-4 py-2 text-3xl rounded-md">
                              Quality food delivery by HR Food
                         </p>
                         <p className="absolute bottom-10 left-10 capitalize z-10 max-w-96 text-[#343a40] font-bold bg-white/30 px-4 py-2 text-lg rounded-md">
                             - Since-2016
                         </p>
                         <p className="absolute bottom-10 right-10 capitalize z-10 max-w-96 text-[#343a40] font-bold bg-black/20 px-4 py-2 text-xl rounded-md">
                             - Manage by:HR GROUP
                         </p>
                    </div> */}
                    <ImageSlider/>

                    {discounts.length > 0 && (
                         <>
                              {/* Section Title */}
                              <h1 className="relative text-2xl pl-4 pb-1 font-medium group bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-violet-500">
                                   Discount
                                   <span className="absolute left-4 bottom-0 w-0 h-1 rounded-md bg-gradient-to-r from-gray-600 to-violet-500 transition-all duration-300 group-hover:w-16"></span>
                              </h1>

                              {/* Discount Cards */}
                              <div className="relative  m-auto lg:ml-7 w-full h-[32rem] overflow-hidden">
                                   <AnimatePresence>
                                        <motion.div
                                             key={currentIndex}
                                             initial={{ opacity: 0, x: 100 }}
                                             animate={{ opacity: 1, x: 0 }}
                                             exit={{ opacity: 0, x: -100 }}
                                             transition={{ duration: 0.5 }}
                                             className="absolute w-full h-full"
                                        >
                                             <img
                                                  src={`${process.env.REACT_APP_API_BASE_URL_IMAGE}/${discounts[currentIndex]?.imagePath || "back.png"}`}
                                                  alt=""
                                                  className="w-full h-full"
                                             />
                                             <div className="absolute top-5 left-2 flex flex-col gap-5 w-[95%] text-white">
                                                  <p className="capitalize text-end">
                                                       <span className="bg-black/80 px-2 py-2 rounded-md text-4xl backdrop: font-bold">
                                                            {discounts[currentIndex]?.discountName}
                                                       </span>
                                                  </p>
                                                  <p className="w-48">
                                                       <span className="bg-black/80 rounded-md px-1 py-1 font-medium flex flex-col gap-1">
                                                            <span className="text-xl font-bold">Product:</span>
                                                            {discounts[currentIndex]?.productName.map((val, index) => (
                                                                 <span key={index} className="text-center">{val}</span>
                                                            ))}
                                                       </span>
                                                  </p>
                                                  <p className="text-center mt-5 ">
                                                       <span className="bg-black/80 px-2 py-2 rounded-md text-xl font-bold">
                                                            Coupon Code: {discounts[currentIndex]?.couponCode}
                                                       </span>
                                                  </p>
                                                  <p className="text-center mt-5">
                                                       <span className="bg-black/80 px-2 py-2 rounded-md text-xl font-bold">
                                                            Discount: {discounts[currentIndex]?.discountPercentage}%
                                                       </span>
                                                  </p>
                                                  <p className="mt-3">
                                                       <span className="bg-black/80 px-2 py-2 rounded-md">
                                                            Start Date: {new Date(discounts[currentIndex]?.startDate).toLocaleDateString()}
                                                       </span>
                                                  </p>
                                                  <p className="mt-3">
                                                       <span className="bg-black/80 px-2 py-2 rounded-md">
                                                            End Date: {new Date(discounts[currentIndex]?.endDate).toLocaleDateString()}
                                                       </span>
                                                  </p>
                                                  <p className="mt-3">
                                                       <span className="bg-black/80 px-2 text-base py-2 rounded-md">
                                                            Note: {(discounts[currentIndex]?.couponDescription)}
                                                       </span>
                                                  </p>
                                             </div>
                                        </motion.div>
                                   </AnimatePresence>

                                   {/* Navigation Buttons */}
                                   {discounts.length > 1 && (
                                        <>
                                             <button
                                                  onClick={prevSlide}
                                                  className="absolute top-1/2  left-5 transform -translate-y-1/2 text-white text-3xl bg-gray-800/50 p-2 rounded-full"
                                             >
                                                  ❮
                                             </button>
                                             <button
                                                  onClick={nextSlide}
                                                  className="absolute top-1/2 right-5 transform -translate-y-1/2 text-white text-3xl bg-gray-800/50 p-2 rounded-full"
                                             >
                                                  ❯
                                             </button>
                                        </>
                                   )}

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
