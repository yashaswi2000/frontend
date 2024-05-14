import { Box, Image, Text, Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { Link, useNavigate } from '@remix-run/react';
import { useState } from 'react';

export default function Card({ id, title, imageUrl, description, time, playback_url, is_sports, sport_name }: { id: number, title: string, imageUrl: string, description: string, time: string, playback_url: string, is_sports: string, sport_name: string }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageValid, setIsImageValid] = useState(true);
  const defaultImageUrl = 'https://www.usnews.com/dims4/USNEWS/72c90e6/17177859217/resize/800x540%3E/quality/85/?url=https%3A%2F%2Fmedia.beam.usnews.com%2F9d%2Fd819230374ef6531890bb7eee1dac0%2FNYU_WSP_Header.jpg'

  const handleImageError = () => {
    setIsImageValid(false);
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOBSStream = () => {
    // Navigate to the OBS stream page
    navigate(`/obsPlaybackStream?q=${playback_url}&id=${id}&is_sports=${is_sports}&sport_name=${sport_name}`);
    handleCloseModal();
  };

  const handleLiveStream = () => {
    // Navigate to the live stream page
    navigate('/liveStreams');
    handleCloseModal();
  };

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md" m="3">
      <Image
        src={isImageValid ? imageUrl : defaultImageUrl}
        alt={title}
        onError={handleImageError}
      />
      <Box p="4">
        <Text fontWeight="bold" fontSize="lg">{title}</Text>
        <Text mt="2">{description}</Text>
        <Text mt="2" fontSize="sm" color="gray.500">
          {time}
        </Text>
        <Button mt="3" colorScheme="teal" onClick={handleOpenModal}>
          Go Live
        </Button>
        <Button mt="3" ml="14" colorScheme="red" onClick={handleDeleteStreaming}>
          Delete Event
        </Button>
      </Box>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Stream Options</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Choose your streaming option:</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleOBSStream}>
              OBS Stream
            </Button>
            <Button colorScheme="green" onClick={handleLiveStream}>
              Live Stream
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}