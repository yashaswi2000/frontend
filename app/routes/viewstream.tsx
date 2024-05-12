import { Link, Form, useActionData, useNavigation, json } from '@remix-run/react';
import {
  Box, CloseButton, Flex, Text, Icon, Stack, Link as ChakraLink, Drawer, Select, FormErrorMessage,
  DrawerContent, useDisclosure, FormControl, FormLabel, Input, Button, Heading, useColorModeValue, useToast
} from "@chakra-ui/react";
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiPlusCircle } from "react-icons/fi";
import { IconType } from "react-icons";
import React from 'react';
import { getSession } from '../session.server'
import SidebarWithHeader from '~/components/SidebarWithHeader';
import { c } from 'node_modules/vite/dist/node/types.d-aGj9QkWt';


const sportsList = ['Football', 'Badminton'];

export async function loader({ request }) {
    const session = await getSession(request.headers.get('Cookie'));
    if (!session) {
        return {
            redirect: '/login',
        };
    }
    const url = new URL(request.url);
    const q = url.searchParams.get("play_back_url");
    return json({ q });
}

export default function ViewStream() {

  return (
    <SidebarWithHeader>
        <></>
    </SidebarWithHeader>
    
  );
}