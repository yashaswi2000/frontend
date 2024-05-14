import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { motion } from "framer-motion";

export const meta: MetaFunction = () => {
  return [
    { title: "NYU TV Live" },
    { name: "description", content: "Welcome to NYU TV Live!" },
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" }
  ];
};

import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
} from '@chakra-ui/react';
import { authenticator } from "~/auth.server";

export async function loader({request}: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
}

export default function CallToActionWithAnnotation() {
  return (
    <Box
      bgGradient="linear(to-br, purple.800, purple.500, purple.300)"
      minH="100vh"
      py={20}
    >
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}
            color="white"
          >
            NYU TV Live
          </Heading>
          <Text color={'gray.200'}>
            Where your events become shared experiences that unite the NYU family.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}
          >
            <Link to={"/register"}>
            <Button
              colorScheme={'purple'}
              ref={'/register'}
              bg={'purple.500'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'purple.600',
              }}
            >
              Sign up now
            </Button>
            </Link>
            <Link to={"/login"}>
            <Button variant={'link'} ref={'/login'} colorScheme={'purple'} size={'sm'} color="white">
              Login Now
            </Button>
            </Link>
            <Box position="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 5 }}
              >
                <Icon
                  as={TvIcon}
                  color="white"
                  w={20}
                  h={20}
                />
              </motion.div>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

const TvIcon = createIcon({
  displayName: 'TvIcon',
  viewBox: '0 0 24 24',
  path: (
    <path
      fill="currentColor"
      d="M21 6c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6zm-2 8H5V6h14v8zm-7-5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
    />
  ),
});