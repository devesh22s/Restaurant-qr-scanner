import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// this page's work is check if there is access token aur not, after login, but before landing on Main page
const Protectedroute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return <Navigate to="/login" />;
  }
  // if (accessToken) {
  //   return <Navigate to="/" />;   // if we do it here then  it willl only navigate , it can't access children
  // }
  return (
    <div>
      {/* <Outlet /> here outlet is homepage for protected page */}
      {children}
      {/* it is the property through which we can access the inner child of protected routes */}
    </div>
  );
};

export default Protectedroute;
