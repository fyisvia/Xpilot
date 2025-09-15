// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <li class="p-4 pb-2 text-lg opacity-100 tracking-wide font-semibold">
            牌谱分析（未完成）
        </li>

        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="mb-2">提示:</div>
            <div class="text-xs font-semibold opacity-60 mb-2 ml-6">1. 只能分析四麻牌谱</div>
            <div class="text-xs font-semibold opacity-60 mb-2 ml-6">2. 仅适用于标准公式战规则</div>
            <div class="text-xs font-semibold opacity-60 mb-2 ml-6">3. 使用Xpilot模型时，仅适用于南场半庄战</div>
        </li>

        <li class="list-row flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <input
                    type="radio"
                    name="radio-uploadmethod"
                    class="radio radio-xs"
                    checked="checked"
                    aria-label="使用牌谱URL"
                />
                <span class="p-0 pb-0 text-base opacity-100 tracking-wide">
                    牌谱 URL (天凤，雀魂)
                </span>
            </div>
            <label class="input flex w-full" style="display: flex; width: 100%;">
                <span class="label" style="flex-shrink: 0; margin-right: 8px;">
                    https://
                </span>
                <input type="text" placeholder="URL" style="flex-grow: 1;" aria-label="牌谱URL" />
            </label>
        </li>

        <li class="list-row flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <input
                    type="radio"
                    name="radio-uploadmethod"
                    class="radio radio-xs"
                    checked="checked"
                    aria-label="使用 Riichi City Log ID"
                />
                <span class="p-0 pb-0 text-base opacity-100 tracking-wide">
                    Riichi City log ID
                </span>
            </div>
            <input type="text" placeholder="Type here" class="input" aria-label="Riichi City log ID" />
        </li>

        <li class="list-row flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <input
                    type="radio"
                    name="radio-uploadmethod"
                    class="radio radio-xs"
                    checked="checked"
                    aria-label="使用 Hime Mahjong Log ID"
                />
                <span class="p-0 pb-0 text-base opacity-100 tracking-wide">
                    Hime Mahjong log ID
                </span>
            </div>
            <input type="text" placeholder="Type here" class="input" aria-label="Hime Mahjong log ID" />
        </li>

        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <fieldset class="fieldset ml-0">
                <legend class="text-base">模型</legend>
                <select class="select ml-0" aria-label="选择模型">
                    <option>Xpilot-1.0</option>
                    <!-- <option>Xpilot-2.0</option>
                    <option>Xpilot-2.1</option> -->
                </select>
                <span class="label ml-3">Optional</span>
            </fieldset>
        </li>

        <li class="p-4 pb-0 text-base opacity-100 tracking-wide">
            <fieldset class="fieldset ml-0">
                <legend class="text-base">语言</legend>
                <select class="select ml-0" aria-label="选择语言">
                    <option>English</option>
                    <option>Chinese (simplified)</option>
                    <option>Japanese</option>
                </select>
                <span class="label ml-3">Optional</span>
            </fieldset>
        </li>

        <li class="list-row flex flex-col gap-2">
            <div></div>
            <button class="btn">提交</button>
        </li>
    </ul>
</template>

<script setup>
    defineProps(["changeComponent"]);
</script>