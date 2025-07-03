// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<script setup>
import { books } from '../data/books'
</script>

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
    <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
      <div class="text-lg font-semibold">战术书链接合集</div>
    </li>
    <br>
    <li class="p-4 pb-2 opacity-100 tracking-wide">
      <div class="pl-8 flex items-center space-x-2">
        <span>声明：本文中的资料整理仅出于非商业性的学习交流目的，一切权利归原作者所有，请支持原作者/译者。</span>
      </div>
      <div class="pl-8 flex items-center space-x-2">
        <span>以下文章均按拼音首字排序。</span>
      </div>
      <br>
      <div class="pl-8 flex items-center space-x-2">
        <span>本合集整理参考自Bilibili up主@南极大熊熊</span>
        <a href="https://b23.tv/GgFnuih" target="_blank" rel="noopener">
          <button class="btn btn-link">Link</button>
        </a>
      </div>
      <div class="pl-8 flex items-center space-x-2">
        <span>如有侵权，请随时发邮件至fyisvia@gmail.com</span>
      </div>
      <br>
      <div v-for="category in books" :key="category.category">
        <div class="font-semibold mt-4 mb-2">{{ category.category }}</div>
        <div v-for="(book, idx) in category.list" :key="book.title + idx" class="pl-8 flex items-center space-x-2">
          <span>{{ idx + 1 }}. {{ book.title }}</span>
          <a :href="book.url" target="_blank" rel="noopener">
            <button class="btn btn-link">Link</button>
          </a>
        </div>
      </div>
    </li>
    <br>
  </ul>
</template>