// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
        <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
            <div class="text-lg font-semibold">{{ t('guide.title') }}</div>
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
        <li class="p-4 pb-2 opacity-100 tracking-wide">
            <div class="pl-8 flex items-center space-x-2">
                <span>{{ t('guide.disclaimer') }}</span>
            </div>
            <br>
            <div class="font-semibold">
                {{ t('guide.beginner') }}
            </div>
            <div v-for="resource in guideData.beginner.resources" :key="resource.id" class="pl-8 flex items-center space-x-2">
                <span>{{ resource.id }}. {{ resource.title }}</span>
                <a :href="resource.link" target="_blank" rel="noopener">
                    <button class="btn btn-link">{{ t('contact.link') }}</button>
                </a>
            </div>
        </li>
        <li class="p-4 pb-2 opacity-100 tracking-wide">
            <div class="font-semibold">
                {{ t('guide.advanced') }}
            </div>
            <template v-for="category in guideData.advanced.categories" :key="category.id">
                <br>
                <div class="pl-8 flex items-center space-x-2">
                    <span>{{ category.id }}.{{ category.name }}:</span>
                </div>
                <div v-for="resource in category.resources" :key="resource.id" class="pl-8 flex items-center space-x-2">
                    <span>{{ resource.title }}</span>
                    <a v-if="resource.isExternal" :href="resource.link" target="_blank" rel="noopener">
                        <button class="btn btn-link">{{ $t('contact.link') }}</button>
                    </a>
                    <router-link v-else-if="resource.useRouter" :to="resource.link" class="link no-underline">
                        <button class="btn btn-link">{{ $t('contact.link') }}</button>
                    </router-link>
                    <a v-else @click="changeComponent(resource.component)">
                        <button class="btn btn-link">{{ $t('contact.link') }}</button>
                    </a>
                </div>
            </template>
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    </ul>
</template>

<script setup>
import { guideData } from '../data/guides.js';
import { useI18n } from 'vue-i18n';
defineProps(['changeComponent']);

const { t } = useI18n()
</script>