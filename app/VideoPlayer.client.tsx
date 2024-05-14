import { useEffect, useRef, useState } from 'react';
import { create, PlayerEventType } from 'amazon-ivs-player';
import React from 'react';
import Chat from './chat/Chat'; // Import the 'Chat' component
import { useLoaderData } from '@remix-run/react';
import EventTable from './components/EventTable';

const VideoPlayer = ({ streamUrl }) => {
    const [events, setEvents] = useState(streamUrl.events);
    const videoRef = useRef(null);
    useEffect(() => {
        if (!videoRef.current) return;
        
        // Initialize the IVS player
        const player = create({
            wasmWorker: './amazon-ivs-wasmworker.min.js',
            wasmBinary: './amazon-ivs-wasmworker.min.wasm',
        });

        // Attach the video element to the player
        player.attachHTMLVideoElement(videoRef.current);
        player.addEventListener(PlayerEventType.TEXT_METADATA_CUE,
            async function (cue) {
            console.log('Timed metadata: ', cue.text);
            let response = await fetch('https://1mqt3o8gkl.execute-api.us-east-1.amazonaws.com/dev/stream/get-events', {
            method: 'POST',    
            headers: {
                'Content-Type': 'application/json',
                // Include additional headers here if needed
                },
            body: JSON.stringify({ event_id: streamUrl.id}),
            });
        
            // Check if the request was successful
            if (!response.ok) throw new Error("Couldn't load the cards");
      
            // Parse the response body as JSON
            let data = await response.json();
            setEvents(data.items);
        });

        // Load the stream
            player.load(streamUrl.url);
            player.play();

        return () => {
                player.pause();
                player.delete();
              }
    }, []);

    return (
        <div style={{ display: 'flex' }}>
        <div>
            <video ref={videoRef} playsInline controls />
            <EventTable events={events} />
        </div>
        <div>
            <Chat email={streamUrl.accountEmail} chatroom={streamUrl.chatroom} is_owner={0} />
        </div>
        </div>
    ); 
};

export default VideoPlayer;