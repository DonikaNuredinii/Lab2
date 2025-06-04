import React from "react";

// Chakra imports
import { Flex, useColorModeValue, Text } from "@chakra-ui/react";

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand(props) {
  const { isSuperAdminLayout } = props;
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");
  let textColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align="center" direction="column">
      {isSuperAdminLayout ? (
        <Text fontSize="26px" fontWeight="bold" color={textColor} my="32px">
          Super Admin
        </Text>
      ) : (
        <HorizonLogo h="26px" w="175px" my="32px" color={logoColor} />
      )}
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
