import { json, useLoaderData, Link } from '@remix-run/react';
import {
  Box, CloseButton, Flex, Text, Icon, IconButton, VStack, Link as ChakraLink, Drawer,
  DrawerContent, useDisclosure, useColorModeValue,
  Heading
} from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu } from "react-icons/fi";
import { IconType } from "react-icons";
import Card from '../components/Card';

export let loader = async () => {
  // Simulate fetching card data
  return [
    { id: 1, title: "Card 1", imageUrl: "https://via.placeholder.com/150", description: "Description of card 1" },
    { id: 2, title: "Card 2", imageUrl: "https://via.placeholder.com/150", description: "Description of card 2" },
    // More cards can be added here
  ];
};

// Define LinkItems with routes
const LinkItems = [
  { name: 'Home', icon: FiHome, to: '/' },
  { name: 'Trending', icon: FiTrendingUp, to: '/trending' },
  { name: 'Explore', icon: FiCompass, to: '/explore' },
  { name: 'Favourites', icon: FiStar, to: '/favourites' },
  { name: 'Settings', icon: FiSettings, to: '/settings' },
];

// Sidebar component
function SidebarContent({ onClose }: { onClose: () => void }) {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full">
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          NYU
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} link={link.to}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
}

// NavItem component
function NavItem({ icon, children, link }: { icon: IconType, children: React.ReactNode, link: string }) {
  return (
    <ChakraLink as={Link} to={link} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </ChakraLink>
  );
}

// Parent component
function SidebarWithHeader({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
    <SidebarContent onClose={() => onClose()} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

export default function Dashboard() {
        const cards = useLoaderData() as { id: number, title: string, imageUrl: string, description: string }[];
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
  