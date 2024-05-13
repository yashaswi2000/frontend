import { useLoaderData, Link } from '@remix-run/react';
import { Box, Flex, Heading, Button } from "@chakra-ui/react";
import Card from '../components/LiveCard';
import { getSession } from '../session.server'
import SidebarWithHeader from '~/components/SidebarWithHeader';
import Chat from '~/chat/Chat';

export let loader = async ({ request }) => {

  const session = await getSession(request.headers.get('Cookie'));
  const accountEmail = session.data.user.email
  return ({});

};

export default function IvsChat() {
  return (
    <SidebarWithHeader>
    <Chat />
    </SidebarWithHeader>
  );
}
  