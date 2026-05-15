// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
        <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
            <div class="text-lg font-semibold">{{ t('navbar.items.basicTerms') }}</div>
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
        <li class="p-4 pb-2 opacity-100 tracking-wide">
            <div class="pl-4 flex items-center space-x-2">
                <span>{{ t('guide.disclaimer') }}</span>
            </div>
            <br>
            <div class="pl-4 flex items-center space-x-2">
                <span>作者：清醒红茶汉化组</span>
            </div>
            <div class="pl-4 flex items-center space-x-2">
                <span>{{ t('booksPage.contact', { email: 'contact@fyisvia.com' }) }}</span>
            </div>
        </li>

        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
        <li class="p-4 pb-2 opacity-100 tracking-wide">
            <div class="pl-4 flex items-center space-x-2">
                <label class="input items-center gap-2 sm:max-w-md">
                    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        stroke-width="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input
                    v-model.trim="keyword"
                    :placeholder="t('basicTerms.searchPlaceholder', '输入术语或关键词以搜索')"
                    class="grow"
                    type="search"
                    />
                </label>
            </div>
        </li>
        <li class="p-4 pb-2 opacity-100 tracking-wide divide-y divide-base-content/10">
            <template v-if="filteredTerms.length">
                <article
                v-for="term in filteredTerms"
                :key="term.id"
                class="p-4 sm:p-6 space-y-3"
                >
                <h2 class="text-sm sm:text-base">
                    {{ term.id }}. {{ term.title }}
                </h2>
                <p
                    v-for="(line, idx) in term.lines"
                    :key="`${term.id}-${idx}`"
                    class="text-xs sm:text-sm leading-relaxed text-base-content/80"
                >
                    {{ line }}
                </p>
                </article>
            </template>
            <div v-else class="p-8 text-center text-sm sm:text-base text-base-content/70">
                {{ t('basicTerms.noResult', '未找到匹配的内容') }}
            </div>
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    </ul>
  
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { terms } from '../data/terms'

const { t } = useI18n()

const keyword = ref('')

const filteredTerms = computed(() => {
  if (!keyword.value) return terms
  const kw = keyword.value.toLowerCase()
  return terms.filter(term => {
    if (term.title.toLowerCase().includes(kw)) return true
    return term.lines.some(line => line.toLowerCase().includes(kw))
  })
})
</script>
