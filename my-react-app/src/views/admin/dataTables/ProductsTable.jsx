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
  useToast,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import Card from "components/card/Card";
import { MdEdit, MdDelete, MdFileUpload, MdFileDownload } from "react-icons/md";
import * as XLSX from "xlsx";
import ProductImportTemplate from "./components/ProductImportTemplate";
import axios from "axios";

const columnHelper = createColumnHelper();

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const toast = useToast();

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/Products`
      );
      if (!response.ok) {
        throw new Error("Error fetching products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        for (const row of jsonData) {
          // Validate Emri and Restaurant Name
          if (!row.Emri || !row["Restaurant Name"]) {
            toast({
              title: "Error",
              description:
                "Each row must have Emri and 'Restaurant Name' fields",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            continue; // Skip to the next row
          }

          const restaurantName = row["Restaurant Name"];
          let restaurantId = null;

          try {
            // Fetch RestaurantId from backend by name
            const restaurantResponse = await axios.get(
              `${
                import.meta.env.VITE_API_BASE
              }/api/Restaurants/byname/${encodeURIComponent(restaurantName)}`
            );
            restaurantId = restaurantResponse.data; // Assuming the backend returns just the ID
          } catch (restaurantError) {
            console.error("Error fetching restaurant ID:", restaurantError);
            toast({
              title: "Error",
              description: `Restaurant \'${restaurantName}\' not found. Skipping product \'${row.Emri}\'.`,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            continue;
          }

          const productData = {
            emri: row.Emri,
            description: row.Description,
            price: parseFloat(row.Price) || 0,
            isActive: row.IsActive === "TRUE",
            unit: row.Unit,
            stockQuantity: parseInt(row.StockQuantity) || 0,
            category: row.Category,
            restaurantId: restaurantId,
          };

          try {
            await axios.post(
              `${import.meta.env.VITE_API_BASE}/api/Products`,
              productData
            );
          } catch (productError) {
            console.error("Error adding product:", productError);
            toast({
              title: "Error",
              description: `Failed to add product \'${row.Emri}\'. Error: ${productError.message}`,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            continue; // Skip to the next row on product add error
          }
        }

        toast({
          title: "Success",
          description:
            "Products import process completed. Check console for skipped products.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        fetchProducts();
      } catch (error) {
        console.error("Error importing file:", error);
        toast({
          title: "Error",
          description: "Failed to process Excel file: " + error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(products);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      XLSX.writeFile(workbook, "products.xlsx");

      toast({
        title: "Export successful",
        description: "Products have been exported successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error exporting file:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the file",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const columns = [
    columnHelper.accessor("productsID", {
      id: "productsID",
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
            aria-label="Edit product"
            icon={<MdEdit />}
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={() => handleEditProduct(info.row.original)}
            mr={2}
          />
          <IconButton
            aria-label="Delete product"
            icon={<MdDelete />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => handleDeleteProduct(info.row.original.productsID)}
          />
        </Flex>
      ),
    }),
  ];

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/Products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      await fetchProducts();
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Deletion failed",
        description: "There was an error deleting the product",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card flexDirection="column" w="100%" px="0px" mt="65px" overflowX="auto">
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Flex gap={4}>
          <ProductImportTemplate />
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            display="none"
            id="file-upload"
          />
          <Button
            as="label"
            htmlFor="file-upload"
            leftIcon={<MdFileUpload />}
            colorScheme="blue"
            size="md"
            borderRadius="0"
          >
            Import Excel
          </Button>
          <Button
            leftIcon={<MdFileDownload />}
            colorScheme="green"
            size="md"
            borderRadius="0"
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>
        </Flex>
      </Flex>

      <Table variant="simple" color="gray.500" mb="24px">
        <Thead>
          <Tr h="60px">
            {columns.map((column) => (
              <Th key={column.id} borderColor={borderColor} textAlign="center">
                {column.header()}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.productsID} h="60px">
              {columns.map((column) => (
                <Td
                  key={column.id}
                  fontSize="14px"
                  borderColor="transparent"
                  py="10px"
                  textAlign="center"
                >
                  {column.cell({
                    getValue: () => product[column.id],
                    row: { original: product },
                  })}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
};

export default ProductsTable;
