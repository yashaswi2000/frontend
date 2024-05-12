import { useEffect, useRef } from 'react';
import { create } from 'amazon-ivs-player';
import React from 'react';

const VideoPlayer = ({ streamUrl }) => {
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
        player.load(streamUrl);
        player.play();

        return () => {
            player.pause();
            player.delete();
        };
    }, [streamUrl]);

    return <video ref={videoRef} playsInline controls />;
};

export default VideoPlayer;