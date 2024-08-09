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
import Success from "./pages/success";
import { OrderProvider } from "./pages/OrderContext";
import { UserProvider } from "./pages/UserContext";
import Profile from "./pages/profile";
import About from "./pages/about";
import OrderStatus from "./pages/orderStatus";
import ProductManage from "./pages/productManage";
import ProductManagementPage from "./pages/pending";
import Running from "./pages/running";
import Complete from "./pages/complete";
import Declined from "./pages/decliened";
import AllGroups from "./pages/allGroups";
import AllProducts from "./pages/allProducts";
import RegisteredUsers from "./pages/registeredUsers";

function App() {
  return (
    <Router>
      <CartProvider>
        <TotalAmountProvider>
          <OrderProvider>
            <UserProvider>
              <AppContent />
            </UserProvider>
          </OrderProvider>
        </TotalAmountProvider>
      </CartProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Define routes where the header and footer should not be shown
  const noHeaderFooterRoutes = [
    "/admin",
    "/adminDashBoard",
    "/productManage",
    "/addProduct",
    "/addGroup",
    "/pending",
    "/running",
    "/complete",
    "/declined",
    "/allGroups",
    "/registeredUsers",
    "/allProducts",
  ];

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
        <Route path="/allGroups" element={<AllGroups />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Success" element={<Success />} />
        <Route path="/about" element={<About />} />
        <Route path="/orderStatus" element={<OrderStatus />} />
        <Route path="/productManage" element={<ProductManage />} />
        <Route path="/pending" element={<ProductManagementPage />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="/allProducts" element={<AllProducts />} />
        <Route path="/registeredUsers" element={<RegisteredUsers />} />
        <Route path="/declined" element={<Declined />} />
        <Route path="/running" element={<Running />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />{" "}
        {/* Default to dashboard */}
      </Routes>
      {/* Conditionally render the footer */}
      {!noHeaderFooterRoutes.includes(location.pathname) && <FooterFunction />}
    </div>
  );
}

export default App;
