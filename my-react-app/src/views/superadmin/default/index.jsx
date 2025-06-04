/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, SimpleGrid, useColorModeValue, Text } from "@chakra-ui/react";
// Assets
// Custom components
import React from "react";

export default function SuperAdminDashboard() {
  // Chakra Color Mode
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 1, lg: 2, "2xl": 2 }}
        gap="20px"
        mb="20px"
      >
        {/* Placeholder for Restaurant Management */}
        <Box bg={boxBg} p="20px" borderRadius="15px">
          <Text fontSize="xl" fontWeight="bold" mb="10px">
            Restaurant Management
          </Text>
          <Text>Add your restaurant management component here.</Text>
        </Box>

        {/* Placeholder for Table Management */}
        <Box bg={boxBg} p="20px" borderRadius="15px">
          <Text fontSize="xl" fontWeight="bold" mb="10px">
            Table Management
          </Text>
          <Text>Add your table management component here.</Text>
        </Box>
      </SimpleGrid>

      {/* You can add more SimpleGrid sections here for other superadmin features */}
    </Box>
  );
}
