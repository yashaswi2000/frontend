import { Box, Image, Text, Button, useToast } from '@chakra-ui/react';
import { Link, useNavigate } from '@remix-run/react';
import { useState } from 'react';

export default function Card({ id, title, imageUrl, description, time, playback_url, streamer_email, user_email, recording, type, chatroom }: { id: number, title: string, imageUrl: string, description: string , time: string, playback_url: string, streamer_email: string, user_email: string, recording: string, type: string, chatroom: string}) {
  const toast = useToast();
  const navigate = useNavigate();
  const [isImageValid, setIsImageValid] = useState(true);
  const defaultImageUrl = 'https://www.usnews.com/dims4/USNEWS/72c90e6/17177859217/resize/800x540%3E/quality/85/?url=https%3A%2F%2Fmedia.beam.usnews.com%2F9d%2Fd819230374ef6531890bb7eee1dac0%2FNYU_WSP_Header.jpg'

  const handleImageError = () => {
    setIsImageValid(false);
  };

  const handleLearnMore = () => {
    if (type === 'live') {
      navigate({
        pathname: "/viewStream",
        search: `?play_back_url=${playback_url}&id=${id}&chatroom=${chatroom}`,
      });
    } else if (type === 'vod') {
      window.open(recording, '_blank');
    } else if (type === 'scheduled') {
      toast({
        title: 'Event Scheduled',
        description: 'This event will go live soon. Stay tuned!',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const sendReminder = async () => {
    try {
      const response = await fetch(`https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/user/remind-me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: id,
          streamer_email: streamer_email,
          event_name: title,
          user_email,
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'A reminder will be sent over email once the stream starts',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'A reminder could not be scheduled',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while sending a reminder',
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
      m="3">
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
        <Button mt="3" colorScheme="teal" onClick={handleLearnMore}>
          Learn More
        </Button>
        <Button mt="3" ml="5" colorScheme="pink" onClick={sendReminder}>
          Remind me!
        </Button>
      </Box>
    </Box>
  );
}