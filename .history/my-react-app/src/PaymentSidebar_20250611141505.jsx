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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

const PaymentSidebar = ({ totalAmount, orderId, onClose }) => {
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handlePaymentSubmit = async () => {
    // Validim bazik i fushave kryesore
    if (!firstName || !lastName || !phoneNumber) {
      toast({
        title: "Please fill required fields (First Name, Last Name, Phone).",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validim i të dhënave të kartës nëse është zgjedhur karta
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
      // Mund të shtosh validime të tjera më të avancuara këtu
    }

    // Përgatit DTO-n për dërgim në backend
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
    <Box
      position="fixed"
      right="0"
      top="0"
      height="100vh"
      width={{ base: "100%", md: "400px" }}
      bg="white"
      boxShadow="xl"
      p={6}
      overflowY="auto"
      zIndex="20"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Payment
      </Text>

      <FormControl mb={4} isRequired>
        <FormLabel>First Name</FormLabel>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
        />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Last Name</FormLabel>
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
        />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Phone Number</FormLabel>
        <Input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Additional Info</FormLabel>
        <Input
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Any additional information"
        />
      </FormControl>

      <RadioGroup onChange={setMethod} value={method} mb={6}>
        <Stack direction="row" spacing={6}>
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
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              placeholder="Name as on card"
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Card Number</FormLabel>
            <Input
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength={19}
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Expire Date</FormLabel>
            <Input
              placeholder="MM/YY"
              value={cardData.expire}
              onChange={(e) => setCardData({ ...cardData, expire: e.target.value })}
              maxLength={5}
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>CVV</FormLabel>
            <Input
              type="password"
              value={cardData.cvv}
              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
              maxLength={4}
            />
          </FormControl>
        </>
      )}

      <Button colorScheme="teal" width="full" onClick={handlePaymentSubmit}>
        Place Order
      </Button>

      <Button mt={4} variant="ghost" width="full" onClick={onClose}>
        Cancel
      </Button>
    </Box>
  );
};

export default PaymentSidebar;
