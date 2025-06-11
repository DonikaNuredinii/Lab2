import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Checkbox,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";

const StaffSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [staff, setStaff] = useState([]);
  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState({
    scheduleID: null,
    staffID: "",
    tableIDs: [],
    dayOfWeek: "Monday",
    startTime: "",
    endTime: "",
    assignedBy: "",
  });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchSchedules();
    fetchStaff();
    fetchTables();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/StaffSchedule`
      );
      const data = await res.json();
      setSchedules(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load schedules.",
        status: "error",
      });
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/User`);
      const data = await res.json();
      setStaff(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load staff.",
        status: "error",
      });
    }
  };

  const restaurantID = 2; // Replace with dynamic value when available

  const fetchTables = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/Table`);
      const data = await res.json();
      const filteredTables = data.filter(
        (t) => t.restaurantID === restaurantID
      );
      setTables(filteredTables);
      console.log("Fetched Tables:", data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tables.",
        status: "error",
      });
    }
  };

  const handleSubmit = async () => {
    const method = formData.scheduleID ? "PUT" : "POST";
    const endpoint = formData.scheduleID
      ? `${import.meta.env.VITE_API_BASE}/api/StaffSchedule/${
          formData.scheduleID
        }`
      : `${import.meta.env.VITE_API_BASE}/api/StaffSchedule`;

    // ✅ Prepare payload and log it
    const payload = {
      StaffID: parseInt(formData.staffID),
      TableIDs: formData.tableIDs.map((id) => parseInt(id)),
      DayOfWeek: formData.dayOfWeek,
      StartTime: `${formData.startTime}:00`,
      EndTime: `${formData.endTime}:00`,
      AssignedBy: formData.assignedBy ? parseInt(formData.assignedBy) : null,
    };

    console.log("🔍 Submitting schedule payload:", payload);

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save schedule");

      toast({
        title: "Success",
        description: "Schedule saved.",
        status: "success",
      });

      fetchSchedules();
      onClose();
      setFormData({
        scheduleID: null,
        staffID: "",
        tableIDs: [],
        dayOfWeek: "Monday",
        startTime: "",
        endTime: "",
        assignedBy: "",
      });
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE}/api/StaffSchedule/${id}`, {
        method: "DELETE",
      });
      toast({
        title: "Deleted",
        description: "Schedule removed.",
        status: "info",
      });
      fetchSchedules();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete schedule.",
        status: "error",
      });
    }
  };

  return (
    <>
      <Box h="250px" />
      <Box px="25px" mb="24px" maxW="1300px" mx="auto">
        <Box overflowX="auto" borderRadius="2xl" boxShadow="base" bg="white">
          <Flex px="25px" mt="6" justifyContent="flex-end">
            <Button
              colorScheme="brand"
              size="md"
              borderRadius="0"
              onClick={onOpen}
            >
              Add Schedule
            </Button>
          </Flex>
          <Table variant="simple" color="gray.800" mb="24px">
            <Thead bg="gray.100">
              <Tr>
                <Th textAlign="center" fontWeight="bold">
                  Staff
                </Th>
                <Th textAlign="center" fontWeight="bold">
                  Day
                </Th>
                <Th textAlign="center" fontWeight="bold">
                  Start
                </Th>
                <Th textAlign="center" fontWeight="bold">
                  End
                </Th>
                <Th textAlign="center" fontWeight="bold">
                  Table
                </Th>
                <Th textAlign="center" fontWeight="bold">
                  Assigned By
                </Th>
                <Th textAlign="center" fontWeight="bold">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {schedules.map((s) => (
                <Tr key={s.scheduleID}>
                  <Td textAlign="center" fontWeight="bold">
                    {s.staffUser?.firstName} {s.staffUser?.lastName}
                  </Td>
                  <Td textAlign="center" fontWeight="bold">
                    {s.dayOfWeek}
                  </Td>
                  <Td textAlign="center" fontWeight="bold">
                    {s.startTime}
                  </Td>
                  <Td textAlign="center" fontWeight="bold">
                    {s.endTime}
                  </Td>
                  <Td textAlign="center" fontWeight="bold">
                    {s.staffScheduleTables
                      ?.map((t) => `Table ${t.table?.tableNumber}`)
                      .join(", ") || "-"}
                  </Td>

                  <Td textAlign="center" fontWeight="bold">
                    {s.assignedByUser?.firstName || "-"}
                  </Td>
                  <Td textAlign="center">
                    <IconButton
                      icon={<MdEdit />}
                      size="sm"
                      mr={2}
                      onClick={() => {
                        setFormData({
                          scheduleID: s.scheduleID,
                          staffID: s.staffID,
                          tableIDs: s.tableID,
                          dayOfWeek: s.dayOfWeek,
                          startTime: s.startTime?.slice(0, 5),
                          endTime: s.endTime?.slice(0, 5),
                          assignedBy: s.assignedBy,
                        });
                        onOpen();
                      }}
                    />
                    <IconButton
                      icon={<MdDelete />}
                      colorScheme="red"
                      size="sm"
                      aria-label="Delete"
                      onClick={() => handleDelete(s.scheduleID)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {formData.scheduleID ? "Edit Schedule" : "Add New Schedule"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch" pb={6}>
              <FormControl isRequired>
                <FormLabel>Staff Member</FormLabel>
                <Select
                  value={formData.staffID}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    console.log("✅ Selected staff ID:", selectedId);
                    setFormData({ ...formData, staffID: selectedId });
                  }}
                >
                  {staff.map((s) =>
                    s.userID != null ? (
                      <option key={`staff-${s.userID}`} value={s.userID}>
                        {s.firstName} {s.lastName}
                      </option>
                    ) : null
                  )}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Tables</FormLabel>
                <Box
                  border="1px solid #CBD5E0"
                  borderRadius="md"
                  p={2}
                  maxH="150px"
                  overflowY="auto"
                >
                  <VStack align="start">
                    {tables.map((table) => (
                      <Checkbox
                        key={`table-${table.id}`}
                        value={table.id}
                        isChecked={formData.tableIDs?.includes(
                          String(table.id)
                        )}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            tableIDs: e.target.checked
                              ? [...(prev.tableIDs || []), value]
                              : (prev.tableIDs || []).filter(
                                  (id) => id !== value
                                ),
                          }));
                        }}
                      >
                        ({table.qrCode})
                      </Checkbox>
                    ))}
                  </VStack>
                </Box>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Day of Week</FormLabel>
                <Select
                  value={formData.dayOfWeek}
                  onChange={(e) =>
                    setFormData({ ...formData, dayOfWeek: e.target.value })
                  }
                >
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>End Time</FormLabel>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Assigned By</FormLabel>
                <Select
                  placeholder="Select a user"
                  value={formData.assignedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedBy: e.target.value })
                  }
                >
                  {staff.map((user) =>
                    user.userID != null ? (
                      <option key={`assign-${user.userID}`} value={user.userID}>
                        {user.firstName} {user.lastName}
                      </option>
                    ) : null
                  )}
                </Select>
              </FormControl>
              <Button
                colorScheme="teal"
                alignSelf="flex-end"
                onClick={handleSubmit}
              >
                {formData.scheduleID ? "Update Schedule" : "Save Schedule"}
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StaffSchedule;
