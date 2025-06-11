import React, { useState, useEffect } from "react";
import "../CSS/OnlineMenu.css";
import { useParams, useNavigate } from "react-router-dom";
import ChatModal from "../components/ChatModal";
import { FaComments } from "react-icons/fa";
import {
  Box,
  Text,
  IconButton,
  useDisclosure,
  Button,
  VStack,
  Divider,
  HStack,
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

  // Cart State
  const [cartItems, setCartItems] = useState([]);

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

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderDto),
    });

    if (!res.ok) throw new Error("Failed to place order");

    const data = await res.json();         // këtë e merr orderId-in nga backend
    setOrderId(data.id);                   // ruaje për PaymentModal
    onPaymentOpen();                       // hap modalin për pagesë

  } catch (err) {
    console.error(err);
    alert("Failed to place order");
  }
};

  const handleOpenNoteModal = async (item) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/MenuItemProducts/menuitem/${
          item.id
        }`
      );
      if (!res.ok) throw new Error("Failed to fetch ingredients");

      const data = await res.json();

      if (data.length === 0) {
        alert("This dish has no removable ingredients configured.");
        return;
      }

      const detailedProducts = await Promise.all(
        data.map(async (prod) => {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE}/api/Products/${prod.productsID}`
          );
          const prodData = await res.json();
          return prodData.emri;
        })
      );

      const uniqueNames = [...new Set(detailedProducts)];
      setSelectedItemProducts(uniqueNames);
      setSelectedProducts(uniqueNames);
      setSelectedMenuItemId(item.id);
      onOpen();
    } catch (err) {
      console.error("Error loading ingredients:", err);
      alert("Failed to load product ingredients.");
    }
  };

  useEffect(() => {
    if (!id) {
      const fetchRestaurants = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE}/api/Restaurant`
          );
          if (!response.ok) throw new Error("Error fetching restaurants.");
          const data = await response.json();
          setRestaurants(data);

          const indices = Array.from({ length: 8 }, (_, i) => i + 1);
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }
          setShuffledImageIndices(indices);
        } catch (err) {
          setError("Failed to load restaurants.");
        } finally {
          setLoading(false);
        }
      };

      fetchRestaurants();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!id) return;

      const restaurantIdToFetch = parseInt(id, 10);
      setLoading(true);
      setError(null);

      try {
        const restaurantRes = await fetch(
          `${
            import.meta.env.VITE_API_BASE
          }/api/Restaurant/${restaurantIdToFetch}`
        );
        if (!restaurantRes.ok) throw new Error("Error fetching restaurant.");

        const restaurantData = await restaurantRes.json();
        setSelectedRestaurant(restaurantData);

        const [itemsRes, categoriesRes, subcategoriesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE}/api/MenuItems`),
          fetch(`${import.meta.env.VITE_API_BASE}/api/Category`),
          fetch(`${import.meta.env.VITE_API_BASE}/api/Subcategory`),
        ]);

        if (!itemsRes.ok || !categoriesRes.ok || !subcategoriesRes.ok) {
          throw new Error("Failed to fetch menu data");
        }

        const itemsJson = await itemsRes.json();
        const categoriesJson = await categoriesRes.json();
        const subcategoriesJson = await subcategoriesRes.json();

        const filteredItems = itemsJson.filter(
          (item) => item.restaurantId === restaurantIdToFetch
        );

        const structuredData = categoriesJson
          .map((category) => {
            const subcats = subcategoriesJson
              .filter((sub) => sub.categoryID === category.id)
              .map((sub) => ({
                title: sub.name,
                items: filteredItems.filter(
                  (item) => item.subCategoryId === sub.id
                ),
              }))
              .filter((sub) => sub.items.length > 0);

            return {
              category: category.name,
              subcategories: subcats,
            };
          })
          .filter((c) => c.subcategories.length > 0);

        setMenuData(structuredData);
      } catch (err) {
        console.error(err);
        setError("Failed to load menu data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setMenuData([]);
    navigate(`/online-menu/${restaurant.id}`);
  };

  if (!id && loading)
    return <div className="online-menu-page">Loading restaurants...</div>;
  if (!id && error)
    return <div className="online-menu-page">Error: {error}</div>;

  return (
    <div className="online-menu-page">
      {!id && !selectedRestaurant ? (
        <>
          <h1 className="intro-h1">Discover Amazing Restaurants</h1>
          <div className="intro-design-section">
            <div className="intro-text-content">
              <h1>Pick the best</h1>
              <p>
                Browse through our selection of restaurants and find your next
                delicious meal.
              </p>
            </div>
            <div className="intro-image-container">
              <img src="/Images-lab2/online.jpg" alt="Intro" />
            </div>
          </div>
          <div className="restaurant-list-container">
            <h1>Available Restaurants</h1>
            <div className="restaurant-list-grid">
              {restaurants.map((restaurant, index) => (
                <div
                  key={restaurant.id}
                  className="restaurant-card"
                  onClick={() => handleRestaurantSelect(restaurant)}
                  style={{
                    backgroundImage: `url(/Images-lab2/r${
                      shuffledImageIndices[index % shuffledImageIndices.length]
                    }.jpg)`,
                  }}
                >
                  <div className="restaurant-card-content">
                    <h2>{restaurant.emri}</h2>
                    <p>{restaurant.adresa}</p>
                    <p>{restaurant.email}</p>
                    <p>{restaurant.numriTel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
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

            {menuData.map((categoryData) => (
              <div key={categoryData.category}>
                <h2 className="category-title">{categoryData.category}</h2>
                <div className="category-items-grid">
                  {categoryData.subcategories.flatMap((sub) =>
                    sub.items.map((item) => (
                      <div className="menu-item-card" key={item.id}>
                        <div className="menu-item-image-container">
                          {item.image && (
                            <img
                              src={
                                item.image.startsWith("/")
                                  ? item.image
                                  : "/" + item.image
                              }
                              alt={item.name}
                            />
                          )}
                        </div>

                        <div className="menu-item-text-content">
                          <div className="menu-item-name-with-icon">
                            <span className="menu-item-name">{item.name}</span>
                            <IconButton
                              icon={<MdNoteAdd size={18} />}
                              size="sm"
                              aria-label="Add Note"
                              className="note-icon-button"
                              onClick={() => handleOpenNoteModal(item)}
                            />
                          </div>

                          <div className="menu-item-description">
                            {item.description}
                          </div>
                          <div className="menu-item-price">
                            Price: ${item.price?.toFixed(2)}
                          </div>
                          <Button
                            onClick={() => addToCart(item)}
                            className="broken-border-button"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </Box>
          <NoteModal
            isOpen={isOpen}
            onClose={onClose}
            products={selectedItemProducts}
            selected={selectedProducts}
            setSelected={setSelectedProducts}
            menuItemId={selectedMenuItemId}
          />

          {/* SIDEBAR */}
          {cartItems.length > 0 && (
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
              <Box p={4} borderBottom="1px solid #ddd" mt={6} mb={2}>
                <Text fontSize="xl" fontWeight="bold">
                  Your Orders
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Tap + or – to update quantity
                </Text>
              </Box>

              <Box flex="1" overflowY="auto" px={4} py={2} mt={4}>
                <HStack
                  justify="space-between"
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.600"
                  mb={2}
                >
                  <Box flex="1">Item</Box>
                  <Box width="80px" textAlign="center">
                    Qty
                  </Box>
                  <Box width="60px" textAlign="right">
                    Price
                  </Box>
                </HStack>
                <Divider my={4} />
                <VStack spacing={3} align="stretch" mb={6}>
                  {cartItems.map((item) => (
                    <Box key={item.id}>
                      <HStack justify="space-between" fontSize="sm">
                        <Box flex="1" fontWeight="medium">
                          {item.name}
                        </Box>
                        <HStack spacing={1} width="80px" justify="center">
                          <Button
                            size="xs"
                            onClick={() => {
                              setCartItems((prev) =>
                                prev
                                  .map((i) =>
                                    i.id === item.id
                                      ? { ...i, quantity: i.quantity - 1 }
                                      : i
                                  )
                                  .filter((i) => i.quantity > 0)
                              );
                            }}
                          >
                            −
                          </Button>
                          <Text>{item.quantity}</Text>
                          <Button
                            size="xs"
                            onClick={() => {
                              setCartItems((prev) =>
                                prev.map((i) =>
                                  i.id === item.id
                                    ? { ...i, quantity: i.quantity + 1 }
                                    : i
                                )
                              );
                            }}
                          >
                            +
                          </Button>
                        </HStack>
                        <Box
                          width="60px"
                          textAlign="right"
                          color="red.500"
                          fontWeight="bold"
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
                <Divider my={4} />
                <HStack justify="space-between" mb={4}>
                  <Text fontSize="25px" fontWeight="bold">
                    Total
                  </Text>
                  <Text fontSize="25px" fontWeight="bold" color="red.500">
                    ${total.toFixed(2)}
                  </Text>
                </HStack>
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
            </Box>
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
