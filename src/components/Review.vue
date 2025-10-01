// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
        <li class="p-4 pb-2 text-lg opacity-100 tracking-wide font-semibold">
            牌谱分析
        </li>

        <li class="p-4 pb-0 text-base opacity-100 tracking-wide">
            <div class="mb-2">鸣谢:</div>
            <div class="text-xs font-semibold opacity-60 mb-2 ml-3">
                此系统由Skyler提供支持与维护，源地址：
            <a href="https://review.bigcoach.work/" target="_blank" rel="noopener">
                <button class="btn-sm btn-link">Link</button>
            </a>
            </div>
        </li>

        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="mb-2">提示:</div>
            <div class="text-xs font-semibold opacity-60 mb-2 ml-3">1. 三人麻将不支持高级模式。</div>
            <div class="text-xs font-semibold opacity-60 mb-2 ml-3">2. 四人麻将的高级模式默认KillerDucky风格，输出更详细和铳数据，需要等待1~2分钟，普通模式速度较快。</div>
        </li>

        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <fieldset class="fieldset ml-0">
                <legend class=" text-base">输入牌谱URL或ID</legend>
                <input type="text" class="input" placeholder="" />
                <p class="label ml-3">
                    自动检测天凤、雀魂、麻雀一番街等格式的四/三麻对局
                </p>
            </fieldset>
        </li>

        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <fieldset class="fieldset ml-0">
                <legend class="text-base">分析视角</legend>
                <select class="select ml-0" aria-label="选择模型">
                    <option>自动检测（由牌谱链接推断）</option>
                    <option>东起</option>
                    <option>南起</option>
                    <option>西起</option>
                    <option>北起（三麻牌谱不适用）</option>
                </select>
            </fieldset>
        </li>

        
        <!-- 设置区域：选择难引擎和模式 -->
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-8">
                <!-- 四麻分析引擎 -->
                <fieldset class="fieldset ml-0 mt-0 flex-1 sm:mt-0">
                    <legend class="text-base">四麻分析引擎</legend>
                    <select class="select ml-0" aria-label="选择模型">
                        <option>Zeus</option>
                        <option>Balance</option>
                        <option>Aggressive</option>
                        <option>Defensive</option>
                    </select>
                </fieldset>
                <!-- 三麻分析引擎 -->
                <fieldset class="fieldset ml-0 mt-4 flex-1 sm:mt-0">
                    <legend class="text-base">三麻分析引擎</legend>
                    <select class="select ml-0" aria-label="选择模型">
                        <option>三叉戟</option>
                    </select>
                </fieldset>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-8">
                <!-- 界面风格 -->
                <fieldset class="fieldset ml-0 mt-4 flex-1">
                    <legend class="text-base">界面风格</legend>
                    <select class="select ml-0" aria-label="选择模型">
                        <option>经典风格</option>
                        <option>KillerDucky风格（测试版）</option>
                    </select>
                </fieldset>
                <!-- 分析模式 -->
                <fieldset class="fieldset ml-0 mt-4 flex-1 sm:mt-4">
                    <legend class="text-base">分析模式</legend>
                    <select class="select ml-0" aria-label="选择语言">
                        <option>标准模式</option>
                        <option>高级模式</option>
                    </select>
                </fieldset>
            </div>
        </li>

        <li class="list-row flex flex-col gap-2">
            <div></div>
            <button class="btn">提交</button>
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    </ul>
</template>

<script setup>
    defineProps(["changeComponent"]);
</script>