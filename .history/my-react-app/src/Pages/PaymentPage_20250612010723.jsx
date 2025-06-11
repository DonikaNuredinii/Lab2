import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentSidebar from "../PaymentSidebar";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const totalAmount = location.state?.totalAmount || 0;
  const orderId = location.state?.orderId || null;
  const cartItems = location.state?.cartItems || [];
  const paymentMethod = location.state?.paymentMethod || "Online";

  const handleClose = () => {
    // Kthehu tek faqja e mëparshme ose home kur mbyllet payment
    navigate(-1);
  };

  return (
    <PaymentSidebar
      isOpen={true}
      onClose={handleClose}
      totalAmount={totalAmount}
      orderId={orderId}
      cartItems={cartItems}
      method={paymentMethod}
      
    />
  );
};

export default PaymentPage;
