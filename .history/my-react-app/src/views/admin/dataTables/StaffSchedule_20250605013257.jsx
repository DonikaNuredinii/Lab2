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
  Text
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
          ...formData,
          tableID: formData.tableID ? parseInt(formData.tableID) : null,
          staffID: parseInt(formData.staffID),
          assignedBy: formData.assignedBy ? parseInt(formData.assignedBy) : null
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
    <Box pt={10} px={6} maxW="1200px" mx="auto">
      <Flex justifyContent="space-between" alignItems="center" mb={4} mt={4}>
        <Text fontSize="2xl" fontWeight="bold">Staff Schedules</Text>
        <Button colorScheme="blue" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Schedule"}
        </Button>
      </Flex>

      <Collapse in={showForm} animateOpacity>
        <Box p={6} borderWidth="1px" borderRadius="xl" bg="gray.50" mt={4} mb={16} boxShadow="md">
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
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ].map(day => (
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
              <FormLabel>Assigned By (User ID)</FormLabel>
              <Input value={formData.assignedBy} onChange={(e) => setFormData({ ...formData, assignedBy: e.target.value })} />
            </FormControl>

            <Box pt={6}>
              <Button colorScheme="teal" onClick={handleSubmit}>Save Schedule</Button>
            </Box>
          </VStack>
        </Box>
      </Collapse>

      <Box overflowX="auto" borderRadius="lg" boxShadow="base" mt={4}>
        <Table variant="striped" colorScheme="gray">
          <Thead bg="gray.100">
            <Tr>
              <Th>Staff</Th>
              <Th>Day</Th>
              <Th>Start</Th>
              <Th>End</Th>
              <Th>Table</Th>
              <Th>Assigned By</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {schedules.map((s) => (
              <Tr key={s.scheduleID}>
                <Td>{s.staffUser?.firstName} {s.staffUser?.lastName}</Td>
                <Td>{s.dayOfWeek}</Td>
                <Td>{s.startTime}</Td>
                <Td>{s.endTime}</Td>
                <Td>{s.table?.tableNumber || "-"}</Td>
                <Td>{s.assignedByUser?.firstName || "-"}</Td>
                <Td>
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