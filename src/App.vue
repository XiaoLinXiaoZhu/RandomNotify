<script setup lang="ts">
import { keepAlive } from './utils/keepalive';

keepAlive();
</script>

<template>
  <s-page>
    <RouterView />
  </s-page>
</template>

<style scoped>
s-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
</style>
