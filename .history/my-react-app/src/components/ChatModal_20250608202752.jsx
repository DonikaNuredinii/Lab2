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
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

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
        .catch((err) => console.error("Connection failed: ", err));
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
    <Modal isOpen={isOpen} onClose={onClose} size="sm" motionPreset="slideInBottom">
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
        <ModalHeader bg="#5A7870" color="white" fontWeight="bold" fontSize="md" py={3}>
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
          </VStack>

          <Input
            mt={4}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            bg="white"
            borderColor="gray.300"
          />
       <Button mt={2} onClick={handleSend} w="full"bg="#5A7870"color="white"_hover={{ bg: "#4f6d64" }}>
  Send
</Button>

        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChatModal;