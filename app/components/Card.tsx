import { Box, Image, Text, Button } from '@chakra-ui/react';
import { Link } from '@remix-run/react';

export default function Card({ title, imageUrl, description, time }: { title: string, imageUrl: string, description: string , time: string}) {
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
            pathname: "/viewstream",
            search: "?play_back_url=https://145742c78c44.us-east-1.playback.live-video.net/api/video/v1/us-east-1.211125489044.channel.j0tIJIU7vA3E.m3u8",
        }}>
        <Button mt="3" colorScheme="teal">Learn More</Button>
        </Link>
      </Box>
    </Box>
  );
}