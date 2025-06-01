import React from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import "../CSS/FoodMenuCover.css";

const MenuCover = () => {
  const navigate = useNavigate();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigate("/main-menu"),
    trackTouch: true,
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <div className="menu-container" {...swipeHandlers}>
      <span className="corner top-right"></span>
      <span className="corner bottom-right"></span>
      <div className="menu-cover">
        <div className="menu-logo">
          <h1 className="menu-title">Restaurant Name</h1>
          <div className="menu-symbols">
            <span className="symbol">🐟</span>
            <span className="symbol">🔪</span>
            <span className="symbol">🐦</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCover;
