const adminMenuData = [
  {
    category: "Dashboard",
    sections: [
      {
        title: "Overview",
        items: [
          { name: "Main Dashboard", path: "/admin/default" },
          { name: "Analytics", path: "/admin/analytics" },
        ],
      },
    ],
  },
  {
    category: "Data Management",
    sections: [
      {
        title: "Menu Data",
        items: [
          { name: "View Menu Items", path: "/admin/data-tables/menu-items" },
          { name: "Manage Categories", path: "/admin/data-tables/categories" },
          {
            name: "Manage Subcategories",
            path: "/admin/data-tables/subcategories",
          },
        ],
      },
      {
        title: "Other Data",
        items: [
          { name: "View Users", path: "/admin/data-tables/users" },
          { name: "View Orders", path: "/admin/data-tables/orders" },
        ],
      },
    ],
  },
  {
    category: "Settings",
    sections: [
      {
        title: "General Settings",
        items: [{ name: "App Configuration", path: "/admin/settings/config" }],
      },
      {
        title: "User Management",
        items: [
          { name: "Roles and Permissions", path: "/admin/settings/roles" },
        ],
      },
    ],
  },
];

export default adminMenuData;
