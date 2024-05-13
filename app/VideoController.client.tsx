import { useEffect, useRef } from 'react';
import { create } from 'amazon-ivs-player';
import React from 'react';

const VideoPlayer = ({ stream_details }) => {
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

        // Load the stream
        player.load(stream_details.q);
        player.play();

        return () => {
            player.pause();
            player.delete();
        };
    }, [stream_details.q]);

    return (
      <div>
        <video ref={videoRef} playsInline controls />
        <div>
          <h2>Stream Details</h2>
          <p>Stream Key: {stream_details.stream_key}</p>
          <p>Ingest URL: {stream_details.ingest_url}</p>
        </div>
      </div>
    );
};

export default VideoPlayer;