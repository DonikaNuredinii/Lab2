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
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import Card from "components/card/Card";
import AddTableForm from "./components/AddTableForm";
import { MdEdit, MdDelete } from "react-icons/md";

const columnHelper = createColumnHelper();

const TablesTable = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const toast = useToast();

  const fetchTables = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/Table`
      );
      if (!response.ok) {
        throw new Error("Error fetching tables.");
      }
      const data = await response.json();
      console.log("Fetched Tables Data:", data);
      setTables(data);
    } catch (err) {
      console.error("Table fetch failed:", err);
      setError("Failed to load tables.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
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
    columnHelper.accessor("restaurantID", {
      id: "restaurantID",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          RESTAURANT ID
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
    columnHelper.accessor("restaurant.emri", {
      id: "restaurantName",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          RESTAURANT NAME
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
    columnHelper.accessor("qrCode", {
      id: "qrCode",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          QR CODE
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
            aria-label="Edit table"
            icon={<MdEdit />}
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={() => {
              setSelectedTable(info.row.original);
              onEditOpen();
            }}
            mr={2}
          />
          <IconButton
            aria-label="Delete table"
            icon={<MdDelete />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => handleDeleteTable(info.row.original.id)}
          />
        </Flex>
      ),
    }),
  ];

  const handleAddTable = async (newTableData) => {
    console.log("Add Table Data:", newTableData);
    try {
      const dataToSubmit = { ...newTableData };
      dataToSubmit.restaurant = {
        id: newTableData.restaurantID,
        emri: "Placeholder",
      };
      delete dataToSubmit.id;

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/Table`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Failed to add table: ${response.status}`
        );
      }

      toast({
        title: "Table added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchTables();
      onClose();
    } catch (error) {
      console.error("Error adding table:", error);
      toast({
        title: "Adding table failed.",
        description: error.message || error.toString(),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm("Are you sure you want to delete this table?")) {
      return;
    }
    console.log("Delete Table ID:", tableId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/Table/${tableId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Failed to delete table: ${response.status}`
        );
      }

      toast({
        title: "Table deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchTables();
    } catch (error) {
      console.error("Error deleting table:", error);
      toast({
        title: "Deleting table failed.",
        description: error.message || error.toString(),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditTable = async (updatedTableData) => {
    console.log("Edit Table Data:", updatedTableData);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/Table/${updatedTableData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTableData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Failed to update table: ${response.status}`
        );
      }

      toast({
        title: "Table updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchTables();
      onEditClose();
    } catch (error) {
      console.error("Error updating table:", error);
      toast({
        title: "Updating table failed.",
        description: error.message || error.toString(),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Box>Loading tables...</Box>;
  if (error) return <Box>Error: {error}</Box>;
  if (!tables.length) return <Box>No tables found.</Box>;

  return (
    <Card flexDirection="column" w="100%" px="0px" mt="135px" overflowX="auto">
      <Flex px="25px" mb="8px" justifyContent="flex-end" align="center">
        <Button colorScheme="brand" size="md" borderRadius="0" onClick={onOpen}>
          Add Table
        </Button>
      </Flex>
      <Box px="25px">
        <Text color={textColor} fontSize="23px" fontWeight="700" mb="16px">
          Tables
        </Text>
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
            {tables.map((table) => (
              <Tr key={table.id} h="100px">
                {columns.map((column) => (
                  <Td
                    key={column.id}
                    fontSize="14px"
                    borderColor="transparent"
                    py="10px"
                    textAlign="center"
                  >
                    {column.id === "actions"
                      ? column.cell({ row: { original: table } })
                      : column.id === "restaurantName"
                      ? table.restaurant?.emri || "N/A"
                      : table[column.id]}
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
          <ModalHeader>Add New Table</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddTableForm onSubmit={handleAddTable} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Table</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddTableForm
              onSubmit={handleEditTable}
              initialData={selectedTable}
              isEdit={true}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default TablesTable;
