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
  Button,
  useToast,
  Spinner,
  Badge,
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

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/Orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordersID: id, status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update order status");
      fetchOrders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Card>
      <Box overflowX="auto">
        <Text fontSize="2xl" fontWeight="bold" mb={4} px={4} pt={4}>
          Orders Overview
        </Text>
        <Table variant="simple" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Customer</Th>
              <Th>Total (€)</Th>
              <Th>Status</Th>
              <Th>Created At</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.ordersID}>
                <Td>{order.ordersID}</Td>
                <Td>{order.costumerID}</Td>
                <Td>{order.totalAmount.toFixed(2)}€</Td>
                <Td>
                  <Badge
                    colorScheme={
                      order.status === "Pending"
                        ? "yellow"
                        : order.status === "Accepted"
                        ? "green"
                        : "red"
                    }
                  >
                    {order.status}
                  </Badge>
                </Td>
                <Td>{new Date(order.createdAt).toLocaleString()}</Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => updateOrderStatus(order.ordersID, "Accepted")}
                      isDisabled={order.status !== "Pending"}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => updateOrderStatus(order.ordersID, "Canceled")}
                      isDisabled={order.status !== "Pending"}
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
