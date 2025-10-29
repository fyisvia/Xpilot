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
      <div v-for="category in books" :key="category.category">
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
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
  </ul>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { books } from '../data/books'
const { t } = useI18n()
</script>