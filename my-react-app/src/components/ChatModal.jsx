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
import { useEffect, useRef, useState } from "react";

const ChatModal = ({ isOpen, onClose, restaurant }) => {
  const [messages, setMessages] = useState([
    {
      senderId: "bot",
      content:
        "Hi there! I'm here to help you with any questions about our menu or services. Let me know if you need anything!",
    },
  ]);
  const [message, setMessage] = useState("");
  const socketRef = useRef(null);
  const toast = useToast();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isOpen) return;

    const wsUrl = `${
      import.meta.env.VITE_WS_BASE
    }/ws?token=${token}&userId=${userId}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error", err);
      toast({
        title: "Connection Error",
        description: "Unable to connect to chat server.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [isOpen]);

  const handleSend = () => {
    if (!message.trim() || socketRef.current.readyState !== WebSocket.OPEN)
      return;

    const newMsg = {
      senderId: userId,
      receiverId: restaurant?.userID,
      content: message,
    };

    socketRef.current.send(JSON.stringify(newMsg));
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent
        bg="white"
        position="fixed"
        bottom="90px"
        right="30px"
        borderRadius="xl"
        boxShadow="xl"
        overflow="hidden"
      >
        <ModalHeader
          bg="#5A7870"
          color="white"
          fontWeight="bold"
          fontSize="md"
          py={3}
        >
          Chat with {restaurant?.emri || "Support"}
          <Text fontSize="xs" fontWeight="normal">
            Usually replies in a few minutes
          </Text>
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody px={4} py={4} bg="gray.50">
          <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
            {messages.map((msg, index) => (
              <HStack
                key={index}
                alignSelf={msg.senderId === userId ? "flex-end" : "flex-start"}
                spacing={2}
              >
                {msg.senderId !== userId && msg.senderId !== "bot" && (
                  <Avatar size="sm" name="Restaurant" />
                )}
                {msg.senderId === "bot" && (
                  <Avatar size="sm" name="Support Bot" bg="green.400" />
                )}
                <Box
                  bg={msg.senderId === userId ? "teal.100" : "gray.200"}
                  borderRadius="lg"
                  p={2}
                  maxW="240px"
                >
                  <Text fontSize="sm">{msg.content}</Text>
                </Box>
              </HStack>
            ))}
          </VStack>

          <Input
            mt={4}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            bg="white"
            borderColor="gray.300"
          />
          <Button
            mt={2}
            onClick={handleSend}
            w="full"
            bg="#5A7870"
            color="white"
            _hover={{ bg: "#4f6d64" }}
          >
            Send
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChatModal;
