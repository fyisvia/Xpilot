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
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden" aria-label="打开导航菜单" aria-haspopup="menu" aria-expanded="false">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-8 w-44 p-2 shadow"
        >
          <li>
            <a class="text-base font-semibold">分析</a>
            <ul class="p-2">
              <li><router-link to="/discard" class="link no-underline text-sm">牌效率分析</router-link></li>
              <li><router-link to="/review" class="link no-underline text-sm">牌谱分析</router-link></li>
            </ul>
          </li>
          <li>
            <a class="text-base font-semibold">学习</a>
            <ul class="p-2">
              <li><router-link to="/three-hundred" class="link no-underline text-sm">何切三百问</router-link></li>
              <li><router-link to="/pure-ones-tenpai" class="link no-underline text-sm">清一色听牌练习</router-link></li>
              <li><router-link to="/point-calculation" class="link no-underline text-sm">点数计算</router-link></li>
              <li><router-link to="/guide" class="link no-underline text-sm">入门及进阶路线</router-link></li>
              <li><router-link to="/books" class="link no-underline text-sm">战术书链接合集</router-link></li>
            </ul>
          </li>
          <li>
            <a class="text-base font-semibold">其他</a>
            <ul class="p-2">
              <li><router-link to="/contact" class="link no-underline text-sm">关于作者</router-link></li>
              <li><router-link to="/introduce" class="link no-underline text-sm">关于本站</router-link></li>
              <li><router-link to="/web-dictionary" class="link no-underline text-sm">其他网站</router-link></li>
            </ul>
          </li>
        </ul>
      </div>
      <router-link to="/" class="btn btn-ghost text-xl no-underline">Xpilot</router-link>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li>
          <details>
            <summary>分析</summary>
            <ul class="p-2 w-32">
              <li><router-link to="/discard" class="link no-underline">牌效率分析</router-link></li>
              <li><router-link to="/review" class="link no-underline">牌谱分析</router-link></li>
            </ul>
          </details>
        </li>
        <li>
          <details>
            <summary>学习</summary>
            <ul class="p-2 w-36">
              <li><router-link to="/three-hundred" class="link no-underline">何切三百问</router-link></li>
              <li><router-link to="/pure-ones-tenpai" class="link no-underline">清一色听牌练习</router-link></li>
              <li><router-link to="/point-calculation" class="link no-underline">点数计算</router-link></li>
              <li><router-link to="/guide" class="link no-underline">入门及进阶路线</router-link></li>
              <li><router-link to="/books" class="link no-underline">战术书链接合集</router-link></li>
            </ul>
          </details>
        </li>
        <li>
          <details>
            <summary>其他</summary>
            <ul class="p-2 w-32">
              <li><router-link to="/contact" class="link no-underline">关于作者</router-link></li>
              <li><router-link to="/introduce" class="link no-underline">关于本站</router-link></li>
              <li><router-link to="/web-dictionary" class="link no-underline">其他网站</router-link></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
    <div class="navbar-end flex items-center gap-4 mr-6">
      <ThemeToggle aria-label="切换主题" />
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar" aria-label="打开用户菜单" aria-haspopup="menu" aria-expanded="false">
          <div class="w-10 rounded-full">
            <img
              alt="用户头像"
              src="/photos/Profile.jpg"
            />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-8 w-32 p-2 shadow"
        >
          <li><router-link to="/contact" class="justify-between no-underline text-sm">关于作者</router-link></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import ThemeToggle from "../components/ThemeToggle.vue";

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

