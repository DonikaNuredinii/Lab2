import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentSidebar from "../PaymentSidebar";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const totalAmount = location.state?.totalAmount || 0;
  const orderId = location.state?.orderId || null;
  const cartItems = location.state?.cartItems || [];
  const initialMethod = location.state?.paymentMethod || "Online";

  const [method, setMethod] = useState(initialMethod); // ✅ Shto useState

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <PaymentSidebar
      isOpen={true}
      onClose={handleClose}
      totalAmount={totalAmount}
      orderId={orderId}
      cartItems={cartItems}
      method={method}         // ✅ Kalon props-in e duhur
      setMethod={setMethod}   // ✅ Kalon funksionin për të ndryshuar metodën
    />
  );
};

export default PaymentPage;
