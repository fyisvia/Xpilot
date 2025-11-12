// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
    <label class="swap swap-rotate">
      <!-- this hidden checkbox controls the state -->
      <input
        type="checkbox"
        v-model="isLightTheme"
        @change="toggleTheme"
        :aria-label="isLightTheme ? '切换为深色主题' : '切换为浅色主题'"
      />
  
      <!-- sun icon -->
      <svg
        class="swap-on h-6 w-6 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
        />
      </svg>
  
      <!-- moon icon -->
      <svg
        class="swap-off h-6 w-6 fill-current"
        viewBox="0 0 24 24"
      >
        <path
          d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
        />
      </svg>
    </label>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'

const emitter = inject('emitter')
const isLightTheme = ref(true)

// 本地存储键（与 Navbar 保持一致）
const THEME_STORAGE_KEY = 'xpilot-theme'

// 获取初始主题：localStorage > data-theme 属性 > 系统偏好 > light
function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

let observer

function toggleTheme() {
  const theme = isLightTheme.value ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme)
  try { localStorage.setItem(THEME_STORAGE_KEY, theme) } catch {}
  if (emitter?.emit) emitter.emit('theme-changed', theme)
}

// 初始化：根据当前/已保存主题同步开关状态，并监听外部变更
onMounted(() => {
  const initial = getInitialTheme()
  if (document.documentElement.getAttribute('data-theme') !== initial) {
    document.documentElement.setAttribute('data-theme', initial)
  }
  isLightTheme.value = initial === 'light'

  observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.attributeName === 'data-theme') {
        const theme = document.documentElement.getAttribute('data-theme')
        if (theme === 'light' || theme === 'dark') {
          isLightTheme.value = theme === 'light'
        }
      }
    }
  })
  observer.observe(document.documentElement, { attributes: true })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>