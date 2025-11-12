// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    <li class="p-4 pb-2 text-lg font-semibold tracking-wide">{{ t('webDictionary.title') }}</li>
    <br>
    <li v-for="site in sites" :key="site.key" class="list-row">
      <div>
        <img class="size-10 rounded-box object-contain" :src="site.img" :alt="t(`webDictionary.sites.${site.key}.name`)"/>
      </div>
      <div>
        <div class="text-sm font-semibold">{{ t(`webDictionary.sites.${site.key}.name`) }}</div>
        <div class="text-xs opacity-80">{{ t(`webDictionary.sites.${site.key}.desc`) }}</div>
      </div>
      <a :href="site.url" target="_blank" rel="noopener">
        <button class="btn btn-square btn-ghost">
          <svg class="size-[1.8em]" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
            </g>
          </svg>
        </button>
      </a>
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
  </ul>
</template>

<script setup>
import { sites } from '../data/sites'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>