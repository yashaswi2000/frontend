// app/routes/searchedEvents.jsx
import { redirect, useLoaderData } from "@remix-run/react";
import { getSession } from "~/session.server";
import Card from "~/components/Card";
import { Box, Flex, Heading } from "@chakra-ui/react";
import SidebarWithHeader from "~/components/SidebarWithHeader";

type Cards = {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  time: string;
  streamer_email: string;
}[];

type LoaderData = {
  cards_live: Cards;
  cards_scheduled: Cards;
  cards_vod: Cards;
  accountEmail: string;
};

export let loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session) {
    return redirect("/login");
  }
  const accountEmail = session.data.user.email

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

  let data = []
  if(response.status != 204)
    data = await response.json();

  const event_ids = data.results.map(result => result.event_id);

  const eventDetails = await fetch(
    "https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/user/get-search-event-details",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event_ids }),
    }
  );

  const event_details = await eventDetails.json();
  return {
    cards_live: event_details.live.map((stream: { event_id: number, account_email: string, event_name: string, thumbnail: string, description: string, event_date: string, playback_url: string }) => {
      return {
        id: stream.event_id,
        title: stream.event_name,
        imageUrl: stream.thumbnail,
        description: stream.description,
        time: new Date(stream.event_date).toLocaleString(),
        playback_url: stream.playback_url,
        streamer_email: stream.account_email,
      };
    }),
    cards_scheduled: event_details.scheduled.map((stream: { event_id: number, account_email: string, event_name: string, thumbnail: string, description: string, event_date: string }) => {
      return {
        id: stream.event_id,
        title: stream.event_name,
        imageUrl: stream.thumbnail,
        description: stream.description,
        time: new Date(stream.event_date).toLocaleString(),
        streamer_email: stream.account_email,
      };
    }),
    cards_vod: event_details.vod.map((stream: { event_id: number, account_email: string, event_name: string, thumbnail: string, description: string, event_date: string }) => {
      return {
        id: stream.event_id,
        title: stream.event_name,
        imageUrl: stream.thumbnail,
        description: stream.description,
        time: new Date(stream.event_date).toLocaleString(),
        streamer_email: stream.account_email,
      };
    }),
    accountEmail
  };
};

export default function SearchedEvents() {
  const { cards_live, cards_scheduled, cards_vod, accountEmail } = useLoaderData<LoaderData>();

  return (
    <SidebarWithHeader hasAccess={1}>
      <Box p="4">
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Heading color="purple.800">Live NOW</Heading>
        </Flex>
        <Flex overflowX="scroll" gap="3">
          {cards_live.map(card => (
            <Card key={card.id} {...card} user_email={accountEmail} />
          ))}
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Heading color="purple.800">Scheduled Events</Heading>
        </Flex>
        <Flex overflowX="scroll" gap="3">
          {cards_scheduled.map(card => (
            <Card key={card.id} {...card} user_email={accountEmail} />
          ))}
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Heading color="purple.800">Previous Events</Heading>
        </Flex>
        <Flex overflowX="scroll" gap="3">
          {cards_vod.map(card => (
            <Card key={card.id} {...card} user_email={accountEmail} />
          ))}
        </Flex>
      </Box>
    </SidebarWithHeader>
  );
}
