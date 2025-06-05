import React, { useEffect, useState } from "react";
import {
  Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useToast,
} from "@chakra-ui/react";
import Card from "components/card/Card";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const restaurantId = localStorage.getItem("restaurantId");

  const fetchOrders = async () => {
    try {
     const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/Orders`);
      if (!response.ok) throw new Error("Failed to fetch orders.");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to load orders.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  return (
    <Card>
      <Box overflowX="auto">
        <Table variant="simple" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Customer</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.ordersID}>
                <Td>{order.ordersID}</Td>
                <Td>{order.customerName || "-"}</Td>
                <Td>{order.totalAmount}€</Td>
                <Td>{order.status}</Td>
                <Td>{new Date(order.createdAt).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
};

export default OrdersTable;
