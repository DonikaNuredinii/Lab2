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
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handlePaymentSubmit = async () => {
    // Validim bazik
    if (!firstName || !lastName || !phoneNumber) {
      toast({
        title: "Please fill required fields (First Name, Last Name, Phone).",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
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
      additionalInfo,
      address,
      zipCode,
      phoneNumber,
      email,
      cardName: cardData.name,
      cardNumber: cardData.number,
      cardExpire: cardData.expire,
      cardCVV: cardData.cvv,
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
      borderLeft="1px solid #ccc"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Payment
      </Text>

      <FormControl mb={4} isRequired>
        <FormLabel>First Name</FormLabel>
        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Last Name</FormLabel>
        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Additional Info</FormLabel>
        <Input value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Address</FormLabel>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Zip Code</FormLabel>
        <Input
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
      </FormControl>

      <FormControl mb={4} isRequired>
        <FormLabel>Phone Number</FormLabel>
        <Input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Card Number</FormLabel>
            <Input
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Expire Date</FormLabel>
            <Input
              placeholder="MM/YY"
              value={cardData.expire}
              onChange={(e) => setCardData({ ...cardData, expire: e.target.value })}
            />
          </FormControl>
          <FormControl mb={4} isRequired>
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
  className="broken-border-button b"
  mb={4}
  mt={4}
  color="gray.900"
>
  Place Order
</Button>

      <Button mt={4} variant="ghost" width="full" onClick={onClose}>
        Cancel
      </Button>
    </Box>
  );
};

export default PaymentSidebar;
