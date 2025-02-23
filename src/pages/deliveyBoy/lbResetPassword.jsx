import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LBResetPassword() {
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      if (!showOtp) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/request-password-reset`,
          {
            email,
          }
        );
        alert(response.data.msg || "OTP sent to your email");
        setShowOtp(true);
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/verify-password`,
          {
            email,
            otp,
            newPassword,
          }
        );
        console.log(response.data); // Debugging
        alert(response.data.msg || "Password updated successfully");

        const token = response.data.token;
        if (token) {
          localStorage.setItem("token", token);
          // Redirect to login page or any other page
        }
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md ">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleRequest}>
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
            {email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid email address.
              </p>
            )}
          </div>

          {showOtp && (
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

              <p className="text-2px text-gray-600">
                OTP will expire in 10 minutes
              </p>
              <br />
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  minLength={6}
                  required
                />
                {newPassword.length > 0 && newPassword.length < 6 && (
                  <p className="text-red-500 text-sm mt-1">
                    Password must be at least 6 characters long.
                  </p>
                )}
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            {showOtp ? "Submit" : "Send OTP"}
          </button>
          <div className="text-center w-full mt-4">
            <Link to="/admin" className="underline hover:text-indigo-500">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
