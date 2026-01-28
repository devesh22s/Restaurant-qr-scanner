import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";

// Components & Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import FindYourAccount from "./pages/FindYourAccount";

// Main App Pages (Customer)
import Home from "./Component/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTables from "./pages/admin/AdminTables";
import AdminCoupons from "./pages/admin/AdminCoupons";
// import AdminMenu from "./pages/admin/AdminMenu"; // Jab bana lo tab uncomment karna

// Layouts & Wrappers
import Protectedroute from "./Component/Protectedroute";
import OpenRoutes from "./Component/OpenRoutes";
import AuthenticatedLayout from "./Component/AuthenticatedLayout"; // Customer Layout
import AdminLayout from "./Component/AdminLayout"; // Admin Layout
import AdminMenu from "./pages/admin/AdminMenu";
import AdminOrders from "./pages/admin/AdminOrders";
import SendOtp from "./pages/SendOtp";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          
          {/* =========================================
              1. PUBLIC / GUEST ROUTES
          ========================================= */}
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          
          <Route
            path="/register"
            element={
              <OpenRoutes>
                <Register />
              </OpenRoutes>
            }
          />
          <Route
            path="/login"
            element={
              <OpenRoutes>
                <Login />
              </OpenRoutes>
            }
          />
          <Route
            path="/recovery"
            element={
              <OpenRoutes>
                <FindYourAccount />
              </OpenRoutes>
            }
          />

          <Route path="/send-otp" element={<SendOtp />} />
          <Route path="/verify-otp" element={<ResetPassword />} />

          {/* =========================================
              2. CUSTOMER ROUTES (Header + Footer)
          ========================================= */}
          {/* Ye saare pages AuthenticatedLayout ke andar khulenge */}
          <Route element={<AuthenticatedLayout />}>
            
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/menu" element={<Home />} />
          </Route>

          {/* =========================================
              3. ADMIN ROUTES (Sidebar Layout)
          ========================================= */}
         {/* ✅ ADMIN ROUTES (Protected + AdminLayout) */}
<Route 
  path="/admin" 
  element={
    <Protectedroute adminOnly={true}>
      <AdminLayout /> {/* Sidebar wala layout */}
    </Protectedroute>
  }
>
  <Route index element={<Navigate to="dashboard" replace />} /> {/* Auto /admin -> /admin/dashboard */}
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="tables" element={<AdminTables />} />
  <Route path="coupons" element={<AdminCoupons />} />
  <Route path="menu" element={<AdminMenu />} />
  <Route path="orders" element={<AdminOrders />} />
</Route>

        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;