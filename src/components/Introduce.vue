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
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    </ul>
</template>

<script setup>
import { ref } from 'vue'

const qrSection = ref(null)

</script>