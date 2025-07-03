// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
    <li class="p-4 pb-2 text-lg font-semibold tracking-wide">其他网站</li>
    <br>
    <li v-for="site in sites" :key="site.name" class="list-row">
      <div>
        <img class="size-10 rounded-box object-contain" :src="site.img" />
      </div>
      <div>
        <div class="text-sm font-semibold">{{ site.name }}</div>
        <div class="text-xs uppercase opacity-80">{{ site.desc }}</div>
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
    <br>
  </ul>
</template>

<script setup>
import { sites } from '../data/sites'
</script>