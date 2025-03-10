import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import Loader from "./loader";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasAutoLoggedIn = useRef(false);

  const autoLogin = async (email, password) => {
    try {
      setIsLoading(true)
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        { email, password }
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
        window.location.href = "/dashboard";
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)

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
        {
          name: displayName,
          email: email,
        }
      );

      if (res.data) {
        const email = res.data.data;
        const password = "GoogleUser"; // You can set a default password for Google users
        console.log(email);
        window.location.href = `/login?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    autoLogin(email, password);
  };

  if (isLoading) {
    return (
      <Loader />
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg sm:w-full md:w-96 mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              minLength={6}
              required
            />
            {password.length > 0 && password.length < 6 && (
              <p className="text-red-500 text-sm mt-1">
                Password must be at least 6 characters long.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            Login
          </button>
          <div className="sm:flex-auto md:flex lg:flex justify-between">
            <a
              href="/resetpassword"
              className="text-sm text-indigo-500 hover:underline block sm:inline-block mb-2 sm:mb-0"
            >
              Resend Password
            </a>
            <a
              href="/register"
              className="text-sm text-indigo-500 hover:underline block sm:inline-block mb-2 sm:mb-0"
            >
              Register
            </a>
            {/* <a
              href="/admin"
              className="text-sm text-indigo-500 hover:underline block sm:inline-block mb-2 sm:mb-0"
            >
              Admin Login
            </a> */}
          </div>
        </form>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleGoogleLogin}
            className=" text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="50"
              height="50"
              viewBox="0 0 48 48"
            >
              <path
                fill="#fbc02d"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#e53935"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4caf50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1565c0"
                d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>{" "}
          </button>
          <button
            onClick={handleGitHubLogin}
            className=" text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="50"
              height="50"
              viewBox="0 0 30 30"
            >
              <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
            </svg>{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
