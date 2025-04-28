// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// See the LICENSE file in the project root for full license information.

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <li class="p-4 pb-2 text-lg font-semibold tracking-wide">其他网站</li>
        <br>
        <li class="list-row">
            <div><img class="size-10 rounded-box object-contain" src="/public/photos/Mortal.png"/></div>
            <div>
            <div class="text-sm font-semibold">Mortal AI</div>
            <div class="text-xs uppercase opacity-80">Mortal作者的牌谱检讨网站，使用Mortal等模型分析牌谱。</div>
            </div>
            <!-- <p class="list-col-wrap text-xs">
            </p> -->
            <!-- <button class="btn btn-square btn-ghost">
            <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
            </button> -->
            <button class="btn btn-square btn-ghost" @click="openLinkMortal">
                <svg class="size-[1.8em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                </g>
                </svg>
            </button>
        </li>
        
        <li class="list-row">
            <div><img class="size-10 rounded-box object-contain" src="/public/photos/NAGA.png"/></div>
            <div>
            <div class="text-sm font-semibold">NAGA AI</div>
            <div class="text-xs uppercase opacity-80">NAGA AI牌谱检讨网站，使用NAGA分析牌谱。准确度稍高，但没有适配中文。</div>
            </div>
            <!-- <p class="list-col-wrap text-xs">
            </p> -->
            <!-- <button class="btn btn-square btn-ghost">
            <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
            </button> -->
            <button class="btn btn-square btn-ghost" @click="openLinkNAGA">
                <svg class="size-[1.8em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                </g>
                </svg>
            </button>
        </li>
        <li class="list-row">
            <div><img class="size-10 rounded-box object-contain" src="/public/mahjongfiles/1z.png"/></div>
            <div>
            <div class="text-sm font-semibold">麻将弃牌模拟器</div>
            <div class="text-xs uppercase opacity-80">更加完善的何切模拟器，C++编写的开源项目。</div>
            </div>
            <!-- <p class="list-col-wrap text-xs">
            </p> -->
            <!-- <button class="btn btn-square btn-ghost">
            <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
            </button> -->
            <button class="btn btn-square btn-ghost" @click="openLinkPystyle">
                <svg class="size-[1.8em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                </g>
                </svg>
            </button>
        </li>
        <li class="list-row">
            <div><img class="size-10 rounded-box object-contain" src="/public/photos/logo-DnybafUn.png"/></div>
            <div>
            <div class="text-sm font-semibold">雀庄公式战</div>
            <div class="text-xs uppercase opacity-80">健康麻将联合，线下公式战雀庄导航及战绩。</div>
            </div>
            <!-- <p class="list-col-wrap text-xs">
            </p> -->
            <!-- <button class="btn btn-square btn-ghost">
            <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
            </button> -->
            <button class="btn btn-square btn-ghost" @click="openLinkRmlinking">
                <svg class="size-[1.8em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                </g>
                </svg>
            </button>
        </li>
        <li class="list-row">
            <div><img class="size-10 rounded-box object-contain" src="/public/photos/ZS2yckce.jpg"/></div>
            <div>
            <div class="text-sm font-semibold">雀魂牌谱屋</div>
            <div class="text-xs uppercase opacity-80">雀魂第三方牌谱数据库，提供金之间及以上每日对局牌谱和统计数据</div>
            </div>
            <!-- <p class="list-col-wrap text-xs">
            </p> -->
            <!-- <button class="btn btn-square btn-ghost">
            <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
            </button> -->
            <button class="btn btn-square btn-ghost" @click="openLinkAmae">
                <svg class="size-[1.8em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                </g>
                </svg>
            </button>
        </li>
        <br>
    </ul>
</template>

<script setup>
function openLinkMortal() {
  // Ensure window is available (browser environment)
  if (typeof window !== 'undefined') {
    window.open('https://mjai.ekyu.moe/zh-cn.html', '_blank');
  }
}function openLinkNAGA() {
  // Ensure window is available (browser environment)
  if (typeof window !== 'undefined') {
    window.open('https://naga.dmv.nico/naga_report/top/', '_blank');
  }
}
function openLinkPystyle() {
  // Ensure window is available (browser environment)
  if (typeof window !== 'undefined') {
    window.open('https://pystyle.info/apps/mahjong-nanikiru-simulator/', '_blank');
  }
}
function openLinkRmlinking() {
  // Ensure window is available (browser environment)
  if (typeof window !== 'undefined') {
    window.open('https://gsz.rmlinking.com/#/', '_blank');
  }
}
function openLinkAmae() {
  // Ensure window is available (browser environment)
  if (typeof window !== 'undefined') {
    window.open('https://amae-koromo.sapk.ch/', '_blank');
  }
}
</script>