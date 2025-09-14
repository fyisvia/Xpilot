// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
  <navbar class="fixed top-0 left-0 w-full z-10 bg-base-200 h-16 sm:h-20" />

  <div class="min-h-screen pt-16 sm:pt-20 w-full flex flex-row justify-center bg-base-0 sm:bg-base-200">
    <main class="w-full max-w-full sm:max-w-6xl overflow-x-hidden overflow-y-auto overscroll-contain bg-base-0 sm:bg-base-200">
      <div class="flex flex-col items-center gap-4 px-0 sm:px-6">
        <br>
        <router-view />
        <template v-if="
          route.path !== '/' 
          && route.path !== '/contact'
          && route.path !== '/introduce'
          && route.path !== '/books'
          && route.path !== '/review'
          "
        >
          <br>
          <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%]">
            <div id="waline" class="w-full"></div>
          </ul>
        </template>
        <!-- Waline 评论框 -->
        <br>
        <footer class="text-center text-gray-500 text-sm">
          Copyright © Fyisvia Virell.
        </footer>
        <br>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import { onMounted, onBeforeUnmount, nextTick, watch, inject } from 'vue';
import { useRoute } from 'vue-router';

let walineInstance = null;
const route = useRoute();
const emitter = inject('emitter');

// 初始化 Waline 的函数
const initWaline = async () => {
  // 如果已有实例，先销毁
  if (walineInstance && walineInstance.destroy) {
    walineInstance.destroy();
  }
  
  await nextTick();
  
  // 检查元素是否存在
  const walineElement = document.querySelector('#waline');
  if (!walineElement) {
    console.log('Waline element not found, skipping initialization');
    return;
  }
  
  try {
    const { init } = await import('https://unpkg.com/@waline/client@v3/dist/waline.js');
    walineInstance = init({
      el: '#waline',
      serverURL: 'https://waline.fyisvia.cn',
      path: route.path, // 使用当前路由路径
      lang: 'zh-CN',
      dark: 'html[data-theme="dark"]',
    });
  } catch (error) {
    console.error('Failed to initialize Waline:', error);
  }
};

const updateWalineTheme = () => {
  if (walineInstance) {
    walineInstance.update({});
  }
};

onMounted(async () => {
  const main = document.querySelector('main');
  const updateHeight = () => {
    // 使用视口高度减去导航栏高度，并考虑底部安全区域
    const navHeight = window.innerWidth >= 640 ? 80 : 64; // 响应式导航栏高度 (16px/20px)
    main.style.height = `calc(100vh - ${navHeight}px)`;
    
    // 防止iOS底部白边
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.overscrollBehavior = 'none';
  };
  
  updateHeight();
  window.addEventListener('resize', updateHeight);
  window.addEventListener('orientationchange', updateHeight);
  
  // 防止iOS橡皮筋效果导致的问题
  document.body.addEventListener('touchmove', function(e) {
    if(e.target === document.body) {
      e.preventDefault();
    }
  }, { passive: false });

  // 初始化 Waline
  await initWaline();

  emitter.on('theme-changed', updateWalineTheme);
});

// 监听路由变化，重新初始化 Waline
watch(() => route.path, async () => {
  await initWaline();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeight);
  window.removeEventListener('orientationchange', updateHeight);
  
  emitter.off('theme-changed', updateWalineTheme);

  // 销毁 Waline 实例
  if (walineInstance && walineInstance.destroy) {
    walineInstance.destroy();
  }
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止body自身有滚动条 */
  position: fixed;
  width: 100%;
  height: 100%;
}

#app {
  height: 100%;
  width: 100%;
}
</style>
