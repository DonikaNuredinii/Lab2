// updated to POST directly to /api/Orders without items
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import "../CSS/Main-Menu.css";
import {
  Box,
  Text,
  IconButton,
  useDisclosure,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Divider,
  HStack,
  Stack,
  Spacer,
} from "@chakra-ui/react";
import { MdNoteAdd } from "react-icons/md";
import NoteModal from "./NoteModal";

const MainMenu = () => {
  const handleSubmitOrder = async () => {
    const orderDto = {
      restaurantID: 2,
      tableID: 1,
      costumerID: 0,
      costumerAdressID: 0,
      orderType: "Dine-in",
      status: "Pending",
      totalAmount: total,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/Orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderDto)
      });

      if (!res.ok) throw new Error("Failed to place order");

      const data = await res.json();
      alert(`Order placed successfully! Order ID: ${data.ordersID}`);
      setCartItems([]);
      setIsCartOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  // ... pjesa tjetër e kodit mbetet e njëjtë
