import { useSubmit, useLoaderData, Link, redirect } from '@remix-run/react';
import {
  Box, CloseButton, Flex, Text, Icon, IconButton, VStack, Link as ChakraLink, Drawer,
  DrawerContent, useDisclosure, useColorModeValue,
  Heading, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import React from 'react';
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiPlusCircle, FiGitPullRequest } from "react-icons/fi";
import { IconType } from "react-icons";
import Card from '../components/Card';
import { getSession } from '~/session.server';
import SidebarWithHeader from '~/components/SidebarWithHeader';

type LoaderData = {
  cards: {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
    time: string;
  }[];
  accountEmail: string;
};

export let loader = async ({request}) => {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session) {
      return redirect('/login');
  }

  const accountEmail = session.data.user.email
  let response = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/user/homepage/streams', {
      headers: {
      'Content-Type': 'application/json',
      // Include additional headers here if needed
      },
  });

  // Check if the request was successful
  if (!response.ok) throw new Error("Couldn't load the cards");

  // Parse the response body as JSON
  let data = await response.json();
  // Simulate fetching card data
  return {
    cards: data.scheduled.map((stream: { event_id: number, event_title: string, imageUrl: string, event_description: string, event_time: string }) => {
      return {
        id: stream.event_id,
        title: stream.event_title,
        imageUrl: 'https://www.usnews.com/dims4/USNEWS/72c90e6/17177859217/resize/800x540%3E/quality/85/?url=https%3A%2F%2Fmedia.beam.usnews.com%2F9d%2Fd819230374ef6531890bb7eee1dac0%2FNYU_WSP_Header.jpg',
        description: stream.event_description,
        time: new Date(stream.event_time).toLocaleString()
      };
    }),
    accountEmail,
  };
};

export default function Dashboard() {
  const { cards, accountEmail } = useLoaderData<LoaderData>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reason, setReason] = React.useState('');
  const submit = useSubmit();

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleCreateChannelRequest = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/user/request-stream-access', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason, email: accountEmail }),
      });

      if (response.ok) {
        // Handle successful response
        console.log('Channel request created successfully');
        onClose();
        setReason('');
      } else {
        // Handle error response
        console.error('Failed to create channel request');
      }
    } catch (error) {
      console.error('Error creating channel request:', error);
    }
  };

  return (
    <SidebarWithHeader>
      <Box p="4">
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Heading>Streaming NOW 🧨🧨🧨</Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            Create Channel Request
          </Button>
        </Flex>
        <Flex overflowX="scroll" gap="3">
          {cards.map(card => (
            <Card key={card.id} {...card} />
          ))}
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Channel Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleCreateChannelRequest}>
              <FormControl id="reason">
                <FormLabel>Reason</FormLabel>
                <Input type="text" value={reason} onChange={handleReasonChange} />
              </FormControl>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Submit
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SidebarWithHeader>
  );
}