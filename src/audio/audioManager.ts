import { startRestAudioFolder, startWorkAudioFolder } from './audioConfig';

// __APP_BASE_PATH__ is defined in vite.config.ts
//@ts-ignore
const basePath : string = process.env.__APP_BASE_PATH__;

import audioFiles from './audio.json' assert { type: 'json' };
const startRestAudioFiles = audioFiles.startRestAudios.map((file: string) => basePath + startRestAudioFolder + file);
const startWorkAudioFiles = audioFiles.startWorkAudios.map((file: string) => basePath + startWorkAudioFolder + file);

export type AudioType = 'startWork' | 'startRest';
let lastPlayedAudio: HTMLAudioElement | null = null;
export function playRandomAudio(audioType: AudioType, volume: number = 1.0) {
    let audioFiles: string[] = [];
    if (audioType === 'startWork') {
        audioFiles = startWorkAudioFiles;
    } else if (audioType === 'startRest') {
        audioFiles = startRestAudioFiles;
    }
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    //debug
    console.log(`Playing ${audioType} audio:`, audioFiles[randomIndex], basePath);
    const audio = new Audio(audioFiles[randomIndex]);
    audio.volume = Math.min(1.0, Math.max(0.0, volume)); // Ensure volume is between 0.0 and 1.0
    audio.preload = 'auto'; // 预加载音频文件
    
    // 不是暂停而是加速播放
    if (lastPlayedAudio) {
        // debug
        lastPlayedAudio.playbackRate = 16.0; // 加速播放
        // console.log('lastPlayedAudio', lastPlayedAudio, lastPlayedAudio.src, lastPlayedAudio.playbackRate);
    }
    lastPlayedAudio = audio;
    audio.play();
}
