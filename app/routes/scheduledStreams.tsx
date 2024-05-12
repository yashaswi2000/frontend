import { useLoaderData, Link } from '@remix-run/react';
import {
  Box, CloseButton, Flex, Text, Icon, Link as ChakraLink, Drawer,
  DrawerContent, useDisclosure, useColorModeValue,
  Heading,
  Button
} from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiPlusCircle } from "react-icons/fi";
import { IconType } from "react-icons";
import Card from '../components/MyStreamCard';
import { getSession } from '../session.server'

export let loader = async ({ request }) => {

  const session = await getSession(request.headers.get('Cookie'));
  const accountEmail = session.data.user.email
  let response = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/user/scheduled/get-streams', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          account_email: accountEmail 
      })
  });

  // Check if the request was successful
  if (!response.ok) throw new Error("Couldn't load the cards");

  // Parse the response body as JSON
  let data = await response.json();
  // Simulate fetching card data
  return data.results.map((stream: { event_id: number, event_title: string, imageUrl: string, event_description: string, event_time: string}) => {
    return {
      id: stream.event_id,
      title: stream.event_title,
      imageUrl: 'https://www.usnews.com/dims4/USNEWS/72c90e6/17177859217/resize/800x540%3E/quality/85/?url=https%3A%2F%2Fmedia.beam.usnews.com%2F9d%2Fd819230374ef6531890bb7eee1dac0%2FNYU_WSP_Header.jpg',
      description: stream.event_description,
      time: new Date(stream.event_time).toLocaleString(),
    };
  })
};

// Define LinkItems with routes
const LinkItems = [
  { name: 'Home', icon: FiHome, to: '/dashboard' },
  { name: 'Scheduled Events', icon: FiTrendingUp, to: '/events' },
  { name: 'Trending', icon: FiTrendingUp, to: '/trending' },
  { name: 'My Scheduled Streams', icon: FiPlusCircle, to: '/scheduledStreams' },
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
  const cards = useLoaderData() as { id: number, title: string, imageUrl: string, description: string , time: string}[];
  return (
    <SidebarWithHeader>
    <Box p="4">
      <Heading mb="4">Scheduled Streams </Heading>
      <Flex overflowX="scroll" gap="3">
        {cards.map(card => (
            <Card key={card.id} {...card} />
        ))}
      </Flex>
      <Button
        as={Link}
        to="/createEvent"
        colorScheme="blue"
        leftIcon={<FiPlusCircle />}
        mr={4}
      >
        Create Event
      </Button>
    </Box>
    </SidebarWithHeader>
  );
}
  