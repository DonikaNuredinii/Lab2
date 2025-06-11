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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";

const PaymentSidebar = ({ isOpen, onClose, totalAmount, orderId, method, setMethod }) => {
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
    // Validim bazik
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

    // Validim kartelës nëse është Card
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
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent p={6}>
        <ModalHeader textAlign="center" fontWeight="bold" fontSize="2xl">
          Payment
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Additional Info</FormLabel>
            <Input
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Additional Info"
            />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Address</FormLabel>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Zip Code</FormLabel>
            <Input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Zip Code"
            />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
            />
          </FormControl>

          <FormControl mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
            />
          </FormControl>

          <RadioGroup
            onChange={setMethod}
            value={method}
            mb={6}
          >
            <Stack direction="row" spacing={6}>
              <Radio value="Cash">Cash</Radio>
              <Radio value="PayPal" isDisabled>
                PayPal
              </Radio>
              <Radio value="Amazon" isDisabled>
                Amazon Pay
              </Radio>
              <Radio value="Card">Card</Radio>
            </Stack>
          </RadioGroup>

          {method === "Card" && (
            <>
              <FormControl mb={4} isRequired>
                <FormLabel>Name on Card</FormLabel>
                <Input
                  value={cardData.name}
                  onChange={(e) =>
                    setCardData({ ...cardData, name: e.target.value })
                  }
                  placeholder="Name on Card"
                />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>Card Number</FormLabel>
                <Input
                  value={cardData.number}
                  onChange={(e) =>
                    setCardData({ ...cardData, number: e.target.value })
                  }
                  placeholder="Card Number"
                  maxLength={16}
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
                />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel>CVV</FormLabel>
                <Input
                  type="password"
                  value={cardData.cvv}
                  onChange={(e) =>
                    setCardData({ ...cardData, cvv: e.target.value })
                  }
                  maxLength={4}
                />
              </FormControl>
            </>
          )}
        </ModalBody>

        <ModalFooter flexDirection="column" gap={3}>
          <Button
            width="100%"
            colorScheme="teal"
            onClick={handlePaymentSubmit}
            className="broken-border-button b"
            color="gray.900"
          >
            Confirm Payment
          </Button>

          <Button width="100%" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentSidebar;
