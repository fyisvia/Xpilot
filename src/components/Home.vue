// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
    <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/discard" class="no-underline" style="text-decoration: none;" aria-label="前往 牌效率分析">
        <div class="text-sm font-semibold">牌效率分析</div>
        <div class="text-xs uppercase opacity-80">分析手牌在不同切牌情况下的进张数。</div>
        </RouterLink>
      </div>
      <RouterLink to="/discard" class="no-underline" style="text-decoration: none;" aria-label="前往 牌效率分析">
        <button class="btn btn-square btn-ghost" aria-label="前往 牌效率分析">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>
    
    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/review" class="no-underline" style="text-decoration: none;" aria-label="前往 牌谱分析（未完成）">
        <div class="text-sm font-semibold">牌谱分析（未完成）</div>
        <div class="text-xs uppercase opacity-80">结合Xpilot-1.0模型分析雀魂等平台牌谱。</div>
        </RouterLink>
      </div>
      <RouterLink to="/review" class="no-underline" style="text-decoration: none;" aria-label="前往 牌谱分析（未完成）">
        <button class="btn btn-square btn-ghost" aria-label="前往 牌谱分析（未完成）">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/three-hundred" class="no-underline" style="text-decoration: none;" aria-label="前往 何切三百问">
        <div class="text-sm font-semibold">何切三百问</div>
        <div class="text-xs uppercase opacity-80">《麻将杰作“何切”300选》的线上练习</div>
        </RouterLink>
      </div>
      <RouterLink to="/three-hundred" class="no-underline" style="text-decoration: none;" aria-label="前往 何切三百问">
        <button class="btn btn-square btn-ghost" aria-label="前往 何切三百问">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/pure-ones-tenpai" class="no-underline" style="text-decoration: none;" aria-label="前往 清一色听牌练习">
        <div class="text-sm font-semibold">清一色听牌练习</div>
        <div class="text-xs uppercase opacity-80">练习门清清一色的听牌快速分析。</div>
        </RouterLink>
      </div>
      <RouterLink to="/pure-ones-tenpai" class="no-underline" style="text-decoration: none;" aria-label="前往 清一色听牌练习">
        <button class="btn btn-square btn-ghost" aria-label="前往 清一色听牌练习">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/point-calculation" class="no-underline" style="text-decoration: none;" aria-label="前往 点数计算练习">
        <div class="text-sm font-semibold">点数计算练习</div>
        <div class="text-xs uppercase opacity-80">计算在各种番数符数下的点数计算。</div>
        </RouterLink>
      </div>
      <RouterLink to="/point-calculation" class="no-underline" style="text-decoration: none;" aria-label="前往 点数计算练习">
        <button class="btn btn-square btn-ghost" aria-label="前往 点数计算练习">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/guide" class="no-underline" style="text-decoration: none;" aria-label="前往 入门到进阶">
        <div class="text-sm font-semibold">入门到进阶</div>
        <div class="text-xs uppercase opacity-80">日麻从入门到进阶的参考学习路线。</div>
        </RouterLink>
      </div>
      <RouterLink to="/guide" class="no-underline" style="text-decoration: none;" aria-label="前往 入门到进阶">
        <button class="btn btn-square btn-ghost" aria-label="前往 入门到进阶">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/books" class="no-underline" style="text-decoration: none;" aria-label="前往 公式书合集">
        <div class="text-sm font-semibold">公式书合集</div>
        <div class="text-xs uppercase opacity-80">整理了目前b站上大部分的中文译本及国内作品。</div>
        </RouterLink>
      </div>
      <RouterLink to="/books" class="no-underline" style="text-decoration: none;" aria-label="前往 公式书合集">
        <button class="btn btn-square btn-ghost" aria-label="前往 公式书合集">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/web-dictionary" class="no-underline" style="text-decoration: none;" aria-label="前往 其他网站">
        <div class="text-sm font-semibold">其他网站</div>
        <div class="text-xs uppercase opacity-80">整理了其他几个日麻的功能性网站。</div>
        </RouterLink>
      </div>
      <RouterLink to="/web-dictionary" class="no-underline" style="text-decoration: none;" aria-label="前往 其他网站">
        <button class="btn btn-square btn-ghost" aria-label="前往 其他网站">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
  </ul>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.no-underline {
  text-decoration: none !important;
}
</style>