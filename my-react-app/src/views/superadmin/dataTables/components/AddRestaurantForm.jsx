import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Checkbox,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AddRestaurantForm = ({
  onSubmit,
  initialData = null,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    id: null,
    emri: "",
    adresa: "",
    email: "",
    numriTel: "",
    orari: daysOfWeek.map((day) => ({
      dita: daysOfWeek.indexOf(day),
      oraHapjes: "",
      oraMbylljes: "",
      isClosed: false,
    })),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || null,
        emri: initialData.emri || "",
        adresa: initialData.adresa || "",
        email: initialData.email || "",
        numriTel: initialData.numriTel || "",
        orari:
          initialData.restaurantHours?.map((hour) => ({
            dita: hour.dita,
            oraHapjes: hour.oraHapjes || "",
            oraMbylljes: hour.oraMbylljes || "",
            isClosed: hour.isClosed ?? false,
          })) ||
          daysOfWeek.map((day) => ({
            dita: daysOfWeek.indexOf(day),
            oraHapjes: "",
            oraMbylljes: "",
            isClosed: false,
          })),
      });
    } else {
      setFormData({
        id: null,
        emri: "",
        adresa: "",
        email: "",
        numriTel: "",
        orari: daysOfWeek.map((day) => ({
          dita: daysOfWeek.indexOf(day),
          oraHapjes: "",
          oraMbylljes: "",
          isClosed: false,
        })),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHourChange = (index, field, value) => {
    setFormData((prevData) => {
      const newOrari = [...prevData.orari];
      newOrari[index] = {
        ...newOrari[index],
        [field]: value,
      };
      return { ...prevData, orari: newOrari };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: formData.id,
      emri: formData.emri,
      adresa: formData.adresa,
      email: formData.email,
      numriTel: formData.numriTel,
      orari: formData.orari.map((hour) => ({
        dita: hour.dita,
        oraHapjes: hour.oraHapjes,
        oraMbylljes: hour.oraMbylljes,
        isClosed: hour.isClosed ?? false,
      })),
    };
    onSubmit(payload);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <Stack spacing={3}>
        <FormControl id="emri" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            name="emri"
            value={formData.emri}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="adresa" isRequired>
          <FormLabel>Address</FormLabel>
          <Input
            type="text"
            name="adresa"
            value={formData.adresa}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl id="numriTel">
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="text"
            name="numriTel"
            value={formData.numriTel}
            onChange={handleChange}
          />
        </FormControl>

        <Heading as="h4" size="sm" mt={4} mb={2}>
          Operating Hours
        </Heading>
        <Stack spacing={2}>
          {formData.orari.map((dayHour, index) => (
            <Box key={index} borderWidth="1px" p={3} borderRadius="md">
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="bold">{daysOfWeek[dayHour.dita]}</Text>
                <Checkbox
                  isChecked={dayHour.isClosed}
                  onChange={(e) =>
                    handleHourChange(index, "isClosed", e.target.isChecked)
                  }
                >
                  Closed
                </Checkbox>
              </Flex>
              {!dayHour.isClosed && (
                <Flex gap={2}>
                  <FormControl>
                    <FormLabel fontSize="sm">Opening Time</FormLabel>
                    <Input
                      type="time"
                      size="sm"
                      value={dayHour.oraHapjes}
                      onChange={(e) =>
                        handleHourChange(
                          index,
                          "oraHapjes",
                          `${e.target.value}:00`
                        )
                      }
                    />
                  </FormControl>

                  <FormControl>
                    {" "}
                    <FormLabel fontSize="sm">Closing Time</FormLabel>
                    <Input
                      type="time"
                      size="sm"
                      value={dayHour.oraMbylljes}
                      onChange={(e) =>
                        handleHourChange(
                          index,
                          "oraMbylljes",
                          `${e.target.value}:00`
                        )
                      }
                    />
                  </FormControl>
                </Flex>
              )}
            </Box>
          ))}
        </Stack>

        <Button type="submit" colorScheme="brand" size="md" borderRadius="0">
          {isEdit ? "Update Restaurant" : "Add Restaurant"}
        </Button>
      </Stack>
    </Box>
  );
};

export default AddRestaurantForm;
