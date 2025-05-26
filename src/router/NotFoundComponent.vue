<template>
  <div class="not-found-container">
    <div class="error-card">
      <div class="error-icon">404</div>
      <h1>页面未找到</h1>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <div class="path-info">
        <span>当前路径：</span>
        <code>{{ currentPath }}</code>
      </div>
      <s-button @click="goHome" class="home-button">返回主界面</s-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentPath = ref('');

onMounted(() => {
  // 获取当前路径
  currentPath.value = window.location.pathname + window.location.hash;
});

function goHome() {
  // 导航到主页
  router.push('/');
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.error-card {
  max-width: 500px;
  padding: 40px;
  border: 1px solid var(--s-color-outline-variant);
  border-radius: 16px;
  background-color: var(--s-color-surface-container);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: fade-in 0.5s ease-out;
}

.error-icon {
  font-size: 80px;
  font-weight: bold;
  color: var(--s-color-error);
  margin-bottom: 20px;
}

h1 {
  color: var(--s-color-on-surface);
  font-size: 32px;
  margin-bottom: 16px;
}

p {
  color: var(--s-color-on-surface-variant);
  font-size: 16px;
  margin-bottom: 24px;
}

.path-info {
  background-color: var(--s-color-surface-variant);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  text-align: left;
}

code {
  font-family: monospace;
  word-break: break-all;
}

.home-button {
  min-width: 150px;
  margin-top: 8px;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>