// 读取音频文件，并且将文件名总结到 audio.json 中

import {startWorkAudioFolder,startRestAudioFolder} from './src/audio/audioManager.ts';

// 读取音频文件，并且将文件名总结到 audio.json 中
import * as bun from 'bun';
import { readdir } from "node:fs/promises";

const startWorkAudioFiles = await readdir("./public" + startWorkAudioFolder);
const startRestAudioFiles = await readdir("./public" + startRestAudioFolder);

// 过滤掉非音频文件
const audioFileExtensions = ['.mp3', '.wav', '.ogg', '.m4a'];
const filteredStartWorkAudioFiles = startWorkAudioFiles.filter(file => 
    audioFileExtensions.includes(file.slice(-4).toLowerCase()) || 
    audioFileExtensions.includes(file.slice(-5).toLowerCase())
);
const filteredStartRestAudioFiles = startRestAudioFiles.filter(file =>
    audioFileExtensions.includes(file.slice(-4).toLowerCase()) || 
    audioFileExtensions.includes(file.slice(-5).toLowerCase())
);

// 将文件名写入到 audio.json 中
const audioJson = {
    startWorkAudios: filteredStartWorkAudioFiles,
    startRestAudios: filteredStartRestAudioFiles
};
const audioJsonPath = './src/audio/audio.json';
await Bun.write(audioJsonPath, JSON.stringify(audioJson, null, 2));
// debug
console.log('Audio files:', audioJson);
console.log(`Audio files have been written to ${audioJsonPath}`);