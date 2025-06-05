import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  Heading,
} from "@chakra-ui/react";

const StaffAndRoleManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    roleID: "",
  });

  const toast = useToast();

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/User`);
      const data = await res.json();
      setStaffList(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load staff", status: "error" });
    }
  };

  const fetchRoles = async () => {
    try {
      fetch(`${import.meta.env.VITE_API_BASE}/api/Role/roles`)

      const data = await res.json();
      setRoles(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load roles", status: "error" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/User`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, creationDate: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Failed to create user");
      toast({ title: "Success", description: "Staff member added", status: "success" });
      fetchStaff();
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchRoles();
  }, []);

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Staff & Role Management</Heading>
      <VStack spacing={4} align="stretch" mb={8}>
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
        <FormControl>
          <FormLabel>Phone Number</FormLabel>
          <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input name="password" type="password" value={formData.password} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Role</FormLabel>
          <Select name="roleID" value={formData.roleID} onChange={handleChange}>
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.roleID} value={role.roleID}>{role.roleName}</option>
            ))}
          </Select>
        </FormControl>
        <Button colorScheme="teal" onClick={handleSubmit}>Add Staff</Button>
      </VStack>

      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Role</Th>
          </Tr>
        </Thead>
        <Tbody>
          {staffList.map((user) => (
            <Tr key={user.userID}>
              <Td>{user.firstName} {user.lastName}</Td>
              <Td>{user.email}</Td>
              <Td>{user.phoneNumber || "-"}</Td>
              <Td>{user.roleName || "-"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default StaffAndRoleManagement;
