import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import "../CSS/Main-Menu.css";
import { Box, Text } from "@chakra-ui/react";

const MainMenu = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, categoriesRes, subcategoriesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE}/api/MenuItems`),
          fetch(`${import.meta.env.VITE_API_BASE}/api/Category`),
          fetch(`${import.meta.env.VITE_API_BASE}/api/Subcategory`),
        ]);

        if (!itemsRes.ok || !categoriesRes.ok || !subcategoriesRes.ok) {
          throw new Error(
            `Failed to fetch: Statuses: Items ${itemsRes.status}, Categories ${categoriesRes.status}, Subcategories ${subcategoriesRes.status}`
          );
        }

        const itemsJson = await itemsRes.json();
        const categoriesJson = await categoriesRes.json();
        const subcategoriesJson = await subcategoriesRes.json();

        const filteredItems = itemsJson.filter(
          (item) => item.restaurantId === 2
        );

        const structuredData = categoriesJson
          .map((category) => {
            const subcats = subcategoriesJson
              .filter((sub) => sub.categoryID === category.id)
              .map((sub) => {
                const itemsForSubcategory = filteredItems.filter(
                  (item) => item.subCategoryId === sub.id
                );

                return {
                  title: sub.name,
                  items: itemsForSubcategory,
                };
              })
              .filter((sub) => sub.items.length > 0);

            return {
              category: category.name,
              subcategories: subcats,
            };
          })
          .filter((c) => c.subcategories.length > 0);

        setMenuData(structuredData);
      } catch (err) {
        console.error("Menu fetch failed:", err);
        setError("Failed to load menu data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (pageIndex < menuData.length - 1) setPageIndex((prev) => prev + 1);
    },
    onSwipedRight: () => {
      if (pageIndex === 0) navigate("/");
      else setPageIndex((prev) => prev - 1);
    },
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  const currentPage = menuData[pageIndex];

  if (loading) return <div className="menu-white-page">Loading menu...</div>;
  if (error) return <div className="menu-white-page">Error: {error}</div>;
  if (!menuData || menuData.length === 0)
    return <div className="menu-white-page">No menu items available.</div>;

  return (
    <div className="menu-white-page" {...swipeHandlers}>
      <h1 className="menu-white-title">{currentPage?.category}</h1>

      <div className="menu-card-grid">
        {currentPage?.subcategories?.flatMap((sub) =>
          sub.items.map((item) => (
            <div className="menu-item-card" key={item.id}>
              <div className="menu-item-image-container">
                {item.image && (
                  <img
                    src={
                      item.image.startsWith("/") ? item.image : "/" + item.image
                    }
                    alt={item.name}
                  />
                )}
              </div>
              <div className="menu-item-text-content">
                {console.log(item.name)}
                <div className="menu-item-name">{item.name}</div>
                <div className="menu-item-description">{item.description}</div>
                {item.price !== undefined && (
                  <div className="menu-item-price">
                    Price: ${item.price?.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="menu-nav-tip">
        {pageIndex > 0 && "← Swipe Back"}{" "}
        {pageIndex < menuData.length - 1 && "Swipe Forward →"}
      </div>
    </div>
  );
};

export default MainMenu;
