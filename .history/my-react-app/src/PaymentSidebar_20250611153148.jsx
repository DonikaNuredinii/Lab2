import React, { useState } from "react";
import {
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
  Heading,
} from "@chakra-ui/react";

const PaymentSidebar = ({ totalAmount, orderId, onClose, cartItems }) => {
  const toast = useToast();
  const [method, setMethod] = useState("Cash");
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
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !address ||
      !zipCode
    ) {
      toast({
        title:
          "Please fill all required fields (First Name, Last Name, Phone, Email, Address, Zip Code).",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (method === "Card") {
      if (
        !cardData.name ||
        !cardData.number ||
        !cardData.expire ||
        !cardData.cvv
      ) {
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
      cardData: method === "Card" ? cardData : null,
      additionalInfo,
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
    <Flex
      position="fixed"
      right="0"
      top="0"
      height="100vh"
      width={{ base: "100%", md: "720px" }}
      bg="white"
      boxShadow="xl"
      p={{ base: 6, md: 10 }}
      overflowY="auto"
      zIndex="20"
      borderRadius={{ base: "0", md: "xl" }}
      gap={{ base: 6, md: 10 }}
      justifyContent="center"
      alignItems="flex-start"
    >
      {/* Form Container */}
      <Box flex="1" maxW="480px" fontSize="lg" lineHeight="tall" px={{ base: 4, md: 0 }}>
        <Heading as="h1" size="2xl" mb={10} textAlign="center" fontWeight="bold" letterSpacing="wide">
          Payment
        </Heading>

        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel fontSize="lg" fontWeight="semibold">First Name</FormLabel>
            <Input
              placeholder="First Name"
              fontSize="md"
              borderRadius="xl"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="lg" fontWeight="semibold">Last Name</FormLabel>
            <Input
              placeholder="Last Name"
              fontSize="md"
              borderRadius="xl"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="lg" fontWeight="semibold">Additional Info</FormLabel>
            <Input
              placeholder="Additional Info"
              fontSize="md"
              borderRadius="xl"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="lg" fontWeight="semibold">Address</FormLabel>
            <Input
              placeholder="Address"
              fontSize="md"
              borderRadius="xl"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="lg" fontWeight="semibold">Zip Code</FormLabel>
            <Input
              placeholder="Zip Code"
              fontSize="md"
              borderRadius="xl"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="lg" fontWeight="semibold">Phone Number</FormLabel>
            <Input
              placeholder="Phone Number"
              fontSize="md"
              borderRadius="xl"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="lg" fontWeight="semibold">Email</FormLabel>
            <Input
              placeholder="Email"
              fontSize="md"
              borderRadius="xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <RadioGroup onChange={setMethod} value={method} fontSize="lg" mb={10}>
            <Stack direction={{ base: "column", md: "row" }} spacing={6}>
              <Radio value="Cash" size="md">Cash</Radio>
              <Radio value="PayPal" size="md">PayPal</Radio>
              <Radio value="Amazon" size="md">Amazon Pay</Radio>
              <Radio value="Card" size="md">Card</Radio>
            </Stack>
          </RadioGroup>

          {method === "Card" && (
            <VStack spacing={6} align="stretch">
              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="semibold">Name on Card</FormLabel>
                <Input
                  placeholder="Name on Card"
                  fontSize="md"
                  borderRadius="xl"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="semibold">Card Number</FormLabel>
                <Input
                  placeholder="Card Number"
                  fontSize="md"
                  borderRadius="xl"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="semibold">Expire Date</FormLabel>
                <Input
                  placeholder="MM/YY"
                  fontSize="md"
                  borderRadius="xl"
                  value={cardData.expire}
                  onChange={(e) => setCardData({ ...cardData, expire: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="semibold">CVV</FormLabel>
                <Input
                  type="password"
                  placeholder="CVV"
                  fontSize="md"
                  borderRadius="xl"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                />
              </FormControl>
            </VStack>
          )}

          <Button
            width="100%"
            colorScheme="teal"
            onClick={handlePaymentSubmit}
            mt={6}
            color="gray.900"
            fontSize="lg"
            fontWeight="bold"
            borderWidth="3px"
            borderRadius="xl"
          >
            Confirm Payment
          </Button>

          <Button
            mt={4}
            variant="ghost"
            width="full"
            onClick={onClose}
            fontSize="lg"
            fontWeight="medium"
          >
            Cancel
          </Button>
        </VStack>
      </Box>

      {/* Order summary on the right */}
      <Box
        flex="1"
        maxW="320px"
        bg="gray.50"
        borderRadius="xl"
        p={6}
        boxShadow="md"
        overflowY="auto"
      >
        <Heading as="h2" size="lg" mb={6} fontWeight="bold" textAlign="center">
          Your Orders
        </Heading>

        <Text mb={4} color="gray.600" fontWeight="medium" fontSize="md" textAlign="center">
          Tap + or – to update quantity
        </Text>

        <VStack spacing={4} align="stretch" mb={8}>
          {cartItems.map((item) => (
            <Flex
              key={item.id}
              justify="space-between"
              fontSize="md"
              fontWeight="medium"
            >
              <Text noOfLines={1}>{item.name}</Text>
              <Text>
                {item.quantity} × ${item.price.toFixed(2)}
              </Text>
            </Flex>
          ))}
        </VStack>

        <Divider mb={6} />

        <Flex justify="space-between" fontWeight="bold" fontSize="2xl" px={1}>
          <Text>Total</Text>
          <Text color="red.600">${totalAmount.toFixed(2)}</Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default PaymentSidebar;
