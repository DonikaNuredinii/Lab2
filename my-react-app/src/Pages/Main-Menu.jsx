import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import "../CSS/Main-Menu.css";
import "../CSS/BrokenBorderButton.css";
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
import { MdNoteAdd } from "react-icons/md";
import NoteModal from "./NoteModal";

const MainMenu = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItemProducts, setSelectedItemProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (pageIndex < menuData.length - 1) setPageIndex((prev) => prev + 1);
    },
    onSwipedRight: () => {
      if (pageIndex === 0) navigate("/");
      else setPageIndex((prev) => prev - 1);
    },
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  const handleSubmitOrder = async () => {
    const orderDto = {
      restaurantID: 2,
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

      await res.json();
      alert(
        "Faleminderit! Porosia juaj po përgatitet dhe së shpejti do të jete gati."
      );
      setCartItems([]);
      navigate("/checkout");
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, categoriesRes, subcategoriesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE}/api/MenuItems`),
          fetch(`${import.meta.env.VITE_API_BASE}/api/Category`),
          fetch(`${import.meta.env.VITE_API_BASE}/api/Subcategory`),
        ]);

        if (!itemsRes.ok || !categoriesRes.ok || !subcategoriesRes.ok)
          throw new Error("Failed to fetch menu data");

        const [itemsJson, categoriesJson, subcategoriesJson] =
          await Promise.all([
            itemsRes.json(),
            categoriesRes.json(),
            subcategoriesRes.json(),
          ]);

        const filteredItems = itemsJson.filter(
          (item) => item.restaurantId === 2
        );
        const filteredCategories = categoriesJson.filter(
          (cat) => cat.restaurantID === 2
        );

        const structured = filteredCategories
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
          .filter((cat) => cat.subcategories.length > 0);

        setMenuData(structured);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load menu data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const currentPage = menuData[pageIndex];

  if (loading) return <div className="menu-white-page">Loading menu...</div>;
  if (error) return <div className="menu-white-page">Error: {error}</div>;
  if (!menuData || menuData.length === 0)
    return <div className="menu-white-page">No menu items available.</div>;

  return (
    <Box display="flex" height="100vh" {...swipeHandlers}>
      {/* LEFT: Menu Content */}
      <Box flex="1" overflowY="auto" p={4} className="menu-white-page">
        <h1 className="menu-white-title">{currentPage?.category}</h1>

        <div
          className="menu-card-grid"
          style={{
            maxWidth: cartItems.length > 0 ? "calc(100% - 360px)" : "100%",
            transition: "max-width 0.3s ease",
          }}
        >
          {currentPage?.subcategories?.flatMap((sub) =>
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

        <Text mt={6} className="menu-nav-tip" textAlign="center">
          {pageIndex > 0 && "← Swipe Back"}{" "}
          {pageIndex < menuData.length - 1 && "Swipe Forward →"}
        </Text>
      </Box>

      {cartItems.length > 0 && (
        <Box
          width={{ base: "100%", md: "360px" }}
          minW={{ base: "100%", md: "360px" }}
          bg="#FAF9F6"
          borderLeft="1px solid #F0EAD6"
          boxShadow="xl"
          height="100vh"
          display="flex"
          flexDirection="column"
          zIndex="10"
        >
          {/* Header */}
          <Box p={4} borderBottom="1px solid #ddd" mt={6} mb={2} bg="#FAF9F6">
            <Text fontSize="xl" fontWeight="bold">
              Your Orders
            </Text>
            <Text fontSize="sm" color="gray.500">
              Tap + or – to update quantity
            </Text>
          </Box>

          <Box flex="1" overflowY="auto" px={4} py={2} mt={4}>
            {/* Table headers */}
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
            <Divider my={4} borderColor="blackAlpha.800" />
            {/* Items */}
            <VStack spacing={3} align="stretch" mb={6}>
              {cartItems.map((item) => (
                <Box key={item.id}>
                  <HStack justify="space-between" align="center" fontSize="sm">
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
            {/* Total + Button inside scroll area */}
            <Divider my={4} mt={10} borderColor="black" />
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
              mt={10}
              color="gray.900"
            >
              Place Order
            </Button>
          </Box>
        </Box>
      )}

      <NoteModal
        isOpen={isOpen}
        onClose={onClose}
        products={selectedItemProducts}
        selected={selectedProducts}
        setSelected={setSelectedProducts}
        menuItemId={selectedMenuItemId}
      />
    </Box>
  );
};

export default MainMenu;
