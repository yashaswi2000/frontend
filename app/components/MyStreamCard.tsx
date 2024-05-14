import { Box, Image, Text, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';

export default function Card({ id, title, imageUrl, description, time }: { id: number, title: string, imageUrl: string, description: string, time: string }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [isImageValid, setIsImageValid] = useState(true);
  const defaultImageUrl = 'https://www.usnews.com/dims4/USNEWS/72c90e6/17177859217/resize/800x540%3E/quality/85/?url=https%3A%2F%2Fmedia.beam.usnews.com%2F9d%2Fd819230374ef6531890bb7eee1dac0%2FNYU_WSP_Header.jpg'

  const handleImageError = () => {
    setIsImageValid(false);
  };

  const handleStartStreaming = async () => {
    try {
      const response = await fetch(`https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/user/get-stream-key?event_id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const chat_room = await fetch(`https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/user/chat/create-room?event_id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        navigate('/liveStreams');
      } else if (response.status == 409){
        toast({
          title: 'Error',
          description: 'User already has a live event',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'It is not possible to start streaming before 15 min of the start time.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error starting streaming:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while starting streaming.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteStreaming = async () => {
    try {
      const response = await fetch(`https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/stream/delete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_id: id }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Successfully deleted the event',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/scheduledStreams');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete the event',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting stream:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while deleting a stream.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      m="3"
    >
      <Image
        src={isImageValid ? imageUrl : defaultImageUrl}
        alt={title}
        onError={handleImageError}
        boxSize="300px"
        objectFit="cover"
      />
      <Box p="4">
        <Text fontWeight="bold" fontSize="lg">{title}</Text>
        <Text mt="2">{description}</Text>
        <Text mt="2" fontSize="sm" color="gray.500">
          {time}
        </Text>
        <Button mt="3" colorScheme="teal" onClick={handleStartStreaming}>
          Start Event
        </Button>
        <Button mt="3" ml="5" colorScheme="red" onClick={handleDeleteStreaming}>
          Delete Event
        </Button>
      </Box>
    </Box>
  );
}