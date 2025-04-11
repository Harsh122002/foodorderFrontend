import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import DeliveryHeader from './deliveryHeader';

const BoyProfile = () => {
     const { userDetail, setUserDetail } = useContext(UserContext);

     const formik = useFormik({
          initialValues: {
               name: userDetail?.name || '',
               email: userDetail?.email || '',
               mobile: userDetail?.mobile || '',
               address: userDetail?.address || '',
          },
          enableReinitialize: true,
          validationSchema: Yup.object({
               name: Yup.string()
                    .required('Name is required')
                    .matches(/^[a-zA-Z\s]*$/, 'Name must contain only letters'),
               email: Yup.string()
                    .email('Invalid email address')
                    .required('Email is required'),
               mobile: Yup.string()
                    .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
                    .required('Mobile number is required'),
               address: Yup.string().required('Address is required'),
          }),
          onSubmit: async (values, formikHelpers) => {
               formikHelpers.setSubmitting(true);
               try {
                    const token = localStorage.getItem("token");
                    console.log(token);

                    const response = await axios.put(
                         `${process.env.REACT_APP_API_BASE_URL}/updateUserDetail`,
                         values,
                         {
                              headers: {
                                   Authorization: `Bearer ${token}`,
                              },
                         }
                    );
                    alert('Profile updated successfully');
                    console.log(response.data);
                    setUserDetail(response.data);
               } catch (error) {
                    console.error('Error updating profile:', error);
                    alert('Something went wrong while updating profile');
               } finally {
                    formikHelpers.setSubmitting(false);
               }
          },
     });

     const {
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
     } = formik;

     return (
          <div className= ' min-h-lvh bg-[#c4b4a5]'>
               <DeliveryHeader />
               <div className="max-w-md mx-auto text-white p-8 pt-36 shadow-lg rounded-lg bg-[#af9b88]">
                    <h2 className="text-2xl font-semibold mb-6 text-center ">
                         Update Profile
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         {/* Name */}
                         <div>
                              <label htmlFor="name" className="block mb-1">First Name</label>
                              <input
                                   id="name"
                                   name="name"
                                   type="text"
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   value={values.name}
                                   className="w-full text-black px-4 py-2 border rounded-md"
                              />
                              {touched.name && errors.name && (
                                   <div className="text-red-600 text-sm">{errors.name}</div>
                              )}
                         </div>

                         {/* Email */}
                         <div>
                              <label htmlFor="email" className="block  mb-1">Email Address</label>
                              <input
                                   id="email"
                                   name="email"
                                   type="email"
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   value={values.email}
                                   className="w-full px-4 py-2  text-black border rounded-md"
                              />
                              {touched.email && errors.email && (
                                   <div className="text-red-600 text-sm">{errors.email}</div>
                              )}
                         </div>

                         {/* Mobile */}
                         <div>
                              <label htmlFor="mobile" className="block mb-1">Mobile Number</label>
                              <input
                                   id="mobile"
                                   name="mobile"
                                   type="text"
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   value={values.mobile}
                                   className="w-full px-4 py-2 text-black border rounded-md"
                              />
                              {touched.mobile && errors.mobile && (
                                   <div className="text-red-600 text-sm">{errors.mobile}</div>
                              )}
                         </div>

                         {/* Address */}
                         <div>
                              <label htmlFor="address" className="block  mb-1">Address</label>
                              <input
                                   id="address"
                                   name="address"
                                   type="text"
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   value={values.address}
                                   className="w-full px-4 py-2 border text-black rounded-md"
                              />
                              {touched.address && errors.address && (
                                   <div className="text-red-600 text-sm">{errors.address}</div>
                              )}
                         </div>

                         {/* Submit */}
                         <div className="text-center">
                              <button
                                   type="submit"
                                   disabled={isSubmitting}
                                   className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                              >
                                   {isSubmitting ? 'Updating...' : 'Update Profile'}
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
};

export default BoyProfile;
