import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Input,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

const ChatModal = ({ isOpen, onClose, restaurant }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    // Ky është simulim - më vonë lidhe me SignalR
    const newMessage = {
      text: message,
      sender: "you",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chat with {restaurant?.emri}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
            {messages.map((msg, index) => (
              <Box
                key={index}
                bg={msg.sender === "you" ? "teal.100" : "gray.200"}
                borderRadius="md"
                p={2}
              >
                <Text>{msg.text}</Text>
              </Box>
            ))}
          </VStack>

          <Input
            mt={4}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button colorScheme="teal" mt={2} onClick={handleSend} w="full">
            Send
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChatModal;
