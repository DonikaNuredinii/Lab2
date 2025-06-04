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
import AddRestaurantForm from "./components/AddRestaurantForm";
import { MdEdit, MdDelete } from "react-icons/md";

const columnHelper = createColumnHelper();

const RestaurantsTable = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const toast = useToast();

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/Restaurant`
      );
      if (!response.ok) {
        throw new Error("Error fetching restaurants.");
      }
      const data = await response.json();
      console.log("Fetched Restaurants Data:", data);
      setRestaurants(data);
    } catch (err) {
      console.error("Restaurant fetch failed:", err);
      setError("Failed to load restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
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
    columnHelper.accessor("emri", {
      id: "emri",
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
    columnHelper.accessor("adresa", {
      id: "adresa",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          ADDRESS
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
    columnHelper.accessor("numriTel", {
      id: "numriTel",
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
          fontWeight="400"
          textAlign="center"
        >
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("dataEKrijimit", {
      id: "dataEKrijimit",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          CREATED AT
        </Text>
      ),
      cell: (info) => (
        <Text fontSize="sm" color={textColor} textAlign="center">
          {new Date(info.getValue()).toLocaleString()}
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
            aria-label="Edit restaurant"
            icon={<MdEdit />}
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={() => {
              setSelectedRestaurant(info.row.original);
              onEditOpen();
            }}
            mr={2}
          />
          <IconButton
            aria-label="Delete restaurant"
            icon={<MdDelete />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => handleDeleteRestaurant(info.row.original.id)}
          />
        </Flex>
      ),
    }),
  ];

  const handleAddRestaurant = async (newRestaurantData) => {
    try {
      const dataToSubmit = { ...newRestaurantData };
      delete dataToSubmit.id;

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/Restaurant`,
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
          errorData?.message || `Failed to add restaurant: ${response.status}`
        );
      }

      toast({
        title: "Restaurant added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchRestaurants();
      onClose();
    } catch (error) {
      console.error("Error adding restaurant:", error);
      toast({
        title: "Adding restaurant failed.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/Restaurant/${restaurantId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to delete restaurant: ${response.status}`
        );
      }

      toast({
        title: "Restaurant deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchRestaurants();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast({
        title: "Deleting restaurant failed.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditRestaurant = async (updatedRestaurantData) => {
    console.log(
      "Data received in handleEditRestaurant:",
      updatedRestaurantData
    );
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/Restaurant/${
          updatedRestaurantData.id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRestaurantData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to update restaurant: ${response.status}`
        );
      }

      toast({
        title: "Restaurant updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchRestaurants();
      onEditClose();
    } catch (error) {
      console.error("Error updating restaurant:", error);
      toast({
        title: "Updating restaurant failed.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Box>Loading restaurants...</Box>;
  if (error) return <Box>Error: {error}</Box>;
  if (!restaurants.length) return <Box>No restaurants found.</Box>;

  return (
    <Card flexDirection="column" w="100%" px="0px" mt="135px" overflowX="auto">
      <Flex px="25px" mb="8px" justifyContent="flex-end" align="center">
        <Button colorScheme="brand" size="md" borderRadius="0" onClick={onOpen}>
          Add Restaurant
        </Button>
      </Flex>
      <Box px="25px">
        <Text color={textColor} fontSize="23px" fontWeight="700" mb="16px">
          Restaurants
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
            {restaurants.map((restaurant) => (
              <Tr key={restaurant.id} h="100px">
                {columns.map((column) => (
                  <Td
                    key={column.id}
                    fontSize="14px"
                    borderColor="transparent"
                    py="10px"
                    textAlign="center"
                  >
                    {column.id === "actions"
                      ? column.cell({ row: { original: restaurant } })
                      : column.id === "dataEKrijimit"
                      ? new Date(restaurant[column.id]).toLocaleString()
                      : restaurant[column.id]}
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
          <ModalHeader>Add New Restaurant</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddRestaurantForm onSubmit={handleAddRestaurant} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Restaurant</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddRestaurantForm
              onSubmit={handleEditRestaurant}
              initialData={selectedRestaurant}
              isEdit={true}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default RestaurantsTable;
