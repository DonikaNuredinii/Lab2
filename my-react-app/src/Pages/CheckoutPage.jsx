import React from "react";
import { useDisclosure } from "@chakra-ui/react";
import PaymentModal from "../components/PaymentModal";

const CheckoutPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    onOpen();
  }, []);

  return (
    <div className="checkout-page">
      <h1>Order Created!</h1>
      <p>Please select your payment method to complete the process.</p>

      <PaymentModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default CheckoutPage;
