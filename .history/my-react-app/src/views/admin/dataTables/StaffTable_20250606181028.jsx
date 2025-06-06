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
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
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
    <Flex pt={20} px={6} maxW="1400px" mx="auto" direction={{ base: "column", xl: "row" }}>
      <Box flex={{ base: 1, xl: 2 }}>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>Staff</Text>
        <Box overflowX="auto" borderRadius="lg" boxShadow="base" bg="white">
          <Table variant="simple" size="md">
            <Thead bg="gray.100">
              <Tr>
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
                      onClick={() => setSelectedStaff(user)}
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

      <Box flex={{ base: 1, xl: 1 }} ml={{ base: 0, xl: 10 }} mt={{ base: 10, xl: 0 }}>
        <Button colorScheme="brand" w="full" borderRadius="0" onClick={onOpen}>
          Add Staff
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Staff</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Form component will be added here</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default StaffManagement;