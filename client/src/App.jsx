import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./Component/Home";
import Register from "./pages/Register";
import Protectedroute from "./Component/Protectedroute";
import OpenRoutes from "./Component/OpenRoutes";
import Welcome from "./pages/Welcome";
import { ToastProvider } from "./context/ToastContext";
import Dashboard from "./Component/Dashboard";
import Cart from "./pages/Cart";

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/welcome/:id" element={<Welcome />} />

          <Route
            path="/"
            element={
              // required access token to get this page
              <Protectedroute>
                <Home />
              </Protectedroute>
            }
          />
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
            path="/dashboard"
            element={
             
                <Dashboard />
              
            }
          />
           <Route
            path="/cart"
            element={
              <Protectedroute>
                <Cart />
              </Protectedroute>
            }
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
