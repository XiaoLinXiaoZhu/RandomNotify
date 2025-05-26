// 定义一个统一的广播通道
const channel = new BroadcastChannel('segment-timer-channel');

export const broadcast = {
  postMessage(data: any) {
    channel.postMessage(data);
  },
  onMessage(callback: (data: any) => void) {
    channel.addEventListener('message', (event) => {
      callback(event.data);
    });
  },
};