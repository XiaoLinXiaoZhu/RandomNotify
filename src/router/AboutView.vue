<template>
  <div class="about-container">
    <div class="about-card">
      <div class="about-header">
        <h1>随机间隔提示器</h1>

        <p class="subtitle">
          改良版番茄钟，理论参见
          <a href="https://www.bilibili.com/video/BV1naLozQEBq" target="_blank" class="bilibili-link">
            bilibili
          </a>
        </p>
        <p class="description">可以设置工作时间段和休息时间段，工作时间段随机生成。</p>
      </div>

      <div class="navigation-links">
        <s-button @click="navigateToTimer" class="nav-button primary-button">
          前往计时器
        </s-button>
        <s-button @click="navigateToOldTimer" class="nav-button">
          前往旧版计时器
        </s-button>
      </div>

      <s-divider />
      <s-scroll-view class="markdown-container" style="max-height: 60vh; overflow-y: auto;">
        <div class="markdown-content" v-html="content" id="about-content"></div>
        <div class="placeholder" style="height: 100px;display: block;"></div>
      </s-scroll-view>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { marked, Renderer } from 'marked';
import { useRouter } from 'vue-router';
import readme from '../../README.md?raw';

const content = ref<string>('');
const router = useRouter();

onMounted(async () => {
  // 解析 Markdown 内容
  content.value = await marked.parse(readme, {
    renderer: new Renderer(),
    gfm: true,
    breaks: true,
  });
});

function navigateToTimer() {
  router.push('/timer');
}

function navigateToOldTimer() {
  router.push('/old-timer');
}
</script>

<style scoped>

s-divider {
  margin: 20px 0;
}

.about-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 80vh;
}

.about-card {
  max-width: 800px;
  width: 100%;
  padding: 40px;
  border-radius: 16px;
  background-color: var(--s-color-surface-container-lowest);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fade-in 0.5s ease-out;
}

.about-header {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  color: var(--s-color-on-surface);
  font-size: 32px;
  margin-bottom: 16px;
}

.subtitle {
  color: var(--s-color-on-surface-variant);
  font-size: 16px;
  margin-bottom: 8px;
}

.description {
  color: var(--s-color-on-surface-variant);
  font-size: 14px;
}

.bilibili-link {
  color: var(--s-color-primary);
  text-decoration: none;
  transition: color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.bilibili-link:hover {
  color: var(--s-color-primary-container);
  text-decoration: underline;
}

.navigation-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.nav-button {
  min-width: 140px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-button {
  background-color: var(--s-color-primary);
  color: var(--s-color-on-primary);
}

.markdown-container {
  margin-top: 20px;
  padding: 20px 40px;
  background-color: var(--s-color-surface-container);
  border-radius: 8px;
  overflow: hidden;
}

.markdown-content {
  line-height: 1.6;
  max-height: calc(100vh - 600px);
  color: var(--s-color-on-surface);
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4 {
  color: var(--s-color-primary);
  margin-top: 24px;
  margin-bottom: 16px;
}

.markdown-content h2 {
  border-bottom: 1px solid var(--s-color-outline-variant);
  padding-bottom: 8px;
}

.markdown-content p {
  margin-bottom: 16px;
}

.markdown-content ul,
.markdown-content ol {
  padding-left: 24px;
  margin-bottom: 16px;
}

.markdown-content code {
  background-color: var(--s-color-surface-variant);
  border-radius: 4px;
  padding: 2px 4px;
  font-family: monospace;
}

.markdown-content pre {
  background-color: var(--s-color-surface-variant);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin-bottom: 16px;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .about-card {
    padding: 20px;
  }

  .navigation-links {
    flex-direction: column;
    align-items: center;
  }

  .nav-button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
