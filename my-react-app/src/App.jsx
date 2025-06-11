import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import initialTheme from "./theme/theme";

import AuthForm from "./Pages/AuthForm";
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";
import RTLLayout from "./layouts/rtl";
import MenuCover from "./Pages/MenuCover";
import MainMenu from "./Pages/Main-Menu";
import OnlineMenu from "./Pages/OnlineMenu";
import ProfilePage from "./Pages/ProfilePage";
import CheckOutPage from "./Pages/CheckoutPage";
import PaymentPage from "./Pages/PaymentPage";
import axiosInstance from "./utils/axiosInstance";
import DishDetails from "./Pages/DishDetails";

export default function Main() {
  const location = useLocation();
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setAuthChecked(true);
        return;
      }

      try {
        const res = await axiosInstance.get("/api/User/me");
        const user = res.data;

        setIsAuthenticated(true);
        const role = user.roleName || "User";
        setUserRole(role);
      } catch (err) {
        console.error("Auth failed", err);
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [location.pathname]);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/User/me`, {
  //         credentials: "include",
  //       });

  //       if (!res.ok) throw new Error("Not authenticated");

  //       const user = await res.json();
  //       let role = user.roleName || "User";
  //       setIsAuthenticated(true);
  //       setUserRole(role);
  //     } catch (err) {
  //       console.warn("Auth failed:", err.message); // më pak alarmant
  //       setIsAuthenticated(false);
  //     } finally {
  //       setAuthChecked(true);
  //     }
  //   };

  //   if (!["/login", "/register"].includes(location.pathname)) {
  //     checkAuth();
  //   } else {
  //     setAuthChecked(true); // nuk ka nevojë të presim auth
  //   }
  // }, [location.pathname]);

  if (!authChecked) return <div>Loading...</div>;

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MenuCover />} />
        <Route path="/main-menu" element={<MainMenu />} />
        <Route path="/dish/:menuItemId" element={<DishDetails />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              userRole === "Superadmin" ? (
                <Navigate to="/superadmin/dashboard" />
              ) : userRole === "Admin" ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/online-menu" />
              )
            ) : (
              <AuthForm setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/online-menu"
          element={isAuthenticated ? <OnlineMenu /> : <Navigate to="/login" />}
        />
        <Route
          path="/online-menu/:id"
          element={isAuthenticated ? <OnlineMenu /> : <Navigate to="/login" />}
        />

        <Route
          path="/checkout"
          element={
            isAuthenticated ? <CheckOutPage /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/payment"
          element={isAuthenticated ? <PaymentPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin/profile"
          element={<Navigate to="/profile" replace />}
        />
        <Route
          path="/superadmin/profile"
          element={<Navigate to="/profile" replace />}
        />


        {/* Admin Dashboards */}
        <Route
          path="admin/*"
          element={
            isAuthenticated &&
            (userRole === "Admin" || userRole === "Superadmin") ? (
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="superadmin/*"
          element={
            isAuthenticated && userRole === "Superadmin" ? (
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="rtl/*"
          element={
            isAuthenticated ? (
              <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </ChakraProvider>
  );
}
