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
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent bg="#5A7870" color="white">
        <ModalHeader borderBottom="1px solid #d9d9d9">Chat with {restaurant?.emri}</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto" mb={3}>
            {messages.map((msg, index) => (
              <HStack
                key={index}
                justify={msg.senderId == userId ? "flex-end" : "flex-start"}
              >
                {msg.senderId != userId && <Avatar size="sm" name="User" />}
                <Box
                  bg={msg.senderId == userId ? "whiteAlpha.300" : "whiteAlpha.200"}
                  px={4}
                  py={2}
                  borderRadius="xl"
                  maxW="70%"
                >
                  <Text>{msg.content}</Text>
                </Box>
                {msg.senderId == userId && <Avatar size="sm" name="Me" />}
              </HStack>
            ))}
          </VStack>

          <HStack>
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              bg="white"
              color="black"
              borderRadius="xl"
            />
            <Button
              colorScheme="whiteAlpha"
              bg="white"
              color="#5A7870"
              onClick={handleSend}
              borderRadius="xl"
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
