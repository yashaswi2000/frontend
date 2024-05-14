import { useNavigation, json, useLoaderData } from '@remix-run/react';
import { getSession } from '../session.server'
import SidebarWithHeader from '~/components/SidebarWithHeader';
import { Suspense, lazy, useState } from "react";

const sportsList = ['soccer', 'badminton'];

export async function loader({ request }) {
    const session = await getSession(request.headers.get('Cookie'));
    if (!session) {
        return {
            redirect: '/login',
        };
    }
    const accountEmail = session.data.user.email;
    const url = new URL(request.url);
    const q = url.searchParams.get("play_back_url");
    const id = url.searchParams.get("id");
    const chatroom = url.searchParams.get("chatroom");
    let response = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/stream/get-events', {
      method: 'POST',    
      headers: {
          'Content-Type': 'application/json',
          // Include additional headers here if needed
          },
      body: JSON.stringify({ event_id: id}),
      });
  
  // Check if the request was successful
  if (!response.ok) throw new Error("Couldn't load the cards");

  // Parse the response body as JSON
  let data = await response.json();
  return json({ url: q, id: id, events: data.items, chatroom: chatroom, accountEmail: accountEmail});
}

const ClientComponent = lazy(() => import("../VideoPlayer.client"));

export default function ViewStream() {
    const q = useLoaderData();
    const [streamUrl, setStreamUrl] = useState(q);
    const navigation = useNavigation();

  return (
    <SidebarWithHeader hasAccess={1}>
      <Suspense fallback={<div>Loading...</div>}>
        {navigation.state === "idle" && <ClientComponent streamUrl={streamUrl} />}
      </Suspense>
    </SidebarWithHeader>
  );
}