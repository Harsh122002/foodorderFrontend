import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [boyLogin, setBoyLogin] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        console.log("Fetching user details with token:", token);
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/getUserDetail`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDetail(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.error(
          "Error fetching user details:",
          error.response ? error.response.data : error.message
        );
        setIsLoggedIn(false);
      }
    };

    fetchUserDetail();
  }, []);

  const logout = async () => {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      console.error("User ID not found");
      return;
    }
  
    try {
      // API call to log out
      await axios.get(`${process.env.REACT_APP_API_BASE_URL}/logout/${userId}`);
  
      // Remove stored user data
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenExpiration");
      sessionStorage.removeItem("token");
  
      // Update state
      setUserDetail(null);
      setIsLoggedIn(false);
  
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <UserContext.Provider
      value={{ userDetail, isLoggedIn, logout, setUserDetail,boyLogin,setBoyLogin }}
    >
      {children}
    </UserContext.Provider>
  );
};
