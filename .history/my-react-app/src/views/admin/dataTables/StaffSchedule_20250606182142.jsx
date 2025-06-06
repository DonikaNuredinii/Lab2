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
  useColorModeValue,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

const StaffSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [staff, setStaff] = useState([]);
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    staffID: "",
    tableID: "",
    dayOfWeek: "Monday",
    startTime: "",
    endTime: "",
    assignedBy: ""
  });
  const toast = useToast();
  const textColor = useColorModeValue("secondaryGray.900", "white");

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
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/StaffSchedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          StaffID: parseInt(formData.staffID),
          TableID: formData.tableID ? parseInt(formData.tableID) : null,
          DayOfWeek: formData.dayOfWeek,
          StartTime: formData.startTime + ":00",
          EndTime: formData.endTime + ":00",
          AssignedBy: formData.assignedBy ? parseInt(formData.assignedBy) : null
        })
      });

      if (!res.ok) throw new Error("Failed to add schedule");
      toast({ title: "Success", description: "Schedule added.", status: "success" });
      fetchSchedules();
      setShowForm(false);
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE}/api/StaffSchedule/${id}`, {
        method: "DELETE"
      });
      toast({ title: "Deleted", description: "Schedule removed.", status: "info" });
      fetchSchedules();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete schedule.", status: "error" });
    }
  };

  return (
    <Box pt={20} px={16} maxW="1600px" mx="auto">
      <Flex justifyContent="space-between" alignItems="center" mb={4} mt={4}>
        <Text fontSize="2xl" fontWeight="bold">Staff Schedules</Text>
        <Button colorScheme="blue" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Schedule"}
        </Button>
      </Flex>

      <Collapse in={showForm} animateOpacity>
        <Box p={6} borderWidth="1px" borderRadius="2xl" bg="gray.50" mt={4} mb={10} boxShadow="md">
          <VStack spacing={4} align="stretch">
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
                {staff.map((user) => (
                  <option key={user.userID} value={user.userID}>{user.firstName} {user.lastName}</option>
                ))}
              </Select>
            </FormControl>

            <Flex pt={4} justifyContent="flex-end">
              <Button colorScheme="teal" onClick={handleSubmit}>Save Schedule</Button>
            </Flex>
          </VStack>
        </Box>
      </Collapse>

      <Box overflowX="auto" borderRadius="2xl" boxShadow="base" bg="white">
        <Table variant="simple" color="gray.500">
          <Thead bg="gray.100">
            <Tr>
              <Th textAlign="center">Staff</Th>
              <Th textAlign="center">Day</Th>
              <Th textAlign="center">Start</Th>
              <Th textAlign="center">End</Th>
              <Th textAlign="center">Table</Th>
              <Th textAlign="center">Assigned By</Th>
              <Th textAlign="center"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {schedules.map((s) => (
              <Tr key={s.scheduleID}>
                <Td textAlign="center">{s.staffUser?.firstName} {s.staffUser?.lastName}</Td>
                <Td textAlign="center">{s.dayOfWeek}</Td>
                <Td textAlign="center">{s.startTime}</Td>
                <Td textAlign="center">{s.endTime}</Td>
                <Td textAlign="center">{s.table?.tableNumber || "-"}</Td>
                <Td textAlign="center">{s.assignedByUser?.firstName || "-"}</Td>
                <Td textAlign="center">
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
  );
};

export default StaffSchedule;