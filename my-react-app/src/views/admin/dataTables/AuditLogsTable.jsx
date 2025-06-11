import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const AuditLogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const toast = useToast();
  const textColor = useColorModeValue("gray.800", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/AuditLog`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data);
      setFilteredLogs(data);
    } catch (err) {
      toast({
        title: "Error loading logs",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = logs.filter((log) => {
      const matchesTerm = Object.values(log).some((value) =>
        value?.toString().toLowerCase().includes(term)
      );

      const matchesDate =
        !filterDate ||
        (log.loginTimestamp &&
          new Date(log.loginTimestamp).toISOString().slice(0, 10) ===
            filterDate);

      return matchesTerm && matchesDate;
    });
    setFilteredLogs(filtered);
  }, [searchTerm, filterDate, logs]);

  return (
    <Box mt="90px" px="25px" pb="50px">
      <Flex justify="flex-start" wrap="wrap" gap={4} mb={6}>
        <InputGroup width="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg={bgColor}
            borderColor={borderColor}
          />
        </InputGroup>

        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          bg={bgColor}
          borderColor={borderColor}
          width="200px"
        />
      </Flex>

      <Box overflowX="auto" borderRadius="lg" boxShadow="md" bg={bgColor}>
        <Table variant="simple" size="md">
          <Thead bg="gray.100">
            <Tr>
              <Th>User ID</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Role ID</Th>
              <Th>Login Timestamp</Th>
              <Th>Logout Timestamp</Th>
              <Th>User Agent</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredLogs.map((log) => (
              <Tr key={log.id} _hover={{ bg: "gray.50" }}>
                <Td>{log.userId}</Td>
                <Td>{log.firstName}</Td>
                <Td>{log.lastName}</Td>
                <Td>{log.roleId}</Td>
                <Td>
                  {log.loginTimestamp
                    ? new Date(log.loginTimestamp).toLocaleString()
                    : "-"}
                </Td>
                <Td>
                  {log.logoutTimestamp
                    ? new Date(log.logoutTimestamp).toLocaleString()
                    : "-"}
                </Td>
                <Td maxW="300px" whiteSpace="normal" fontSize="sm">
                  {log.userAgent}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default AuditLogsTable;
