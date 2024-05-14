import { useSubmit, useLoaderData, redirect, useNavigate } from '@remix-run/react';
import {
  Box, Flex, useDisclosure, Heading, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Button,
} from "@chakra-ui/react";
import React, { useState } from 'react';
import Card from '../components/Card';
import { getSession } from '~/session.server';
import SidebarWithHeader from '~/components/SidebarWithHeader';

type Cards = {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  time: string;
  streamer_email: string;
  recording?: string;
}[];

type LoaderData = {
  cards_live: Cards;
  cards_scheduled: Cards;
  cards_vod: Cards;
  accountEmail: string;
  hasAccess: number;
};

export let loader = async ({request}) => {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session) {
      return redirect('/login');
  }

  const accountEmail = session.data.user.email

  const hasChannelAccess = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/user/check-stream-access', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      account_email: accountEmail 
  })
  });
  const hasAccess = await hasChannelAccess.json();

  let response = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/user/homepage/streams', {
      headers: {
      'Content-Type': 'application/json',
      },
  });

  // Check if the request was successful
  if (!response.ok) throw new Error("Couldn't load the cards");

  // Parse the response body as JSON
  let data = await response.json();
  // Simulate fetching card data
  return {
    cards_live: data.live.map((stream: { event_id: number, event_streamer: string, event_title: string, imageUrl: string, event_description: string, event_time: string, playback_url: string }) => {
      return {
        id: stream.event_id,
        title: stream.event_title,
        imageUrl: stream.imageUrl,
        description: stream.event_description,
        time: new Date(stream.event_time).toLocaleString(),
        playback_url: stream.playback_url,
        streamer_email: stream.event_streamer,
      };
    }),
    cards_scheduled: data.scheduled.map((stream: { event_id: number, event_streamer: string, event_title: string, imageUrl: string, event_description: string, event_time: string }) => {
      return {
        id: stream.event_id,
        title: stream.event_title,
        imageUrl: stream.imageUrl,
        description: stream.event_description,
        time: new Date(stream.event_time).toLocaleString(),
        streamer_email: stream.event_streamer,
      };
    }),
    cards_vod: data.vod.map((stream: { event_id: number, event_streamer: string, event_title: string, imageUrl: string, event_description: string, event_time: string, recording: string }) => {
      return {
        id: stream.event_id,
        title: stream.event_title,
        imageUrl: stream.imageUrl,
        description: stream.event_description,
        time: new Date(stream.event_time).toLocaleString(),
        streamer_email: stream.event_streamer,
        recording: stream.recording,
      };
    }),
    accountEmail,
    hasAccess: hasAccess.access,
  };
};

export default function Dashboard() {
  const { cards_live, cards_scheduled, accountEmail, cards_vod, hasAccess } = useLoaderData<LoaderData>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reason, setChannel] = React.useState('');
  const submit = useSubmit();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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
        setChannel('');
      } else {
        // Handle error response
        console.error('Failed to create channel request');
      }
    } catch (error) {
      console.error('Error creating channel request:', error);
    }
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      navigate(`/searchedEvents?q=${searchQuery}`);
    }
  };

  const handleChannelChange = (event) => {
    const formattedChannel = event.target.value
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '');
  
    setChannel(formattedChannel);
  };

  return (
    <SidebarWithHeader hasAccess={hasAccess}>
      <Box p="4">
        <Flex justifyContent="space-between" alignItems="center" mb="4" >
          <Input
            placeholder="Search for events"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            bg="white"
            color="purple.800"
            borderColor="purple.600"
            _placeholder={{ color: 'purple.400' }}
          />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Heading color="purple.800">Live NOW</Heading>
          <Button colorScheme="purple" onClick={onOpen}>
            Create Channel Request
          </Button>
        </Flex>
        <Flex overflowX="scroll" gap="3">
          {cards_live.map(card => (
            <Card key={card.id} {...card} user_email={accountEmail} type={'live'}/>
          ))}
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Heading color="purple.800">Scheduled Events</Heading>
        </Flex>
        <Flex overflowX="scroll" gap="3">
          {cards_scheduled.map(card => (
            <Card key={card.id} {...card} user_email={accountEmail} type={'scheduled'}/>
          ))}
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Heading color="purple.800">Previous Events</Heading>
        </Flex>
        <Flex overflowX="scroll" gap="3">
          {cards_vod.map(card => (
            <Card key={card.id} {...card} user_email={accountEmail} type={'vod'}/>
          ))}
        </Flex>
      </Box>
  
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="purple.800" color="white">Create Channel Request</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <form onSubmit={handleCreateChannelRequest}>
              <FormControl id="reason">
                <FormLabel color="purple.800">Channel Name</FormLabel>
                <Input type="text" value={reason} onChange={handleChannelChange} bg="white" color="purple.800" borderColor="purple.600" />
              </FormControl>
  
              <ModalFooter>
                <Button colorScheme="purple" mr={3} type="submit">
                  Submit
                </Button>
                <Button variant="ghost" onClick={onClose} color="purple.800">
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