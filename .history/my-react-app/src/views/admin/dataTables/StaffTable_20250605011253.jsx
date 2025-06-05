import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";

const StaffManager = () => {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    roleId: "",
  });
  const toast = useToast();

  useEffect(() => {
    fetchStaff();
    fetchRoles();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/User`);
      const data = await res.json();
      setStaff(data);
    } catch {
      toast({ title: "Error", description: "Failed to load staff.", status: "error" });
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/Role/roles`);
      const data = await res.json();
      setRoles(data);
    } catch {
      toast({ title: "Error", description: "Failed to load roles.", status: "error" });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/User`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          roleID: parseInt(formData.roleId),
          creationDate: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to add staff.");
      toast({ title: "Success", description: "Staff member added", status: "success" });
      fetchStaff();
    } catch {
      toast({ title: "Error", description: "Failed to add staff.", status: "error" });
    }
  };

  return (
    <Box p={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Staff Management</Text>

      <VStack spacing={4} align="stretch" mb={8}>
        <Flex gap={4} flexWrap="wrap">
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input name="firstName" value={formData.firstName} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input name="lastName" value={formData.lastName} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input name="email" value={formData.email} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" value={formData.password} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Role</FormLabel>
            <Select name="roleId" placeholder="Select a role" value={formData.roleId} onChange={handleChange}>
              {roles.map((role) => (
                <option key={role.roleID} value={role.roleID}>{role.roleName}</option>
              ))}
            </Select>
          </FormControl>
        </Flex>

        <Button colorScheme="teal" onClick={handleSubmit}>Add Staff</Button>
      </VStack>

      <Box borderRadius="md" overflowX="auto" bg="white" p={4} shadow="md">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {staff.map((user) => (
              <Tr key={user.userID}>
                <Td>{user.firstName} {user.lastName}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phoneNumber}</Td>
                <Td>{user.roleName}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default StaffManager;