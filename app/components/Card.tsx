import { Box, Image, Text, Button } from '@chakra-ui/react';

export default function Card({ title, imageUrl, description }: { title: string, imageUrl: string, description: string }) {
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
        <Button mt="3" colorScheme="teal">Learn More</Button>
      </Box>
    </Box>
  );
}