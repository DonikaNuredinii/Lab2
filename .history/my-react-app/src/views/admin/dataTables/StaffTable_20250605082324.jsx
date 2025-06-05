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
  VStack,
  useToast,
  Flex,
  Collapse,
  Text,
} from "@chakra-ui/react";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    roleID: "",
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
    } catch (error) {
      toast({ title: "Error", description: "Failed to load staff.", status: "error" });
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/Role/roles`);
      const data = await res.json();
      setRoles(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load roles.", status: "error" });
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/User`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add staff");
      toast({ title: "Success", description: "Staff member added.", status: "success" });
      fetchStaff();
      setShowForm(false);
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  return (
    <Box p={20} pb={40} maxW="1300px" mx="auto">
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">Staff</Text>
        <Button colorScheme="blue" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Staff"}
        </Button>
      </Flex>

      <Collapse in={showForm} animateOpacity>
        <Box p={6} borderWidth="1px" borderRadius="lg" bg="gray.50" mb={10} boxShadow="md">
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>First Name</FormLabel>
              <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Role</FormLabel>
              <Select placeholder="Select role" value={formData.roleID} onChange={(e) => setFormData({ ...formData, roleID: parseInt(e.target.value) })}>
                {roles.map((role) => (
                  <option key={role.roleID} value={role.roleID}>{role.roleName}</option>
                ))}
              </Select>
            </FormControl>

            <Button colorScheme="teal" onClick={handleSubmit}>Save Staff</Button>
          </VStack>
        </Box>
      </Collapse>

      <Box overflowX="auto" borderRadius="lg" boxShadow="base" bg="white">
        <Table variant="simple" size="md">
          <Thead bg="gray.100">
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {staff.map((user) => (
              <Tr
                key={user.userID}
                _hover={{ bg: "gray.50" }}
                transition="all 0.2s"
              >
                <Td fontWeight="medium">{user.firstName} {user.lastName}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phoneNumber}</Td>
                <Td>
                  <Box
                    bg="gray.100"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                    display="inline-block"
                    fontWeight="semibold"
                    color="gray.700"
                  >
                    {user.roleName}
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default StaffManagement;

