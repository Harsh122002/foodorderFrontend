import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import HeaderFunction from "./Header";
import FooterFunction from "./footer";
import ResetPassword from "./pages/resetpassword";
import AdminLogin from "./pages/admin";
import AdminDashboard from "./pages/adminDashBoard";
import AddGroup from "./pages/addGroup";
import AddProduct from "./pages/addProduct";
import { CartPage } from "./pages/CartPage";
import { CartProvider } from "./pages/CartContext";
import OrderPlace from "./pages/orderPlace";
import { TotalAmountProvider } from "./pages/TotalAmountContext";

function App() {
  return (
    <Router>
      <CartProvider>
        <TotalAmountProvider>
          <AppContent />
        </TotalAmountProvider>
      </CartProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Define routes where the header and footer should not be shown
  const noHeaderFooterRoutes = ["/admin", "/adminDashBoard"];

  return (
    <div className="App">
      {/* Conditionally render the header */}
      {!noHeaderFooterRoutes.includes(location.pathname) && <HeaderFunction />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/addGroup" element={<AddGroup />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/orderPlace" element={<OrderPlace />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />{" "}
        {/* Default to dashboard */}
      </Routes>
      {/* Conditionally render the footer */}
      {!noHeaderFooterRoutes.includes(location.pathname) && <FooterFunction />}
    </div>
  );
}

export default App;
