import { json, useLoaderData, Link } from '@remix-run/react';
import {
  Box, CloseButton, Flex, Text, Icon, IconButton, VStack, Link as ChakraLink, Drawer,
  DrawerContent, useDisclosure, useColorModeValue,
  Heading
} from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu, FiPlusCircle } from "react-icons/fi";
import { IconType } from "react-icons";
import Card from '../components/Card';
import SidebarWithHeader from '~/components/SidebarWithHeader';

export default function Dashboard() {
        const cards = useLoaderData() as { id: number, title: string, imageUrl: string, description: string , time: string}[];
        return (
            <SidebarWithHeader>
            <Box p="4">
                <Heading mb="4">Featured Content</Heading>
                <Flex overflowX="scroll" gap="3">
                    {cards.map(card => (
                        <Card key={card.id} {...card} />
                    ))}
                </Flex>
            </Box>
            </SidebarWithHeader>
        );
    }
  