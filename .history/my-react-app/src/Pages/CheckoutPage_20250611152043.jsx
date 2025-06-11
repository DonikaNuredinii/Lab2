import React, { useState } from "react";
import { Box, Button, Text, VStack, Heading, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Supozojmë që këto vijnë nga `location.state` në rastin real
  const totalAmount = 100; // shembull
  const orderId = 123; // shembull
  const cartItems = []; // nëse ke

  const handlePaymentChoice = (method) => {
    if (method === "Cash") {
      toast({
        title: "Waiter will be with you shortly.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate("/"); // ose ndonjë faqe tjetër
    } else if (method === "Online") {
      // Këtu bojm ridrejtim me state në payment
      navigate("/payment", {
        state: {
          totalAmount,
          orderId,
          cartItems,
          paymentMethod: method,
        },
      });
    } else {
      // Për "Card" ose metoda tjera, vepro si duhet (mund të ridrejtohet apo hapet modal)
      navigate("/payment", {
        state: {
          totalAmount,
          orderId,
          cartItems,
          paymentMethod: method,
        },
      });
    }
  };

  return (
    <Box>
      <Heading>Checkout</Heading>
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
    </Box>
  );
};

export default CheckoutPage;
