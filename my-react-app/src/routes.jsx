import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdRestaurantMenu,
  MdChat,
  MdPeople,
  MdDinnerDining,
  MdShoppingCart,
  MdSchedule,
  MdAccessTime,
  MdInventory,
  MdTableRestaurant,
} from "react-icons/md";
// import { MdShoppingCart } from "react-icons/md";
// import { MdPeople } from "react-icons/md";

// Admin Imports
import MainDashboard from "../src/views/admin/default";
import Profile from "views/admin/profile";
import DataTables from "views/admin/dataTables";
import RTL from "views/admin/rtl";
import MenuItemsTable from "../src/views/admin/dataTables/MenuItemsTable";
import CustomersTable from "../src/views/admin/dataTables/CustomersTable";
import OrdersTable from "../src/views/admin/dataTables/OrdersTable";
import StaffTable from "views/admin/dataTables/StaffTable";
import StaffSchedule from "views/admin/dataTables/StaffSchedule";
import ProductsTable from "../src/views/admin/dataTables/ProductsTable";
import AuditLogsTable from "views/admin/dataTables/AuditLogsTable";
import ReviewsTable from "views/admin/dataTables/ReviewsTable";

// Superadmin Imports
import SuperAdminDashboard from "../src/views/superadmin/default";
import RestaurantsTable from "../src/views/superadmin/dataTables/RestaurantsTable";
import TablesTable from "../src/views/superadmin/dataTables/TablesTable";

// Auth Imports
import SignInCentered from "views/auth/signIn";
import OnlineMenu from "./Pages/OnlineMenu";
import ProfilePage from "./Pages/ProfilePage";
import DishDetails from "./Pages/DishDetails";
import AdminChatTable from "views/admin/dataTables/AdminChatTable";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: "Superadmin Dashboard",
    layout: "/superadmin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <SuperAdminDashboard />,
  },
  {
    name: "Restaurants",
    layout: "/superadmin",
    path: "/restaurants",
    icon: (
      <Icon as={MdDinnerDining} width="20px" height="20px" color="inherit" />
    ),
    component: <RestaurantsTable />,
  },
  {
    name: "Tables",
    layout: "/superadmin",
    path: "/tables",
    icon: (
      <Icon as={MdTableRestaurant} width="20px" height="20px" color="inherit" />
    ),
    component: <TablesTable />,
  },
  {
    name: "Menu Items",
    layout: "/admin",
    path: "/menu-items",
    icon: (
      <Icon as={MdRestaurantMenu} width="20px" height="20px" color="inherit" />
    ),
    component: <MenuItemsTable />,
  },
  {
    name: "Menu Items",
    layout: "/superadmin",
    path: "/menu-items",
    icon: (
      <Icon as={MdRestaurantMenu} width="20px" height="20px" color="inherit" />
    ),
    component: <MenuItemsTable />,
  },
  {
    name: "Customers",
    layout: "/admin",
    path: "/customers",
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <CustomersTable />,
  },
  {
    name: "Orders",
    layout: "/admin",
    path: "/orders",
    icon: (
      <Icon as={MdShoppingCart} width="20px" height="20px" color="inherit" />
    ),
    component: <OrdersTable />,
  },
  {
    name: "Staff",
    layout: "/admin",
    path: "/staff",
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <StaffTable />,
  },
  {
    name: "Staff Schedule",
    layout: "/admin",
    path: "/schedule",
    icon: <Icon as={MdSchedule} width="20px" height="20px" color="inherit" />,
    component: <StaffSchedule />,
  },
  {
    name: "Products",
    layout: "/admin",
    path: "/products",
    icon: <Icon as={MdInventory} width="20px" height="20px" color="inherit" />,
    component: <ProductsTable />,
  },
  {
    name: "Products",
    layout: "/superadmin",
    path: "/products",
    icon: <Icon as={MdInventory} width="20px" height="20px" color="inherit" />,
    component: <ProductsTable />,
  },
  {
    name: "Audit Logs",
    layout: "/admin",
    path: "/audit-logs",
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <AuditLogsTable />,
  },
  {
    name: "Reviews",
    layout: "/admin",
    path: "/reviews",
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <ReviewsTable />,
  },
  {
    name: "Chat",
    layout: "/admin",
    path: "/chat",
    icon: <Icon as={MdChat} width="20px" height="20px" color="inherit" />,
    component: <AdminChatTable />,
  },

  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
  {
    name: "RTL Admin",
    layout: "/rtl",
    path: "/rtl-default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <RTL />,
  },
  {
    name: "Online Menu",
    layout: "/",
    path: "/online-menu",
    component: <OnlineMenu />,
    hidden: true,
  },
  {
    name: "Dish Review",
    layout: "/",
    path: "/dish/:menuItemId",
    component: <DishDetails />,
    hidden: true,
  },

  // {
  //   name: "Profile",
  //   layout: "/admin",
  //   path: "/profile",
  //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  //   component: <ProfilePage />,
  // },
];

export default routes;
