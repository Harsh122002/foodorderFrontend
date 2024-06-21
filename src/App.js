import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import Header from "./Header";
import HeaderFunction from "./Header";
import FooterFunction from "./footer";
import ResetPassword from "./pages/resetpassword";
function App() {
  return (
    <Router>
      <div className="App">
        <HeaderFunction />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} /> {/* Default to login */}
        </Routes>
        <FooterFunction />
      </div>
    </Router>
  );
}

export default App;
