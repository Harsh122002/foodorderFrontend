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
import  Dashboard  from "./pages/dashboard";
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
        <Route path="/rating" element={<Rating />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/orderPlace" element={<OrderPlace />} />
        <Route path="/orderPlace" element={<OrderPlace />} />

        <Route path="/allGroups" element={<AllGroups />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Success" element={<Success />} />
        <Route path="/about" element={<About />} />
        <Route path="/about" element={<About />} />

        <Route path="/orderStatus" element={<OrderStatus />} />
        <Route path="/productManage" element={<ProductManage />} />
        <Route path="/pending" element={<ProductManagementPage />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="/allProducts" element={<AllProducts />} />
        <Route path="/registeredUsers" element={<RegisteredUsers />} />
        <Route path="/declined" element={<Declined />} />
        <Route path="/running" element={<Running />} />
        <Route path="/rating" element={<Rating />} />
        <Route path="/deliveryBoy" element={<Delivery />} />
        <Route path="/deliveryBoyLogin" element={<BoyLogin />} />
        <Route path="/lbResetPassword" element={<LBResetPassword />} />
        <Route path="/boyDashBoard" element={<BoyDashBoard   />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />{" "}
        {/* Default to dashboard */}
      </Routes>
      {/* Conditionally render the footer */}
      {!noHeaderFooterRoutes.includes(location.pathname) && <FooterFunction />}
    </div>
  );
}

export default App;
