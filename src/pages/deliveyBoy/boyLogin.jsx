import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_BASE_URL);

export default function BoyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userDetail } = useContext(UserContext);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetail?.status === "online" && userDetail.role === "delivery") {
      navigate("/boyDashBoard");
    }
  }, [userDetail, navigate]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token= localStorage.getItem("token");
    if (token) {
      alert("You are already logged in.");
      navigate("/boyLogin");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/boyLogin`,
        {
          email,
          password,
          role: "delivery",
          latitude: location.latitude,
          longitude: location.longitude,
        }
      );

      // alert(res.data.msg || "Login Successfully");

      const token = res.data.token;
      const userId = res.data.userId;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        const tokenExpiration = new Date();
        tokenExpiration.setHours(tokenExpiration.getHours() + 1);
        localStorage.setItem("tokenExpiration", tokenExpiration);

        sessionStorage.setItem("token", token);
        window.location.href = "/boyDashBoard";
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        alert(`Error: ${error.response.data.msg || error.response.statusText}`);
      } else if (error.request) {
        alert("Error: No response from server. Please try again later.");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:5000"); // or your backend URL

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    
      const userId = localStorage.getItem("userId");
    
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
    
            socket.emit("updateLocation", { userId, latitude, longitude });
            console.log("Sent location to backend:", latitude, longitude);
          },
          (error) => {
            console.error("Error getting location", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    });
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-[#c4b4a5]">
      <div className=" p-8 rounded-lg shadow-lg w-full max-w-md bg-[#af9b88] text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Delivery Boy Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 ">
            <label htmlFor="email" className="block text-gray-700">Email</label>
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
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 border-2 w-full border-blue-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-white hover:text-blue-500 duration-500 ease-in-out"
          >
            Login
          </button>
          <div className="flex justify-between mt-4">
            <Link to="/lbResetPassword" className="underline hover:text-indigo-500">
              Resend Password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
