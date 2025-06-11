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
  const [authChecked, setAuthChecked] = useState(false); 
  const [userRole, setUserRole] = useState("");


useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const valid = token && token.split(".").length === 3;
  setIsAuthenticated(!!valid);
  setUserRole(role); // new
  setAuthChecked(true);
  console.log("Auth check completed:", valid);
}, [location.pathname]);


  if (!authChecked) return <div>Loading...</div>;

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              userRole === "Superadmin" ? (
                <Navigate to="/superadmin" replace />
              ) : userRole === "Admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/online-menu" replace />
              )
            ) : (
              <AuthForm setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />


        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
  path="admin/*"
  element={
    isAuthenticated && (userRole === "Admin" || userRole === "Superadmin") ? (
      <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
    ) : isAuthenticated ? (
      <Navigate to="/online-menu" />
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
    ) : isAuthenticated ? (
      <Navigate to="/online-menu" />
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
