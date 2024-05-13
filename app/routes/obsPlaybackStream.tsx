import { useLoaderData } from '@remix-run/react';
import { getSession } from '../session.server'
import { useState } from 'react';
import { Box, Text, Input, Select, Button, Flex, Stack, Heading, useColorModeValue, FormLabel, FormControl } from '@chakra-ui/react';

const sportsList = ['soccer', 'badminton'];

export async function loader({ request }) {
    const session = await getSession(request.headers.get('Cookie'));
    const accountEmail = session.data.user.email
    if (!session) {
        return {
            redirect: '/login',
        };
    }
    const url = new URL(request.url);
    const q = url.searchParams.get("play_back_url");
    const sport_name = url.searchParams.get("sport_name");
    const is_sports = url.searchParams.get("is_sports");
    const event_id = url.searchParams.get("id");
    let response = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/stream/get-stream-key-and-url', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email: accountEmail 
      })
    });

    // Check if the request was successful
    if (!response.ok) throw new Error("Couldn't load the cards");

    // Parse the response body as JSON
    let data = await response.json();

    let eventTypes;
    if(is_sports != '0') {
      const eventTypesResponse = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/stream/game-event-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sport_name
        })
      });
      eventTypes = await eventTypesResponse.json();
    }

    // Simulate fetching card data
      return {
        event_id,
        q,
        stream_key: data.stream_key,
        ingest_url: `rtmps://${data.ingest_url}:443/app/`,
        channel_arn: data.channel_arn,
        eventTypes: eventTypes?.events,
        is_sports,
        sport_name,
        account_email: accountEmail
      };
}

export default function ViewStream() {
  const stream_details = useLoaderData() as { event_id: number, channel_arn: string, q: string, stream_key: string, ingest_url: string, eventTypes: string[], sport_name: string, account_email: string, is_sports: number };
  const [score, setScore] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString();
    const event = {
      type: eventType,
      desc: eventDescription,
      score: score,
    };

    const requestBody = {
      channel_arn: stream_details.channel_arn,
      event_id: stream_details.event_id,
      sport_name: stream_details.sport_name,
      account_email: stream_details.account_email,
      timestamp,
      event,
    };

    try {
      const response = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/stream/put-sport-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log('Event submitted successfully');
        // Reset form fields
        setEventType('');
        setEventDescription('');
      } else {
        console.error('Failed to submit event');
      }
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  return (
    <Box>
      <Stack spacing={4} mx={'auto'} maxW={'lg'} py={6} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'2xl'}>Stream Details</Heading>
        </Stack>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            <Text fontWeight="bold" fontSize="lg">
              Stream Key: {stream_details.stream_key}
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              Ingest URL: {stream_details.ingest_url}
            </Text>
          </Stack>
        </Box>
      </Stack>

      {stream_details.is_sports == 1 && (
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'2xl'}>Score Update</Heading>
          </Stack>
          <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
            <Stack spacing={4}>
              <form onSubmit={handleSubmit}>
                <FormControl id="score">
                  <FormLabel>Score:</FormLabel>
                  <Input value={score} onChange={(e) => setScore(e.target.value)} />
                </FormControl>

                <FormControl id="event_type">
                  <FormLabel>Event Type:</FormLabel>
                  <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                    <option value="">Select an event type</option>
                    {stream_details.eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl id="event_description">
                  <FormLabel>Event Description:</FormLabel>
                  <Input value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
                </FormControl>

                <Button type="submit" colorScheme="blue">
                  Submit
                </Button>
              </form>
            </Stack>
          </Box>
        </Stack>
      )}
    </Box>
  );
}