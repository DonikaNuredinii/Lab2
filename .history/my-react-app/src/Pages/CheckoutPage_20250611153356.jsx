import React, { useState } from "react";
import { Box, Button, VStack } from "@chakra-ui/react";
import PaymentSidebar from "./PaymentSidebar";

const CheckoutPage = () => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const totalAmount = 100;
  const orderId = 123;
  const cartItems = [];

  const handlePaymentChoice = (method) => {
    if (method === "Cash") {
      // Logjikë për Cash
      alert("Waiter will be with you shortly.");
    } else {
      setPaymentMethod(method);
      setIsPaymentOpen(true);
    }
  };

  const closePaymentSidebar = () => setIsPaymentOpen(false);

  return (
    <Box>
      <VStack spacing={4}>
        <Button colorScheme="blue" onClick={() => handlePaymentChoice("Cash")}>
          Pay with Cash
        </Button>
        <Button colorScheme="green" onClick={() => handlePaymentChoice("Card")}>
          Pay with Card
        </Button>
        <Button
          colorScheme="purple"
          onClick={() => handlePaymentChoice("Online")}
        >
          Pay Online
        </Button>
      </VStack>

      <PaymentSidebar
        isOpen={isPaymentOpen}
        onClose={closePaymentSidebar}
        totalAmount={totalAmount}
        orderId={orderId}
        cartItems={cartItems}
        method={paymentMethod}
      />
    </Box>
  );
};

export default CheckoutPage;
