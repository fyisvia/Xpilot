// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
  <div class="mx-auto max-w-5xl sm:px-4 sm:py-8">

    <div class="bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8 text-base-content">
      <div class="p-4 sm:py-8">
        
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="card-title text-xl sm:text-2xl font-bold mb-2">{{ $t('introduce.title') }}</h1>
            <div class="text-sm sm:text-base opacity-80 space-y-1">
              <p class="font-mono">v1.6.0</p>
              <p>{{ $t('introduce.copyrightLine') }} {{ $t('introduce.rightsLine') }}</p>
              <p>{{ $t('contact.email', { email: 'contact@fyisvia.com' }) }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <a href="https://github.com/fyisvia/Xpilot" target="_blank" class="btn btn-primary btn-sm md:btn-md gap-2 rounded-btn text-xs sm:text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>

        <div class="mt-4 p-4 bg-base-200 rounded-box">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm sm:text-base font-bold whitespace-nowrap">{{ $t('introduce.specialThanksTitle') }}:</span>
            <div class="flex flex-wrap gap-0 text-xs sm:text-sm">
              <div class="badge badge-ghost">清醒红茶汉化组</div>
              <div class="badge badge-ghost">Skyler</div>
              <div class="badge badge-ghost">lhrg李</div>
              <div class="badge badge-ghost">朱华</div>
              <div class="badge badge-ghost">真白の猫</div>
              <div class="badge badge-ghost">空银子</div>
              <div class="badge badge-ghost">絕好调</div>
              <div class="badge badge-ghost">周可儿</div>
              <div class="badge badge-ghost">云岭茉莉白</div>
              <div class="badge badge-ghost">谎言の火花</div>
              <div class="badge badge-ghost">其余匿名支持者</div>
            </div>
          </div>
        </div>

        <div class="divider opacity-60"></div>
        
        <!-- Changelog Section -->
        <h2 class="card-title text-base sm:text-lg mb-6 flex items-center gap-2 font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ $t('introduce.changelog.title') }}
        </h2>
        
        <div class="space-y-8 pl-2">
          
          <ReleaseItem version="v1.6.0" :title="$t('introduce.changelog.v160.title')" current>
            <p class="mb-2 italic text-xs sm:text-sm opacity-80">{{ $t('introduce.changelog.common.intro') }}</p>
            <ul class="list-disc list-outside ml-5 space-y-1 text-xs sm:text-sm opacity-80">
              <li>{{ $t('introduce.changelog.v160.i1') }}</li>
              <li>{{ $t('introduce.changelog.v160.i2') }}</li>
              <li>{{ $t('introduce.changelog.v160.i3') }}</li>
              <li>{{ $t('introduce.changelog.v160.i4') }}</li>
              <li>{{ $t('introduce.changelog.v160.i5') }}</li>
              <li>{{ $t('introduce.changelog.v160.i6') }}</li>
            </ul>
          </ReleaseItem>

          <ReleaseItem version="v1.5.0" :title="$t('introduce.changelog.v150.title')">
            <p class="mb-2 italic text-xs sm:text-sm opacity-80">{{ $t('introduce.changelog.common.intro') }}</p>
            <ul class="list-disc list-outside ml-5 space-y-1 text-xs sm:text-sm opacity-80">
              <li>{{ $t('introduce.changelog.v150.i1') }}</li>
              <li>{{ $t('introduce.changelog.v150.i2') }}</li>
              <li>{{ $t('introduce.changelog.v150.i3') }}</li>
              <li>{{ $t('introduce.changelog.v150.i4') }}</li>
              <li>{{ $t('introduce.changelog.v150.i5') }}</li>
              <li>{{ $t('introduce.changelog.v150.i6') }}</li>
              <li>{{ $t('introduce.changelog.v150.i7') }}</li>
            </ul>
          </ReleaseItem>

          <ReleaseItem version="v1.4.0" :title="$t('introduce.changelog.v140.title')">
             <p class="mb-2 italic text-xs sm:text-sm opacity-80">{{ $t('introduce.changelog.common.intro') }}</p>
             <ul class="list-disc list-outside ml-5 space-y-1 text-xs sm:text-sm opacity-80">
              <li>{{ $t('introduce.changelog.v140.i1') }}</li>
              <li>{{ $t('introduce.changelog.v140.i2') }}</li>
              <li>{{ $t('introduce.changelog.v140.i3') }}</li>
             </ul>
          </ReleaseItem>

          <ReleaseItem version="v1.3.0" :title="$t('introduce.changelog.v130.title')">
             <p class="mb-2 italic text-xs sm:text-sm opacity-80">{{ $t('introduce.changelog.common.intro') }}</p>
             <ul class="list-disc list-outside ml-5 space-y-1 text-xs sm:text-sm opacity-80">
              <li>{{ $t('introduce.changelog.v130.i1') }}</li>
              <li>{{ $t('introduce.changelog.v130.i2') }}</li>
             </ul>
          </ReleaseItem>

          <ReleaseItem version="v1.2.1" :title="$t('introduce.changelog.v121.title')">
             <p class="mb-2 italic text-xs sm:text-sm opacity-80">{{ $t('introduce.changelog.common.intro') }}</p>
             <ul class="list-disc list-outside ml-5 space-y-1 text-xs sm:text-sm opacity-80">
              <li>{{ $t('introduce.changelog.v121.i1') }}</li>
              <li>{{ $t('introduce.changelog.v121.i2') }}</li>
             </ul>
          </ReleaseItem>

          <ReleaseItem version="v1.2.0" :title="$t('introduce.changelog.v120.title')">
             <p class="mb-2 italic text-xs sm:text-sm opacity-80">{{ $t('introduce.changelog.common.intro') }}</p>
             <ul class="list-disc list-outside ml-5 space-y-1 text-xs sm:text-sm opacity-80">
              <li>{{ $t('introduce.changelog.v120.i1') }}</li>
              <li>{{ $t('introduce.changelog.v120.i2') }}</li>
             </ul>
          </ReleaseItem>

          <ReleaseItem version="v1.1.3" :title="$t('introduce.changelog.v113.title')">
             <p class="mb-2 italic text-xs sm:text-sm opacity-80">{{ $t('introduce.changelog.common.intro') }}</p>
             <ul class="list-disc list-outside ml-5 space-y-1 text-xs sm:text-sm opacity-80">
              <li>{{ $t('introduce.changelog.v113.i1') }}</li>
              <li>{{ $t('introduce.changelog.v113.i2') }}</li>
             </ul>
          </ReleaseItem>

           <ReleaseItem version="v1.1.2" :title="$t('introduce.changelog.v112.title')">
             <p class="mb-2 italic text-xs sm:text-sm opacity-80">{{ $t('introduce.changelog.common.intro') }}</p>
             <ul class="list-disc list-outside ml-5 space-y-1 text-xs sm:text-sm opacity-80">
              <li>{{ $t('introduce.changelog.v112.i1') }}</li>
              <li>{{ $t('introduce.changelog.v112.i2') }}</li>
              <li>{{ $t('introduce.changelog.v112.i3') }}</li>
             </ul>
          </ReleaseItem>

          <ReleaseItem version="v1.1.1" :title="$t('introduce.changelog.v111.title')">
             <p class="mb-2 italic text-xs sm:text-sm opacity-80">{{ $t('introduce.changelog.common.intro') }}</p>
             <ul class="list-disc list-outside ml-5 space-y-1 text-xs sm:text-sm opacity-80">
              <li>{{ $t('introduce.changelog.v111.i1') }}</li>
              <li>{{ $t('introduce.changelog.v111.i2') }}</li>
              <li>{{ $t('introduce.changelog.v111.i3') }}</li>
             </ul>
          </ReleaseItem>

          <ReleaseItem version="v1.1.0" :title="$t('introduce.changelog.v110.title')">
             <p class="mb-2 italic text-xs sm:text-sm opacity-80">{{ $t('introduce.changelog.common.intro') }}</p>
             <ul class="list-disc list-outside ml-5 space-y-1 text-xs sm:text-sm opacity-80">
              <li>{{ $t('introduce.changelog.v110.i1') }}</li>
              <li>{{ $t('introduce.changelog.v110.i2') }}</li>
              <li>{{ $t('introduce.changelog.v110.i3') }}</li>
              <li>{{ $t('introduce.changelog.v110.i4') }}</li>
             </ul>
          </ReleaseItem>

          <ReleaseItem version="v1.0.1" :title="$t('introduce.changelog.v101.title')">
             <p class="mb-2 italic text-xs sm:text-sm opacity-80">{{ $t('introduce.changelog.common.intro') }}</p>
             <ul class="list-disc list-outside ml-5 space-y-1 text-xs sm:text-sm opacity-80">
              <li>{{ $t('introduce.changelog.v101.i1') }}</li>
              <li>{{ $t('introduce.changelog.v101.i2') }}</li>
             </ul>
          </ReleaseItem>

          <ReleaseItem version="RC" :title="$t('introduce.changelog.rc.title')">
            <p class="mb-2 text-xs sm:text-sm opacity-80">{{ $t('introduce.changelog.rc.preamble') }}</p>
            <ul class="list-disc list-outside ml-5 space-y-2 text-xs sm:text-sm opacity-80">
              <li>
                {{ $t('introduce.changelog.rc.s1') }}<br>
                <span>{{ $t('introduce.changelog.rc.s1b') }}</span>
              </li>
              <li>
                {{ $t('introduce.changelog.rc.s2') }}<br>
                <span>{{ $t('introduce.changelog.rc.s2b') }}</span>
              </li>
              <li>
                {{ $t('introduce.changelog.rc.s3') }}<br>
                <span>{{ $t('introduce.changelog.rc.s3b') }}</span>
              </li>
              <li>
                {{ $t('introduce.changelog.rc.s4') }}<br>
                <span>{{ $t('introduce.changelog.rc.s4b') }}</span>
              </li>
            </ul>
          </ReleaseItem>

        </div>
        
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { h } from 'vue'

// Simple functional component for release items to reduce code duplication in template
const ReleaseItem = (props, { slots }) => {
    return h('div', { class: 'relative pl-8 border-l-2 border-base-300' }, [
        h('div', { class: `absolute -left-[9px] top-0 w-4 h-4 rounded-full ${props.current ? 'bg-primary ring-4 ring-base-100' : 'bg-base-300'}` }),
        h('div', { class: 'mb-1 flex items-center gap-2' }, [
             h('span', { class: `font-mono text-xs sm:text-sm font-bold px-2 py-0.5 rounded ${props.current ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/70'}` }, props.version),
             h('h3', { class: 'text-xs sm:text-sm font-bold' }, props.title)
        ]),
        h('div', { class: '' }, slots.default ? slots.default() : [])
    ])
}
</script>