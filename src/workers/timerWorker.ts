let timer: number | null = null;
let segments: any[] = [];
let currentSegmentIndex: number = 0;
let paused = false;

onmessage = (event) => {
  const data = event.data;

  if (data.type === 'START') {
    const { totalTime, workMin, workMax, restTime } = data.payload;
    segments = generateSegments(totalTime, workMin, workMax, restTime);
    currentSegmentIndex = 0;
    paused = false;

    postMessage({ type: 'UPDATE_SEGMENTS', payload: { segments } });
    postMessage({ type: 'UPDATE_CURRENT_SEGMENT_INDEX', payload: { index: currentSegmentIndex } });

    startTimer();
  }

  if (data.type === 'PAUSE') {
    paused = true;
  }

  if (data.type === 'RESUME') {
    paused = false;
    startTimer();
  }

  if (data.type === 'CANCEL') {
    if (timer !== null) clearInterval(timer);
    timer = null;
    segments = [];
    currentSegmentIndex = 0;
    paused = false;
  }
};

function generateSegments(totalTime: number, workMin: number, workMax: number, restTime: number) {
  const result = [];
  let remaining = totalTime;

  while (remaining > 0) {
    const workDuration = Math.floor(Math.random() * (workMax - workMin + 1)) + workMin;
    if (workDuration <= remaining) {
      result.push({
        isRest: false,
        duration: workDuration,
        timeLeft: workDuration,
        progress: 0,
      });
      remaining -= workDuration;
    } else {
      result.push({
        isRest: false,
        duration: remaining,
        timeLeft: remaining,
        progress: 0,
      });
      break;
    }

    if (remaining >= restTime) {
      result.push({
        isRest: true,
        duration: restTime,
        timeLeft: restTime,
        progress: 0,
      });
      remaining -= restTime;
    }
  }

  return result;
}

function startTimer() {
  if (timer !== null) clearInterval(timer);

  timer = setInterval(() => {
    if (paused) return;

    const current = segments[currentSegmentIndex];
    if (!current) {
      clearInterval(timer!);
      timer = null;
      return;
    }

    if (current.timeLeft > 0) {
      current.timeLeft--;
      current.progress = ((current.duration - current.timeLeft) / current.duration) * 100;
      postMessage({ type: 'UPDATE_SEGMENTS', payload: { segments } });

    } else {
      clearInterval(timer!);
      timer = null;

      postMessage({ type: 'SEGMENT_FINISHED', payload: { isRest: current.isRest } });

      currentSegmentIndex++;
      if (currentSegmentIndex < segments.length) {
        postMessage({ type: 'UPDATE_CURRENT_SEGMENT_INDEX', payload: { index: currentSegmentIndex } });
        startTimer();
      }
    }
  }, 1000);
}