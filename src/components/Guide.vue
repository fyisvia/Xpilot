// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
            <div class="text-lg font-semibold">入门到进阶</div>
        </li>
        <br>
        <li class="p-4 pb-2 opacity-100 tracking-wide">
            <div class="pl-8 flex items-center space-x-2">
                <span>声明：本文中的资料整理仅出于非商业性的学习交流目的，一切权利归原作者所有。</span>
            </div>
            <br>
            <div class="font-semibold">
                入门
            </div>
            <div class="pl-8 flex items-center space-x-2">
                <span>1.  《基本规则篇》星野Poteto</span>
                <a href="https://b23.tv/zcyuy63" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
            <div class="pl-8 flex items-center space-x-2">
                <span>2. 《麻将手役大全》ZERO</span>
                <a href="https://www.bilibili.com/read/readlist/rl411847" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
        </li>
        <li class="p-4 pb-2 opacity-100 tracking-wide">
            <div class="font-semibold">
                进阶
            </div>
            <br>
            <div class="pl-8 flex items-center space-x-2">
                <span>1.牌效:</span>
            </div>
            <div class="pl-8 flex items-center space-x-2">
                <span>《麻将技术教科书：有效率的和牌方法》小林刚/井出洋介</span>
                <a href="https://www.bilibili.com/read/readlist/rl480264" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
            <div class="pl-8 flex items-center space-x-2">
                <span>《麻将学习·牌效率》G·Uzaku</span>
                <a href="https://www.bilibili.com/read/readlist/rl509592" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
            <br>
            <div class="pl-8 flex items-center space-x-2">
                <span>2.攻防判断：</span>
            </div>
            <div class="pl-8 flex items-center space-x-2">
                <span>《统计学麻将战术》みーにん</span>
                <a href="https://www.bilibili.com/read/readlist/rl97988" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
            <br>
            <div class="pl-8 flex items-center space-x-2">
                <span>3.防守：</span>
            </div>
            <div class="pl-8 flex items-center space-x-2">
                <span>《麻将技术教科书：不会放铳的打法》小林刚/井出洋介</span>
                <a href="https://www.bilibili.com/read/readlist/rl398453" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
            <br>
            <div class="pl-8 flex items-center space-x-2">
                <span>4.何切：</span>
            </div>
            <div class="pl-8 flex items-center space-x-2">
                <span>《麻将杰作“何切”300选》福地诚/G·Uzaku （何切三百问）</span>
                <a @click="changeComponent('ThreeHundred')">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
            <div class="pl-8 flex items-center space-x-2">
                <span>《麻将定式“何切”301选》福地诚/G·Uzaku</span>
                <a href="https://www.bilibili.com/read/readlist/rl493079" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
            <div class="pl-8 flex items-center space-x-2">
                <span>《麻将的二择》みーにん、梶本琢程</span>
                <a href="https://www.bilibili.com/read/readlist/rl116320" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>

        </li>
        <br>
    </ul>
</template>

<script setup>
    defineProps(['changeComponent'])
</script>