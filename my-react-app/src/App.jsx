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
  const checkAuth = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/User/me`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not authenticated");

      const user = await res.json();
      setIsAuthenticated(true);

      // Kontroll i sigurt për rolin
      let role = user.roleName || "User"; // Lexo direkt nga user.roleName
      console.log("User object:", user);
      console.log("Roli final:", role);
      setUserRole(role);


      console.log("User object:", user);
      console.log("Roli final:", role);
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
        {/* LOGIN ROUTE */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            userRole === "Superadmin" ? (
              <Navigate to="/superadmin/dashboard" replace />
            ) : userRole === "Admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/online-menu" replace />
            )
          ) : (
            <AuthForm setIsAuthenticated={setIsAuthenticated} />
          )
        }
      />

      
        {/* AUTH LAYOUT */}
        <Route path="auth/*" element={<AuthLayout />} />
      
        {/* PROFILE PAGE */}
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="admin/*"
          element={
            isAuthenticated && (userRole === "Admin" || userRole === "Superadmin") ? (
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            ) : isAuthenticated ? (
              <Navigate to="/online-menu/2" />
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
              <Navigate to="/online-menu/2" />
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
        path="/online-menu"
        element={isAuthenticated ? <OnlineMenu /> : <Navigate to="/login" />}
      />
      {/* <Route
        path="/online-menu"
        element={<Navigate to="/online-menu/2" />}
      /> */}

      
      
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>

    </ChakraProvider>
  );
}
