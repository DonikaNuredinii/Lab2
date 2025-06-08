import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Checkbox,
  SimpleGrid,
  useToast,
  Spinner,
  Input,
} from "@chakra-ui/react";
import axios from "axios";

const ManageIngredientsModal = ({ isOpen, onClose, menuItemId }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const allRes = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/Products`
      );
      const assignedRes = await axios.get(
        `${
          import.meta.env.VITE_API_BASE
        }/api/MenuItemProducts/menuitem/${menuItemId}`
      );

      setAllProducts(allRes.data);
      const ids = assignedRes.data.map((p) => p.productsID); // ensure backend returns { productsID: ... }
      setSelectedProductIds(ids);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error loading ingredients",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && menuItemId) {
      fetchProducts();
    }
  }, [isOpen, menuItemId]);

  const handleToggle = async (productId) => {
    const isSelected = selectedProductIds.includes(productId);

    try {
      if (isSelected) {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE}/api/MenuItemProducts/remove`,
          {
            data: {
              menuItemID: menuItemId,
              productsID: productId,
            },
          }
        );

        setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
        toast({
          title: "Ingredient removed",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE}/api/MenuItemProducts`,
          {
            menuItemID: menuItemId,
            productsID: productId,
            isRequired: true,
          }
        );

        setSelectedProductIds((prev) => [...prev, productId]);
        toast({
          title: "Ingredient added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to update ingredient",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const filteredProducts = allProducts.filter((p) =>
    p.emri.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Ingredients</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Input
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                mb={4}
              />
              <SimpleGrid columns={2} spacing={3}>
                {filteredProducts.map((p) => (
                  <Checkbox
                    key={p.productsID}
                    isChecked={selectedProductIds.includes(p.productsID)}
                    onChange={() => handleToggle(p.productsID)}
                  >
                    {p.emri}
                  </Checkbox>
                ))}
              </SimpleGrid>
              <Button mt={5} colorScheme="blue" onClick={onClose}>
                Done
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ManageIngredientsModal;
