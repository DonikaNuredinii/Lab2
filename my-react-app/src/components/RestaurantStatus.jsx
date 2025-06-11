import React, { useEffect, useState } from "react";

const RestaurantStatus = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    const openHour = 9;
    const closeHour = 21;

    if (currentHour >= openHour && currentHour < closeHour) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, []);

  return (
    <div
      style={{
        color: isOpen ? "#AAFF00" : "#FF0000",
        padding: "10px 20px",
        display: "inline-block",
        fontWeight: "bold",
      }}
    >
      {isOpen ? " OPEN" : "CLOSED"}
    </div>
  );
};

export default RestaurantStatus;
