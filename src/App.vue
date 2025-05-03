// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
  <navbar :changeComponent class="fixed top-0 left-0 w-full z-10 bg-base-200 h-16 sm:h-20" />

  <div class="min-h-screen pt-16 sm:pt-20 w-full flex flex-row justify-center overflow-x-hidden overflow-y-auto overscroll-contain bg-base-0 sm:bg-base-200">
    <main class="w-full max-w-full sm:max-w-6xl h-[calc(100vh-5rem)] overflow-x-hidden overflow-y-auto overscroll-contain bg-base-0 sm:bg-base-200">
      <div class="flex flex-col items-center gap-4 px-0 sm:px-6">
        <br>
        <component :changeComponent :is="components[currentComponent]"></component>
        <br>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import Home from './components/Home.vue';
import Upload from './components/Review.vue';
import Discard from './components/Discard.vue';

import ThreeHundred from './components/ThreeHundred.vue';
import PointCalculation from './components/PointCalculation.vue';
import PureOnesTenpai from './components/PureOnesTenpai.vue';
import Guide from './components/Guide.vue';
import Books from './components/Books.vue';

import Contact from './components/Contact.vue';
import Introduce from './components/Introduce.vue';
import WebDictionary from './components/WebDictionary.vue';

import Navbar from './components/Navbar.vue';


const currentComponent = ref('Home');

const components = {
  
  Home: Home,

  Discard: Discard,
  Upload: Upload,

  ThreeHundred: ThreeHundred,
  PointCalculation: PointCalculation,
  PureOnesTenpai: PureOnesTenpai,
  Guide: Guide,
  Books: Books,

  Contact: Contact,
  Introduce: Introduce,
  WebDictionary: WebDictionary,

};

function changeComponent(component) {
  currentComponent.value = component;
}

import { onMounted } from 'vue';

onMounted(() => {
  const main = document.querySelector('main');
  const updateHeight = () => {
    main.style.height = `${window.innerHeight - 80}px`; // 80px ≈ 5rem
  };
  updateHeight();
  window.addEventListener('resize', updateHeight);
});

</script>
