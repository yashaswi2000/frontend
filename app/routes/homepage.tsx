// app/routes/client-route/route.jsx
import { Suspense, lazy } from "react";
import { useLoaderData, useNavigation } from "@remix-run/react";
import SidebarWithHeader from "~/components/SidebarWithHeader";
import { getSession } from "~/session.server";

export let loader = async ({ request }) => {

  const session = await getSession(request.headers.get('Cookie'));
  const accountEmail = session.data.user.email
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
  console.log(data)
  // Simulate fetching card data
    return {
      stream_key: data.stream_key,
      ingest_url: data.ingest_url,
    };
};

const ClientComponent = lazy(() => import("../ivsutils.client"));

export default function ClientRoute() {
  const navigation = useNavigation();
  const stream_details = useLoaderData() as { stream_key: string, ingest_url: string};
  return (
    <SidebarWithHeader>
      <div>
        <h1>Client Route</h1>
        <Suspense fallback={<div>Loading...</div>}>
          {navigation.state === "idle" && <ClientComponent stream_details={stream_details}/>}
        </Suspense>
      </div>
    </SidebarWithHeader>
  );
}