import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Stack,
  Radio,
  VStack,
  Flex,
  Divider,
  useToast,
} from "@chakra-ui/react";

const PaymentSidebar = ({ isOpen, onClose, totalAmount, orderId, cartItems, method }) => {
  const toast = useToast();
  const [paymentMethod, setPaymentMethod] = useState(method || "Cash");

  const handlePaymentSubmit = () => {
    toast({
      title: `Payment for order ${orderId} confirmed! Method: ${paymentMethod}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody p={6}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Payment
          </Text>

          <Text mb={4}>Order ID: {orderId}</Text>
          <Text mb={4}>Total Amount: ${totalAmount.toFixed(2)}</Text>

          <RadioGroup onChange={setPaymentMethod} value={paymentMethod} mb={6}>
            <Stack direction="row" spacing={6}>
              <Radio value="Cash">Cash</Radio>
              <Radio value="Card">Card</Radio>
              <Radio value="Online">Online</Radio>
            </Stack>
          </RadioGroup>

          <Button colorScheme="teal" onClick={handlePaymentSubmit} width="full">
            Confirm Payment
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PaymentSidebar;
