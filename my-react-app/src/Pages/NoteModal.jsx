import React, { useEffect } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  SimpleGrid,
  Text,
  Box,
  Divider,
  Button,
  Flex,
} from "@chakra-ui/react";

const NoteModal = ({
  isOpen,
  onClose,
  products,
  selected,
  setSelected,
  menuItemId,
}) => {
  const toggleCheck = (product) => {
    if (selected.includes(product)) {
      setSelected(selected.filter((p) => p !== product));
    } else {
      setSelected([...selected, product]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelected(products);
    }
  }, [isOpen, products, setSelected]);

  const handleDone = async () => {
    const uncheckedProducts = products.filter((p) => !selected.includes(p));

    try {
      for (const product of uncheckedProducts) {
        await axios.post(`${import.meta.env.VITE_API_BASE}/api/ProductNotes`, {
          menuItemsID: menuItemId,
          note: product,
          createdAt: new Date().toISOString(),
        });
      }

      console.log("Notes saved successfully");
      onClose();
    } catch (error) {
      console.error("Failed to save notes", error);
      alert("Something went wrong while saving notes.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent
        bg="#fdfbf7"
        borderRadius="xl"
        boxShadow="lg"
        p={2}
        maxW={{ base: "90%", md: "500px" }}
        position="relative"
        top={{ base: "-7vh", md: "-15vh" }}
        left={{ base: "0", md: "0" }}
      >
        <ModalHeader
          fontSize="xl"
          textAlign="center"
          fontWeight="bold"
          color="#32524D"
        >
          Customize Your Dish
        </ModalHeader>
        <Divider borderColor="#ccc" />
        <ModalCloseButton />

        <ModalBody pt={5} pb={6}>
          <Text mb={4} color="#666" fontSize="sm" textAlign="center">
            Uncheck the ingredients you want to remove from this dish.
          </Text>

          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mb={6}>
            {products.map((product, idx) => (
              <Box
                key={idx}
                borderWidth="1px"
                borderRadius="lg"
                p={2}
                bg="#fff"
                _hover={{ bg: "#e9f1ef" }}
                transition="0.2s"
              >
                <Checkbox
                  isChecked={selected.includes(product)}
                  onChange={() => toggleCheck(product)}
                  colorScheme="green"
                  iconColor="#32524D"
                  sx={{
                    control: {
                      borderColor: "#32524D",
                      _checked: {
                        bg: "#32524D",
                        borderColor: "#32524D",
                      },
                    },
                  }}
                >
                  {product}
                </Checkbox>
              </Box>
            ))}
          </SimpleGrid>

          <Flex justifyContent="center">
            <Button
              bg="#32524D"
              color="white"
              _hover={{ bg: "#28453f" }}
              variant="solid"
              borderRadius="full"
              px={6}
              onClick={handleDone}
            >
              Done
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NoteModal;
