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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/Orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update order.");

      toast({
        title: "Success",
        description: `Order marked as ${newStatus}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchOrders();
    } catch (error) {
      console.error("Update error:", error);
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
    <Card mt={"80px"}>
       <Box h="100px" >
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
             <Flex gap={2} flexWrap="wrap">
  <Button
    size="sm"
    bg="#F5E8C7"
    color="#5B4A28"
    borderRadius="full"
    fontWeight="medium"
    px={4}
    _hover={{ bg: "#EADFB4" }}
    onClick={() => updateOrderStatus(order.ordersID, "Preparing")}
  >
    Preparing
  </Button>
  <Button
    size="sm"
    bg="#D1FADF"
    color="#027A48"
    borderRadius="full"
    fontWeight="medium"
    px={4}
    _hover={{ bg: "#B6F2CF" }}
    onClick={() => updateOrderStatus(order.ordersID, "Completed")}
  >
    Complete
  </Button>
  <Button
    size="sm"
    bg="#FEE4E2"
    color="#B42318"
    borderRadius="full"
    fontWeight="medium"
    px={4}
    _hover={{ bg: "#FECDCA" }}
    onClick={() => updateOrderStatus(order.ordersID, "Cancelled")}
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