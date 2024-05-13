// app/routes/searchedEvents.jsx
import { redirect, useLoaderData } from "@remix-run/react";
import { getSession } from "~/session.server";
import Card from "~/components/Card";
import { Box, Flex, Heading } from "@chakra-ui/react";
import SidebarWithHeader from "~/components/SidebarWithHeader";

export let loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session) {
    return redirect("/login");
  }

  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q");

  // Send API request with search query in the body
  const response = await fetch(
    "https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/user/search-events",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: searchQuery }),
    }
  );

  if (!response.ok) {
    throw new Error("Couldn't fetch search results");
  }

  const data = await response.json();
  console.log(data);
  const event_details = data.results;

  // Fetch event details for each event ID
  //   const eventDetails = await Promise.all(
  //     event_details.map(async (event_detail) => {
  //       const eventResponse = await fetch(`https://your-api-endpoint.com/events/${event_detail.event_id}`);
  //       const eventData = await eventResponse.json();
  //       return eventData;
  //     })
  //   );

  const eventDetails = [
    {
      id: 34,
      title: "soccer intramural",
      time: "2024-05-13 19:09:00",
      imageUrl: 'https://www.usnews.com/dims4/USNEWS/72c90e6/17177859217/resize/800x540%3E/quality/85/?url=https%3A%2F%2Fmedia.beam.usnews.com%2F9d%2Fd819230374ef6531890bb7eee1dac0%2FNYU_WSP_Header.jpg',
      description: "Soccer: NYU vs Columbia",
      streamer: "am13801@nyu.edu",
    },
    {
      id: 47,
      title: "soccer mahasangraam",
      time: "2024-05-12 12:00:00",
      imageUrl: 'https://www.usnews.com/dims4/USNEWS/72c90e6/17177859217/resize/800x540%3E/quality/85/?url=https%3A%2F%2Fmedia.beam.usnews.com%2F9d%2Fd819230374ef6531890bb7eee1dac0%2FNYU_WSP_Header.jpg',
      description: "footsal",
      streamer: "am13801@nyu.edu",
    },
  ];

  return { eventDetails };
};

export default function SearchedEvents() {
  const { eventDetails } = useLoaderData();

  return (
    <SidebarWithHeader>
      <Box p="4">
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Heading>Searched Events</Heading>
        </Flex>
        <Flex overflowX="scroll" gap="3">
          {eventDetails.map((event) => (
            <Card key={event.id} {...event} />
          ))}
        </Flex>
      </Box>
    </SidebarWithHeader>
  );
}
