// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
  <navbar class="fixed top-0 left-0 w-full z-10 bg-base-200 h-16 sm:h-20" />

  <div class="min-h-screen pt-12 sm:pt-20 w-full flex flex-row justify-center bg-base-0 sm:bg-base-200">
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
import { onMounted, onBeforeUnmount, nextTick, watch, inject, VueElement } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

let walineInstance = null;
const route = useRoute();
const emitter = inject('emitter');
const { t, locale } = useI18n();

// map i18n -> Waline lang（仅 zhCN/zhTW/en 有对应，其余回退 en）
const toWalineLang = (l) => {
  switch (l) {
    case 'zhCN': return 'zh-CN';
    case 'zhTW': return 'zh-TW';
    case 'en':   return 'en';
    default:     return 'en'; // fr/es/ja/ko 等一律显示为英语
  }
};

// 初始化 Waline 的函数
const initWaline = async () => {
  if (walineInstance && walineInstance.destroy) {
    walineInstance.destroy();
  }
  await nextTick();

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
      path: route.path,
      lang: toWalineLang(locale.value),
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
    const navHeight = window.innerWidth >= 640 ? 80 : 64;
    main.style.height = `calc(100vh - ${navHeight}px)`;
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.overscrollBehavior = 'none';
  };

  updateHeight();
  window.addEventListener('resize', updateHeight);
  window.addEventListener('orientationchange', updateHeight);

  document.body.addEventListener('touchmove', function(e) {
    if(e.target === document.body) {
      e.preventDefault();
    }
  }, { passive: false });

  await initWaline();

  emitter.on('theme-changed', updateWalineTheme);
});

// 监听路由变化，重新初始化 Waline
watch(() => route.path, async () => {
  await initWaline();
});

// 监听站点语言变化，联动 Waline 语言
watch(() => locale.value, (newLang) => {
  if (walineInstance && walineInstance.update) {
    walineInstance.update({ lang: toWalineLang(newLang) });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeight);
  window.removeEventListener('orientationchange', updateHeight);

  emitter.off('theme-changed', updateWalineTheme);

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
