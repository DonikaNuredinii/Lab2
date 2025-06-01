import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import "../CSS/Main-Menu.css";

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
          fetch("https://localhost:7076/api/MenuItems"),
          fetch("https://localhost:7076/api/Category"),
          fetch("https://localhost:7076/api/Subcategory"),
        ]);

        if (!itemsRes.ok || !categoriesRes.ok || !subcategoriesRes.ok) {
          throw new Error(
            `Failed to fetch: Statuses: Items ${itemsRes.status}, Categories ${categoriesRes.status}, Subcategories ${subcategoriesRes.status}`
          );
        }

        const itemsJson = await itemsRes.json();
        const categoriesJson = await categoriesRes.json();
        const subcategoriesJson = await subcategoriesRes.json();

        console.log("Fetched ItemsJson (before filter):", itemsJson);
        console.log("Fetched CategoriesJson:", categoriesJson);
        console.log("Fetched SubcategoriesJson:", subcategoriesJson);

        const filteredItems = itemsJson.filter(
          (item) => item.restaurantId === 2
        );
        console.log("Filtered Items (restaurantId === 2):", filteredItems);

        const structuredData = categoriesJson
          .map((category) => {
            console.log(
              `Processing Category: ${category.name} (ID: ${category.id})`
            );

            const subcats = subcategoriesJson
              .filter((sub) => sub.categoryID === category.id)
              .map((sub) => {
                const itemsForSubcategory = filteredItems.filter(
                  (item) => item.subCategoryId === sub.id
                );

                console.log(
                  `  Subcategory: ${sub.name} (ID: ${sub.id}) - Items found: ${itemsForSubcategory.length}`
                );

                return {
                  title: sub.name,
                  items: itemsForSubcategory,
                };
              });

            console.log(
              `Category ${category.name} processed. Subcategories with items: ${
                subcats.filter((s) => s.items.length > 0).length
              }`
            );

            return {
              category: category.name,
              subcategories: subcats,
            };
          })
          .filter((c) => {
            const hasItems = c.subcategories.some(
              (sub) => sub.items.length > 0
            );
            console.log(`Category ${c.category} has items? ${hasItems}`);
            return hasItems;
          });

        console.log("Structured Data:", structuredData);
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
        {currentPage.subcategories.flatMap((sub, subIndex) =>
          sub.items.map((item) => (
            <div className="menu-card" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="category">
                {currentPage.category} - {sub.title}
              </div>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <div className="date">Price: ${item.price?.toFixed(2)}</div>
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
