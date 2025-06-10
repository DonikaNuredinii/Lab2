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
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("userId")); // Check login status on mount
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    console.log("Restaurant prop:", restaurant);

    // Ensure token, userId, and restaurant userID are valid
    if (!token || !userId || !restaurant?.userID) {
      const errorMessage =
        !token || !userId
          ? "Missing authentication information."
          : "Restaurant information is incomplete.";

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const wsUrl = `${
      import.meta.env.VITE_WS_BASE
    }/ws?token=${token}&userId=${userId}`;

    console.log("WebSocket URL:", wsUrl);

    socketRef.current = new WebSocket(wsUrl);

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
  }, [isOpen, token, userId, restaurant?.userID]);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || socketRef.current.readyState !== WebSocket.OPEN)
      return;

    const receiverId = parseInt(restaurant?.userID);

    if (Number.isNaN(receiverId)) {
      toast({
        title: "Invalid Restaurant ID",
        description: "The restaurant ID is not valid.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newMsg = {
      receiverId: receiverId,
      content: message,
    };

    try {
      socketRef.current.send(JSON.stringify(newMsg));
      setMessages((prev) => [...prev, { ...newMsg, senderId: userId }]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Send Error",
        description: "Failed to send message.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Conditionally render the modal based on login status
  if (!isLoggedIn) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please Log In</ModalHeader>
          <ModalBody>You need to log in to use the chat feature.</ModalBody>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    );
  }

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
            <div ref={messagesEndRef} /> {/* Scroll to bottom */}
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
