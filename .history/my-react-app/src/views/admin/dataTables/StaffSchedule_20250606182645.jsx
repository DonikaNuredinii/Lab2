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
  Collapse,
  IconButton,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";

const StaffSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [staff, setStaff] = useState([]);
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    scheduleID: null,
    staffID: "",
    tableID: "",
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/StaffSchedule`);
      const data = await res.json();
      setSchedules(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load schedules.", status: "error" });
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/User`);
      const data = await res.json();
      setStaff(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load staff.", status: "error" });
    }
  };

  const fetchTables = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/Table`);
      const data = await res.json();
      setTables(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load tables.", status: "error" });
    }
  };

  const handleSubmit = async () => {
    const method = formData.scheduleID ? "PUT" : "POST";
    const endpoint = formData.scheduleID
      ? `${import.meta.env.VITE_API_BASE}/api/StaffSchedule/${formData.scheduleID}`
      : `${import.meta.env.VITE_API_BASE}/api/StaffSchedule`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          StaffID: parseInt(formData.staffID),
          TableID: formData.tableID ? parseInt(formData.tableID) : null,
          DayOfWeek: formData.dayOfWeek,
          StartTime: formData.startTime + ":00",
          EndTime: formData.endTime + ":00",
          AssignedBy: formData.assignedBy ? parseInt(formData.assignedBy) : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save schedule");
      toast({ title: "Success", description: "Schedule saved.", status: "success" });
      fetchSchedules();
      setShowForm(false);
      onClose();
      setFormData({
        scheduleID: null,
        staffID: "",
        tableID: "",
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
      toast({ title: "Deleted", description: "Schedule removed.", status: "info" });
      fetchSchedules();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete schedule.", status: "error" });
    }
  };

  return (
    <Box pt={20} px={12} maxW="1600px" mx="auto">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="3xl" fontWeight="bold">Staff Schedules</Text>
        <Button colorScheme="blue" onClick={() => {
          setFormData({
            scheduleID: null,
            staffID: "",
            tableID: "",
            dayOfWeek: "Monday",
            startTime: "",
            endTime: "",
            assignedBy: "",
          });
          onOpen();
        }}>
          Add Schedule
        </Button>
      </Flex>

      <Box overflowX="auto" borderRadius="2xl" boxShadow="base" bg="white">
        <Table variant="simple" color="gray.500" mb="24px">
          <Thead bg="gray.100">
            <Tr>
              <Th textAlign="center" fontWeight="bold">Staff</Th>
              <Th textAlign="center" fontWeight="bold">Day</Th>
              <Th textAlign="center" fontWeight="bold">Start</Th>
              <Th textAlign="center" fontWeight="bold">End</Th>
              <Th textAlign="center" fontWeight="bold">Table</Th>
              <Th textAlign="center" fontWeight="bold">Assigned By</Th>
              <Th textAlign="center" fontWeight="bold">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {schedules.map((s) => (
              <Tr key={s.scheduleID}>
            <Td textAlign="center" fontWeight="bold" color="gray.900">{s.staffUser?.firstName} {s.staffUser?.lastName}</Td>

                <Td textAlign="center" fontWeight="bold">{s.dayOfWeek}</Td>
                <Td textAlign="center" fontWeight="bold">{s.startTime}</Td>
                <Td textAlign="center" fontWeight="bold">{s.endTime}</Td>
                <Td textAlign="center" fontWeight="bold">{s.table?.tableNumber || "-"}</Td>
                <Td textAlign="center" fontWeight="bold">{s.assignedByUser?.firstName || "-"}</Td>
                <Td textAlign="center">
                  <IconButton
                    icon={<MdEdit />}
                    size="sm"
                    mr={2}
                    onClick={() => {
                      setFormData({
                        scheduleID: s.scheduleID,
                        staffID: s.staffID,
                        tableID: s.tableID,
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

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{formData.scheduleID ? "Edit Schedule" : "Add New Schedule"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch" pb={6}>
              <FormControl isRequired>
                <FormLabel>Staff Member</FormLabel>
                <Select value={formData.staffID} onChange={(e) => setFormData({ ...formData, staffID: e.target.value })}>
                  {staff.map(s => (
                    <option key={s.userID} value={s.userID}>{s.firstName} {s.lastName}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Table</FormLabel>
                <Select placeholder="Optional" value={formData.tableID} onChange={(e) => setFormData({ ...formData, tableID: e.target.value })}>
                  {tables.map(t => (
                    <option key={t.tableID} value={t.tableID}>Table {t.tableNumber}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Day of Week</FormLabel>
                <Select value={formData.dayOfWeek} onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Start Time</FormLabel>
                <Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>End Time</FormLabel>
                <Input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Assigned By</FormLabel>
                <Select placeholder="Select a user" value={formData.assignedBy} onChange={(e) => setFormData({ ...formData, assignedBy: e.target.value })}>
                  {staff.map(user => (
                    <option key={user.userID} value={user.userID}>{user.firstName} {user.lastName}</option>
                  ))}
                </Select>
              </FormControl>
              <Flex justifyContent="flex-end" pt={4}>
                <Button colorScheme="teal" onClick={handleSubmit}>{formData.scheduleID ? "Update Schedule" : "Save Schedule"}</Button>
              </Flex>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StaffSchedule;