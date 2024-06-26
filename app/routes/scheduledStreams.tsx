import { useLoaderData, Link } from '@remix-run/react';
import {
  Box,
  Flex,
  Heading,
  Button
} from "@chakra-ui/react";
import { FiPlusCircle } from "react-icons/fi";
import Card from '../components/MyStreamCard';
import { getSession } from '../session.server'
import SidebarWithHeader from '~/components/SidebarWithHeader';

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
      imageUrl: stream.imageUrl,
      description: stream.event_description,
      time: new Date(stream.event_time).toLocaleString(),
    };
  })
};

export default function Dashboard() {
  const cards = useLoaderData() as { id: number, title: string, imageUrl: string, description: string , time: string}[];
  return (
    <SidebarWithHeader hasAccess={1}>
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
  