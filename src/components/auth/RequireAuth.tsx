import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function isTokenValid(token) {
  if (!token) return false;
  try {
    // JWT: header.payload.signature
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    // exp is in seconds
    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
}

const RequireAuth = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  if (!isTokenValid(token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default RequireAuth;
