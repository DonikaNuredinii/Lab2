import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import Card from "components/card/Card";
import { MdEdit, MdDelete, MdLocationOn } from "react-icons/md";
import CustomerForm from "./components/CustomerForm";

const columnHelper = createColumnHelper();

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerAddress, setSelectedCustomerAddress] = useState(null);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isAddressOpen,
    onOpen: onAddressOpen,
    onClose: onAddressClose,
  } = useDisclosure();
  const toast = useToast();

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/Customer`);
      if (!response.ok) {
        throw new Error("Error fetching customer data.");
      }
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load customer data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          ID
        </Text>
      ),
      cell: (info) => (
        <Text
          color={textColor}
          fontSize="sm"
          fontWeight="700"
          textAlign="center"
        >
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("firstName", {
      id: "firstName",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          NAME
        </Text>
      ),
      cell: (info) => (
        <Text
          color={textColor}
          fontSize="sm"
          fontWeight="700"
          textAlign="center"
        >
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("lastName", {
      id: "lastName",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          SURNAME
        </Text>
      ),
      cell: (info) => (
        <Text
          color={textColor}
          fontSize="sm"
          fontWeight="700"
          textAlign="center"
        >
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          EMAIL
        </Text>
      ),
      cell: (info) => (
        <Text
          color={textColor}
          fontSize="sm"
          fontWeight="400"
          textAlign="center"
        >
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("phoneNumber", {
      id: "phoneNumber",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          PHONE
        </Text>
      ),
      cell: (info) => (
        <Text
          color={textColor}
          fontSize="sm"
          fontWeight="700"
          textAlign="center"
        >
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("actions", {
      id: "actions",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          ACTIONS
        </Text>
      ),
      cell: (info) => (
        <Flex justifyContent="center">
          <IconButton
            aria-label="Edit customer"
            icon={<MdEdit />}
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={() => {
              setSelectedCustomer(info.row.original);
              onEditOpen();
            }}
            mr={2}
          />
          <IconButton
            aria-label="View address"
            icon={<MdLocationOn />}
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={async () => {
              try {
                const customerId = info.row.original.userID; // Assuming userID is the correct property for the user ID
               const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/CustomerAddress/byuser/${customerId}`);

                if (!response.ok) {
                  throw new Error("Failed to fetch customer address");
                }
                const addressData = await response.json();
                setSelectedCustomerAddress(addressData);
                onAddressOpen();
              } catch (error) {
                console.error("Error fetching customer address:", error);
                setSelectedCustomerAddress(null);
                onAddressOpen();
              }
            }}
            mr={2}
          />
          <IconButton
            aria-label="Delete customer"
            icon={<MdDelete />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => handleDeleteCustomer(info.row.original.userID)}
          />
        </Flex>
      ),
    }),
  ];

  const handleDeleteCustomer = async (customerId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this customer? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
       `${import.meta.env.VITE_API_BASE}/api/User/${customerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Failed to delete customer: ${response.status}`
        );
      }

      await fetchCustomers();
      toast({
        title: "Customer deleted successfully",
        description: "The customer has been permanently removed.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error deleting customer:", error);

      // Attempt to read and log the response body for more details
      if (error.response) {
        error.response
          .text()
          .then((text) => {
            console.error("Backend Error Details:", text);
          })
          .catch((e) =>
            console.error("Failed to read error response body:", e)
          );
      }

      toast({
        title: "Deletion failed",
        description:
          error.message ||
          "There was an error deleting the customer. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleAddCustomer = async (newCustomerData) => {
    try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/Customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomerData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add customer: ${response.status}`);
      }

      await fetchCustomers();
      onClose();
      toast({
        title: "Customer added.",
        description: "The new customer has been added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding customer:", error);
      toast({
        title: "Adding customer failed.",
        description: `There was an error adding the customer: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditCustomer = async (updatedCustomerData) => {
    setCustomers(
      customers.map((cust) =>
        cust.userID === updatedCustomerData.userID ? updatedCustomerData : cust
      )
    );
    onEditClose();

    toast({
      title: "Customer updated successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  if (loading) return <div>Loading customer data...</div>;
  if (error) return <div>{error}</div>;
  if (!customers.length) return <div>No customers found.</div>;

  return (
    <>
      <Box h="250px" />
      <Card flexDirection="column" w="100%" px="0px" overflowX="auto">
        <Flex px="25px" mb="8px" justifyContent="flex-end" align="center">
          <Button
            colorScheme="brand"
            size="md"
            borderRadius="0"
            onClick={onOpen}
          >
            Add Customer
          </Button>
        </Flex>

        <Box px="25px" mb="24px">
          <Table variant="simple" color="gray.500" mb="24px">
            <Thead>
              <Tr h="60px">
                {columns.map((column) => (
                  <Th
                    key={column.id}
                    borderColor={borderColor}
                    textAlign="center"
                  >
                    {column.header()}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((customer) => (
                <Tr key={customer.userID} h="100px">
                  {columns.map((column) => (
                    <Td
                      key={column.id}
                      fontSize="14px"
                      borderColor="transparent"
                      py="10px"
                      textAlign="center"
                    >
                      {column.cell({
                        getValue: () => customer[column.id],
                        row: { original: customer },
                      })}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Customer</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CustomerForm onAddCustomer={handleAddCustomer} />
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal isOpen={isEditOpen} onClose={onEditClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Customer</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedCustomer && (
                <CustomerForm
                  initialData={selectedCustomer}
                  isEdit={true}
                  onAddCustomer={handleEditCustomer}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal isOpen={isAddressOpen} onClose={onAddressClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Customer Address</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedCustomerAddress ? (
                <VStack align="stretch" spacing={2}>
                  <Text>
                    Address Line: {selectedCustomerAddress.addressLine}
                  </Text>
                  <Text>City: {selectedCustomerAddress.city}</Text>
                  <Text>Postal Code: {selectedCustomerAddress.postalCode}</Text>
                </VStack>
              ) : (
                <Text>No address data available.</Text>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Card>
    </>
  );
};

export default CustomersTable;
