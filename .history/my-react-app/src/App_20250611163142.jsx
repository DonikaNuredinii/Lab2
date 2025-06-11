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

import DishDetails from "./Pages/DishDetails";

export default function Main() {
  const location = useLocation();
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // ✅ added

  useEffect(() => {
    const token = localStorage.getItem("token");
    const valid = token && token.split(".").length === 3;
    setIsAuthenticated(!!valid);
    setAuthChecked(true); // ✅ indicate that auth check is done
    console.log("Auth check completed:", valid);
  }, [location.pathname]);

  if (!authChecked) return <div>Loading...</div>; // ✅ delay route rendering

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route
          path="/login"
          element={<AuthForm setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="admin/*"
          element={
            isAuthenticated ? (
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="superadmin/*"
          element={
            isAuthenticated ? (
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
        <Route path="/" element={<MenuCover />} />
        <Route path="/main-menu" element={<MainMenu />} />
         <Route path="/dish/:menuItemId" element={<DishDetails />} />
        <Route
          path="/online-menu/:id?"
          element={isAuthenticated ? <OnlineMenu /> : <Navigate to="/login" />}
        />{" "}
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/payment" element={<PaymentPage />} />

      </Routes>
    </ChakraProvider>
  );
}
