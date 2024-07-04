import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          "http://localhost:5000/api/auth/getUserDetail",
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("User details fetched successfully:", response.data);
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

  return (
    <UserContext.Provider value={{ userDetail, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};