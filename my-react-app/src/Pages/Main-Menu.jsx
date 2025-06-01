import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import menuData from "../menuData";
import "../CSS/Main-Menu.css"; // reuse your styles

const MainMenu = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const navigate = useNavigate();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (pageIndex < menuData.length - 1) {
        setPageIndex((prev) => prev + 1);
      }
    },
    onSwipedRight: () => {
      if (pageIndex === 0) {
        navigate("/");
      } else {
        setPageIndex((prev) => prev - 1);
      }
    },
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  const currentPage = menuData[pageIndex];

  return (
    <div className="menu-white-page" {...swipeHandlers}>
      <h1 className="menu-white-title">{currentPage.category}</h1>

      <div className="menu-card-grid">
        {currentPage.subcategories.map((sub, i) => (
          <div className="menu-card" key={i}>
            <img src={sub.items[0]?.image} alt={sub.title} />
            <div className="category">{currentPage.category}</div>
            <h2>{sub.title}</h2>
            <p>
              Explore delicious {sub.title.toLowerCase()} with the finest
              ingredients.
            </p>
            <div className="date">30 April 2023</div>
          </div>
        ))}
      </div>

      <div className="menu-nav-tip">
        {pageIndex > 0 && "← Swipe Back"}{" "}
        {pageIndex < menuData.length - 1 && "Swipe Forward →"}
      </div>
    </div>
  );
};

export default MainMenu;
