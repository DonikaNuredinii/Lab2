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
  Text,
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
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
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
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

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
      const method = formData.userID ? "PUT" : "POST";
      const endpoint = formData.userID
        ? `${import.meta.env.VITE_API_BASE}/api/User/${formData.userID}`
        : `${import.meta.env.VITE_API_BASE}/api/User`;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save staff");
      toast({ title: "Success", description: "Staff member saved.", status: "success" });
      fetchStaff();
      onClose();
      setFormData({
        userID: null,
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        roleID: "",
      });
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE}/api/User/${id}`, { method: "DELETE" });
      toast({ title: "Deleted", description: "Staff member removed.", status: "info" });
      fetchStaff();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete staff.", status: "error" });
    }
  };

  return (
    <>
      <Box h="250px" />
      <Box px="50px" mb="24px" maxW="1600px" mx="auto">
        <Box overflowX="auto" borderRadius="2xl" boxShadow="base" bg="white">
          <Table variant="simple" color="gray.500" mb="24px">
            <Thead>
              <Tr h="60px">
                <Th textAlign="center" fontSize="12px" fontWeight="600" color="gray.400">NAME</Th>
                <Th textAlign="center" fontSize="12px" fontWeight="600" color="gray.400">EMAIL</Th>
                <Th textAlign="center" fontSize="12px" fontWeight="600" color="gray.400">PHONE</Th>
                <Th textAlign="center" fontSize="12px" fontWeight="600" color="gray.400">ROLE</Th>
                <Th textAlign="center" fontSize="12px" fontWeight="600" color="gray.400">ACTIONS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {staff.map((user) => (
                <Tr key={user.userID} h="100px">
                  <Td textAlign="center" fontWeight="700" color={textColor}>{user.firstName} {user.lastName}</Td>
                  <Td textAlign="center" fontWeight="400" color={textColor}>{user.email}</Td>
                  <Td textAlign="center" fontWeight="700" color={textColor}>{user.phoneNumber}</Td>
                  <Td textAlign="center" fontWeight="500" color={textColor}>{user.roleName}</Td>
                  <Td textAlign="center">
                    <IconButton
                      aria-label="Edit staff"
                      icon={<MdEdit />}
                      size="sm"
                      variant="ghost"
                      colorScheme="gray"
                      onClick={() => {
                        setFormData({
                          userID: user.userID,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          email: user.email,
                          phoneNumber: user.phoneNumber,
                          password: "",
                          roleID: user.roleID,
                        });
                        onOpen();
                      }}
                      mr={2}
                    />
                    <IconButton
                      aria-label="Delete staff"
                      icon={<MdDelete />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteStaff(user.userID)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{formData.userID ? "Edit Staff" : "Add New Staff"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch" pb={6}>
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
              <Flex justifyContent="flex-end" pt={4}>
                <Button colorScheme="teal" onClick={handleSubmit}>
                  {formData.userID ? "Update Staff" : "Save Staff"}
                </Button>
              </Flex>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StaffManagement;
