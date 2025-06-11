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

const PaymentSidebar = ({ totalAmount, orderId, onClose, cartItems, isOpen, method, setMethod }) => {
  const toast = useToast();
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expire: "",
    cvv: "",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handlePaymentSubmit = async () => {
    if (!firstName || !lastName || !phoneNumber || !email || !address || !zipCode) {
      toast({
        title: "Please fill all required fields (First Name, Last Name, Phone, Email, Address, Zip Code).",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (method === "Card") {
      if (!cardData.name || !cardData.number || !cardData.expire || !cardData.cvv) {
        toast({
          title: "Please fill all card details.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    const paymentDto = {
      orderID: orderId,
      paymentMethod: method,
      status: method === "Cash" ? "Pending" : "Paid",
      amount: totalAmount,
      transactionID: method === "Cash" ? "" : `TXN-${Date.now()}`,
      createdAt: new Date().toISOString(),
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      zipCode,
      additionalInfo,
      cardData: method === "Card" ? cardData : null,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/Payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDto),
      });

      if (!res.ok) throw new Error("Payment failed");

      toast({
        title: "Payment successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "Payment failed.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody p={10}>
          <Flex gap={10} height="100%">
            {/* Form container */}
            <Box flex="1" maxW="600px" fontSize="lg" lineHeight="tall" overflowY="auto">
              <Text fontSize="4xl" fontWeight="bold" mb={10} textAlign="center">Payment</Text>

              <FormControl mb={8} isRequired>
                <FormLabel>First Name</FormLabel>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </FormControl>
              <FormControl mb={8} isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </FormControl>
              <FormControl mb={8}>
                <FormLabel>Additional Info</FormLabel>
                <Input value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} />
              </FormControl>
              <FormControl mb={8} isRequired>
                <FormLabel>Address</FormLabel>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </FormControl>
              <FormControl mb={8} isRequired>
                <FormLabel>Zip Code</FormLabel>
                <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
              </FormControl>
              <FormControl mb={8} isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </FormControl>
              <FormControl mb={8} isRequired>
                <FormLabel>Email</FormLabel>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>

              <RadioGroup onChange={setMethod} value={method} mb={10}>
                <Stack direction="row" spacing={12}>
                  <Radio value="Cash">Cash</Radio>
                  <Radio value="PayPal">PayPal</Radio>
                  <Radio value="Amazon">Amazon Pay</Radio>
                  <Radio value="Card">Card</Radio>
                </Stack>
              </RadioGroup>

              {method === "Card" && (
                <>
                  <FormControl mb={8} isRequired>
                    <FormLabel>Name on Card</FormLabel>
                    <Input
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    />
                  </FormControl>
                  <FormControl mb={8} isRequired>
                    <FormLabel>Card Number</FormLabel>
                    <Input
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    />
                  </FormControl>
                  <FormControl mb={8} isRequired>
                    <FormLabel>Expire Date</FormLabel>
                    <Input
                      value={cardData.expire}
                      onChange={(e) => setCardData({ ...cardData, expire: e.target.value })}
                    />
                  </FormControl>
                  <FormControl mb={12} isRequired>
                    <FormLabel>CVV</FormLabel>
                    <Input
                      type="password"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    />
                  </FormControl>
                </>
              )}

              <Button
                width="100%"
                colorScheme="teal"
                onClick={handlePaymentSubmit}
                mb={8}
                fontSize="2xl"
              >
                Confirm Payment
              </Button>

              <Button variant="ghost" width="full" onClick={onClose}>
                Cancel
              </Button>
            </Box>

            {/* Order summary */}
            <Box flex="1" maxW="300px" bg="gray.50" borderRadius="xl" p={6} boxShadow="md" overflowY="auto">
              <Text fontSize="3xl" fontWeight="bold" mb={6}>Your Orders</Text>
              <Text mb={3} color="gray.600" fontWeight="medium" fontSize="md">
                Tap + or – to update quantity
              </Text>
              <VStack spacing={4} align="stretch" mb={8}>
                {cartItems.map((item) => (
                  <Flex key={item.id} justify="space-between" fontSize="lg" fontWeight="medium">
                    <Text>{item.name}</Text>
                    <Text>{item.quantity} × ${item.price.toFixed(2)}</Text>
                  </Flex>
                ))}
              </VStack>
              <Divider mb={6} />
              <Flex justify="space-between" fontWeight="bold" fontSize="2xl">
                <Text>Total</Text>
                <Text color="red.600">${totalAmount.toFixed(2)}</Text>
              </Flex>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PaymentSidebar;
