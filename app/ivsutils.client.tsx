import { Button } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { ClientActionFunctionArgs } from '@remix-run/react';
import IVSBroadcastClient, {
    Errors,
    BASIC_LANDSCAPE
 } from 'amazon-ivs-web-broadcast';


 async function handlePermissions() {
    let permissions = {
        audio: false,
        video: false,
    };
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        for (const track of stream.getTracks()) {
            track.stop();
        }
        permissions = { video: true, audio: true };
    } catch (err: any) {
        permissions = { video: false, audio: false };
        console.error(err.message);
    }
    // If we still don't have permissions after requesting them display the error message
    if (!permissions.video) {
        console.error('Failed to get video permissions.');
    } else if (!permissions.audio) {
        console.error('Failed to get audio permissions.');
    }
 }

 const startVideo = async () => {
    const client = IVSBroadcastClient.create({
        // Enter the desired stream configuration
        streamConfig: BASIC_LANDSCAPE,
        // Enter the ingest endpoint from the AWS console or CreateChannel API
        ingestEndpoint: '145742c78c44.global-contribute.live-video.net',
     });
    //  where #preview is an existing <canvas> DOM element on your page
    const previewEl = document.getElementById('video-canvas') as HTMLCanvasElement; // Cast the element to HTMLCanvasElement
    client.attachPreview(previewEl);
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === 'videoinput');
    const audioDevices = devices.filter((d) => d.kind === 'audioinput');
    const streamConfig = BASIC_LANDSCAPE;

    const cameraStream = await navigator.mediaDevices.getUserMedia({
    video: {
        deviceId: videoDevices[0].deviceId,
        width: {
            ideal: streamConfig.maxResolution.width,
        },
        height: {
            ideal: streamConfig.maxResolution.height,
        },
    },
    });
    const microphoneStream = await navigator.mediaDevices.getUserMedia({
    audio: { deviceId: audioDevices[0].deviceId },
    });
    client.addVideoInputDevice(cameraStream, 'camera1', { index: 0 }); // only 'index' is required for the position parameter
    client.addAudioInputDevice(microphoneStream, 'mic1');
    client
   .startBroadcast('sk_us-east-1_cRYsjkdsYAwh_aVTIgehw4tp063kVjUvQhJfjj142lK')
   .then((result) => {
       console.log('I am successfully broadcasting!');
   })
   .catch((error) => {
       console.error('Something drastically failed while broadcasting!', error);
   });
}

export default function HomePage() {

    return (
      <div>
        <h1>IVS Broadcast</h1>
        <canvas  id="video-canvas"></canvas>
        <Button onClick={handlePermissions}>Request Permissions</Button>
        <Button onClick={startVideo}>Start Video</Button>
      </div>
    );
}
