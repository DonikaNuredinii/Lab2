import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  Heading,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();

  const totalAmount = location.state?.total || 0;
  const orderId = location.state?.orderId || null;
  const cartItems = location.state?.cartItems || [];

  const [showWaiterModal, setShowWaiterModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handlePaymentChoice = (method) => {
    if (method === "Cash") {
      setShowWaiterModal(true);

      setTimeout(() => {
        setShowWaiterModal(false);
        setShowInvoiceModal(true);
      }, 3000);
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
    <>
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
          <Heading size="lg" mb={4}>Checkout</Heading>
          <Text fontSize="md" mb={6}>
            Thank you for your order! Please choose a payment method to continue.
          </Text>

          <VStack spacing={4}>
            <Button width="100%" colorScheme="blue" onClick={() => handlePaymentChoice("Cash")}>
              Pay with Cash
            </Button>
           <Button
  width="100%"
  colorScheme="green"
  onClick={async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/Payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
         credentials: "include",
        body: JSON.stringify({
          cartItems,
        }),
      });

      const data = await res.json();
      
const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
if (!stripe) {
  throw new Error("Stripe failed to load.");
}

stripe.redirectToCheckout({ sessionId: data.id });
      stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error("Stripe Checkout error:", error);
      toast({
        title: "Failed to start payment session.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }}
>
  Pay with Card (Stripe)
</Button>

          </VStack>
        </Box>
      </Box>

      {/* Waiter Modal */}
      <Modal isOpen={showWaiterModal} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={6} textAlign="center">
            <Text fontSize="xl" fontWeight="bold">
              Waiter will be with you shortly!
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Invoice Modal */}
      <Modal isOpen={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invoice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={3}>
              <Text><strong>Order ID:</strong> {orderId}</Text>
              <Text><strong>Total:</strong> €{totalAmount.toFixed(2)}</Text>
              <Divider />
              <Text fontWeight="bold" mt={2}>Items:</Text>
              {cartItems.map((item, index) => (
                <Box key={index} w="100%">
                  <Text>- {item.name} x {item.quantity}</Text>
                </Box>
              ))}
            </VStack>
            <Button
              mt={6}
              width="100%"
              colorScheme="blue"
              onClick={() => setShowInvoiceModal(false)}
            >
              Close
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CheckoutPage;
