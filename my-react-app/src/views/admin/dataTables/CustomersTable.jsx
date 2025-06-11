import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Flex,
  useToast,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";

const API_BASE = import.meta.env.VITE_API_BASE;

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    userID: null,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    roleID: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const textColor = useColorModeValue("secondaryGray.900", "white");

  useEffect(() => {
    fetchCustomers();
    fetchRoles();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/User`);
      const data = await res.json();
      const userOnly = data.filter((user) => user.roleName === "User");
      setCustomers(userOnly);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load customers.",
        status: "error",
      });
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/Role/roles`);
      const data = await res.json();
      const userRole = data.find((role) => role.roleName === "User");
      if (userRole) {
        setRoles([userRole]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load roles.",
        status: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      userID: null,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      roleID: roles[0]?.roleID || "",
    });
  };

  const handleAddCustomer = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/User`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add customer");

      toast({
        title: "Success",
        description: "Customer added.",
        status: "success",
      });

      fetchCustomers();
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await fetch(`${API_BASE}/api/User/${id}`, { method: "DELETE" });
      toast({
        title: "Deleted",
        description: "Customer has been removed.",
        status: "info",
      });
      fetchCustomers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer.",
        status: "error",
      });
    }
  };

  return (
    <>
      <Box h="250px" />
      <Box px="25px" mb="24px" maxW="1300px" mx="auto">
        <Box overflowX="auto" borderRadius="2xl" boxShadow="base" bg="white">
          <Flex px="25px" mt="6" justifyContent="flex-end">
            <Button colorScheme="brand" size="md" borderRadius="0" onClick={() => {
              resetForm();
              onOpen();
            }}>
              Add Customer
            </Button>
          </Flex>
          <Table variant="simple" color="gray.500" mb="24px">
            <Thead>
              <Tr h="60px">
                <Th textAlign="center" fontSize="12px" fontWeight="600" color="gray.400">
                  NAME
                </Th>
                <Th textAlign="center" fontSize="12px" fontWeight="600" color="gray.400">
                  EMAIL
                </Th>
                <Th textAlign="center" fontSize="12px" fontWeight="600" color="gray.400">
                  PHONE
                </Th>
                <Th textAlign="center" fontSize="12px" fontWeight="600" color="gray.400">
                  ROLE
                </Th>
                <Th textAlign="center" fontSize="12px" fontWeight="600" color="gray.400">
                  ACTIONS
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((user) => (
                <Tr key={user.userID} h="100px">
                  <Td textAlign="center" fontWeight="700" color={textColor}>
                    {user.firstName} {user.lastName}
                  </Td>
                  <Td textAlign="center" fontWeight="400" color={textColor}>
                    {user.email}
                  </Td>
                  <Td textAlign="center" fontWeight="700" color={textColor}>
                    {user.phoneNumber}
                  </Td>
                  <Td textAlign="center" fontWeight="500" color={textColor}>
                    {user.roleName}
                  </Td>
                  <Td textAlign="center">
                    {/* Could add Edit here if needed */}
                    <IconButton
                      aria-label="Delete customer"
                      icon={<MdDelete />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteCustomer(user.userID)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Modal for Add Customer */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch" pb={6}>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  placeholder="Select role"
                  value={formData.roleID}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roleID: parseInt(e.target.value),
                    })
                  }
                >
                  {roles.map((role) => (
                    <option key={role.roleID} value={role.roleID}>
                      {role.roleName}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Flex justifyContent="flex-end" pt={4}>
                <Button colorScheme="teal" onClick={handleAddCustomer}>
                  Save Customer
                </Button>
              </Flex>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomerManagement;
