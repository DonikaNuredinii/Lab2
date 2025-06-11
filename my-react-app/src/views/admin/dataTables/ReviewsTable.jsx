import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useToast,
  Tag,
} from "@chakra-ui/react";
import Card from "components/card/Card";

const ReviewsTable = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/Reviews`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        setError("Failed to load reviews");
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card flexDirection="column" w="100%" px="0px" mt="65px" overflowX="auto">
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          All User Reviews
        </Text>
      </Flex>

      <Table variant="simple" colorScheme="gray" size="md">
        <Thead bg="gray.50">
          <Tr>
            <Th>ID</Th>
            <Th>User</Th>
            <Th>Menu Item</Th>
            <Th textAlign="center">Rating</Th>
            <Th>Comment</Th>
            <Th>Created At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reviews.map((review) => (
            <Tr key={review.reviewID} _hover={{ bg: "gray.50" }}>
              <Td fontWeight="semibold">{review.reviewID}</Td>
              <Td>{review.userName || "Unknown"}</Td>
              <Td>{review.menuItemName || "Unknown"}</Td>
              <Td textAlign="center">
                <Tag colorScheme="yellow" fontWeight="bold">
                  {review.rating} ★
                </Tag>
              </Td>
              <Td>{review.comment}</Td>
              <Td fontSize="sm" color="gray.500">
                {new Date(review.createdAt).toLocaleString()}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
};

export default ReviewsTable;
