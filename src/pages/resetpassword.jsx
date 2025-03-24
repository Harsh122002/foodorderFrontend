import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
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
    <div className="min-h-screen flex items-center justify-center bg-[#c4b4a5]">
      <div className=" p-8 rounded-lg shadow-lg w-full max-w-md bg-[#a19182] mt-32">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#343a40]">Reset Password</h2>
        <form onSubmit={handleRequest}>
          <div className="mb-4 text-white">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#a19182] border border-gray-300 rounded-lg focus:ring-[#343a40]"
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
                  className="w-full px-3 bg-[#a19182] py-2 border border-gray-300 rounded-lg focus:ring-[#343a40]"
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
                  className="w-full px-3 py-2 border bg-[#a19182] border-gray-300 rounded-lg focus:ring-[#343a40]"
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
            className="bg-blue-500 border-2 w-full border-blue-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-white hover:text-blue-500 duration-500 ease-in-out"
          >
            {showOtp ? "Submit" : "Send OTP"}
          </button>
          <div className="text-center w-full mt-4">
            <a href="/login" className="underline hover:text-indigo-500">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
