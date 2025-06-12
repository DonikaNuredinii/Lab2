import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Avatar,
  Input,
  Button,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const AdminChatPanel = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const bottomRef = useRef(null);
  const toast = useToast();

  const adminId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // ✅ Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/Messages/conversations`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          }
        );
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        toast({
          title: "Failed to load conversations",
          description: "Please make sure you're logged in as admin.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchConversations();
  }, [token, toast]);

  // ✅ SignalR setup
  useEffect(() => {
    if (!token || !adminId) return;

    const conn = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_WS_BASE}/chatHub`, {
        accessTokenFactory: () => token,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    conn.on("ReceiveMessage", (senderId, content) => {
      if (parseInt(senderId) === parseInt(adminId)) return; // ignore echoed admin messages

      console.log("📨 Live message from:", senderId, content);

      setMessages((prev) => {
        // Only update if the chat window for this sender is open
        if (parseInt(senderId) === parseInt(selectedUser)) {
          return [...prev, { senderId, content }];
        }
        return prev;
      });

      setConversations((prev) => {
        const exists = prev.find((c) => c.userId === senderId);
        if (!exists) return [...prev, { userId: senderId }];
        return prev;
      });

      scrollToBottom();
    });

    conn
      .start()
      .then(() => {
        console.log("✅ SignalR connected");
        setConnection(conn);
      })
      .catch((err) => {
        console.error("❌ SignalR connection failed", err);
      });

    return () => conn.stop();
  }, [token, adminId]); // ❌ selectedUser intentionally excluded

  // ✅ Load messages for selected user
  const loadMessages = async (userId) => {
    setSelectedUser(userId);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/Messages/${adminId}/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      const data = await res.json();
      setMessages(data);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      toast({
        title: "Failed to load chat history",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // ✅ Send message to selected user
  const handleSend = async () => {
    if (!message.trim() || !selectedUser || !connection) return;

    try {
      await connection.invoke("SendMessage", selectedUser, message);
      setMessages((prev) => [...prev, { senderId: adminId, content: message }]);
      setMessage("");
      scrollToBottom();
    } catch (err) {
      toast({
        title: "Failed to send message",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Flex h="100vh" mt="70px" bg="gray.50">
      {/* Sidebar */}
      <Box w="260px" bg="white" p={4} boxShadow="md">
        <Text fontWeight="bold" fontSize="lg" mb={4}>
          Conversations
        </Text>
        <VStack align="stretch" spacing={2}>
          {conversations.map((conv) => (
            <Button
              key={conv.userId}
              variant="ghost"
              justifyContent="start"
              onClick={() => loadMessages(conv.userId)}
              bg={selectedUser === conv.userId ? "teal.100" : "gray.100"}
              _hover={{ bg: "teal.50" }}
            >
              User {conv.userId}
            </Button>
          ))}
        </VStack>
      </Box>

      {/* Chat Window */}
      <Flex flex="1" direction="column" p={6} bg="gray.100">
        <Box flex="1" overflowY="auto" mb={4} pr={2}>
          <VStack spacing={3} align="stretch">
            {messages.map((msg, idx) => {
              const isAdmin = parseInt(msg.senderId) === parseInt(adminId);
              const uniqueKey = `${msg.senderId}-${msg.content}-${idx}`;

              return (
                <HStack
                  key={uniqueKey}
                  justify={isAdmin ? "flex-end" : "flex-start"}
                >
                  {!isAdmin && (
                    <Avatar
                      size="sm"
                      name={`User ${msg.senderId}`}
                      bg="orange.400"
                      color="white"
                    />
                  )}
                  <Box
                    p={3}
                    bg={isAdmin ? "teal.500" : "white"}
                    color={isAdmin ? "white" : "black"}
                    borderRadius="xl"
                    maxW="70%"
                    boxShadow="md"
                  >
                    <Text fontSize="xs" fontWeight="bold" mb={1}>
                      {isAdmin ? "You (Admin)" : `User ${msg.senderId}`}
                    </Text>
                    <Text fontSize="sm">{msg.content}</Text>
                  </Box>
                  {isAdmin && (
                    <Avatar
                      size="sm"
                      name="Admin"
                      bg="teal.500"
                      color="white"
                    />
                  )}
                </HStack>
              );
            })}
            <div ref={bottomRef} />
          </VStack>
        </Box>

        {selectedUser && (
          <>
            <Divider />
            <HStack mt={3} mb={4}>
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                bg="white"
                borderRadius="md"
                boxShadow="sm"
              />
              <Button onClick={handleSend} colorScheme="teal" px={6}>
                Send
              </Button>
            </HStack>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default AdminChatPanel;
