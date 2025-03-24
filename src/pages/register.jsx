import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

function Register() {
  const [showOtpField, setShowOtpField] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[A-Za-z\s]*$/, "Name must contain only alphabets and spaces")
      .required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters long").required("Password is required"),
    mobile: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),
    otp: Yup.string().when("showOtpField", {
      is: true,
      then: Yup.string().required("OTP is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      mobile: "",
      otp: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (!showOtpField) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/register`,
            {
              name: values.name,
              email: values.email,
              password: values.password,
              mobile: values.mobile,
            }
          );
          alert(response.data.msg || "Otp Sent In Email");
          setShowOtpField(true);
        } else {
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/verify-otp`,
            {
              email: values.email,
              otp: values.otp,
            }
          );
          console.log(response.data);
          alert(
            response.data.msg ||
              "OTP verified successfully & Registered successfully"
          );

          const token = response.data.token;
          if (token) {
            localStorage.setItem("token", token);
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        alert(error.response.data.msg || "User Already Exists");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c4b4a5]">
      <div className="bg-[#a19182] text-white p-8 rounded-lg shadow-lg w-full max-w-md mt-36  mb-20">
        <h2 className="text-3xl text-[#343a40] font-bold mb-6 text-center">Register</h2>
        <form onSubmit={formik.handleSubmit} method="post">
          {!showOtpField ? (
            <>
              <div className="mb-4 ">
                <label htmlFor="name" className="block">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...formik.getFieldProps('name')}
                  placeholder="Full Name"
                  className="w-full px-3 placeholder:text-white py-2 bg-[#a19182] border border-gray-300 rounded-lg focus:ring-[#343a40]"
                  required
                />
                {formik.touched.name && formik.errors.name ? (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block ">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                  placeholder="Enter Email"
                  className="w-full px-3 py-2 placeholder:text-white bg-[#a19182] border border-gray-300 rounded-lg focus:ring-[#343a40]"
                  required
                />
                {formik.touched.email && formik.errors.email ? (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block ">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...formik.getFieldProps('password')}
                  placeholder="password"
                  className="w-full px-3 py-2 placeholder:text-white bg-[#a19182] border border-gray-300 rounded-lg focus:ring-[#343a40]"
                  minLength={6}
                  required
                />
                {formik.touched.password && formik.errors.password ? (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                ) : null}
              </div>
              <div className="mb-4">
                <label htmlFor="mobile" className="block ">
                  Mobile
                </label>
                <input
                  id="mobile"
                  type="text"
                  {...formik.getFieldProps('mobile')}
                  placeholder="Mobile Number"
                  className="w-full px-3 py-2 placeholder:text-white bg-[#a19182] border border-gray-300 rounded-lg focus:ring-[#343a40]"
                  maxLength={10} 
                  required
                />
                {formik.touched.mobile && formik.errors.mobile ? (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.mobile}</p>
                ) : null}
              </div>

              <button
                type="submit"
                className="bg-blue-500 border-2 w-full border-blue-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-white hover:text-blue-500 duration-500 ease-in-out"
                >
                Register
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="otp" className="block ">
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  {...formik.getFieldProps('otp')}
                  placeholder="Enter OTP"
                  className="w-full text-white placeholder:text-white bg-[#a19182]  px-3 py-2 border border-gray-300 rounded-lg  focus:ring-[#343a40]"
                  required
                />
                {formik.touched.otp && formik.errors.otp ? (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.otp}</p>
                ) : null}
              </div>
              <div className="mb-4">
                <p>
                  This Otp Will Expire within{" "}
                  {`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`} Minutes
                </p>
              </div>
              <button
                type="submit"
                className="bg-blue-500 border-2 w-full border-blue-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-white hover:text-blue-500 duration-500 ease-in-out"
                disabled={timeLeft <= 0}
              >
                Verify OTP
              </button>
            </>
          )}
        </form>
        {!showOtpField && (
          <div className="text-center w-full mt-4">
            <Link to="/login" className=" text-indigo-900 hover:underline">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
