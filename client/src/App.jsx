import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";

// Components & Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import FindYourAccount from "./pages/FindYourAccount";
import Dashboard from "./Component/Dashboard";

// Main App Pages
import Home from "./Component/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

// Layouts & Wrappers
import Protectedroute from "./Component/Protectedroute";
import OpenRoutes from "./Component/OpenRoutes";
import AuthenticatedLayout from "./Component/AuthenticatedLayout";
import Orders from "./pages/Orders";

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* --- GUEST / ONBOARDING ROUTES --- */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/welcome/:id" element={<Welcome />} />

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

          {/* --- MAIN APP ROUTES (With Header/Layout) --- */}

          {/* HOME: AuthenticatedLayout use kiya taaki Guest bhi Menu dekh sake */}
          <Route
            path="/"
            element={
              <AuthenticatedLayout>
                <Home />
              </AuthenticatedLayout>
            }
          />

          {/* CART: Accessible to Everyone */}
          <Route
            path="/cart"
            element={
              <AuthenticatedLayout>
                <Cart />
              </AuthenticatedLayout>
            }
          />

          {/* CHECKOUT: Payment Page (New) */}
          <Route
            path="/checkout"
            element={
              <AuthenticatedLayout>
                <Checkout />
              </AuthenticatedLayout>
            }
          />

          {/* SUCCESS PAGE (New) */}
          <Route
            path="/order-success"
            element={
              <AuthenticatedLayout>
                <OrderSuccess />
              </AuthenticatedLayout>
            }
          />
          {/* orders page */}
          <Route
            path="/orders"
            element={
              <AuthenticatedLayout>
                <Orders />
              </AuthenticatedLayout>
            }
          />

          {/* --- ADMIN / PROTECTED ROUTES --- */}
          <Route
            path="/dashboard"
            element={
              <Protectedroute>
                <Dashboard />
              </Protectedroute>
            }
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
