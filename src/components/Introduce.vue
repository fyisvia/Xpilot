// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-8">
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
        <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.title') }}
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            {{ $t('introduce.versionLine', { version: '1.5.0' }) }}<br>
            {{ $t('introduce.copyrightLine') }} {{ $t('introduce.rightsLine') }}<br>
            {{ $t('contact.email', { email: 'contact@fyisvia.com' }) }}<br>
            {{ $t('introduce.repoWelcome') }}<br>
            <div class="flex flex-wrap items-center gap-2">
                <span>{{ $t('introduce.specialThanksTitle') }}</span>
                <span>：</span>
                <span class="whitespace-normal break-words">清醒红茶汉化组</span>
                <span class="whitespace-normal break-words ml-2">Skyler</span>
                <span class="whitespace-normal break-words ml-2">a*Z</span>
                <span class="whitespace-normal break-words ml-2">*川</span>
                <span class="whitespace-normal break-words ml-2">*钧</span>
                <span class="whitespace-normal break-words ml-2">lhrg李</span>
            </div>
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="flex items-center space-x-2">
                <span>{{ $t('introduce.repoLabel') }}</span>
                <a href="https://github.com/fyisvia/Xpilot" target="_blank" rel="noopener">
                    <button class="btn btn-link">{{ $t('introduce.repoLinkText') }}</button>
                </a>
                <span>{{ $t('contact.donate') }}</span>
                <a href="#" @click.prevent="scrollToDonate">
                    <button class="btn btn-link">{{ $t('contact.link') }}</button>
                </a>
            </div>
        </li>

        <li aria-hidden="true" role="presentation" class=" m-0 p-4">
            <div class="w-full border-t border-gray-200 dark:border-gray-700 my-4"></div>
        </li>

        <!-- v1.5.0 -->
        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.changelog.v150.title') }}<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            {{ $t('introduce.changelog.common.intro') }}<br><br>
            {{ $t('introduce.changelog.v150.i1') }}<br><br>
            {{ $t('introduce.changelog.v150.i2') }}<br><br>
            {{ $t('introduce.changelog.v150.i3') }}<br><br>
            {{ $t('introduce.changelog.v150.i4') }}<br><br>
            {{ $t('introduce.changelog.v150.i5') }}<br><br>
            {{ $t('introduce.changelog.v150.i6') }}<br><br>
            {{ $t('introduce.changelog.v150.i7') }}
        </li>

        <!-- v1.4.0 -->
        <li class="p-4 pb-2 text-sm font-semibold opacity-100 tracking-wide">
            {{ $t('introduce.changelog.v140.title') }}<br>
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide pl-6">
            {{ $t('introduce.changelog.common.intro') }}<br><br>
            {{ $t('introduce.changelog.v140.i1') }}<br><br>
            {{ $t('introduce.changelog.v140.i2') }}<br><br>
            {{ $t('introduce.changelog.v140.i3') }}
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

        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-2"></li>

        <li aria-hidden="true" role="presentation" class=" m-0 p-4">
            <div class="w-full border-t border-gray-200 dark:border-gray-700 my-4"></div>
        </li>

        <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide w-full sm:w-3/5" ref="qrSection">
            <img src="/photos/QRcode.jpg" :alt="$t('contact.qrcodeAlt')" class="w-full h-auto">
        </li>
        <li class="p-4 pb-2 text-sm opacity-100 tracking-wide font-semibold">
            <span>{{ $t('contact.qrcodeNote') }}</span>
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    </ul>
</template>

<script setup>
import { ref } from 'vue'

const qrSection = ref(null)

const scrollToDonate = () => {
  qrSection.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>