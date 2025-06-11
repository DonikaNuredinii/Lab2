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
  ModalHeader,
} from "@chakra-ui/react";

const PaymentSidebar = ({
  totalAmount,
  orderId,
  onClose,
  cartItems,
  isOpen,
  method,
  setMethod,
}) => {
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [showInvoiceModal, setShowInvoiceModal] = useState(false); // ✅ shtuar

  const handlePaymentSubmit = async () => {
    if (!firstName || !lastName || !phoneNumber || !email ) {
      toast({
        title:
          "Please fill all required fields (First Name, Last Name, Phone, Email).",
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

 const isCash = method === "Cash";
const isCard = method === "Card";

const paymentDto = {
  orderID: orderId,
  paymentMethod: method,
  status: isCash ? "Pending" : "Paid",
  amount: totalAmount,
  transactionID: isCash ? "" : `TXN-${Date.now()}`,
  createdAt: new Date().toISOString(),
  firstName,
  lastName,
  phoneNumber,
  email,
  additionalInfo,
  cardData: isCard ? cardData : null,
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

      setShowInvoiceModal(true); // ✅ faturë pas pagesës

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
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
 <ModalBody p={10}>
  <Box
    border="1px solid #E2E8F0"
    borderRadius="2xl"
    p={10}
    w="100%"
    maxW="7xl"
    mx="auto"
    bg="white"
  >
    <Flex
      gap={10}
      align="start"
      justify="center"
      flexDirection={{ base: "column", md: "row" }}
    >
              {/* Form container */}
              <Box flex="1" maxW="600px" fontSize="lg" lineHeight="tall" overflowY="auto"  mx="auto">
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
                      <Input value={cardData.name} onChange={(e) => setCardData({ ...cardData, name: e.target.value })} />
                    </FormControl>
                    <FormControl mb={8} isRequired>
                      <FormLabel>Card Number</FormLabel>
                      <Input value={cardData.number} onChange={(e) => setCardData({ ...cardData, number: e.target.value })} />
                    </FormControl>
                    <FormControl mb={8} isRequired>
                      <FormLabel>Expire Date</FormLabel>
                      <Input value={cardData.expire} onChange={(e) => setCardData({ ...cardData, expire: e.target.value })} />
                    </FormControl>
                    <FormControl mb={12} isRequired>
                      <FormLabel>CVV</FormLabel>
                      <Input type="password" value={cardData.cvv} onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })} />
                    </FormControl>
                  </>
                )}

                <Button
                  width="100%"
                  colorScheme="teal"
                  onClick={handlePaymentSubmit}
                  mb={8}
                  fontSize="1xl"
                >
                  Confirm Payment
                </Button>

                <Button variant="ghost" width="full" onClick={onClose}>
                  Cancel
                </Button>
              </Box>

              {/* Order summary */}
              <Box flex="1" maxW="420px" bg="gray.50" borderRadius="xl" p={6} boxShadow="md" overflowY="auto"  mx="auto"  alignSelf="stretch">
                <Text fontSize="3xl" fontWeight="bold" mb={6}>Your Orders</Text>
            <Text mb={2} color="gray.600" fontWeight="medium" fontSize="sm">
  Tap + or – to update quantity
</Text>

{/* Header row */}
<Flex
  justify="space-between"
  px={1}
  mb={2}
  fontSize="sm"
  fontWeight="semibold"
  color="gray.500"
>
  <Box flex="1">Item</Box>
  <Box width="80px" textAlign="center">Qty</Box>
  <Box width="60px" textAlign="right">Price</Box>
</Flex>

<Divider mb={3} />

<VStack spacing={4} align="stretch" mb={8}>
  {cartItems.map((item) => (
    <Flex key={item.id} justify="space-between" fontSize="md">
      <Box flex="1" fontWeight="medium">
        {item.name}
      </Box>
      <Box width="80px" textAlign="center">
        {item.quantity}
      </Box>
      <Box width="60px" textAlign="right" color="red.600" fontWeight="semibold">
        ${(item.price * item.quantity).toFixed(2)}
      </Box>
    </Flex>
  ))}
</VStack>
<Divider mb={4} />
<Flex
  justify="space-between"
  align="center"
  fontWeight="bold"
  fontSize="xl"
  pt={2}
  borderTop="1px solid #E2E8F0"
>

                  <Text>Total</Text>
                  <Text color="red.600">${totalAmount.toFixed(2)}</Text>
                </Flex>
              </Box>
            </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* ✅ Invoice Modal */}
      <Modal isOpen={showInvoiceModal} onClose={() => {
        setShowInvoiceModal(false);
        onClose();
      }} size="lg">
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
              colorScheme="orange"
              onClick={() => {
                setShowInvoiceModal(false);
                onClose();
              }}
            >
              Close
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PaymentSidebar;
