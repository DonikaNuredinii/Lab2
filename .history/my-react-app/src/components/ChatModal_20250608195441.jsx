// src/components/ChatModal.jsx
import React, { useEffect, useState } from "react";
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
  Avatar,
  HStack,
} from "@chakra-ui/react";
import * as signalR from "@microsoft/signalr";

const ChatModal = ({ isOpen, onClose, restaurant }) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const toast = useToast();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE}/chatHub`, {
        accessTokenFactory: () => localStorage.getItem("token"),
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
          connection.on("ReceiveMessage", (senderId, content) => {
            setMessages((prev) => [...prev, { senderId, content }]);
          });
        })
        .catch((err) => console.error("Connection failed:", err));
    }
  }, [connection]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const receiverId = restaurant?.userID;
    try {
      await connection.invoke("SendMessage", receiverId, message);
      setMessages((prev) => [...prev, { senderId: userId, content: message }]);
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
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" shadow="xl">
        <ModalHeader bg="teal.500" color="white" borderTopRadius="2xl">
          Chat with {restaurant?.emri}
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto" px={1}>
            {messages.map((msg, index) => (
              <HStack
                key={index}
                justify={msg.senderId == userId ? "flex-end" : "flex-start"}
              >
                {msg.senderId != userId && <Avatar size="sm" name="User" />}
                <Box
                  bg={msg.senderId == userId ? "teal.100" : "gray.200"}
                  borderRadius="xl"
                  p={3}
                  maxW="70%"
                >
                  <Text fontSize="sm">{msg.content}</Text>
                </Box>
              </HStack>
            ))}
          </VStack>

          <HStack mt={4} spacing={2}>
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              flex={1}
              borderRadius="xl"
            />
            <Button
              colorScheme="teal"
              borderRadius="xl"
              px={6}
              onClick={handleSend}
            >
              Send
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChatModal;
