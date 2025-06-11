// import "./assets/css/App.css";
// import { Routes, Route, Navigate } from "react-router-dom";
// import {} from "react-router-dom";
// import AuthLayout from "./layouts/auth";
// import AdminLayout from "./layouts/admin";
// import RTLLayout from "./layouts/rtl";
// import MenuCover from "./Pages/MenuCover";
// import MainMenu from "./Pages/Main-Menu";
// import OnlineMenu from "./Pages/OnlineMenu";
// import AuthForm from './Pages/AuthForm';
// import ProfilePage from './Pages/ProfilePage';

// import {
//   ChakraProvider,
//   // extendTheme
// } from "@chakra-ui/react";
// import initialTheme from "./theme/theme";
// import { useState } from "react";

// export default function Main() {
//   const [currentTheme, setCurrentTheme] = useState(initialTheme);
//   return (
//     <ChakraProvider theme={currentTheme}>
//       <Routes>
//         <Route path="/login" element={<AuthForm />} />
//         <Route path="auth/*" element={<AuthLayout />} />
//         <Route path="/profile" element={<ProfilePage />} />
//         <Route
//           path="admin/*"
//           element={
//             <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
//           }
//         />
//         <Route
//           path="superadmin/*"
//           element={
//             <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
//           }
//         />
//         <Route
//           path="rtl/*"
//           element={
//             <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
//           }
//         />
//         <Route path="/" element={<MenuCover />} />
//         <Route path="/main-menu" element={<MainMenu />} />
//         <Route path="/online-menu/:id?" element={<OnlineMenu />} />
//       </Routes>
//     </ChakraProvider>
//   );
// }




import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import {
  ChakraProvider,
} from "@chakra-ui/react";
import initialTheme from "./theme/theme";

import AuthForm from './Pages/AuthForm';
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";
import RTLLayout from "./layouts/rtl";
import MenuCover from "./Pages/MenuCover";
import MainMenu from "./Pages/Main-Menu";
import OnlineMenu from "./Pages/OnlineMenu";
import ProfilePage from './Pages/ProfilePage';

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
  element={
    isAuthenticated
      ? (() => {
          const role = localStorage.getItem("role");
          if (role === "Superadmin") {
            return <Navigate to="/superadmin/default" />;
          } else {
            return <Navigate to="/admin/default" />;
          }
        })()
      : <AuthForm setIsAuthenticated={setIsAuthenticated} />
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
            isAuthenticated
              ? <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="superadmin/*"
          element={
            isAuthenticated
              ? <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="rtl/*"
          element={
            isAuthenticated
              ? <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
              : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<MenuCover />} />
        <Route path="/main-menu" element={<MainMenu />} />
        <Route
          path="/online-menu/:id?"
          element={isAuthenticated ? <OnlineMenu /> : <Navigate to="/login" />}
        />
      </Routes>
    </ChakraProvider>
  );
}
