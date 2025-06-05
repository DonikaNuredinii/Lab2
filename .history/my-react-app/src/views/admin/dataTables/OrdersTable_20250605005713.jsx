import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import Card from "components/card/Card";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/Orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordersID: orderId, status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status.");
      toast({
        title: "Success",
        description: `Order marked as ${newStatus}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchOrders(); // Refresh after update
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  return (
    <Card mt="40px">
      <Box overflowX="auto">
        <Table variant="simple" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Customer</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.ordersID}>
                <Td>{order.ordersID}</Td>
                <Td>{order.costumerID}</Td>
                <Td>{order.totalAmount}€</Td>
                <Td>{order.status}</Td>
                <Td>{new Date(order.createdAt).toLocaleString()}</Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      colorScheme="yellow"
                      onClick={() => updateStatus(order.ordersID, "Preparing")}
                    >
                      Preparing
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => updateStatus(order.ordersID, "Completed")}
                    >
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => updateStatus(order.ordersID, "Cancelled")}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
};

export default OrdersTable;
