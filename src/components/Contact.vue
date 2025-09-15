// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-8">
        <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
            联系作者
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            Email: fyisvia@gmail.com
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="flex items-center space-x-2">
                <span>Github主页：</span>
                <a href="https://github.com/fyisvia" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="flex items-center space-x-2">
                <span>Bilibili主页：</span>
                <a href="https://b23.tv/ErKXzIV" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="flex items-center space-x-2">
                <span>小黑盒主页：</span>
                <a href="https://web.xiaoheihe.cn/bbs/user_profile_share?user_id=809b6a5a9524" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            赞助：
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide w-full sm:w-3/5">
            <img src="/photos/QRcode.jpg" alt="赞助二维码" class="w-full h-auto">
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
    </ul>
</template>