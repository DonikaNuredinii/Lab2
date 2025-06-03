import "./assets/css/App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import {} from "react-router-dom";
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";
import RTLLayout from "./layouts/rtl";
import MenuCover from "./Pages/MenuCover";
import MainMenu from "./Pages/Main-Menu";
import OnlineMenu from "./Pages/OnlineMenu";
import {
  ChakraProvider,
  // extendTheme
} from "@chakra-ui/react";
import initialTheme from "./theme/theme";
import { useState } from "react";

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route
          path="rtl/*"
          element={
            <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route path="/" element={<MenuCover />} />
        <Route path="/main-menu" element={<MainMenu />} />
        <Route path="/online-menu/:id?" element={<OnlineMenu />} />
      </Routes>
    </ChakraProvider>
  );
}
