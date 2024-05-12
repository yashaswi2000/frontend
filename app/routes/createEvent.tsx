import { Link, Form, useActionData, useNavigation } from '@remix-run/react';
import {
  Box, CloseButton, Flex, Text, Icon, Stack, Link as ChakraLink, Drawer, Select, FormErrorMessage,
  DrawerContent, useDisclosure, FormControl, FormLabel, Input, Button, Heading, useColorModeValue, useToast
} from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings } from "react-icons/fi";
import { IconType } from "react-icons";
import React from 'react';
import axios from 'axios';

export let loader = async () => {
  // Simulate fetching card data
  return [
    { id: 1, title: "Card 1", imageUrl: "https://via.placeholder.com/150", description: "Description of card 1" },
    { id: 2, title: "Card 2", imageUrl: "https://via.placeholder.com/150", description: "Description of card 2" },
    // More cards can be added here
  ];
};

const sportsList = ['Football', 'Badminton'];

// Define LinkItems with routes
const LinkItems = [
  { name: 'Home', icon: FiHome, to: '/dashboard' },
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

export async function action({ request }) {
  const formData = await request.formData();
  const eventName = formData.get('event_name');
  const eventDate = formData.get('event_date');
  const duration = formData.get('duration');
  const description = formData.get('description');
  const accountEmail = formData.get('account_email');
  const isSports = formData.get('is_sports') === 'true';
  const sportName = isSports ? formData.get('sport_name') : null;
  const thumbnail = formData.get('thumbnail');

  // Check if the thumbnail is a PNG or JPEG file
  const allowedFileTypes = ['image/png', 'image/jpeg'];
  if (!allowedFileTypes.includes(thumbnail.type)) {
    return { error: 'Thumbnail must be a PNG or JPEG file' };
  }

  // Upload the thumbnail to S3
  const s3Link = "boom boom dot com";
  // const s3Link = "https://photos-bucket-3.s3.amazonaws.com/" + thumbnail.name;
  // axios.put('url', thumbnail).then(response => {
  //    alert("Image uploaded: " + thumbnail.name);
  // });

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

  if (response.ok) {
    // Reset the form fields
    formData.set('event_name', '');
    formData.set('event_date', '');
    formData.set('duration', '');
    formData.set('description', '');
    formData.set('account_email', '');
    formData.set('is_sports', 'false');
    formData.set('sport_name', '');
    formData.set('thumbnail', null);

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
                  <Input type="date" name="event_date" required />
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
                <FormControl id="account_email">
                  <FormLabel>Account Email</FormLabel>
                  <Input type="email" name="account_email" required />
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