import React, { useEffect } from "react";
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

const NoteModal = ({ isOpen, onClose, products, selected, setSelected }) => {
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
          color="#333"
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
                _hover={{ bg: "#f4f4f4" }}
                transition="0.2s"
              >
                <Checkbox
                  isChecked={selected.includes(product)}
                  onChange={() => toggleCheck(product)}
                  colorScheme="orange"
                >
                  {product}
                </Checkbox>
              </Box>
            ))}
          </SimpleGrid>

          <Flex justifyContent="center">
            <Button
              colorScheme="orange"
              variant="solid"
              borderRadius="full"
              px={6}
              onClick={onClose}
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
