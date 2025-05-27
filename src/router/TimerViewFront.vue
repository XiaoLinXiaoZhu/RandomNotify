<template>
  <div class="segment-timer-container">
    <!-- Sober UI 输入控件 -->
    <Transition name="fade">
      <div v-if="!isRunning" class="config-panel">
        <s-text-field label="总时间(s)" type="number" v-model="totalTime" />
        <div style="display: grid; grid-template-columns: 0.5fr 0.5fr; gap: 10px;">
          <s-text-field label="工作时间最小值(s)" type="number" style="display: grid; width: 100%" v-model="workMin" />
          <s-text-field label="工作时间最大值(s)" type="number" style="display: grid; width: 100%" v-model="workMax" />
        </div>
        <s-text-field label="休息时间(s)" type="number" v-model="restTime" />
      </div>

      <div v-else class="config-panel">
        <div class="config-bar">
          <h2>显示剩余时间</h2>
          <s-switch v-model.lazy="ifShowTimeLeft" type="checkbox" label="显示剩余时间" />
        </div>
      </div>
    </Transition>


    <!-- 控制按钮区域 -->
    <div class="control-buttons">
      <Transition name="horfade">
        <div v-if="!isRunning" class="start-button">
          <s-button @click="start" style="flex: 1;">开始</s-button>
        </div>

        <div v-else class="pause-cancel-buttons">
          <s-button @click="pause" type="elevated" style="flex: 1;">{{ isPaused ? '继续' : '暂停' }}</s-button>
          <s-button @click="cancel">取消</s-button>
        </div>
      </Transition>
    </div>

    <!-- 音量控制 -->
    <s-slider v-model="volume" :min="0" :max="1" :step="0.05" labeled style="margin: 10px 0;">
    </s-slider>

    <s-divider />
    <p>当前运行段：{{ currentSegmentIndex }}</p>

    <!-- 段落列表 -->
    <!-- 使用transition group 实现更加丝滑的列表动画 -->
    <s-scroll-view class="segments-list" ref="listContainer">
      <TransitionGroup name="list">
        <div v-for="(seg, index) in segments" :key="index" class="segment-item" :data-index="index"
          :style="{ transitionDelay: `${Math.min(Math.max(2 * index / (20 + index), 0.01), Math.max(1 - 0.05 * index, 0.01))}s` }"
          :class="{ active: index === currentSegmentIndex }" :ref="el => { if (el) itemRefs[index] = el as HTMLElement }">
          <div class="segment-header">
            {{ seg.isRest ? '💤 休息' : '⏰ 工作' }} - 倒计时：{{ ifShowTimeLeft || seg.isRest ? seg.timeLeft : "***" }}s
          </div>
          <div class="segment-progress-bar">
            <div class="segment-progress-fill" v-if="ifShowTimeLeft || seg.isRest"
              :style="{ width: seg.progress + '%', backgroundColor: seg.isRest ? '#ff9800' : '#6200ea' }"></div>
            <div class="segment-progress-fill" v-else-if="seg.progress > 0 && index === currentSegmentIndex"
              style="background-color: #fe628a;background-blend-mode: screen;">
              <s-skeleton class="segment-progress-fill" style="opacity: 0.4;background-blend-mode: hard-light;"></s-skeleton>
            </div>
            <div class="segment-progress-fill" v-else
              :style="{ width: seg.progress + '%', backgroundColor: '#fe628a' }"></div>
          </div>
        </div>
      </TransitionGroup>
    </s-scroll-view>



  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import TimerWorker from '@/workers/timerWorker.ts?worker';
import { playRandomAudio } from '../audio/audioManager';

// 数据绑定
const totalTime = ref(3600); // 默认总时间 60分钟 = 3600秒
const workMin = ref(240); // 最小工作时间（秒）
const workMax = ref(300); // 最大工作时间（秒）
const restTime = ref(10); // 休息时间（秒），默认 10 秒

const ifShowTimeLeft = ref(true); // 是否显示剩余时间

const volume = ref(0.5); // 音量控制，默认 50%
const isRunning = ref(false);
const isPaused = ref(false);

type Segment = {
  isRest: boolean;
  duration: number; // 段持续时间（秒）
  timeLeft: number; // 剩余时间（秒）
  progress: number; // 进度百分比
};
const segments = ref<Segment[]>([]);

const currentSegmentIndex = ref<number | null>(null);
const listContainer = ref<HTMLElement | null>(null);
const itemRefs = ref<(HTMLElement | null)[]>([]);

const worker = new TimerWorker();

worker.onmessage = (e) => {
  const msg = e.data;

  //debug
  // console.debug(msg.type,msg.payload);

  if (msg.type === 'UPDATE_SEGMENTS') {
    segments.value = msg.payload.segments;
  }

  if (msg.type === 'UPDATE_CURRENT_SEGMENT_INDEX') {
    currentSegmentIndex.value = msg.payload.index;
    scrollToActiveItem();
  }

  if (msg.type === 'SEGMENT_FINISHED') {
    playRandomAudio(msg.payload.isRest ? 'startWork' : 'startRest', volume.value);
  }
};

function start() {
  isRunning.value = true;
  isPaused.value = false;
  worker.postMessage({
    type: 'START',
    payload: {
      totalTime: totalTime.value,
      workMin: workMin.value,
      workMax: workMax.value,
      restTime: restTime.value,
    }
  });
}

function pause() {
  isPaused.value = !isPaused.value;
  worker.postMessage({
    type: isPaused.value ? 'PAUSE' : 'RESUME'
  });
}

function cancel() {
  isRunning.value = false;
  isPaused.value = false;
  worker.postMessage({ type: 'CANCEL' });
  segments.value = [];
  currentSegmentIndex.value = null;
}

function scrollToActiveItem() {
  nextTick(() => {
    const container = listContainer.value;
    const activeItem = currentSegmentIndex.value !== null ? itemRefs.value[currentSegmentIndex.value] : null;
    // debug
    // console.log('scrollToActiveItem', { container, activeItem });
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
.horfade-enter-active,
.horfade-leave-active {
  transition: all 0.5s ease-in-out;

  * {
    transition: all 0.5s ease-in-out;
  }
}

.horfade-enter-from,
.horfade-leave-to {
  width: 0 !important;
  padding: 0 !important;
  margin: 0px 0px !important;
  opacity: 0;

  * {
    min-width: 0 !important;
    padding: 0 !important;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
  position: absolute;

  * {
    transition: all 0.5s ease;
  }
}

.fade-enter-from,
.fade-leave-to {
  /* width: 0 !important; */
  height: 0 !important;
  padding: 0 !important;
  margin: 0px 0px !important;
  opacity: 0;
  position: absolute;

  transition: all 0.3s ease;

  * {
    min-width: 0 !important;
    padding: 0 !important;
  }
}

.fade-leave-from {
  opacity: 1;
  position: absolute;
}

.control-buttons {
  display: flex;
  height: 40px;
  justify-content: left;
  flex-direction: row;
  position: relative;
  padding: 0px 0 10px 0;
  overflow: hidden;

  >div>s-button {
    min-width: 0;
  }
}

.start-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pause-cancel-buttons {
  position: relative;
  width: 100%;
  display: flex;
  gap: 10px;
}

.segment-timer-container {
  max-width: 600px;
  /* margin: auto; */
  padding: 40px;
  border-radius: 50px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  background-color: var(--s-color-surface-container-lowest);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  transition: all 1s ease;
  animation: fade-in 0.5s ease-out;
}

.segment-timer-container>* {
  margin: 10px 0;
}

.config-panel {
  padding: 0px;
  min-width: 300px;
  position: relative;

  transform: height 1s ease;

  >s-text-field {
    width: 100%;
    margin: 10px 0;
  }
}

.config-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  h2 {
    font-size: 16px;
    margin: 0;
    color: var(--s-color-on-surface);
  }

  s-switch {
    flex-shrink: 0;
    width: auto;
    min-width: 50px;
  }
}

.segments-list {
  margin-top: 20px;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;

  transition: all 0.3s ease;
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

.list-move,
/* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;

  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  padding: 0;
  margin: 0;
  transform: scaleY(0);
  /* height: 0px; */

  transition: all 0.3s ease, opacity 10s ease;
}

.list-leave-from {
  opacity: 1 !important;
  transform: scaleY(1) !important;
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
/* .list-leave-active {
  position: absolute;
} */


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