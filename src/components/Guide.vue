// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
            <div class="text-lg font-semibold">{{ guideData.title }}</div>
        </li>
        <br>
        <li class="p-4 pb-2 opacity-100 tracking-wide">
            <div class="pl-8 flex items-center space-x-2">
                <span>{{ guideData.disclaimer }}</span>
            </div>
            <br>
            <div class="font-semibold">
                {{ guideData.beginner.title }}
            </div>
            <div v-for="resource in guideData.beginner.resources" :key="resource.id" class="pl-8 flex items-center space-x-2">
                <span>{{ resource.id }}. {{ resource.title }}</span>
                <a :href="resource.link" target="_blank" rel="noopener">
                    <button class="btn btn-link">Link</button>
                </a>
            </div>
        </li>
        <li class="p-4 pb-2 opacity-100 tracking-wide">
            <div class="font-semibold">
                {{ guideData.advanced.title }}
            </div>
            <template v-for="category in guideData.advanced.categories" :key="category.id">
                <br>
                <div class="pl-8 flex items-center space-x-2">
                    <span>{{ category.id }}.{{ category.name }}:</span>
                </div>
                <div v-for="resource in category.resources" :key="resource.id" class="pl-8 flex items-center space-x-2">
                    <span>{{ resource.title }}</span>
                    <a v-if="resource.isExternal" :href="resource.link" target="_blank" rel="noopener">
                        <button class="btn btn-link">Link</button>
                    </a>
                    <router-link v-else-if="resource.useRouter" :to="resource.link" class="link no-underline">
                        <button class="btn btn-link">Link</button>
                    </router-link>
                    <a v-else @click="changeComponent(resource.component)">
                        <button class="btn btn-link">Link</button>
                    </a>
                </div>
            </template>
        </li>
        <br>
    </ul>
</template>

<script setup>
import { guideData } from '../data/guides.js';

defineProps(['changeComponent']);
</script>