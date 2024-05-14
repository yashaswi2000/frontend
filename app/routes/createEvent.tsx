import { Link, Form, useActionData, useNavigation } from '@remix-run/react';
import {
  Box, CloseButton, Flex, Text, Icon, Stack, Link as ChakraLink, Drawer, Select, FormErrorMessage,
  DrawerContent, useDisclosure, FormControl, FormLabel, Input, Button, Heading, useColorModeValue, useToast
} from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiPlusCircle } from "react-icons/fi";
import { IconType } from "react-icons";
import React from 'react';
import { getSession } from '../session.server'
import SidebarWithHeader from '~/components/SidebarWithHeader';
import AWS from 'aws-sdk';

const sportsList = ['soccer', 'badminton'];

const s3 = new AWS.S3();
const bucketName = 'stream-thumbnail-nyu';

export async function action({ request }) {
  const formData = await request.formData();
  const eventName = formData.get('event_name');
  const eventDate = formData.get('event_date');
  const duration = formData.get('duration');
  const description = formData.get('description');
  const isSports = formData.get('is_sports') === 'true';
  const sportName = isSports ? formData.get('sport_name') : null;
  const thumbnail = formData.get('thumbnail');

  // Check if the thumbnail is a PNG or JPEG file
  const allowedFileTypes = ['image/png', 'image/jpeg'];
  if (!allowedFileTypes.includes(thumbnail.type)) {
    return { error: 'Thumbnail must be a PNG or JPEG file' };
  }

  let s3Link = ""
  try {
    // Convert Blob to Buffer
    const thumbnailBuffer = await thumbnail.arrayBuffer().then(Buffer.from);

    // Upload the thumbnail to S3
    const uploadParams = {
      Bucket: bucketName,
      Key: `thumbnails/${thumbnail.name}`,
      Body: thumbnailBuffer,
      ContentType: thumbnail.type,
    };

    const uploadResult = await s3.upload(uploadParams).promise();
    s3Link = uploadResult.Location;

  } catch (error) {
    console.error('Error uploading thumbnail to S3:', error);
    return { error: 'Failed to upload thumbnail' };
  }

  const session = await getSession(request.headers.get('Cookie'));
  const accountEmail = session.data.user.email

  // Call the API with the event data
  const response = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/user/schedule-event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_name: eventName,
      event_date: eventDate,
      duration: duration,
      description: description,
      email: accountEmail,
      thumbnail: s3Link,
      is_sports: isSports,
      sport_name: sportName,
    }),
  });
  const data = await response.json()

  if (response.ok) {
    // Reset the form fields
    formData.set('event_name', '');
    formData.set('event_date', '');
    formData.set('duration', '');
    formData.set('description', '');
    formData.set('is_sports', 'false');
    formData.set('sport_name', '');
    formData.set('thumbnail', null);

    const elasticResponse = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/user/schedule-event/index-event', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_id: data.event_id,
        description: description,
      })
    })

    if(!elasticResponse.ok)
      return { error: 'Failed to insert to elastic search' }
    return { success: 'Event scheduled successfully' };
  } else {
    return { error: 'Failed to schedule the event' };
  }
}

export default function EventForm() {
  const [isSports, setIsSports] = React.useState(false);
  const [sportName, setSportName] = React.useState('');
  const [duration, setDuration] = React.useState('');
  const [durationError, setDurationError] = React.useState('');
  const actionData = useActionData();
  const navigation = useNavigation();
  const toast = useToast();

  const handleIsSportsChange = (event) => {
    setIsSports(event.target.value === 'true');
  };

  const handleSportNameChange = (event) => {
    setSportName(event.target.value);
  };

  const handleDurationChange = (event) => {
    const value = event.target.value;
    setDuration(value);

    if (value !== '' && (isNaN(value) || parseInt(value) > 360 || parseInt(value) < 1)) {
      setDurationError('Duration should be a number between 1 and 360 minutes');
    } else {
      setDurationError('');
    }
  };

  React.useEffect(() => {
    if (actionData?.success) {
      toast({
        title: 'Event Scheduled',
        description: actionData.success,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else if (actionData?.error) {
      toast({
        title: 'Error',
        description: actionData.error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [actionData, toast]);

  return (
    <SidebarWithHeader>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Create Event</Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack spacing={4}>
              <Form method="post" encType="multipart/form-data">
                <FormControl id="event_name">
                  <FormLabel>Event Name</FormLabel>
                  <Input type="text" name="event_name" required />
                </FormControl>
                <FormControl id="event_date">
                  <FormLabel>Event Date</FormLabel>
                  <Input type="datetime-local" name="event_date" required />
                </FormControl>
                <FormControl id="duration" isInvalid={durationError !== ''}>
                  <FormLabel>Duration (in minutes)</FormLabel>
                  <Input
                    type="number"
                    name="duration"
                    value={duration}
                    onChange={handleDurationChange}
                    required
                  />
                  <FormErrorMessage>{durationError}</FormErrorMessage>
                </FormControl>
                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Input type="text" name="description" required />
                </FormControl>
                <FormControl id="is_sports">
                  <FormLabel>Is Sports Event?</FormLabel>
                  <Select name="is_sports" onChange={handleIsSportsChange}>
                    <option value="false">False</option>
                    <option value="true">True</option>
                  </Select>
                </FormControl>
                {isSports && (
                  <FormControl id="sport_name">
                    <FormLabel>Sport Name</FormLabel>
                    <Select name="sport_name" value={sportName} onChange={handleSportNameChange}>
                      <option value="">Select a sport</option>
                      {sportsList.map((sport) => (
                        <option key={sport} value={sport}>
                          {sport}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <FormControl id="thumbnail">
                  <FormLabel>Thumbnail</FormLabel>
                  <Input type="file" name="thumbnail" accept="image/png, image/jpeg" required />
                </FormControl>
                <Button
                  type="submit"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  isDisabled={durationError !== '' || navigation.state === 'submitting'}
                >
                  {navigation.state === 'submitting' ? 'Scheduling...' : 'Create Event'}
                </Button>
              </Form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </SidebarWithHeader>
    
  );
}