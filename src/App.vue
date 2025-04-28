<template>
  <navbar :changeComponent class="fixed top-0 left-0 w-full z-10 bg-base-200 h-16 sm:h-20" />

  <div class="min-h-screen pt-16 sm:pt-20 w-full flex flex-row justify-center bg-base-0 sm:bg-base-200 overscroll-contain">
    <main class="w-full max-w-full sm:max-w-6xl h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden bg-base-0 sm:bg-base-200">
      <div class="flex flex-col items-center gap-4 px-0 sm:px-6">
        <br>
        <component :is="components[currentComponent]"></component>
        <br>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';

// import HomeView from '';
import Upload from './components/Review.vue';
import Discard from './components/Discard.vue';

import ThreeHundred from './components/ThreeHundred.vue';
import PointCalculation from './components/PointCalculation.vue';
import Guide from './components/Guide.vue';
import Books from './components/Books.vue';

import Contact from './components/Contact.vue';
import Introduce from './components/Introduce.vue';
import WebDictionary from './components/WebDictionary.vue';

import Navbar from './components/Navbar.vue';


const currentComponent = ref('Discard');

const components = {
  
  // Home: Home,
  Discard: Discard,
  Upload: Upload,

  ThreeHundred: ThreeHundred,
  PointCalculation: PointCalculation,
  Guide: Guide,
  Books: Books,

  Contact: Contact,
  Introduce: Introduce,
  WebDictionary: WebDictionary,

};

function changeComponent(component) {
  currentComponent.value = component;
}

onMounted(() => {
  const main = document.querySelector('main');
  const updateHeight = () => {
    main.style.height = `${window.innerHeight - 80}px`; // 80px ≈ 5rem
  };
  updateHeight();
  window.addEventListener('resize', updateHeight);
});

</script>

<style scoped>
  /* 在全局 CSS 或 <style> 中添加 */
  html, body {
    height: 100%;
    overflow: hidden; /* 禁止 body 滚动 */
  }

  .min-h-screen {
    height: 100vh;
    overflow: hidden; /* 禁止外层 div 滚动 */
  }

  main {
    overflow-y: auto; /* 仅 main 允许垂直滚动 */
    -webkit-overflow-scrolling: touch; /* 优化手机滚动体验 */
  }
</style>