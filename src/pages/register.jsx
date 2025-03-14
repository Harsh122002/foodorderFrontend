import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!showOtpField) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/register`,
          {
            name,
            email,
            password,
            mobile,
          }
        );
        alert(response.data.msg || "Otp Sent In Email");
        setShowOtpField(true);
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/verify-otp`,
          {
            email,
            otp,
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c4b4a5]">
      <div className="bg-[#a19182] text-white p-8 rounded-lg shadow-lg w-full max-w-md mt-36  mb-20">
        <h2 className="text-3xl text-[#343a40] font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} method="post">
          {!showOtpField ? (
            <>
              <div className="mb-4 ">
                <label htmlFor="name" className="block">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  placeholder="Full Name"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[A-Za-z\s]*$/.test(value)) {
                      setName(value);
                    }
                  }}
                  className="w-full px-3 placeholder:text-white py-2 bg-[#a19182] border border-gray-300 rounded-lg focus:ring-[#343a40]"
                  required
                />
                {name.trim().length > 0 &&
                  !/^[A-Za-z]*\s[a-z]*$/.test(name.trim()) && (
                    <p className="text-red-500 text-sm mt-1">
                      Name must start with a capital letter and contain only
                      alphabets with a single space.
                    </p>
                  )}
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block ">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}

                placeholder="Enter Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 placeholder:text-white bg-[#a19182] border border-gray-300 rounded-lg focus:ring-[#343a40]"
                  required
                />
                {email.length > 0 &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                    <p className="text-red-500 text-sm mt-1">
                      Please enter a valid email address.
                    </p>
                  )}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block ">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 placeholder:text-white bg-[#a19182] border border-gray-300 rounded-lg focus:ring-[#343a40]"
                  minLength={6}
                  required
                />
                {password.length > 0 && password.length < 6 && (
                  <p className="text-red-500 text-sm mt-1">
                    Password must be at least 6 characters long.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="mobile" className="block ">
                  Mobile
                </label>
                <input
                  id="mobile"
                  type="text"
                  value={mobile}
                  placeholder="Mobile Number"
                  onChange={(e) => {
                    const value = e.target.value;
                    
                    if (/^\d*$/.test(value)) {
                      setMobile(value); 
                    }
                  }}
                  className="w-full px-3 py-2 placeholder:text-white bg-[#a19182] border border-gray-300 rounded-lg focus:ring-[#343a40]"
                  maxLength={10} 
                  required
                />
                {mobile.length > 0 && mobile.length !== 10 && (
                  <p className="text-red-500 text-sm mt-1">
                    Mobile number must be exactly 10 digits.
                  </p>
                )}
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
                    value={otp}
                    placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-white placeholder:text-white bg-[#a19182]  px-3 py-2 border border-gray-300 rounded-lg  focus:ring-[#343a40]"
                  required
                />
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
