// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-8">
        <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
            MahjongXpilot
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            version: 1.1.3<br><br>
            Copyright © Fyisvia Virell. <br>
            All Rights Reserved.<br>
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="flex items-center space-x-2">
                <span>Github项目地址：</span>
                <a href="https://github.com/fyisvia/Xpilot" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
            欢迎帮忙review代码，提交bug和功能建议。<br><br>
        </li>
        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            1.1.3 版本更新（20250812）<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            本次更新主要内容为：
            <br><br>
            1.修复Shanten函数在特定情况下有误的问题。
            <br><br>
            2.优化牌效率分析对于用户输入手牌的处理逻辑，新增对无摸进牌情况下的进张分析。
        </li>
        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            1.1.2 版本更新（20250703）<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            本次更新主要内容为：
            <br><br>
            1.修复牌效率分析当手牌复杂时，Shanten函数递归深度过大而导致栈溢出的问题。
            <br><br>
            2.新增清一色听牌时选择随机牌型的功能。
            <br><br>
            3.修复部分收录内容错误的问题。
        </li>
        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            1.1.1 版本更新（20250521）<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            本次更新主要内容为：
            <br><br>
            1.新增牌效率分析的好型率显示。
            <br><br>
            2.增大了清一色听牌时选择随机难度时的难度。
            <br><br>
            3.修复部分收录内容错误的问题。
        </li>
        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            1.1.0 版本更新（20250503）<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            本次更新主要内容为：
            <br><br>
            1.新增清一色听牌练习功能。
            <br><br>
            2.新增首页。
            <br><br>
            3.修复了部分UI问题。
            <br><br>
            4.修复了部分收录内容错误的问题。
        </li>
        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            1.0.1 版本更新（20250428）<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            本次更新主要内容为：
            <br><br>
            1.修复了在移动端页面垂直滑动时的卡顿问题。
            <br><br>
            2.修复了部分UI问题。
        </li>
        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            1.0.1 - rc 版本简介（20250427）<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            我很高兴宣布 Xpilot Version 1.0.1-rc 的发布。Xpilot作为专为日本麻将（Riichi Mahjong）设计的功能性网页端，致力于日麻爱好者提供稳定、易用的体验。本次 rc 版本为用户带来了以下主要功能：
            <br><br>
            1.基础功能支持：<br>  
            实现了基本的手牌何切分析功能，何切三百问的练习功能，点数速查和计算练习功能，以及教程列表查看功能。<br>
            <br><br>
            2.用戶界面：<br> 
            提供了一个简洁直观的用户界面，设计上偏向简约风格，方便用户快速上手。包括基本的手牌何切分析、何切三百问、点数计算和教程列表查看功能。
            <br><br>
            3.跨平台兼容性：<br>
            本版本适配pc端页面和移动端页面。
            <br><br>
            4.已知问题：<br>
            作为 rc 版本，可能存在连接不稳定、部分功能和UI未完善或偶现崩溃的问题。何切分析的预期打点功能和何切三百问的收录还没有完成，后续会尽快更新，同时牌谱分析功能也在开发中。
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
    </ul>
</template>