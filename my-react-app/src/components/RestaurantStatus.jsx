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
        backgroundColor: isOpen ? "#D4EDDA" : "#F8D7DA",
        color: isOpen ? "#155724" : "#721C24",
        border: `1px solid ${isOpen ? "#C3E6CB" : "#F5C6CB"}`,
        padding: "10px 20px",
        borderRadius: "12px",
        display: "inline-block",
        fontWeight: "bold",
      }}
    >
      {isOpen ? "🟢 Restaurant is OPEN" : "🔴 Restaurant is CLOSED"}
    </div>
  );
};

export default RestaurantStatus;
