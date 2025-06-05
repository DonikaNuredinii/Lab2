import React from "react";
import { Button, useToast } from "@chakra-ui/react";
import * as XLSX from "xlsx";
import { MdDownload } from "react-icons/md";

const ProductImportTemplate = () => {
  const toast = useToast();

  const generateTemplate = () => {
    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Updated sample data with all fields and 'Restaurant Name'
      const data = [
        {
          Emri: "Product Name",
          Description: "Product Description",
          Price: "0.00",
          IsActive: "TRUE",
          Unit: "unit",
          StockQuantity: "0",
          Category: "Category Name",
          "Restaurant Name": "Your Restaurant Name",
        },
        {
          Emri: "Sample Product 1",
          Description: "Description 1",
          Price: "10.99",
          IsActive: "TRUE",
          Unit: "piece",
          StockQuantity: "100",
          Category: "Category 1",
          "Restaurant Name": "Restaurant A",
        },
        {
          Emri: "Sample Product 2",
          Description: "Description 2",
          Price: "15.99",
          IsActive: "TRUE",
          Unit: "kg",
          StockQuantity: "50",
          Category: "Category 1",
          "Restaurant Name": "Restaurant A",
        },
        {
          Emri: "Sample Product 3",
          Description: "Description 3",
          Price: "5.99",
          IsActive: "TRUE",
          Unit: "liter",
          StockQuantity: "75",
          Category: "Category 2",
          "Restaurant Name": "Restaurant B",
        },
      ];

      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Products");

      // Generate Excel file
      XLSX.writeFile(wb, "product_import_template.xlsx");

      toast({
        title: "Template downloaded",
        description: "The import template has been downloaded successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate template: " + error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Button
      leftIcon={<MdDownload />}
      colorScheme="blue"
      variant="outline"
      onClick={generateTemplate}
      size="sm"
    >
      Download Import Template
    </Button>
  );
};

export default ProductImportTemplate;
