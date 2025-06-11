import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, FormControl, FormLabel,
  Input, RadioGroup, Stack, Radio, useToast
} from "@chakra-ui/react";
import { useState } from "react";

const PaymentModal = ({ isOpen, onClose, totalAmount, orderId }) => {
  const toast = useToast();
  const [method, setMethod] = useState("Cash");
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expire: "",
    cvv: ""
  });

  const handlePaymentSubmit = async () => {
    const paymentDto = {
      orderID: orderId,
      paymentMethod: method,
      status: method === "Cash" ? "Pending" : "Paid",
      amount: totalAmount,
      transactionID: method === "Cash" ? "" : `TXN-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/Payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDto)
      });

      if (!res.ok) throw new Error("Payment failed");

      toast({
        title: "Payment successful!",
        status: "success",
        duration: 3000,
        isClosable: true
      });
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "Payment failed.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Payment Method</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <RadioGroup onChange={setMethod} value={method}>
            <Stack direction="row" spacing={6}>
              <Radio value="Cash">Cash</Radio>
              <Radio value="PayPal">PayPal</Radio>
              <Radio value="Amazon">Amazon Pay</Radio>
              <Radio value="Card">Card</Radio>
            </Stack>
          </RadioGroup>

          {method === "Card" && (
            <Stack spacing={3} mt={4}>
              <FormControl>
                <FormLabel>Name on Card</FormLabel>
                <Input value={cardData.name} onChange={(e) => setCardData({ ...cardData, name: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Card Number</FormLabel>
                <Input value={cardData.number} onChange={(e) => setCardData({ ...cardData, number: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Expire Date</FormLabel>
                <Input placeholder="MM/YY" value={cardData.expire} onChange={(e) => setCardData({ ...cardData, expire: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>CVV</FormLabel>
                <Input type="password" value={cardData.cvv} onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })} />
              </FormControl>
            </Stack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handlePaymentSubmit}>
            Confirm Payment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
