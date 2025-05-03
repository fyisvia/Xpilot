// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <!-- <li class="p-4 pb-2 text-lg font-semibold tracking-wide">功能导航</li> -->
        <br>
        <li class="list-row">
            <div></div>
            <div>
              <div @click="changeComponent('Discard')">
                <div class="text-sm font-semibold">牌效率分析</div>
                <div class="text-xs uppercase opacity-80">分析手牌在不同切牌情况下的进张数。</div>
              </div>
            </div>
            <a @click="changeComponent('Discard')" target="_blank" rel="noopener">
              <button class="btn btn-square btn-ghost">
                <svg class="size-[1.8em]" viewBox="0 0 24 24">
                  <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                  </g>
                </svg>
              </button>
            </a>
        </li>
        
        <li class="list-row">
            <div></div>
            <div @click="changeComponent('Upload')">
              <div class="text-sm font-semibold">牌谱分析（未完成）</div>
              <div class="text-xs uppercase opacity-80">结合Xpilot-1.0模型分析雀魂等平台牌谱。</div>
            </div>
            <a @click="changeComponent('Upload')" target="_blank" rel="noopener">
              <button class="btn btn-square btn-ghost">
                <svg class="size-[1.8em]" viewBox="0 0 24 24">
                  <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                  </g>
                </svg>
              </button>
            </a>
        </li>
        <li class="list-row">
            <div></div>
            <div @click="changeComponent('ThreeHundred')">
              <div class="text-sm font-semibold">何切三百问</div>
              <div class="text-xs uppercase opacity-80">《麻将杰作“何切”300选》的线上练习</div>
            </div>
            <a @click="changeComponent('ThreeHundred')" target="_blank" rel="noopener">
              <button class="btn btn-square btn-ghost">
                <svg class="size-[1.8em]" viewBox="0 0 24 24">
                  <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                  </g>
                </svg>
              </button>
            </a>
        </li>
        <li class="list-row">
            <div></div>
            <div @click="changeComponent('PureOnesTenpai')">
              <div class="text-sm font-semibold">清一色听牌练习</div>
              <div class="text-xs uppercase opacity-80">练习门清清一色的听牌快速分析。</div>
            </div>
            <a @click="changeComponent('PureOnesTenpai')" target="_blank" rel="noopener">
              <button class="btn btn-square btn-ghost">
                <svg class="size-[1.8em]" viewBox="0 0 24 24">
                  <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                  </g>
                </svg>
              </button>
            </a>
        </li>
        <li class="list-row">
            <div></div>
            <div @click="changeComponent('PointCalculation')">
              <div class="text-sm font-semibold">点数计算练习</div>
              <div class="text-xs uppercase opacity-80">计算在各种番数符数下的点数计算。</div>
            </div>
            <a @click="changeComponent('PointCalculation')" target="_blank" rel="noopener">
              <button class="btn btn-square btn-ghost">
                <svg class="size-[1.8em]" viewBox="0 0 24 24">
                  <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                  </g>
                </svg>
              </button>
            </a>
        </li>
        <li class="list-row">
            <div></div>
            <div @click="changeComponent('Guide')">
              <div class="text-sm font-semibold">入门到进阶</div>
              <div class="text-xs uppercase opacity-80">日麻从入门到进阶的参考学习路线。</div>
            </div>
            <a @click="changeComponent('Guide')" target="_blank" rel="noopener">
              <button class="btn btn-square btn-ghost">
                <svg class="size-[1.8em]" viewBox="0 0 24 24">
                  <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                  </g>
                </svg>
              </button>
            </a>
        </li>
        <li class="list-row">
            <div></div>
            <div @click="changeComponent('Books')">
              <div class="text-sm font-semibold">公式书合集</div>
              <div class="text-xs uppercase opacity-80">整理了目前b站上大部分的中文译本及国内作品。</div>
            </div>
            <a @click="changeComponent('Books')" target="_blank" rel="noopener">
              <button class="btn btn-square btn-ghost">
                <svg class="size-[1.8em]" viewBox="0 0 24 24">
                  <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                  </g>
                </svg>
              </button>
            </a>
        </li>
        <li class="list-row">
            <div></div>
            <div @click="changeComponent('WebDictionary')">
              <div class="text-sm font-semibold">其他网站</div>
              <div class="text-xs uppercase opacity-80">整理了其他几个日麻的功能性网站。</div>
            </div>
            <a @click="changeComponent('WebDictionary')" target="_blank" rel="noopener">
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
    defineProps(['changeComponent'])

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
</script>