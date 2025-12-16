import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthenticatedLayout from "./AuthenticatedLayout";

// this page's work is check if there is access token aur not, after login, but before landing on Main page
const Protectedroute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
    const sessionToken = localStorage.getItem('sessionToken');
    
    // Allow access if user has either accessToken (logged in) or sessionToken (guest)
    if(!accessToken && !sessionToken){
    return <Navigate to="/login" />;
  }
  // if (accessToken) {
  //   return <Navigate to="/" />;   // if we do it here then  it willl only navigate , it can't access children
  // }
  return (
    <div>
      {/* <Outlet /> here outlet is homepage for protected page */}
      <AuthenticatedLayout>
      {children}
      </AuthenticatedLayout>
      {/* it is the property through which we can access the inner child of protected routes */}
    </div>
  );
};

export default Protectedroute;
