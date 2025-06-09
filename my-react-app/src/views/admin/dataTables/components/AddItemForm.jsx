import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import ReactSelect from "react-select";

const AddItemForm = ({
  onAddItem,
  restaurantId,
  initialData = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    subCategoryId: "",
    isActive: true,
    restaurantId: restaurantId,
    updatedAt: new Date().toISOString(),
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productError, setProductError] = useState("");

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [categoriesRes, subcategoriesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE}/api/Category`),
          fetch(`${import.meta.env.VITE_API_BASE}/api/Subcategory`),
        ]);

        if (!categoriesRes.ok || !subcategoriesRes.ok) {
          throw new Error("Failed to fetch dropdown data");
        }

        const categoriesJson = await categoriesRes.json();
        const subcategoriesJson = await subcategoriesRes.json();

        const filteredCategories = categoriesJson.filter(
          (cat) => cat.restaurantID === restaurantId
        );
        setCategories(filteredCategories);
        setSubcategories(subcategoriesJson);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    if (restaurantId) {
      fetchDropdownData();
    }
  }, [restaurantId]);

  useEffect(() => {
    if (initialData && categories.length > 0 && subcategories.length > 0) {
      const categoryId = initialData.categoryId?.toString() || "";
      const subCategoryId = initialData.subCategoryId?.toString() || "";

      setFormData({
        ...initialData,
        categoryId,
        subCategoryId,
      });

      if (categoryId !== "") {
        const filtered = subcategories.filter(
          (sub) => sub.categoryID === parseInt(categoryId)
        );
        setFilteredSubcategories(filtered);
      } else {
        setFilteredSubcategories([]);
      }

      setTimeout(() => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          categoryId: categoryId,
          subCategoryId: subCategoryId,
        }));
      }, 0);
    } else if (
      !initialData &&
      categories.length > 0 &&
      subcategories.length > 0
    ) {
      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        categoryId: "",
        subCategoryId: "",
        isActive: true,
        restaurantId: restaurantId,
        updatedAt: new Date().toISOString(),
      });
      setFilteredSubcategories([]);
    }
  }, [initialData, categories, subcategories, restaurantId]);

  useEffect(() => {
    if (formData.categoryId !== "" && subcategories.length > 0) {
      const filtered = subcategories.filter(
        (sub) => sub.categoryID === parseInt(formData.categoryId)
      );
      setFilteredSubcategories(filtered);

      if (
        formData.subCategoryId !== "" &&
        filtered.length > 0 &&
        !filtered.some((sub) => sub.id.toString() === formData.subCategoryId)
      ) {
        setFormData((prev) => ({
          ...prev,
          subCategoryId: "",
        }));
      }
    } else if (formData.categoryId === "") {
      setFilteredSubcategories([]);

      if (formData.subCategoryId !== "") {
        setFormData((prev) => ({
          ...prev,
          subCategoryId: "",
        }));
      }
    }
  }, [formData.categoryId, subcategories]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/Products`
        );
        const data = await res.json();
        setAvailableProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      setProductError("Please select at least one ingredient.");
      return;
    } else {
      setProductError("");
    }
    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      categoryId: parseInt(formData.categoryId) || null,
      subCategoryId: parseInt(formData.subCategoryId) || null,
      productIds: selectedProducts,
    };
    onAddItem(dataToSubmit);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <Stack spacing={3}>
        <FormControl id="name" isRequired key={`name-${formData.name}`}>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl
          id="description"
          key={`description-${formData.description}`}
        >
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="price" isRequired key={`price-${formData.price}`}>
          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
          />
        </FormControl>

        <FormControl id="image" key={`image-${formData.image}`}>
          <FormLabel>Image URL</FormLabel>
          <Input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="ingredients" isInvalid={!!productError} isRequired>
          <FormLabel>Select Ingredients</FormLabel>
          <ReactSelect
            isMulti
            options={availableProducts.map((p) => ({
              value: p.productsID,
              label: p.emri,
            }))}
            value={availableProducts
              .filter((p) => selectedProducts.includes(p.productsID))
              .map((p) => ({ value: p.productsID, label: p.emri }))}
            onChange={(selectedOptions) =>
              setSelectedProducts(selectedOptions.map((opt) => opt.value))
            }
            placeholder="Choose ingredients..."
          />
          {productError && (
            <Box color="red.500" fontSize="sm" mt={1}>
              {productError}
            </Box>
          )}
        </FormControl>

        <FormControl
          id="categoryId"
          isRequired
          key={`category-${categories.length}-${formData.categoryId}`}
        >
          <FormLabel>Category</FormLabel>
          <Select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            placeholder="Select category"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl
          id="subCategoryId"
          isRequired
          key={`subcategory-${filteredSubcategories.length}-${formData.subCategoryId}`}
        >
          <FormLabel>Subcategory</FormLabel>
          <Select
            name="subCategoryId"
            value={formData.subCategoryId}
            onChange={handleChange}
            placeholder="Select subcategory"
            isDisabled={
              !formData.categoryId || filteredSubcategories.length === 0
            }
          >
            {filteredSubcategories.map((sub) => (
              <option key={sub.id} value={sub.id.toString()}>
                {sub.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="isActive" key={`isActive-${formData.isActive}`}>
          <FormLabel>Active</FormLabel>
          <Checkbox
            name="isActive"
            isChecked={formData.isActive}
            onChange={handleChange}
          >
            Item is active
          </Checkbox>
        </FormControl>

        <Button type="submit" colorScheme="brand" size="md" borderRadius="0">
          {isEdit ? "Update Item" : "Add Item"}
        </Button>
      </Stack>
    </Box>
  );
};

export default AddItemForm;
