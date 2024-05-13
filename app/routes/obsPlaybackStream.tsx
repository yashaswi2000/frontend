import { useNavigation, json, useLoaderData } from '@remix-run/react';
import { getSession } from '../session.server'
import SidebarWithHeader from '~/components/SidebarWithHeader';
import { Suspense, lazy } from "react";

const sportsList = ['Football', 'Badminton'];

export async function loader({ request }) {
    const session = await getSession(request.headers.get('Cookie'));
    const accountEmail = session.data.user.email
    if (!session) {
        return {
            redirect: '/login',
        };
    }
    const url = new URL(request.url);
    const q = url.searchParams.get("play_back_url");
    let response = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/stream/get-stream-key-and-url', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email: accountEmail 
      })
    });

    // Check if the request was successful
    if (!response.ok) throw new Error("Couldn't load the cards");

    // Parse the response body as JSON
    let data = await response.json();
    // Simulate fetching card data
      return {
        q,
        stream_key: data.stream_key,
        ingest_url: data.ingest_url,
      };
}

const ClientComponent = lazy(() => import("../VideoController.client"));

export default function ViewStream() {
    const stream_details = useLoaderData() as { q: string, stream_key: string, ingest_url: string };
    const navigation = useNavigation();

  return (
    <SidebarWithHeader>
      <Suspense fallback={<div>Loading...</div>}>
        {navigation.state === "idle" && <ClientComponent stream_details={stream_details} />}
      </Suspense>
    </SidebarWithHeader>
  );
}