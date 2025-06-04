import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";

const AddRestaurantForm = ({
  onSubmit,
  initialData = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    id: null,
    emri: "",
    adresa: "",
    email: "",
    numriTel: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || null,
        emri: initialData.emri || "",
        adresa: initialData.adresa || "",
        email: initialData.email || "",
        numriTel: initialData.numriTel || "",
      });
    } else {
      setFormData({
        id: null,
        emri: "",
        adresa: "",
        email: "",
        numriTel: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData });
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <Stack spacing={3}>
        <FormControl id="emri" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="emri"
            value={formData.emri}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="adresa" isRequired>
          <FormLabel>Address</FormLabel>
          <Input
            type="text"
            name="adresa"
            value={formData.adresa}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="numriTel">
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="text"
            name="numriTel"
            value={formData.numriTel}
            onChange={handleChange}
          />
        </FormControl>

        <Button type="submit" colorScheme="brand" size="md" borderRadius="0">
          {isEdit ? "Update Restaurant" : "Add Restaurant"}
        </Button>
      </Stack>
    </Box>
  );
};

export default AddRestaurantForm;
