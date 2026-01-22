import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Protectedroute = ({ children, adminOnly = false }) => {
  // 1. Redux aur LocalStorage se data lo
  const { role } = useSelector((state) => state.auth);
  const token = localStorage.getItem('accessToken');
  const storedRole = localStorage.getItem('role');

  // Priority: Redux role > LocalStorage role
  const currentRole = role || storedRole;

  // 2. Token Check: Agar login nahi hai, to Login page par bhejo
  if (!token) {
    // Guest logic (agar session token allow karna hai to yahan check kar sakte ho)
    // Lekin Admin route ke liye strict login chahiye
    return <Navigate to="/login" replace />;
  }

  // 3. Admin Security Check: 
  // Agar route "Admin Only" hai, lekin user "Admin" nahi hai -> Home par bhejo
  if (adminOnly && currentRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 4. Sab sahi hai -> Jo page manga hai wo dikhao (Bina kisi Layout wrapper ke)
  // Layout wrapper ab App.js mein laga hua hai
  return children;
};

export default Protectedroute;