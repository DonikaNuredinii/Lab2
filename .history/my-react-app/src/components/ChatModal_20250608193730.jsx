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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const ChatModal = ({ isOpen, onClose, restaurant }) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const toast = useToast();

  const userId = localStorage.getItem("userId"); // ose merr prej context nese e ke

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE}/chatHub`, {
        accessTokenFactory: () => localStorage.getItem("token") // JWT token
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR");

          // Pranon mesazhet që dërgohen nga serveri
          connection.on("ReceiveMessage", (senderId, content) => {
            setMessages(prev => [
              ...prev,
              { senderId, content }
            ]);
          });
        })
        .catch(err => console.error("Connection failed: ", err));
    }
  }, [connection]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const receiverId = restaurant?.userID; // ose ndrysho sipas strukturës

    try {
      await connection.invoke("SendMessage", receiverId, message);
      setMessages(prev => [...prev, { senderId: userId, content: message }]);
      setMessage("");
    } catch (err) {
      console.error("Send error:", err);
      toast({
        title: "Error",
        description: "Message could not be sent.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
                bg={msg.senderId == userId ? "teal.100" : "gray.200"}
                borderRadius="md"
                p={2}
              >
                <Text>{msg.content}</Text>
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
