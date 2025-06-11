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
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // Merr të dhënat nga ruter state (total, orderId, cartItems)
  const totalAmount = location.state?.total || 0;
  const orderId = location.state?.orderId || null;
  const cartItems = location.state?.cartItems || [];

  // State për metodat e pagesës dhe formën
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

  // Submit payment
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
      // Redirect to home or faqen e falenderimit
      navigate("/");
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
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
      p={5}
      gap={10}
      flexWrap="wrap"
    >
      {/* Formi i pagesës */}
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        maxW="450px"
        w="100%"
      >
        <Text fontSize="3xl" fontWeight="bold" mb={8} textAlign="center">
          Payment
        </Text>

        <FormControl mb={4} isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            borderRadius="md"
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            borderRadius="md"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Additional Info</FormLabel>
          <Input
            placeholder="Additional Info"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            borderRadius="md"
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Address</FormLabel>
          <Input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            borderRadius="md"
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Zip Code</FormLabel>
          <Input
            placeholder="Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            borderRadius="md"
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            borderRadius="md"
          />
        </FormControl>

        <FormControl mb={6} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            borderRadius="md"
          />
        </FormControl>

        <RadioGroup onChange={setMethod} value={method} mb={6}>
          <Stack direction="row" spacing={8}>
            <Radio value="Cash">Cash</Radio>
            <Radio value="PayPal">PayPal</Radio>
            <Radio value="Amazon">Amazon Pay</Radio>
            <Radio value="Card">Card</Radio>
          </Stack>
        </RadioGroup>

        {method === "Card" && (
          <>
            <FormControl mb={4} isRequired>
              <FormLabel>Name on Card</FormLabel>
              <Input
                placeholder="Name on Card"
                value={cardData.name}
                onChange={(e) =>
                  setCardData({ ...cardData, name: e.target.value })
                }
                borderRadius="md"
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Card Number</FormLabel>
              <Input
                placeholder="Card Number"
                value={cardData.number}
                onChange={(e) =>
                  setCardData({ ...cardData, number: e.target.value })
                }
                borderRadius="md"
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Expire Date</FormLabel>
              <Input
                placeholder="MM/YY"
                value={cardData.expire}
                onChange={(e) =>
                  setCardData({ ...cardData, expire: e.target.value })
                }
                borderRadius="md"
              />
            </FormControl>

            <FormControl mb={6} isRequired>
              <FormLabel>CVV</FormLabel>
              <Input
                placeholder="CVV"
                type="password"
                value={cardData.cvv}
                onChange={(e) =>
                  setCardData({ ...cardData, cvv: e.target.value })
                }
                borderRadius="md"
              />
            </FormControl>
          </>
        )}

        <Button
          colorScheme="teal"
          size="lg"
          width="100%"
          onClick={handlePaymentSubmit}
        >
          Confirm Payment
        </Button>
      </Box>

      {/* Summary i porosisë */}
      <Box
        bg="white"
        p={6}
        borderRadius="xl"
        boxShadow="lg"
        maxW="300px"
        w="100%"
        minHeight="450px"
      >
        <Text fontWeight="bold" fontSize="2xl" mb={4}>
          Your Orders
        </Text>
        <Text color="gray.600" fontSize="sm" mb={6}>
          Tap + or – to update quantity
        </Text>

        <VStack spacing={3} align="stretch" mb={4}>
          {cartItems.map((item) => (
            <Flex
              key={item.id}
              justify="space-between"
              fontWeight="medium"
              fontSize="md"
            >
              <Text>{item.name}</Text>
              <Text>
                {item.quantity} × ${item.price.toFixed(2)}
              </Text>
            </Flex>
          ))}
        </VStack>

        <Divider mb={6} />

        <Flex justify="space-between" fontWeight="bold" fontSize="xl">
          <Text>Total</Text>
          <Text color="red.600">${totalAmount.toFixed(2)}</Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default CheckoutPage;
