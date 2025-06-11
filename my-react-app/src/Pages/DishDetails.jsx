import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  VStack,
  Textarea,
  Button,
  Heading,
  HStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import "../CSS/DishDetails.css";

const StarRating = ({ rating, setRating }) => {
  return (
    <HStack>
      {[1, 2, 3, 4, 5].map((star) => (
        <IconButton
          key={star}
          icon={<FaStar />}
          onClick={() => setRating(star)}
          color={star <= rating ? "yellow.400" : "gray.300"}
          variant="ghost"
          aria-label={`Rate ${star}`}
          _hover={{ color: "yellow.500" }}
        />
      ))}
    </HStack>
  );
};

const DishDetails = () => {
  const { menuItemId } = useParams();
  const toast = useToast();
  const userID = parseInt(localStorage.getItem("userId"));

  const [menuItem, setMenuItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    const fetchMenuItem = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/MenuItems/${menuItemId}`
      );
      const data = await res.json();
      setMenuItem(data);
    };

    const fetchReviews = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/Reviews/menuitem/${menuItemId}`
      );
      const data = await res.json();
      setReviews(data);
    };

    fetchMenuItem();
    fetchReviews();
  }, [menuItemId]);

  const handleReviewSubmit = async () => {
    if (!userID) {
      toast({
        title: "Not logged in",
        description: "Please log in to submit a review.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const dto = {
      menuItemID: parseInt(menuItemId),
      userID,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date().toISOString(),
    };

    const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/Reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (res.status === 409) {
      toast({
        title: "Already Reviewed",
        description: "You have already reviewed this item.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Review submitted.",
      description: "Thank you for your feedback!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setNewReview({ rating: 0, comment: "" });
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Box className="dish-details-wrapper">
      <Box className="dish-details-container">
        <Box className="dish-card">
          {menuItem && (
            <>
              <img
                src={
                  menuItem.image?.startsWith("/")
                    ? menuItem.image
                    : "/" + menuItem.image
                }
                alt={menuItem.name}
                className="dish-image"
              />
              <Box className="dish-info-text">
                <Heading size="md">{menuItem.name}</Heading>
                <Text>{menuItem.description}</Text>
                <Text className="dish-price">
                  Price: ${menuItem.price?.toFixed(2)}
                </Text>
              </Box>
            </>
          )}
        </Box>

        <Box className="interaction-section">
          <Box>
            <Heading
              size="md"
              mb={4}
              color="gray.700"
              fontFamily="'Poppins', sans-serif"
              fontWeight="semibold"
            >
              We value your feedback — tell us what you think by leaving a
              review.
            </Heading>

            <StarRating
              rating={newReview.rating}
              setRating={(val) =>
                setNewReview({ ...newReview, rating: val })
              }
            />
            <Textarea
              placeholder="Write your review..."
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              mt={2}
            />
            <Button
              mt={2}
              onClick={handleReviewSubmit}
              bg="#325B55"
              color="white"
              _hover={{ bg: "#264743" }}
            >
              Submit Review
            </Button>
          </Box>
        </Box>

        <Box className="reviews-section">
          <Heading size="sm" mb={2}>
            Reviews
          </Heading>
          <VStack spacing={4} align="stretch">
            {reviews.map((rev) => (
              <Box key={rev.reviewID} className="review-comment-box">
                <Text fontWeight="bold">{rev.userName || "Anonymous"}</Text>
                <HStack spacing={1} mb={1}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      color={i < rev.rating ? "#ECC94B" : "#CBD5E0"}
                    />
                  ))}
                </HStack>
                <Text>{rev.comment}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(rev.createdAt).toLocaleString()}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default DishDetails;
