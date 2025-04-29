// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-44 p-2 shadow"
        >
          <li>
            <a class="text-sm font-semibold">分析</a>
            <ul class="p-2">
              <li><a class="text-sm" @click="changeComponent('Discard')">何切分析</a></li>
              <li><a class="text-sm" @click="changeComponent('Upload')">牌谱分析</a></li>
            </ul>
          </li>
          <li>
            <a class="text-sm font-semibold">学习</a>
            <ul class="p-2">
              <li><a class="text-sm" @click="changeComponent('ThreeHundred')">何切三百问</a></li>
              <li><a class="text-sm" @click="changeComponent('PointCalculation')">点数计算练习</a></li>
              <li><a class="text-sm" @click="changeComponent('Guide')">入门及进阶路线</a></li>
              <li><a class="text-sm" @click="changeComponent('Books')">战术书链接合集</a></li>
            </ul>
          </li>
          <li>
            <a class="text-sm font-semibold">其他</a>
            <ul class="p-2">
              <li><a class="text-sm" @click="changeComponent('Contact')">关于作者</a></li>
              <li><a class="text-sm" @click="changeComponent('Introduce')">关于本站</a></li>
              <li><a class="text-sm" @click="changeComponent('WebDictionary')">其他网站</a></li>
            </ul>
          </li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl">Xpilot</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li>
          <details>
            <summary>分析</summary>
            <ul class="p-2 w-32">
              <li><a @click="changeComponent('Discard')">何切分析</a></li>
              <li><a @click="changeComponent('Upload')">牌谱分析</a></li>
            </ul>
          </details>
        </li>
        <li>
          <details>
            <summary>学习</summary>
            <ul class="p-2 w-36">
              <li><a @click="changeComponent('ThreeHundred')">何切三百问</a></li>
              <li><a @click="changeComponent('PointCalculation')">点数计算</a></li>
              <li><a @click="changeComponent('Guide')">入门及进阶路线</a></li>
              <li><a @click="changeComponent('Books')">战术书链接合集</a></li>
            </ul>
          </details>
        </li>
        <li>
          <details>
            <summary>其他</summary>
            <ul class="p-2 w-32">
              <li><a @click="changeComponent('Contact')">关于作者</a></li>
              <li><a @click="changeComponent('Introduce')">关于本站</a></li>
              <li><a @click="changeComponent('WebDictionary')">其他网站</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
    <div class="navbar-end flex items-center gap-4 mr-6">
      <ThemeToggle />
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="/public/photos/Profile.jpg"
            />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-8 w-32 p-2 shadow"
        >
          <li>
            <a class="justify-between" @click="changeComponent('Contact')">
              关于作者
              <!-- <span class="badge"></span> -->
            </a>
          </li>
          <!-- <li><a>Settings</a></li> -->
          <!-- <li><a>Logout</a></li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import ThemeToggle from "../components/ThemeToggle.vue";

defineProps(['changeComponent'])

const closeDropdowns = (event) => {
  const dropdowns = document.querySelectorAll('details[open]')
  dropdowns.forEach((dropdown) => {
    const summary = dropdown.querySelector('summary')
    const ul = dropdown.querySelector('ul')
    if (!summary.contains(event.target) && !ul.contains(event.target)) {
      dropdown.removeAttribute('open')
    }
  })
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>


