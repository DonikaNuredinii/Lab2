import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7076/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      const { token, user } = data;

      if (token && user) {
        // Save token and user in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Set authenticated flag
        setIsAuthenticated(true);

        // Navigate based on role
        if (user.role === "Superadmin") {
          navigate("/superadmin");
        } else if (user.role === "Admin") {
          navigate("/admin");
        } else if (user.role === "User" || user.role === "user") {
          navigate("/online-menu");
        } else {
          console.warn("Unknown role. Redirecting to home.");
          navigate("/");
        }

        toast({
          title: "Login successful.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Invalid token or user data.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={6} borderWidth={1} borderRadius="md">
      <Heading mb={6}>Login</Heading>
      <form onSubmit={handleLogin}>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl mb={6}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <Button colorScheme="teal" type="submit" width="full">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default AuthForm;
