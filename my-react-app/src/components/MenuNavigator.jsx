import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import menuData from "../menuData";
import MenuPage from "./MenuPage";

const MenuNavigator = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const pageIndex = parseInt(pageNumber, 10) - 1;

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (pageIndex < menuData.length - 1) {
        navigate(`/menu/page/${pageIndex + 2}`);
      }
    },
    onSwipedRight: () => {
      if (pageIndex > 0) {
        navigate(`/menu/page/${pageIndex}`);
      }
    },
    trackTouch: true,
  });

  const currentPage = menuData[pageIndex];

  return (
    <div {...swipeHandlers}>
      <MenuPage category={currentPage} />
    </div>
  );
};

export default MenuNavigator;
