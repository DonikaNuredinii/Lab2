import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";

const CustomerForm = ({ onAddCustomer, initialData, isEdit = false }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    userID: 0,
    creationDate: "",
    roleID: null,
  });

  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        password: initialData.password || "",
        userID: initialData.userID || 0,
        creationDate: initialData.creationDate || "",
        roleID: initialData.roleID || null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isEdit
        ? `https://localhost:7076/api/User/${initialData.userID}`
        : "https://localhost:7076/api/User/signup";

      const dataToSend = isEdit
        ? formData
        : {
            ...formData,
            creationDate: undefined,
            userID: undefined,
            roleID: undefined,
          };

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          `Failed to ${isEdit ? "update" : "add"} customer: ${
            response.status
          } ${response.statusText}. Details: ${errorText}`
        );
      }

      onAddCustomer(dataToSend);
      toast({
        title: `Customer ${isEdit ? "updated" : "added"} successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          isEdit ? "update" : "add"
        } customer. Please try again.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter customer name"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Surname</FormLabel>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter customer surname"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter customer email"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter customer phone number"
          />
        </FormControl>

        {!isEdit && (
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter customer password"
            />
          </FormControl>
        )}

        <Button type="submit" colorScheme="brand" size="lg">
          {isEdit ? "Update Customer" : "Add Customer"}
        </Button>
      </VStack>
    </form>
  );
};

export default CustomerForm;
