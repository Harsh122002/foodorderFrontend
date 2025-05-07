import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import Loader from "./loader";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from "./context/UserContext";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const hasAutoLoggedIn = useRef(false);
  const { userDetail } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetail?.status === "online" && userDetail.role === "user") {
      navigate("/");
    }
  }, [userDetail, navigate]);

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000); // hide alert after 5 seconds
  };

  const autoLogin = async (email, password) => {
    try {
      const tokens = localStorage.getItem("token");
      if (tokens) {
        alert("You are already logged in.");
        navigate("/login")
        return;
      }
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        { email, password }
      );

      const token = res.data.token;
      const userId = res.data.userId;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        const tokenExpiration = new Date();
        tokenExpiration.setHours(tokenExpiration.getHours() + 1);
        localStorage.setItem("tokenExpiration", tokenExpiration);

        sessionStorage.setItem("token", token);
        window.location.href = "/dashboard";
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      if (error.response) {
        showAlert(`Error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        showAlert("Error: No response from server. Please try again later.");
      } else {
        showAlert("Error: " + error.message);
      }
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get("email");
    const passwordParam = urlParams.get("password");

    if (emailParam && passwordParam && !hasAutoLoggedIn.current) {
      hasAutoLoggedIn.current = true;
      autoLogin(emailParam, passwordParam);
    }
  }, []);

  const handleGitHubLogin = () => {
    if (isLoading) return;
    setIsLoading(true);
    const redirectUri = `${process.env.REACT_APP_API_BASE_URL}/auth/github/callback`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23liApTdOCEb50m4j1&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=user:email`;
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const displayName = result.user.displayName;
      const email = result.user.email;

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/googleRegister`,
        { name: displayName, email: email }
      );

      if (res.data) {
        const email = res.data.data;
        const password = "GoogleUser"; // default password for Google users
        window.location.href = `/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        showAlert(`Error: ${error.response.data.msg || error.response.statusText}`);
      } else if (error.request) {
        showAlert("Error: No response from server. Please try again later.");
      } else {
        showAlert("Error: " + error.message);
      }
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      autoLogin(values.email, values.password);
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex bg-[#c4b4a5] items-center justify-center">
      <div className="p-8 rounded-lg bg-[#a19182] shadow-lg sm:w-full md:w-96 mt-20">
        {alertMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {alertMessage}
          </div>
        )}
        <h2 className="text-3xl font-bold mb-6 text-[#343a40] text-center">Login</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4 text-white">
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className="w-full px-3 py-2 border-2 border-white bg-[#a19182] rounded-lg focus:ring-[#343a40]"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps('password')}
              className="w-full px-3 py-2 rounded-lg border-2 border-white bg-[#a19182] focus:ring-[#343a40]"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 border-2 w-full border-blue-500 text-white text-sm lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-md hover:bg-white hover:text-blue-500 duration-500 ease-in-out"
          >
            Login
          </button>
          <div className="sm:flex-auto md:flex lg:flex justify-between mt-2">
            <Link to="/resetpassword" className="text-sm text-indigo-900 hover:underline block sm:inline-block mb-2 sm:mb-0">
              Resend Password
            </Link>
            <Link to="/register" className="text-sm text-indigo-900 hover:underline block sm:inline-block mb-2 sm:mb-0">
              Register
            </Link>
          </div>
        </form>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleGoogleLogin}
            className="text-white px-4 bg-[#9d836a] flex items-center py-2 rounded-lg hover:bg-gray-700 transition duration-200"
            disabled={isLoading}
          >
            <FcGoogle className="w-6 h-6 mr-2" /> Google
          </button>
          &nbsp;&nbsp;
          <button
            onClick={handleGitHubLogin}
            className="text-white px-4 bg-black flex items-center py-2 rounded-lg hover:bg-gray-700 transition duration-200"
            disabled={isLoading}
          >
            <FaGithub className="w-6 h-6 mr-2" /> GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
