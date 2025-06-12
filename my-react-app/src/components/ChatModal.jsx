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
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const ChatModal = ({ isOpen, onClose, restaurant }) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([
    {
      senderId: "bot",
      content:
        "Hi there! I'm here to help you with any questions about our menu or services. Let me know if you need anything!",
    },
  ]);
  const [message, setMessage] = useState("");
  const [adminUserId, setAdminUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const messagesEndRef = useRef(null);
  const toast = useToast();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch admin user ID
  useEffect(() => {
    setIsLoggedIn(!!userId);

    const fetchAdminUserId = async () => {
      if (!restaurant?.id) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/Messages/admin/${restaurant.id}`
        );
        const data = await res.json();
        setAdminUserId(data.userId);
      } catch (err) {
        toast({
          title: "Error",
          description: "Could not find restaurant admin.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    if (isOpen) fetchAdminUserId();
  }, [isOpen, restaurant, toast, userId]);

  // Setup SignalR connection
  useEffect(() => {
    if (!isOpen || !token || !userId || !adminUserId) return;

    const connectSignalR = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_WS_BASE}/chatHub`, {
          accessTokenFactory: () => token, // if using JWT
        })

        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();

      connection.on("ReceiveMessage", (senderId, content) => {
        setMessages((prev) => [...prev, { senderId, content }]);
      });

      try {
        await connection.start();
        console.log("✅ SignalR connected");
        setConnection(connection);
      } catch (error) {
        console.error("❌ SignalR connection failed", error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to the chat server.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    connectSignalR();

    return () => {
      connection?.stop();
    };
  }, [isOpen, token, userId, adminUserId, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !connection || !adminUserId) return;

    try {
      await connection.invoke("SendMessage", adminUserId, message);
      setMessages((prev) => [...prev, { senderId: userId, content: message }]);
      setMessage("");
    } catch (err) {
      console.error("Send failed:", err);
      toast({
        title: "Send Error",
        description: "Could not send your message.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please Log In</ModalHeader>
          <ModalCloseButton />
          <ModalBody>You need to log in to use the chat feature.</ModalBody>
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
        <ModalHeader bg="#5A7870" color="white" py={3} fontSize="md">
          Chat with {restaurant?.emri || "Support"}
          <Text fontSize="xs" fontWeight="normal">
            Usually replies in a few minutes
          </Text>
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody px={4} py={4} bg="gray.50">
          <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
            {messages.map((msg, idx) => (
              <HStack
                key={idx}
                alignSelf={msg.senderId == userId ? "flex-end" : "flex-start"}
                spacing={2}
              >
                {msg.senderId !== userId && msg.senderId !== "bot" && (
                  <Avatar size="sm" name="Restaurant" />
                )}
                {msg.senderId === "bot" && (
                  <Avatar size="sm" name="Support Bot" bg="green.400" />
                )}
                <Box
                  bg={msg.senderId == userId ? "teal.100" : "gray.200"}
                  borderRadius="lg"
                  p={2}
                  maxW="240px"
                >
                  <Text fontSize="sm">{msg.content}</Text>
                </Box>
              </HStack>
            ))}
            <div ref={messagesEndRef} />
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
