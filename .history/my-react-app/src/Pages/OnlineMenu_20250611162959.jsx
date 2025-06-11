import React, { useState, useEffect } from "react";
import "../CSS/OnlineMenu.css";
import { useParams, useNavigate } from "react-router-dom";
import ChatModal from "../components/ChatModal";
import { FaComments } from "react-icons/fa";
import PaymentSidebar from "../PaymentSidebar";
import {
  Box,
  Text,
  IconButton,
  useDisclosure,
  Button,
  VStack,
  Divider,
  HStack,
  Flex,
} from "@chakra-ui/react";
import NoteModal from "./NoteModal";
import { MdNoteAdd } from "react-icons/md";

const OnlineMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shuffledImageIndices, setShuffledImageIndices] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItemProducts, setSelectedItemProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);

  const [orderId, setOrderId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Payment modal control
  const {
    isOpen: isPaymentOpen,
    onOpen: onPaymentOpen,
    onClose: onPaymentClose,
  } = useDisclosure();

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Close payment modal
  const closePaymentSidebar = () => {
    onPaymentClose();
  };

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Calculate total price
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Submit order and open payment modal
  const handleSubmitOrder = async () => {
    const orderDto = {
      restaurantID: parseInt(id),
      tableID: 1,
      costumerID: 0,
      costumerAdressID: 0,
      orderType: "Dine-in",
      status: "Pending",
      totalAmount: total,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/Orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDto),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const data = await res.json();
      setOrderId(data.ordersID || data.orderID);

      // Open payment modal
      onPaymentOpen();
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  // Fetch restaurants or menu data, handle loading & error states
  useEffect(() => {
    if (!id) {
      // Fetch restaurants code here ...
      setLoading(false);
    } else {
      // Fetch menu code here ...
      setLoading(false);
    }
  }, [id]);

  // Handle restaurant selection
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setMenuData([]);
    navigate(`/online-menu/${restaurant.id}`);
  };

  // Render
  if (!id && loading) return <div>Loading restaurants...</div>;
  if (!id && error) return <div>Error: {error}</div>;

  return (
    <div className="online-menu-page">
      {/* Restaurants list or Menu */}
      {!id && !selectedRestaurant ? (
        // Restaurant listing JSX here ...
        <></>
      ) : loading ? (
        <div>Loading menu...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Box display="flex">
          <Box flex="1" p={4}>
            <h1 className="online-menu-title menu-title-display">
              {selectedRestaurant?.emri} Menu
            </h1>
            {/* Render categories and items */}
          </Box>

          {/* Note Modal */}
          <NoteModal
            isOpen={isOpen}
            onClose={onClose}
            products={selectedItemProducts}
            selected={selectedProducts}
            setSelected={setSelectedProducts}
            menuItemId={selectedMenuItemId}
          />

          {/* Sidebar for orders */}
          {cartItems.length > 0 && !isPaymentOpen && (
            <Box
              width={{ base: "100%", md: "360px" }}
              bg="#FAF9F6"
              borderLeft="1px solid #F0EAD6"
              boxShadow="xl"
              height="100vh"
              display="flex"
              flexDirection="column"
              zIndex="10"
              position="sticky"
              top="0"
            >
              {/* Order summary and Place Order button */}
              <Button
                width="100%"
                colorScheme="teal"
                onClick={handleSubmitOrder}
                className="broken-border-button b"
                mb={4}
                mt={4}
                color="gray.900"
              >
                Place Order
              </Button>
            </Box>
          )}

          {/* Payment Modal */}
          {isPaymentOpen && (
            <PaymentSidebar
              isOpen={isPaymentOpen}
              onClose={closePaymentSidebar}
              totalAmount={total}
              orderId={orderId}
              cartItems={cartItems}
              method={paymentMethod}
              setMethod={setPaymentMethod}
            />
          )}
        </Box>
      )}

      {selectedRestaurant && (
        <>
          <IconButton
            icon={<FaComments />}
            aria-label="Live Chat"
            position="fixed"
            bottom="30px"
            right="30px"
            zIndex={1000}
            size="lg"
            colorScheme="teal"
            borderRadius="full"
            onClick={onOpen}
          />
          <ChatModal
            isOpen={isOpen}
            onClose={onClose}
            restaurant={selectedRestaurant}
          />
        </>
      )}
    </div>
  );
};

export default OnlineMenu;
