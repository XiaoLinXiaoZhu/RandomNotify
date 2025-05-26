<template>
    <div class="segment-timer-container">
        <!-- Sober UI 输入控件 -->
        <s-text-field label="总时间(s)" type="number" v-model="totalTime" />
        <s-text-field label="工作时长最小值(s)" type="number" v-model="workMin" />
        <s-text-field label="工作时长最大值(s)" type="number" v-model="workMax" />

        <s-button style="display: flex" @click="start">开始</s-button>

        <s-divider />
        <p>当前运行段：{{ currentSegmentIndex }}</p>

        <!-- 段落列表 -->
        <s-scroll-view class="segments-list" ref="listContainer">
            <div v-for="(seg, index) in segments" :key="index" class="segment-item"
                :class="{ active: index === currentSegmentIndex }" ref="itemRefs">
                <div class="segment-header">
                    {{ seg.isRest ? '💤 休息' : '⏰ 工作' }} - 倒计时：{{ seg.timeLeft }}s
                </div>
                <div class="segment-progress-bar">
                    <div class="segment-progress-fill" :style="{ width: seg.progress + '%', backgroundColor: seg.isRest ? '#ff9800' : '#6200ea' }"></div>
                </div>
            </div>
        </s-scroll-view>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { playRandomAudio} from '../audio/audioManager';

// 数据绑定
const totalTime = ref(3600); // 默认总时间 60分钟 = 3600秒
const workMin = ref(240); // 最小工作时间（秒）
const workMax = ref(300); // 最大工作时间（秒）

const segments = ref<
    {
        isRest: boolean;
        duration: number;
        timeLeft: number;
        progress: number;
    }[]
>([]);

const currentSegmentIndex = ref<number>(0);
const timerId = ref<number | null>(null);
const listContainer = ref<HTMLElement | null>(null);
const itemRefs = ref<HTMLElement[]>([]);

// 生成所有时间段
function generateSegments() {
    const result = [];
    let remaining = totalTime.value;

    while (remaining > 0) {
        const workDuration = Math.floor(Math.random() * (workMax.value - workMin.value + 1)) + workMin.value;
        if (workDuration <= remaining) {
            result.push({ isRest: false, duration: workDuration, timeLeft: workDuration, progress: 0 });
            remaining -= workDuration;
        } else {
            result.push({ isRest: false, duration: remaining, timeLeft: remaining, progress: 0 });
            break;
        }

        if (remaining >= 10) {
            result.push({ isRest: true, duration: 10, timeLeft: 10, progress: 0 });
            remaining -= 10;
        }
    }

    // debug
    console.log('生成的时间段:', result);

    segments.value = result;
}

// 开始定时器
function start() {
    generateSegments();
    currentSegmentIndex.value = 0;
    startCurrentSegment();
}

function startCurrentSegment() {
    if (timerId.value) {
        clearInterval(timerId.value);
    }

    if (currentSegmentIndex.value === null || currentSegmentIndex.value >= segments.value.length) return;

    const segment = segments.value[currentSegmentIndex.value];
    timerId.value = setInterval(() => {
        if (segment.timeLeft > 0) {
            segment.timeLeft--;
            segment.progress = ((segment.duration - segment.timeLeft) / segment.duration) * 100;
        } else {
            clearInterval(timerId.value!);
            playRandomAudio(segment.isRest ? 'startWork' : 'startRest');
            currentSegmentIndex.value++;
            scrollToActiveItem();

            if (currentSegmentIndex.value < segments.value.length) {
                startCurrentSegment();
            }
        }
    }, 1000);
}

function scrollToActiveItem() {
    nextTick(() => {
        const container = listContainer.value;
        const activeItem = itemRefs.value[currentSegmentIndex.value!];

        if (container && activeItem) {
            const containerRect = container.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();

            if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}
</script>

<style scoped>
.segment-timer-container {
    max-width: 600px;
    margin: auto;
    padding: 40px;
    border-radius: 50px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    background-color: var(--s-color-surface-container-lowest);

    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    >* {
        margin: 10px 0;
    }
}

.segments-list {
    margin-top: 20px;
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
}

.segment-item {
    background-color: #f9f9f9;
    padding: 10px 15px;
    margin-bottom: 10px;
    border-radius: 6px;
    transition: background-color 0.3s ease;
}

.segment-item.active {
    background-color: #e3f2fd;
    font-weight: bold;
    transform: scale(1.02);
}

.segment-header {
    font-size: 14px;
    margin-bottom: 5px;
}

.segment-progress-bar {
    height: 10px;
    background-color: #e0e0e0;
    border-radius: 5px;
    overflow: hidden;
}

.segment-progress-fill {
    height: 100%;
    transition: width 0.2s linear;
}
</style>