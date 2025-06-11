import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  VStack,
} from "@chakra-ui/react";

const PaymentModal = ({ isOpen, onClose }) => {
  const handlePayment = (method) => {
    onClose();
    alert(`You selected ${method}. Payment process simulated.`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Payment Method</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} py={4}>
            <Button onClick={() => handlePayment("Cash")}>Pay with Cash</Button>
            <Button onClick={() => handlePayment("Card")}>Pay with Card</Button>
            <Button onClick={() => handlePayment("Online")}>Pay Online</Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
