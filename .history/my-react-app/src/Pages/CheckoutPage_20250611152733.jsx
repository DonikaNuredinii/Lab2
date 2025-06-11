import React from "react";
import { Box, Button, Text, VStack, Heading, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Këto mund t'i marrësh nga props ose nga location.state në rast real
  const totalAmount = 100; // Shembull
  const orderId = 123; // Shembull
  const cartItems = []; // Shembull, mund të plotësohet sipas nevojës

  const handlePaymentChoice = (method) => {
    if (method === "Cash") {
      toast({
        title: "Waiter will be with you shortly.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      navigate("/"); // Ose faqe tjetër ku doni me kthy
    } else {
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
    </Box>
  );
};

export default CheckoutPage;
