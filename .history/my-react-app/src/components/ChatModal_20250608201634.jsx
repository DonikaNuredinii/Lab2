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
  Avatar,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
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

          setMessages([
            {
              senderId: "bot",
              content:
                "Hey there! I'm here to help you with any questions you might have about our features. Let me know if you need anything!",
            },
          ]);
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
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent
        position="fixed"
        bottom="30px"
        right="30px"
        borderRadius="xl"
        boxShadow="lg"
        overflow="hidden"
        maxW="sm"
      >
        <ModalHeader
          bg="green.600"
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
                alignSelf={msg.senderId == userId ? "flex-end" : "flex-start"}
                spacing={2}
              >
                {msg.senderId !== userId && (
                  <Avatar
                    size="sm"
                    name={msg.senderId === "bot" ? "Support Bot" : "User"}
                    bg={msg.senderId === "bot" ? "green.400" : "gray.400"}
                  />
                )}
                <Box
                  bg={msg.senderId == userId ? "teal.100" : "gray.200"}
                  borderRadius="md"
                  p={2}
                  maxW="220px"
                >
                  <Text fontSize="sm">{msg.content}</Text>
                </Box>
              </HStack>
            ))}
          </VStack>

          <Input
            mt={4}
            placeholder="Send a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            bg="white"
            borderColor="gray.300"
          />
          <Button
            colorScheme="teal"
            mt={2}
            onClick={handleSend}
            w="full"
            fontWeight="bold"
          >
            Send
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChatModal;
