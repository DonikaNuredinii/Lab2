import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdRestaurantMenu,
  MdPeople,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "../src/views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/dataTables";
import RTL from "views/admin/rtl";
import MenuItemsTable from "../src/views/admin/dataTables/MenuItemsTable";
import CustomersTable from "../src/views/admin/dataTables/CustomersTable";
import OrdersTable from "../src/views/admin/dataTables/OrdersTable";


// Superadmin Imports
import SuperAdminDashboard from "../src/views/superadmin/default";
import RestaurantsTable from "../src/views/superadmin/dataTables/RestaurantsTable";

// Auth Imports
import SignInCentered from "views/auth/signIn";
import OnlineMenu from "./Pages/OnlineMenu";

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
    name: "Restaurants Table",
    layout: "/superadmin",
    path: "/restaurants",
    icon: (
      <Icon as={MdRestaurantMenu} width="20px" height="20px" color="inherit" />
    ),
    component: <RestaurantsTable />,
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
    name: "Customers",
    layout: "/admin",
    path: "/customers",
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <CustomersTable />,
  },
  {
    name: "NFT Marketplace",
    layout: "/admin",
    path: "/nft-marketplace",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: "/data-tables",
    component: <DataTables />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
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
  
];

export default routes;
