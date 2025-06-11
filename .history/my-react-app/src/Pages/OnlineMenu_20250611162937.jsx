import React, { useState } from "react";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import PaymentSidebar from "../PaymentSidebar";

const OnlineMenu = () => {
  // Simulimi i artikujve në karrocë me çmime
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Pizza", price: 12.99, quantity: 1 },
    { id: 2, name: "Burger", price: 8.5, quantity: 2 },
  ]);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const [orderId, setOrderId] = useState(null);

  const {
    isOpen: isPaymentOpen,
    onOpen: onPaymentOpen,
    onClose: onPaymentClose,
  } = useDisclosure();

  // Simulo vendosjen e porosisë dhe hapjen e modalit
  const handleSubmitOrder = async () => {
    // Në të vërtetë do të bëje POST tek backend, por ne e simulojmë me setTimeout
    setTimeout(() => {
      setOrderId(123); // Simulimi i orderId të marrë nga backend
      onPaymentOpen();
    }, 500);
  };

  const closePaymentSidebar = () => {
    onPaymentClose();
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4}>
        Your Cart (Total: ${total.toFixed(2)})
      </Text>

      {cartItems.map((item) => (
        <Text key={item.id}>
          {item.name} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
        </Text>
      ))}

      <Button mt={6} colorScheme="teal" onClick={handleSubmitOrder}>
        Place Order & Pay
      </Button>

      {/* Modal i pagesës */}
      {isPaymentOpen && orderId && (
        <PaymentSidebar
          isOpen={isPaymentOpen}
          onClose={closePaymentSidebar}
          totalAmount={total}
          orderId={orderId}
          cartItems={cartItems}
          method="Cash"
        />
      )}
    </Box>
  );
};

export default OnlineMenu;
