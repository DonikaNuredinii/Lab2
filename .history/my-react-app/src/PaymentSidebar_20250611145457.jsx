import React from "react";
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
} from "@chakra-ui/react";
import { useState } from "react";

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
    // Validim bazik i fushave të domosdoshme
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
      p={10}
      overflowY="auto"
      zIndex="20"
      borderRadius="xl"
      gap={10}
    >
      {/* Form Container */}
      <Box flex="1" maxW="450px" fontSize="lg" lineHeight="tall">
        <Text fontSize="4xl" fontWeight="bold" mb={10} textAlign="center">
          Payment
        </Text>

        <FormControl mb={8} isRequired>
          <FormLabel fontSize="lg" fontWeight="semibold">
            First Name
          </FormLabel>
          <Input
            placeholder="First Name"
            fontSize="lg"
            borderRadius="xl"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </FormControl>

        <FormControl mb={8} isRequired>
          <FormLabel fontSize="lg" fontWeight="semibold">
            Last Name
          </FormLabel>
          <Input
            placeholder="Last Name"
            fontSize="lg"
            borderRadius="xl"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormControl>

        <FormControl mb={8}>
          <FormLabel fontSize="lg" fontWeight="semibold">
            Additional Info
          </FormLabel>
          <Input
            placeholder="Additional Info"
            fontSize="lg"
            borderRadius="xl"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </FormControl>

        <FormControl mb={8} isRequired>
          <FormLabel fontSize="lg" fontWeight="semibold">
            Address
          </FormLabel>
          <Input
            placeholder="Address"
            fontSize="lg"
            borderRadius="xl"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </FormControl>

        <FormControl mb={8} isRequired>
          <FormLabel fontSize="lg" fontWeight="semibold">
            Zip Code
          </FormLabel>
          <Input
            placeholder="Zip Code"
            fontSize="lg"
            borderRadius="xl"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </FormControl>

        <FormControl mb={8} isRequired>
          <FormLabel fontSize="lg" fontWeight="semibold">
            Phone Number
          </FormLabel>
          <Input
            placeholder="Phone Number"
            fontSize="lg"
            borderRadius="xl"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </FormControl>

        <FormControl mb={8} isRequired>
          <FormLabel fontSize="lg" fontWeight="semibold">
            Email
          </FormLabel>
          <Input
            placeholder="Email"
            fontSize="lg"
            borderRadius="xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <RadioGroup onChange={setMethod} value={method} mb={10} fontSize="lg">
          <Stack direction="row" spacing={12}>
            <Radio value="Cash" size="lg">
              Cash
            </Radio>
            <Radio value="PayPal" size="lg">
              PayPal
            </Radio>
            <Radio value="Amazon" size="lg">
              Amazon Pay
            </Radio>
            <Radio value="Card" size="lg">
              Card
            </Radio>
          </Stack>
        </RadioGroup>

        {method === "Card" && (
          <>
            <FormControl mb={8} isRequired>
              <FormLabel fontSize="lg" fontWeight="semibold">
                Name on Card
              </FormLabel>
              <Input
                placeholder="Name on Card"
                fontSize="lg"
                borderRadius="xl"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              />
            </FormControl>
            <FormControl mb={8} isRequired>
              <FormLabel fontSize="lg" fontWeight="semibold">
                Card Number
              </FormLabel>
              <Input
                placeholder="Card Number"
                fontSize="lg"
                borderRadius="xl"
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
              />
            </FormControl>
            <FormControl mb={8} isRequired>
              <FormLabel fontSize="lg" fontWeight="semibold">
                Expire Date
              </FormLabel>
              <Input
                placeholder="MM/YY"
                fontSize="lg"
                borderRadius="xl"
                value={cardData.expire}
                onChange={(e) => setCardData({ ...cardData, expire: e.target.value })}
              />
            </FormControl>
            <FormControl mb={12} isRequired>
              <FormLabel fontSize="lg" fontWeight="semibold">
                CVV
              </FormLabel>
              <Input
                type="password"
                placeholder="CVV"
                fontSize="lg"
                borderRadius="xl"
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
          className="broken-border-button b"
          mb={8}
          mt={8}
          color="gray.900"
          fontSize="2xl"
          fontWeight="bold"
          borderWidth="3px"
          borderRadius="xl"
        >
          Confirm Payment
        </Button>

        <Button
          mt={3}
          variant="ghost"
          width="full"
          onClick={onClose}
          fontSize="xl"
          fontWeight="medium"
        >
          Cancel
        </Button>
      </Box>

      {/* Order summary on the right */}
      <Box
        flex="1"
        maxW="300px"
        bg="gray.50"
        borderRadius="xl"
        p={6}
        boxShadow="md"
        overflowY="auto"
      >
        <Text fontSize="3xl" fontWeight="bold" mb={6}>
          Your Orders
        </Text>
        <Text mb={3} color="gray.600" fontWeight="medium" fontSize="md">
          Tap + or – to update quantity
        </Text>

        <VStack spacing={4} align="stretch" mb={8}>
          {cartItems.map((item) => (
            <Flex
              key={item.id}
              justify="space-between"
              fontSize="lg"
              fontWeight="medium"
            >
              <Text>{item.name}</Text>
              <Text>
                {item.quantity} × ${item.price.toFixed(2)}
              </Text>
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
  );
};

export default PaymentSidebar;
