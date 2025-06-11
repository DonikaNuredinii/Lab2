import React, { useState } from "react";
import { Box, Button, Text, VStack, Heading, useToast } from "@chakra-ui/react";
import PaymentSidebar from "../PaymentSidebar";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const totalAmount = location.state?.total || 0;
  const orderId = location.state?.orderId || null;
const cartItems = location.state?.cartItems || [];
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const openPaymentSidebar = (method) => {
    setPaymentMethod(method);
    setIsPaymentOpen(true);
  };

  const closePaymentSidebar = () => {
    setIsPaymentOpen(false);
  };

  const handlePaymentChoice = (method) => {
    if (method === "Cash") {
      toast({
        title: "Waiter will be with you shortly.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      // Mundesh me kthy prap ose me bo redirect
      navigate("/"); // ose faqe tjetër
    } else {
      openPaymentSidebar(method);
    }
  };

  return (
    <Box
      minHeight="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        maxW="md"
        w="full"
        p={8}
        bg="white"
        boxShadow="lg"
        borderRadius="xl"
        textAlign="center"
      >
        <Heading size="lg" mb={4}>
          Checkout
        </Heading>
        <Text fontSize="md" mb={6}>
          Thank you for your order! Please choose a payment method to continue.
        </Text>

        <VStack spacing={4}>
          <Button
            width="100%"
            colorScheme="blue"
            onClick={() => handlePaymentChoice("Cash")}
          >
            Pay with Cash
          </Button>
          <Button
            width="100%"
            colorScheme="green"
            onClick={() => handlePaymentChoice("Card")}
          >
            Pay with Card
          </Button>
          <Button
            width="100%"
            colorScheme="purple"
            onClick={() => handlePaymentChoice("Online")}
          >
            Pay Online
          </Button>
        </VStack>
      </Box>

      {/* Modal / Sidebar i pagesës */}
      {isPaymentOpen && (
        <PaymentSidebar
          isOpen={isPaymentOpen}
          onClose={closePaymentSidebar}
          totalAmount={totalAmount}
            cartItems={cartItems}   
          orderId={orderId}
          method={paymentMethod}
          
          setMethod={setPaymentMethod}
        />
      )}
    </Box>
  );
};

export default CheckoutPage;
