//A bit late to the party, I know... A way to make it even easier!
// javascript: (function () { var audio = new Audio('https://download.samplelib.com/mp3/sample-9s.mp3'); audio.loop = true; audio.volume = 0.01; audio.play(); })();

import emptyAudio from './10-minutes-of-silence.mp3';

let audioInstance: HTMLAudioElement | null = null;
let heartBeatInterval: ReturnType<typeof setInterval> | null = null;
let startTime: number | null = null;

export function keepAlive() {
    if (audioInstance) {
        return; // Return if already initialized
    }

    if (heartBeatInterval) {
        clearInterval(heartBeatInterval); // Clear any existing interval
        heartBeatInterval = null; // Reset the interval variable
        startTime = null; // Reset the start time
    }

    startTime = Date.now(); // Record the start time
    console.log('KeepAlive started at:', new Date(startTime).toLocaleTimeString());
    heartBeatInterval = setInterval(() => {
        if (audioInstance) {
            // debug
            console.log('KeepAlive is running for', Math.floor((Date.now() - startTime!) / 1000), 'seconds');
            audioInstance.currentTime = 0; // Reset currentTime to keep the audio alive
        } else {
            console.warn('KeepAlive running failed: audioInstance is null');
        }
    }, 10000); // Reset every 10 seconds

    audioInstance = new Audio(emptyAudio);
    audioInstance.loop = true;
    audioInstance.volume = 0.01; // Set a very low volume
    audioInstance.play().catch((error) => {
        console.error('Failed to play audio:', error);
        audioInstance = null; // Reset if play fails
        setTimeout(keepAlive, 1000); // Retry after 1 second
    });
}