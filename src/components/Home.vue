// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/discard" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.discard.aria')">
        <div class="text-sm font-semibold">{{ t('home.cards.discard.title') }}</div>
        <div class="text-xs opacity-80">{{ t('home.cards.discard.desc') }}</div>
        </RouterLink>
      </div>
      <RouterLink to="/discard" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.discard.aria')">
        <button class="btn btn-square btn-ghost" :aria-label="t('home.cards.discard.aria')">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>
    
    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/review" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.review.aria')">
        <div class="text-sm font-semibold">{{ t('home.cards.review.title') }}</div>
        <div class="text-xs opacity-80">{{ t('home.cards.review.desc') }}</div>
        </RouterLink>
      </div>
      <RouterLink to="/review" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.review.aria')">
        <button class="btn btn-square btn-ghost" :aria-label="t('home.cards.review.aria')">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/hand-point-calculator" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.handPointCalculator.aria')">
          <div class="text-sm font-semibold">{{ t('home.cards.handPointCalculator.title') }}</div>
          <div class="text-xs opacity-80">{{ t('home.cards.handPointCalculator.desc') }}</div>
        </RouterLink>
      </div>
      <RouterLink to="/hand-point-calculator" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.handPointCalculator.aria')">
        <button class="btn btn-square btn-ghost" :aria-label="t('home.cards.handPointCalculator.aria')">
          <svg class="size-[1.8em]" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
            </g>
          </svg>
        </button>
      </RouterLink>
    </li>
    
    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/pure-ones-tenpai" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.pureOnesTenpai.aria')">
        <div class="text-sm font-semibold">{{ t('home.cards.pureOnesTenpai.title') }}</div>
        <div class="text-xs opacity-80">{{ t('home.cards.pureOnesTenpai.desc') }}</div>
        </RouterLink>
      </div>
      <RouterLink to="/pure-ones-tenpai" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.pureOnesTenpai.aria')">
        <button class="btn btn-square btn-ghost" :aria-label="t('home.cards.pureOnesTenpai.aria')">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/efficiency-train" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.efficiencyTrain.aria')">
        <div class="text-sm font-semibold">{{ t('home.cards.efficiencyTrain.title') }}</div>
        <div class="text-xs opacity-80">{{ t('home.cards.efficiencyTrain.desc') }}</div>
        </RouterLink>
      </div>
      <RouterLink to="/efficiency-train" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.efficiencyTrain.aria')">
        <button class="btn btn-square btn-ghost" :aria-label="t('home.cards.efficiencyTrain.aria')">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/point-calculation" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.pointCalc.aria')">
        <div class="text-sm font-semibold">{{ t('home.cards.pointCalc.title') }}</div>
        <div class="text-xs opacity-80">{{ t('home.cards.pointCalc.desc') }}</div>
        </RouterLink>
      </div>
      <RouterLink to="/point-calculation" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.pointCalc.aria')">
        <button class="btn btn-square btn-ghost" :aria-label="t('home.cards.pointCalc.aria')">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <!-- 新增：手牌点数计算练习 -->
    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/hand-point-calculation" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.handPointCalc.aria')">
          <div class="text-sm font-semibold">{{ t('home.cards.handPointCalc.title') }}</div>
          <div class="text-xs opacity-80">{{ t('home.cards.handPointCalc.desc') }}</div>
        </RouterLink>
      </div>
      <RouterLink to="/hand-point-calculation" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.handPointCalc.aria')">
        <button class="btn btn-square btn-ghost" :aria-label="t('home.cards.handPointCalc.aria')">
          <svg class="size-[1.8em]" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
            </g>
          </svg>
        </button>
      </RouterLink>
    </li>
    
    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/guide" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.guide.aria')">
        <div class="text-sm font-semibold">{{ t('home.cards.guide.title') }}</div>
        <div class="text-xs opacity-80">{{ t('home.cards.guide.desc') }}</div>
        </RouterLink>
      </div>
      <RouterLink to="/guide" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.guide.aria')">
        <button class="btn btn-square btn-ghost" :aria-label="t('home.cards.guide.aria')">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/basic-terms" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.terms.aria')">
        <div class="text-sm font-semibold">{{ t('home.cards.terms.title') }}</div>
        <div class="text-xs opacity-80">{{ t('home.cards.terms.desc') }}</div>
        </RouterLink>
      </div>
      <RouterLink to="/basic-terms" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.terms.aria')">
        <button class="btn btn-square btn-ghost" :aria-label="t('home.cards.terms.aria')">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/books" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.books.aria')">
        <div class="text-sm font-semibold">{{ t('home.cards.books.title') }}</div>
        <div class="text-xs opacity-80">{{ t('home.cards.books.desc') }}</div>
        </RouterLink>
      </div>
      <RouterLink to="/books" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.books.aria')">
        <button class="btn btn-square btn-ghost" :aria-label="t('home.cards.books.aria')">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>

    <li class="list-row">
      <div></div>
      <div>
        <RouterLink to="/web-dictionary" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.webDictionary.aria')">
        <div class="text-sm font-semibold">{{ t('home.cards.webDictionary.title') }}</div>
        <div class="text-xs opacity-80">{{ t('home.cards.webDictionary.desc') }}</div>
        </RouterLink>
      </div>
      <RouterLink to="/web-dictionary" class="no-underline" style="text-decoration: none;" :aria-label="t('home.cards.webDictionary.aria')">
        <button class="btn btn-square btn-ghost" :aria-label="t('home.cards.webDictionary.aria')">
        <svg class="size-[1.8em]" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="1" fill="none" stroke="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
          </g>
        </svg>
        </button>
      </RouterLink>
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
  </ul>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.no-underline {
  text-decoration: none !important;
}
</style>