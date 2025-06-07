// updated to POST directly to /api/Orders without items
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import "../CSS/Main-Menu.css";
import {
  Box,
  Text,
  IconButton,
  useDisclosure,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Divider,
  HStack,
  Stack,
  Spacer,
} from "@chakra-ui/react";
import { MdNoteAdd } from "react-icons/md";
import NoteModal from "./NoteModal";

const MainMenu = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const [selectedItemProducts, setSelectedItemProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmitOrder = async () => {
    const orderDto = {
      restaurantID: 2,
      tableID: 1,
      costumerID: 0,
      costumerAdressID: 0,
      orderType: "Dine-in",
      status: "Pending",
      totalAmount: total,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/Orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderDto)
      });

      if (!res.ok) throw new Error("Failed to place order");

      const data = await res.json();
      alert(`Faleminderit! Porosia juaj po përgatitet dhe  së shpejti.`);
      setCartItems([]);
      setIsCartOpen(false);
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

        if (!itemsRes.ok || !categoriesRes.ok || !subcategoriesRes.ok) {
          throw new Error("Failed to fetch menu data");
        }

        const itemsJson = await itemsRes.json();
        const categoriesJson = await categoriesRes.json();
        const subcategoriesJson = await subcategoriesRes.json();

        const filteredItems = itemsJson.filter(
          (item) => item.restaurantId === 2
        );

        const structuredData = categoriesJson
          .map((category) => {
            const subcats = subcategoriesJson
              .filter((sub) => sub.categoryID === category.id)
              .map((sub) => {
                const itemsForSubcategory = filteredItems.filter(
                  (item) => item.subCategoryId === sub.id
                );

                return {
                  title: sub.name,
                  items: itemsForSubcategory,
                };
              })
              .filter((sub) => sub.items.length > 0);

            return {
              category: category.name,
              subcategories: subcats,
            };
          })
          .filter((c) => c.subcategories.length > 0);

        setMenuData(structuredData);
      } catch (err) {
        console.error("Menu fetch failed:", err);
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
      if (exists) return prev;
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

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

  const currentPage = menuData[pageIndex];

  if (loading) return <div className="menu-white-page">Loading menu...</div>;
  if (error) return <div className="menu-white-page">Error: {error}</div>;
  if (!menuData || menuData.length === 0)
    return <div className="menu-white-page">No menu items available.</div>;

  return (
    <div className="menu-white-page" {...swipeHandlers}>
      <h1 className="menu-white-title">{currentPage?.category}</h1>

      <div className="menu-card-grid">
        {currentPage?.subcategories?.flatMap((sub) =>
          sub.items.map((item) => (
            <div className="menu-item-card" key={item.id}>
              <div className="menu-item-image-container">
                {item.image && (
                  <img
                    src={item.image.startsWith("/") ? item.image : "/" + item.image}
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
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `${import.meta.env.VITE_API_BASE}/api/MenuItemProducts/menuitem/${item.id}`
                        );
                        if (!res.ok) throw new Error("Failed to fetch products");

                        const data = await res.json();
                        if (data.length > 0) {
                          setSelectedItemProducts(data);
                          setSelectedProducts(data);
                          setSelectedMenuItemId(item.id);
                          onOpen();
                        } else {
                          alert("This dish has no removable ingredients configured.");
                        }
                      } catch (error) {
                        console.error("Failed to load product ingredients:", error);
                      }
                    }}
                  />
                </div>
                <div className="menu-item-description">{item.description}</div>
                <div className="menu-item-price">Price: ${item.price?.toFixed(2)}</div>
                <Button
                  mt={2}
                  size="sm"
                  variant="solid"
                  bg="white"
                  color="black"
                  borderRadius="full"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <NoteModal
        isOpen={isOpen}
        onClose={onClose}
        products={selectedItemProducts}
        selected={selectedProducts}
        setSelected={setSelectedProducts}
        menuItemId={selectedMenuItemId}
      />

      <Drawer isOpen={isCartOpen} placement="right" onClose={() => setIsCartOpen(false)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize="2xl" fontWeight="bold" color="teal.700">My Cart</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={3}>
              {cartItems.length === 0 ? (
                <Text fontSize="sm">Cart is empty</Text>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <Box key={item.id}>
                      <HStack justify="space-between">
                        <Text>{item.name}</Text>
                        <Text fontWeight="bold">${item.price.toFixed(2)}</Text>
                      </HStack>
                      <Divider />
                    </Box>
                  ))}
                  <Box pt={4}>
                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="bold">Total</Text>
                      <Text fontSize="lg" fontWeight="bold">${total.toFixed(2)}</Text>
                    </HStack>
                  </Box>
                </>
              )}
              <Button
                mt={4}
                colorScheme="teal"
                borderRadius="full"
                onClick={handleSubmitOrder}>
                Place Order
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <div className="menu-nav-tip">
        {pageIndex > 0 && "← Swipe Back"} {pageIndex < menuData.length - 1 && "Swipe Forward →"}
      </div>
    </div>
  );
};

export default MainMenu;
