import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
} from "@chakra-ui/react";

const EditProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    emri: "",
    description: "",
    price: "",
    isActive: true,
    unit: "",
    stockQuantity: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        emri: product.emri || "",
        description: product.description || "",
        price: product.price || "",
        isActive: product.isActive ?? true,
        unit: product.unit || "",
        stockQuantity: product.stockQuantity || 0,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
    };
    onSave(updatedProduct);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <Stack spacing={4}>
        <FormControl id="emri" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="emri"
            value={formData.emri}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="description">
          <FormLabel>Description</FormLabel>
          <Input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="price" isRequired>
          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="unit">
          <FormLabel>Unit</FormLabel>
          <Input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="stockQuantity">
          <FormLabel>Stock Quantity</FormLabel>
          <Input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="isActive">
          <Checkbox
            name="isActive"
            isChecked={formData.isActive}
            onChange={handleChange}
          >
            Active
          </Checkbox>
        </FormControl>

        <Stack direction="row" spacing={4}>
          <Button type="submit" colorScheme="blue">
            Save
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default EditProductForm;
