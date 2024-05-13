import { Box, Image, Text, Button, useToast } from '@chakra-ui/react';
import { Link, useNavigate } from '@remix-run/react';

export default function Card({ id, title, imageUrl, description, time, playback_url }: { id: number, title: string, imageUrl: string, description: string , time: string, playback_url: string}) {
  const toast = useToast();
  const navigate = useNavigate();

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      m="3">
      <Image src={imageUrl} alt={title} />
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