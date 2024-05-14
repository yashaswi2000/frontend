import { Link, useLoaderData } from '@remix-run/react';
import {
  Box, CloseButton, Flex, Text, Icon, Link as ChakraLink, Drawer,
  DrawerContent, useDisclosure, useColorModeValue,
} from "@chakra-ui/react";
import React from 'react';
import { FiHome, FiStar, FiSettings, FiGitPullRequest, FiTarget } from "react-icons/fi";
import { IconType } from "react-icons";
import { json, redirect } from "@remix-run/node";
import { getSession } from '~/session.server';

// Define LinkItems with routes
const LinkItems = [
    { name: 'Home', icon: FiHome, to: '/dashboard' },
    { name: 'My Scheduled Streams', icon: FiGitPullRequest, to: '/scheduledStreams' },
    { name: 'My Live Stream', icon: FiTarget, to: '/liveStreams' },
    { name: 'Logout', icon: FiSettings, to: '/logout' },
  ];

  // Sidebar component
  function SidebarContent({ onClose, filteredLinkItems }: { onClose: () => void, filteredLinkItems: typeof LinkItems }) {
    return (
      <Box
        transition="3s ease"
        bg="purple.800"
        borderRight="1px"
        borderRightColor="purple.600"
        w={{ base: 'full', md: 60 }}
        pos="fixed"
        h="full">
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">
            NYU
          </Text>
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} color="white" />
        </Flex>
        {filteredLinkItems.map((link) => (
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
            bg: 'purple.600',
            color: 'white',
          }}
          color="white"
        >
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
  export default function SidebarWithHeader({ children, hasAccess }: { children: React.ReactNode, hasAccess: number }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const filteredLinkItems = LinkItems.filter((link) => {
      if (link.to === '/scheduledStreams' && hasAccess == 0) {
        return false;
      }
      if (link.to === '/liveStreams' && hasAccess == 0) {
        return false;
      }
      return true;
    });

    return (
      <Box minH="100vh" bg="white">
        <SidebarContent onClose={() => onClose()} filteredLinkItems={filteredLinkItems} />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full">
          <DrawerContent>
            <SidebarContent onClose={onClose} filteredLinkItems={filteredLinkItems}/>
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: 60 }} p="4">
          {children}
        </Box>
      </Box>
    );
  }