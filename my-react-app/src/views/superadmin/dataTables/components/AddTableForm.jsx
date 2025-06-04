import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Box,
  Select,
  useToast,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const AddTableForm = ({ onSubmit, initialData, isEdit }) => {
  const [formData, setFormData] = useState({
    id: initialData?.id || 0,
    restaurantID: initialData?.restaurantID || "",
    qrCode: initialData?.qrCode || "",
  });
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/Restaurant`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch restaurants.");
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        toast({
          title: "Error fetching restaurants.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoadingRestaurants(false);
      }
    };
    fetchRestaurants();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl id="restaurantID" isRequired>
          <FormLabel>Restaurant</FormLabel>
          <Select
            name="restaurantID"
            placeholder="Select restaurant"
            value={formData.restaurantID}
            onChange={handleChange}
            disabled={loadingRestaurants}
          >
            {loadingRestaurants ? (
              <option value="">Loading...</option>
            ) : (
              restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.emri}
                </option>
              ))
            )}
          </Select>
        </FormControl>
        <FormControl id="qrCode">
          <FormLabel>QR Code</FormLabel>
          <Input
            type="text"
            name="qrCode"
            value={formData.qrCode}
            onChange={handleChange}
          />
        </FormControl>
        <Button colorScheme="brand" type="submit">
          {isEdit ? "Update Table" : "Add Table"}
        </Button>
      </Stack>
    </Box>
  );
};

AddTableForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isEdit: PropTypes.bool,
};

export default AddTableForm;
