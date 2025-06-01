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
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";

const columnHelper = createColumnHelper();

const MenuItemsFullView = () => {
  const [structuredData, setStructuredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

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
    columnHelper.accessor("name", {
      id: "name",
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
    columnHelper.accessor("description", {
      id: "description",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          DESCRIPTION
        </Text>
      ),
      cell: (info) => (
        <Text
          color={textColor}
          fontSize="sm"
          fontWeight="400"
          textAlign="center"
          width="200px"
          marginLeft="170px"
        >
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("price", {
      id: "price",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          PRICE
        </Text>
      ),
      cell: (info) => (
        <Text
          color={textColor}
          fontSize="sm"
          fontWeight="700"
          textAlign="center"
        >
          ${info.getValue()?.toFixed(2)}
        </Text>
      ),
    }),
    columnHelper.accessor("isActive", {
      id: "isActive",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          ACTIVE
        </Text>
      ),
      cell: (info) => (
        <Text
          color={info.getValue() ? "green.500" : "red.500"}
          fontWeight="700"
          textAlign="center"
        >
          {info.getValue() ? "Yes" : "No"}
        </Text>
      ),
    }),
    columnHelper.accessor("updatedAt", {
      id: "updatedAt",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="center"
        >
          UPDATED AT
        </Text>
      ),
      cell: (info) => (
        <Text fontSize="sm" color={textColor} textAlign="center">
          {new Date(info.getValue()).toLocaleString()}
        </Text>
      ),
    }),
    columnHelper.accessor("image", {
      id: "image",
      header: () => (
        <Text
          fontSize="12px"
          fontWeight="600"
          color="gray.400"
          textAlign="right"
          marginRight="15px"
        >
          IMAGE
        </Text>
      ),
      cell: (info) => {
        const imagePath = `/Images-lab2/${info.getValue()?.split("/").pop()}`;
        return (
          <Box display="flex" justifyContent="flex-end" w="100%">
            <Box w="80px" h="80px" borderRadius="8px" overflow="hidden">
              <img
                src={imagePath}
                alt="Menu item"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Box>
        );
      },
    }),
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, categoriesRes, subcategoriesRes] = await Promise.all([
          fetch("https://localhost:7076/api/MenuItems"),
          fetch("https://localhost:7076/api/Category"),
          fetch("https://localhost:7076/api/Subcategory"),
        ]);

        if (!itemsRes.ok || !categoriesRes.ok || !subcategoriesRes.ok) {
          throw new Error("Error fetching data from backend.");
        }

        const [items, categories, subcategories] = await Promise.all([
          itemsRes.json(),
          categoriesRes.json(),
          subcategoriesRes.json(),
        ]);

        const filteredItems = items.filter((item) => item.restaurantId === 2);
        const filteredCategories = categories.filter(
          (c) => c.restaurantID === 2
        );

        const structured = filteredCategories
          .map((category) => {
            const categorySubcats = subcategories
              .filter((sub) => sub.categoryID === category.id)
              .map((sub) => ({
                subcategoryName: sub.name,
                items: filteredItems.filter(
                  (item) => item.subCategoryId === sub.id
                ),
              }));

            return {
              categoryName: category.name,
              subcategories: categorySubcats.filter(
                (sc) => sc.items.length > 0
              ),
            };
          })
          .filter((c) => c.subcategories.length > 0);

        setStructuredData(structured);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading menu data...</div>;
  if (error) return <div>{error}</div>;
  if (!structuredData.length) return <div>No data found.</div>;

  return (
    <Card flexDirection="column" w="100%" px="0px" mt="65px" overflowX="auto">
      {/* <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Menu />
      </Flex> */}

      {structuredData.map((cat, catIdx) => (
        <Box key={catIdx} px="25px" mb="24px">
          <Text color={textColor} fontSize="23px" fontWeight="700" mb="16px">
            {cat.categoryName}
          </Text>

          {cat.subcategories.map((sub, subIdx) => (
            <Box key={subIdx} mb="24px">
              <Text color={textColor} fontSize="16px" mb="12px">
                {sub.subcategoryName}
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
                  {sub.items.map((item) => (
                    <Tr key={item.id} h="100px">
                      {columns.map((column) => (
                        <Td
                          key={column.id}
                          fontSize="14px"
                          borderColor="transparent"
                          py="10px"
                          textAlign="center"
                        >
                          {column.cell({ getValue: () => item[column.id] })}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ))}
        </Box>
      ))}
    </Card>
  );
};

export default MenuItemsFullView;
