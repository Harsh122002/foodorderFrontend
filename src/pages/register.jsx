import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

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
          "http://localhost:5000/api/auth/register",
          {
            name,
            email,
            password,
            mobile,
          }
        );
        alert(response.data.msg || "Otp Send In Email");
        setShowOtpField(true);
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/auth/verify-otp",
          {
            email,
            otp,
          }
        );
        console.log(response.data);
        alert(
          response.data.msg ||
            "OTP verified successfully & Register successfully"
        );

        const token = response.data.token;
        if (token) {
          localStorage.setItem("token", token);
          // Redirect to login page or any other page
        }
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response.data.msg || "User Already Exist");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-36  mb-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} method="post">
          {!showOtpField ? (
            <>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="mobile" className="block text-gray-700">
                  Mobile
                </label>
                <input
                  id="mobile"
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="otp" className="block text-gray-700">
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <p>
                  This Otp Will Expire within{" "}
                  {`${minutes}:${seconds < 10 ? "0" : ""}  ${seconds} `} Minutes
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
                disabled={timeLeft <= 0}
              >
                Verify OTP
              </button>
            </>
          )}
        </form>
        {!showOtpField && (
          <div className="text-center w-full mt-4">
            <Link to="/login" className="underline hover:text-indigo-500">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
