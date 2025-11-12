// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost lg:hidden"
          :aria-label="$t('navbar.aria.openMenu')"
          aria-haspopup="menu"
          aria-expanded="false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-8 w-max whitespace-nowrap p-2 shadow"
        >
          <li>
            <a class="text-base font-semibold">{{ $t('navbar.groups.analysis') }}</a>
            <ul class="p-2 w-max whitespace-nowrap">
              <li><router-link to="/discard" class="link no-underline text-sm">{{ $t('navbar.items.discard') }}</router-link></li>
              <li><router-link to="/review" class="link no-underline text-sm">{{ $t('navbar.items.review') }}</router-link></li>
              <li><router-link to="/hand-point-calculator" class="link no-underline text-sm">{{ $t('navbar.items.handPointCalculator') }}</router-link></li>
            </ul>
          </li>
          <li>
            <a class="text-base font-semibold">{{ $t('navbar.groups.learn') }}</a>
            <ul class="p-2 w-max whitespace-nowrap">
              <li><router-link to="/pure-ones-tenpai" class="link no-underline text-sm">{{ $t('navbar.items.pureOnesTenpai') }}</router-link></li>
              <li><router-link to="/efficiency-train" class="link no-underline text-sm">{{ $t('navbar.items.efficiencyTrain') }}</router-link></li>
              <li><router-link to="/point-calculation" class="link no-underline text-sm">{{ $t('navbar.items.pointCalc') }}</router-link></li>
              <li><router-link to="/hand-point-calculation" class="link no-underline text-sm">{{ $t('navbar.items.handPointCalc') }}</router-link></li>
              <li><router-link to="/guide" class="link no-underline text-sm">{{ $t('navbar.items.guide') }}</router-link></li>
              <li><router-link to="/basic-terms" class="link no-underline text-sm">{{ $t('navbar.items.basicTerms') }}</router-link></li>
              <li><router-link to="/books" class="link no-underline text-sm">{{ $t('navbar.items.books') }}</router-link></li>
            </ul>
          </li>
          <li>
            <a class="text-base font-semibold">{{ $t('navbar.groups.more') }}</a>
            <ul class="p-2 w-max whitespace-nowrap">
              <li><router-link to="/introduce" class="link no-underline text-sm">{{ $t('navbar.items.introduce') }}</router-link></li>
              <li><router-link to="/web-dictionary" class="link no-underline text-sm">{{ $t('navbar.items.webDictionary') }}</router-link></li>
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
            <summary>{{ $t('navbar.groups.analysis') }}</summary>
            <ul class="p-2 w-max whitespace-nowrap top-[calc(100%+1.2rem)]">
              <li><router-link to="/discard" class="link no-underline">{{ $t('navbar.items.discard') }}</router-link></li>
              <li><router-link to="/review" class="link no-underline">{{ $t('navbar.items.review') }}</router-link></li>
              <li><router-link to="/hand-point-calculator" class="link no-underline">{{ $t('navbar.items.handPointCalculator') }}</router-link></li>
            </ul>
          </details>
        </li>
        <li>
          <details>
            <summary>{{ $t('navbar.groups.learn') }}</summary>
            <ul class="p-2 w-max whitespace-nowrap top-[calc(100%+1.2rem)]">
              <li><router-link to="/pure-ones-tenpai" class="link no-underline">{{ $t('navbar.items.pureOnesTenpai') }}</router-link></li>
              <li><router-link to="/efficiency-train" class="link no-underline">{{ $t('navbar.items.efficiencyTrain') }}</router-link></li>
              <li><router-link to="/point-calculation" class="link no-underline">{{ $t('navbar.items.pointCalc') }}</router-link></li>
              <li><router-link to="/hand-point-calculation" class="link no-underline">{{ $t('navbar.items.handPointCalc') }}</router-link></li>
              <li><router-link to="/guide" class="link no-underline">{{ $t('navbar.items.guide') }}</router-link></li>
              <li><router-link to="/basic-terms" class="link no-underline">{{ $t('navbar.items.basicTerms') }}</router-link></li>
              <li><router-link to="/books" class="link no-underline">{{ $t('navbar.items.books') }}</router-link></li>
            </ul>
          </details>
        </li>
        <li>
          <details>
            <summary>{{ $t('navbar.groups.more') }}</summary>
            <ul class="p-2 w-max whitespace-nowrap top-[calc(100%+1.2rem)]">
              <li><router-link to="/introduce" class="link no-underline">{{ $t('navbar.items.introduce') }}</router-link></li>
              <li><router-link to="/web-dictionary" class="link no-underline">{{ $t('navbar.items.webDictionary') }}</router-link></li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
    <div class="navbar-end flex items-center mr-6">
      <ThemeToggle aria-label="切换主题" />
      <div class="dropdown dropdown-end ml-1">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-circle"
          :aria-label="$t('navbar.aria.langSwitch')"
          :title="$t('navbar.aria.langSwitch')"
        >
          <!-- globe icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 21c4.971 0 9-4.029 9-9S16.971 3 12 3 3 7.029 3 12s4.029 9 9 9Z" stroke="currentColor" stroke-width="1.6"/>
            <path d="M3 12h18M12 3c2.485 2.443 3.75 5.4 3.75 9S14.485 19.557 12 21M12 3C9.515 5.443 8.25 8.4 8.25 12s1.265 6.557 3.75 9M6 6c3.5 2 8.5 2 12 0M6 18c3.5-2 8.5-2 12 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-8 w-max whitespace-nowrap p-2 shadow"
        >
          <li>
            <button class="justify-between no-underline text-sm" @click="changeLang('zhCN')">
              {{ $t('navbar.lang.zhCN') }}
              <span v-if="locale === 'zhCN'" class="badge badge-sm">✓</span>
            </button>
          </li>
          <li>
            <button class="justify-between no-underline text-sm" @click="changeLang('zhTW')">
              {{ $t('navbar.lang.zhTW') }}
              <span v-if="locale === 'zhTW'" class="badge badge-sm">✓</span>
            </button>
          </li>
          <li>
            <button class="justify-between no-underline text-sm" @click="changeLang('en')">
              {{ $t('navbar.lang.en') }}
              <span v-if="locale === 'en'" class="badge badge-sm">✓</span>
            </button>
          </li>
          <li>
            <button class="justify-between no-underline text-sm" @click="changeLang('ja')">
              {{ $t('navbar.lang.ja') }}
              <span v-if="locale === 'ja'" class="badge badge-sm">✓</span>
            </button>
          </li>
          <li>
            <button class="justify-between no-underline text-sm" @click="changeLang('ko')">
              {{ $t('navbar.lang.ko') }}
              <span v-if="locale === 'ko'" class="badge badge-sm">✓</span>
            </button>
          </li>
          <li>
            <button class="justify-between no-underline text-sm" @click="changeLang('fr')">
              {{ $t('navbar.lang.fr') }}
              <span v-if="locale === 'fr'" class="badge badge-sm">✓</span>
            </button>
          </li>
          <li>
            <button class="justify-between no-underline text-sm" @click="changeLang('es')">
              {{ $t('navbar.lang.es') }}
              <span v-if="locale === 'es'" class="badge badge-sm">✓</span>
            </button>
          </li>
        </ul>
      </div>

      <div class="dropdown dropdown-end ml-2">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar" aria-label="打开用户菜单" aria-haspopup="menu" aria-expanded="false">
          <div class="w-10 rounded-full">
            <img
              :alt="$t('navbar.aria.userAvatarAlt')"
              src="/photos/Profile.jpg"
            />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-8 w-max whitespace-nowrap p-2 shadow"
        >
          <li><router-link to="/introduce" class="justify-between no-underline text-sm">{{ $t('navbar.items.introduce') }}</router-link></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ThemeToggle from "../components/ThemeToggle.vue";

const { locale } = useI18n()

const THEME_STORAGE_KEY = 'xpilot-theme'

// 将站点语言映射到 <html lang="">，用于可访问性与 SEO
function mapHtmlLang(l) {
  switch (l) {
    case 'zhCN': return 'zh-CN'
    case 'zhTW': return 'zh-TW'
    case 'ja':   return 'ja'
    case 'ko':   return 'ko'
    case 'fr':   return 'fr'
    case 'es':   return 'es'
    case 'en':
    default:     return 'en'
  }
}

// 切换语言并持久化
function changeLang(l) {
  locale.value = l
  try { localStorage.setItem('xpilot-lang', l) } catch {}
  document.documentElement.setAttribute('lang', mapHtmlLang(l))
}

// 读取并应用保存的主题
function applySavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved)
    }
  } catch {}
}

let themeObserver // 监听 data-theme 变化

const closeDropdowns = (event) => {
  const dropdowns = document.querySelectorAll('details[open]')
  dropdowns.forEach((dropdown) => {
    const summary = dropdown.querySelector('summary')
    const ul = dropdown.querySelector('ul')
    if (!summary || !ul) return
    if (!summary.contains(event.target) && !ul.contains(event.target)) {
      dropdown.removeAttribute('open')
    }
  })
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
  // 初始化时应用已保存的语言
  try {
    const saved = localStorage.getItem('xpilot-lang')
    if (saved && saved !== locale.value) {
      locale.value = saved
    }
  } catch {}
  document.documentElement.setAttribute('lang', mapHtmlLang(locale.value))
  applySavedTheme()
  themeObserver = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.attributeName === 'data-theme') {
        const theme = document.documentElement.getAttribute('data-theme') || ''
        if (theme) {
          try { localStorage.setItem(THEME_STORAGE_KEY, theme) } catch {}
        }
      }
    }
  })
  themeObserver.observe(document.documentElement, { attributes: true })
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
  if (themeObserver) themeObserver.disconnect()
})
</script>

<style>
/* ...existing code... */
</style>

