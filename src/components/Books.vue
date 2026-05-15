// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
      <div class="text-lg font-semibold">{{ t('booksPage.title') }}</div>
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
    <li class="p-4 pb-2 opacity-100 tracking-wide">
      <div class="pl-8 flex items-center space-x-2">
        <span>{{ t('booksPage.disclaimer') }}</span>
      </div>
      <div class="pl-8 flex items-center space-x-2">
        <span>{{ t('booksPage.sortNote') }}</span>
      </div>
      <br>
      <div class="pl-8 flex items-center space-x-2">
        <span>{{ t('booksPage.referenceText', { upname:'@南极大熊熊'}) }}</span>
        <a href="https://b23.tv/GgFnuih" target="_blank" rel="noopener">
          <button class="btn btn-link">{{ t('contact.link') }}</button>
        </a>
      </div>
      <div class="pl-8 flex items-center space-x-2">
        <span>{{ t('booksPage.contact', { email: 'contact@fyisvia.com' }) }}</span>
      </div>
      <br>
    </li>
    <li class="p-4 pb-2 opacity-100 tracking-wide">
      <div class="pl-8 flex items-center space-x-2">
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
            :placeholder="t('booksPage.searchPlaceholder', '输入书名或作者以搜索')"
            class="grow"
            type="search"
          />
        </label>
      </div>
    </li>
    <li class="p-4 pb-2 opacity-100 tracking-wide">
      <template v-if="filteredBooks.length">
        <div v-for="category in filteredBooks" :key="category.category">
        <div class="font-semibold mt-4 mb-2">
          {{ t('books.categories.' + category.category, category.category) }}
        </div>
        <div
          v-for="(book, idx) in category.list"
          :key="book.title + idx"
          class="pl-8 flex items-center space-x-2"
        >
          <span>{{ idx + 1 }}. {{ book.title }}</span>
          <a :href="book.url" target="_blank" rel="noopener">
            <button class="btn btn-link">{{ t('contact.link') }}</button>
          </a>
        </div>
      </div>
      </template>
      <div v-else class="pl-8 text-sm sm:text-base text-base-content/70">
        {{ t('booksPage.noResult', '未找到匹配的内容') }}
      </div>
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
  </ul>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { books } from '../data/books'

const { t } = useI18n()

const keyword = ref('')

const filteredBooks = computed(() => {
  if (!keyword.value) return books
  const kw = keyword.value.toLowerCase()
  return books
    .map(category => ({
      ...category,
      list: category.list.filter(book => book.title.toLowerCase().includes(kw))
    }))
    .filter(category => category.list.length > 0)
})
</script>