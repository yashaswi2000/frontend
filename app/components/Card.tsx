import { Box, Image, Text, Button, useToast } from '@chakra-ui/react';
import { Link, useNavigate } from '@remix-run/react';
import { useState } from 'react';

export default function Card({ id, title, imageUrl, description, time, playback_url }: { id: number, title: string, imageUrl: string, description: string , time: string, playback_url: string}) {
  const [isImageValid, setIsImageValid] = useState(true);
  const defaultImageUrl = 'https://www.usnews.com/dims4/USNEWS/72c90e6/17177859217/resize/800x540%3E/quality/85/?url=https%3A%2F%2Fmedia.beam.usnews.com%2F9d%2Fd819230374ef6531890bb7eee1dac0%2FNYU_WSP_Header.jpg'

  const handleImageError = () => {
    setIsImageValid(false);
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
        <Link to={{
            pathname: "/viewStream",
            search: "?play_back_url="+playback_url+"&id="+id,
        }}>
        <Button mt="3" colorScheme="teal">Learn More</Button>
        </Link>
      </Box>
    </Box>
  );
}