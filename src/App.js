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
import Dashboard from "./pages/dashboard";
import HeaderFunction from "./Header";
import FooterFunction from "./footer";
import ResetPassword from "./pages/resetpassword";
import AdminLogin from "./pages/admin/admin";
import AdminDashboard from "./pages/admin/adminDashBoard";
import AddGroup from "./pages/admin/addGroup";
import AddProduct from "./pages/admin/addProduct";
import { CartPage } from "./pages/CartPage";
import { CartProvider } from "./pages/context/CartContext";
import OrderPlace from "./pages/orderPlace";
import { TotalAmountProvider } from "./pages/context/TotalAmountContext";
import Success from "./pages/success";
import { OrderProvider } from "./pages/context/OrderContext";
import { UserProvider } from "./pages/context/UserContext";
import Profile from "./pages/profile";
import About from "./pages/about";
import OrderStatus from "./pages/orderStatus";
import ProductManage from "./pages/admin/productManage";
import ProductManagementPage from "./pages/admin/pending";
import Running from "./pages/admin/running";
import Complete from "./pages/admin/complete";
import Declined from "./pages/admin/decliened";
import AllGroups from "./pages/admin/allGroups";
import AllProducts from "./pages/admin/allProducts";
import RegisteredUsers from "./pages/admin/registeredUsers";
import Rating from "./pages/rating";
import Delivery from "./pages/admin/delivery";
import BoyLogin from "./pages/deliveyBoy/boyLogin";
import LBResetPassword from "./pages/deliveyBoy/lbResetPassword";
import BoyDashBoard from "./pages/deliveyBoy/boyDashBoard";
import PageNot from "./pages/pageNot";
import Discount from "./pages/admin/discount";
import ShowDiscount from "./pages/admin/showDiscount";
import { ProtectedRoute, PublicRoute } from "./protect";
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
    "/deliveryBoyLogin",
    "/deliveryBoy",
    "/lbResetPassword",
    "/boyDashBoard",
    "/discount",
    "/allDiscount",
  ];

  return (
    <div className="App">
      {/* Conditionally render the header */}
      {!noHeaderFooterRoutes.includes(location.pathname) && <HeaderFunction />}
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/resetpassword"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/deliveryBoyLogin"
          element={
            <PublicRoute>
              <BoyLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
              <Dashboard />
          }
        />
        {/* admin */}
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addGroup"
          element={
            <ProtectedRoute>
              <AddGroup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addProduct"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/allDiscount"
          element={
            <ProtectedRoute>
              <ShowDiscount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discount"
          element={
            <ProtectedRoute>
              <Discount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productManage"
          element={
            <ProtectedRoute>
              <ProductManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pending"
          element={
            <ProtectedRoute>
              <ProductManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complete"
          element={
            <ProtectedRoute>
              <Complete />
            </ProtectedRoute>
          }
        />
        <Route
          path="/declined"
          element={
            <ProtectedRoute>
              <Declined />
            </ProtectedRoute>
          }
        />
        <Route
          path="/running"
          element={
            <ProtectedRoute>
              <Running />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registeredUsers"
          element={
            <ProtectedRoute>
              <RegisteredUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/allProducts"
          element={
            <ProtectedRoute>
              <AllProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/allGroups"
          element={
            <ProtectedRoute>
              <AllGroups />
            </ProtectedRoute>
          }
        />
        {/** */}
        <Route
          path="/rating"
          element={
            <ProtectedRoute>
              <Rating />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orderPlace"
          element={
            <ProtectedRoute>
              <OrderPlace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orderStatus"
          element={
            <ProtectedRoute>
              <OrderStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deliveryBoy"
          element={
            <ProtectedRoute>
              <Delivery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lbResetPassword"
          element={
            <ProtectedRoute>
              <LBResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/boyDashBoard"
          element={
            <ProtectedRoute>
              <BoyDashBoard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageNot />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />{" "}
        {/* Default to dashboard */}
      </Routes>
      {/* Conditionally render the footer */}
      {!noHeaderFooterRoutes.includes(location.pathname) && <FooterFunction />}
    </div>
  );
}

export default App;
