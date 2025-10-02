// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-8">
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
        <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.title') }}
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            {{ $t('introduce.versionLine', { version: '1.3.0' }) }}<br><br>
            {{ $t('introduce.copyrightLine') }} <br>
            {{ $t('introduce.rightsLine') }}<br>
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="flex items-center space-x-2">
                <span>{{ $t('introduce.repoLabel') }}</span>
                <a href="https://github.com/fyisvia/Xpilot" target="_blank" rel="noopener">
                    <button class="btn btn-link">{{ $t('introduce.repoLinkText') }}</button>
                </a>
            </div>
            {{ $t('introduce.repoWelcome') }}<br><br>
        </li>

        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.changelog.v130.title') }}<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            {{ $t('introduce.changelog.common.intro') }}<br><br>
            {{ $t('introduce.changelog.v130.i1') }}<br><br>
            {{ $t('introduce.changelog.v130.i2') }}
        </li>

        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.changelog.v121.title') }}<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            {{ $t('introduce.changelog.common.intro') }}<br><br>
            {{ $t('introduce.changelog.v121.i1') }}<br><br>
            {{ $t('introduce.changelog.v121.i2') }}
        </li>

        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.changelog.v120.title') }}<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            {{ $t('introduce.changelog.common.intro') }}<br><br>
            {{ $t('introduce.changelog.v120.i1') }}<br><br>
            {{ $t('introduce.changelog.v120.i2') }}
        </li>

        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.changelog.v113.title') }}<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            {{ $t('introduce.changelog.common.intro') }}<br><br>
            {{ $t('introduce.changelog.v113.i1') }}<br><br>
            {{ $t('introduce.changelog.v113.i2') }}
        </li>

        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.changelog.v112.title') }}<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            {{ $t('introduce.changelog.common.intro') }}<br><br>
            {{ $t('introduce.changelog.v112.i1') }}<br><br>
            {{ $t('introduce.changelog.v112.i2') }}<br><br>
            {{ $t('introduce.changelog.v112.i3') }}
        </li>

        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.changelog.v111.title') }}<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            {{ $t('introduce.changelog.common.intro') }}<br><br>
            {{ $t('introduce.changelog.v111.i1') }}<br><br>
            {{ $t('introduce.changelog.v111.i2') }}<br><br>
            {{ $t('introduce.changelog.v111.i3') }}
        </li>

        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.changelog.v110.title') }}<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            {{ $t('introduce.changelog.common.intro') }}<br><br>
            {{ $t('introduce.changelog.v110.i1') }}<br><br>
            {{ $t('introduce.changelog.v110.i2') }}<br><br>
            {{ $t('introduce.changelog.v110.i3') }}<br><br>
            {{ $t('introduce.changelog.v110.i4') }}
        </li>

        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.changelog.v101.title') }}<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            {{ $t('introduce.changelog.common.intro') }}<br><br>
            {{ $t('introduce.changelog.v101.i1') }}<br><br>
            {{ $t('introduce.changelog.v101.i2') }}
        </li>

        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.changelog.rc.title') }}<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            {{ $t('introduce.changelog.rc.preamble') }}<br><br>
            {{ $t('introduce.changelog.rc.s1') }}<br>  
            {{ $t('introduce.changelog.rc.s1b') }}<br><br>
            {{ $t('introduce.changelog.rc.s2') }}<br> 
            {{ $t('introduce.changelog.rc.s2b') }}<br><br>
            {{ $t('introduce.changelog.rc.s3') }}<br>
            {{ $t('introduce.changelog.rc.s3b') }}<br><br>
            {{ $t('introduce.changelog.rc.s4') }}<br>
            {{ $t('introduce.changelog.rc.s4b') }}
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    </ul>
</template>