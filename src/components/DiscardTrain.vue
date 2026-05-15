// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-full px-2 sm:px-8">
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
      {{ t('navbar.items.threeHundredOne') }}
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>

    <li class="p-4 pb-0 text-base opacity-100 tracking-wide">
      <div class="mb-2">{{ $t("review.thanks") }} 此题库由 Fyisvia, 斯布林, Astro, Zerol Acqua, shiRoha
        <!--  慢慢腐烂 -->
        共同参与整理修订。

      </div>
    </li>

    <!-- 新增：仅在小屏显示提交方式选择 -->
    <li v-if="isSmallScreen" class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-8">
        <fieldset class="fieldset ml-0 flex-1">
          <legend class="text-base">{{ t('efficiencyTrain.settings.submitModeLegend') }}</legend>
          <select
            class="select ml-0 w-full sm:w-auto"
            v-model="submitMode"
            :disabled="!isSmallScreen"
          >
            <option
              v-for="option in submitModeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </fieldset>
      </div>
    </li>
 
    <li ref="questionNumberRef" class="question-number p-4 pb-2 text-lg sm:text-xl opacity-100 tracking-wide">
      {{ t('threeHundred.labels.no') }} {{ currentArticle.id }}
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 h-4"></li>
    <li class="p-4 sm:p-4 pb-2 text-lg sm:text-xl opacity-100 tracking-wide" :style="contentWidthStyle">
      <div class="flex flex-col items-start">
        <a class="mb-2">[ {{ currentArticle.round }} ]</a>
        <div class="flex flex-row space-x-0">
          <img
            v-for="img in currentArticle.images1"
            :key="img"
            :src="img"
            alt=""
            class="flex-shrink-0 object-contain"
            :style="{
              width: 'calc(100% / 14.333)',
              height: 'calc((100% / 14.333) * 1.5)'
            }"
          >
        </div>
      </div>
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
    <li class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide" :style="contentWidthStyle">
      <div class="flex flex-nowrap justify-start" style="gap: 0;">
        <template v-for="(img, index) in currentArticle.images2" :key="img + '-' + index">
          <div class="relative group" style="width: calc(100% / 14);">
            <img
              :src="img"
              alt=""
              class="flex-shrink-0 object-contain transition-transform duration-150 group-active:scale-95 group-hover:scale-110"
              :style="{
                width: '100%',
                height: 'calc(1.5 * 100%)',
                // 新增：按钮提交模式下，已选择牌变灰
                filter: (isSmallScreen && submitMode === 'button' && selectedAnswer === img) ? 'grayscale(100%) brightness(0.9)' : undefined,
                opacity: (isSmallScreen && submitMode === 'button' && selectedAnswer === img) ? '0.8' : undefined
              }"
            />
            <button
              class="absolute inset-0 w-full h-full opacity-0 hover:opacity-50 transition-opacity duration-300"
              @click="handleImageClick(img)"
              tabindex="-1"
              :aria-label="t('threeHundred.aria.selectAnswer')"
              style="pointer-events: auto;"
            ></button>
          </div>
        </template>
      </div>
    </li>
    <li class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide" :style="contentWidthStyle">
      <div class="flex flex-nowrap justify-end" style="gap: 0;">
        <template v-for="(img, index) in currentArticle.images3" :key="img + '-' + index">
          <img
            :src="img"
            alt=""
            class="flex-shrink-0 object-contain"
            :class="{ 'first-image': index === 0 }"
            :style="{
              width: `calc(100% / (${currentArticle.images2.length} + 1/3))`,
              height: 'calc((100% / 14.333) * 1.5)',
              marginRight: index === currentArticle.images2.length - 2 ? `calc((100% / (${currentArticle.images2.length} + 1/3)) / 3)` : '0'
            }"
          >
        </template>
      </div>
    </li>
    <li class="p-0 sm:p-4 pb-0 sm:pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide" :style="contentWidthStyle">
      <div class="flex flex-nowrap justify-end" style="gap: 0;">
        <template v-for="(img, index) in currentArticle.images4" :key="img + '-' + index">
          <img
            :src="img"
            alt=""
            class="flex-shrink-0 object-contain"
            :class="{ 'first-image': index === 0 }"
            :style="{
              width: `calc(100% / (${currentArticle.images2.length} + 1/3))`,
              height: 'calc((100% / 14.333) * 1.5)',
              marginRight: index === currentArticle.images2.length - 2 ? `calc((100% / (${currentArticle.images2.length} + 1/3)) / 3)` : '0'
            }"
          >
        </template>
      </div>
    </li>

    <!-- 点击提示与宽度滑动条（常规提示行：左侧滑动条，右侧提示） -->
    <li
      v-if="!isSmallScreen && submitMode !== 'button'"
      class="p-4 pb-2 text-xs md:text-base opacity-80 tracking-wide flex items-center gap-4 mx-2"
    >
      <div v-if="!isSmallScreen" class="flex items-center gap-3">
        <input
          type="range"
          min="40"
          max="100"
          step="5"
          v-model.number="contentWidth"
          class="range range-xs w-36 sm:w-40"
          :aria-label="t('threeHundred.ui.clickHint')"
        />
        <span class="opacity-80">{{ contentWidth }}%</span>
      </div>
      <div class="ml-auto">{{ t('threeHundred.ui.clickHint') }}</div>
    </li>
    
    <li
      v-else
      class="p-4 pb-2 text-xs md:text-base opacity-80 tracking-wide flex justify-start items-center mx-2"
      :style="contentWidthStyle"
    >
      <div v-if="isSmallScreen && submitMode === 'button'" class="w-full flex justify-center">
        <button
          class="btn btn-sm text-sm sm:text-base px-4 btn-primary"
          :disabled="!selectedAnswer"
          @click="handleSubmitAnswer"
        >
          {{ t('efficiencyTrain.buttons.submit') }}
        </button>
      </div>
      <div v-else class="ml-auto text-right opacity-70">
        {{ t('threeHundred.ui.clickHint') }}
      </div>
    </li>

    <!-- 参考答案 -->
    <li class="p-2 sm:p-4 pb-2 text-sm sm:text-base md:text-lg opacity-100 tracking-wide">
      <div class="flex items-center gap-2 pb-4">
        <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
          <input type="checkbox" v-model="isAnswerCollapsed"/>
          <div class="collapse-title text-base md:text-xl font-semibold text-center  pl-12">
            {{ t('threeHundred.answer.title') }}
          </div>
          <div class="collapse-content text-sm sm:text-base md:text-lg mb-0">
            <div class="flex items-center gap-2">
              <img
                :src="currentArticle.answerImg"
                alt=""
                class="flex-shrink-0 object-contain"
                :style="{
                  width: `calc(1em * (${currentArticle.images2.length} / ${isSmallScreen ? 7 : 5}))`,
                  height: `calc(1.5em * (${currentArticle.images2.length} / ${isSmallScreen ? 7 : 5}))`
                }"
              >
              <span
                v-if="currentArticle.answerNote"
                class="opacity-80 text-base sm:text-lg md:text-xl"
              >
                （{{ currentArticle.answerNote }}）
              </span>
            </div>
            <br>
            <a class="opacity-100">{{ t('threeHundred.answer.explanationTitle') }}</a>
            <br>
            <div class="explanation-text">
              <template v-for="(token, idx) in explanationTokens" :key="idx">
                <span v-if="token.type === 'text'" class="opacity-100">{{ token.value }}</span>
                <img
                  v-else-if="token.type === 'tile'"
                  :src="token.src"
                  alt=""
                  class="object-contain"
                  :style="{
                    width: `calc(1em * (${currentArticle.images2.length} / 10))`,
                    height: `calc(1.5em * (${currentArticle.images2.length} / 10))`
                  }"
                >
                <br v-else-if="token.type === 'br'">
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 分析 -->
      <div class="flex items-center gap-2 pb-4">
        <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
          <input type="checkbox" v-model="showResult" @change="handleAnalysisToggle"/>
            <div class="collapse-title text-base md:text-xl font-semibold text-center pl-12">
              {{ t('threeHundred.analysis.title') }}
            </div>
          <div class="collapse-content text-sm sm:text-base md:text-lg mb-0">
            <div class="overflow-x-auto">
              <!-- 小屏幕：切换按钮 + 紧凑表格 -->
              <div class="sm:hidden">
                <div class="flex justify-end mb-2">
                  <button
                    class="btn btn-sm text-sm sm:text-base px-4"
                    @click="showSmallWaits = !showSmallWaits"
                    :aria-label="showSmallWaits ? t('discard.small.toggleToMetrics') : t('discard.small.toggleToWaits')"
                    :title="showSmallWaits ? t('discard.small.toggleToMetrics') : t('discard.small.toggleToWaits')"
                  >
                    {{ showSmallWaits ? t('discard.small.toggleToMetrics') : t('discard.small.toggleToWaits') }}
                  </button>
                </div>

                <!-- 小屏幕视图A：切牌/好型率/指数/进张数 -->
                <div class="responsive-table-wrapper" v-if="!showSmallWaits">
                  <table class="table table-xs w-full bg-base-100 rounded-lg">
                    <thead>
                      <tr>
                        <th class="text-center">{{ t('threeHundred.table.cut') }}</th>
                        <th class="text-center">{{ t('threeHundred.table.goodShapeRate') }}</th>
                        <th class="text-center">{{ t('discard.table.index') }}</th>
                        <th class="text-center">{{ t('threeHundred.table.total') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="([tile, result], idx) in sortedImprovementResults"
                        :key="'smA-' + (tile || '-')"
                        :class="idx % 2 === 1 ? 'hover:bg-base-300' : ''"
                      >
                        <td class="font-bold text-center">{{ tile || '—' }}</td>
                        <td class="font-bold text-center">{{ result.goodShapeRate.toFixed(0) }}%</td>
                        <td class="font-bold text-center">{{ Math.round(expectedPointResults[tile] || 0) }}</td>
                        <td class="font-bold text-center">{{ result.totalCount }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 小屏幕视图B：切牌/进张 -->
                <div class="responsive-table-wrapper" v-else>
                  <table class="table table-xs w-full bg-base-100 rounded-lg">
                    <thead>
                      <tr>
                        <th class="text-center">{{ t('threeHundred.table.cut') }}</th>
                        <th class="text-center">{{ t('threeHundred.table.improvements') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="([tile, result], idx) in sortedImprovementResults"
                        :key="'smB-' + (tile || '-')"
                        :class="idx % 2 === 1 ? 'hover:bg-base-300' : ''"
                      >
                        <td class="font-bold text-center">{{ tile || '—' }}</td>
                        <td class="text-center">
                          <template v-for="(item, idx) in formatImprovementsList(result.improvements, result.improvementsQuality)" :key="item.tile + '-' + idx">
                            <span>{{ item.tile }}</span>
                            <span
                              :class="[
                                'improvement-muted',
                                {
                                  'improvement-count--on': shantenNum === 1 && item.goodShape === true,
                                  'improvement-count--bad': shantenNum === 1 && item.goodShape === false
                                }
                              ]"
                            >({{ item.count }})</span>
                            <span v-if="idx < formatImprovementsList(result.improvements, result.improvementsQuality).length - 1" class="improvement-muted">, </span>
                          </template>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 大屏幕：保留现有完整表格 -->
              <div class="responsive-table-wrapper hidden sm:block">
                <table class="table table-sm w-full bg-base-100 rounded-lg">
                  <thead>
                    <tr>
                      <th class="text-center">{{ t('threeHundred.table.cut') }}</th>
                      <th class="text-center">{{ t('threeHundred.table.improvements') }}</th>
                      <th class="text-center">{{ t('threeHundred.table.goodShapeRate') }}</th>
                      <th class="text-center">{{ t('discard.table.index') }}</th>
                      <th class="text-center">{{ t('threeHundred.table.total') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="([tile, result], idx) in sortedImprovementResults"
                      :key="tile"
                      :class="idx % 2 === 1 ? 'hover:bg-base-300' : ''"
                    >
                      <td class="font-bold text-center">
                        <img
                          v-if="tile"
                          :src="resolveTileImage(tile)"
                          :alt="tile"
                          class="inline-block align-middle object-contain"
                          style="width: 2em; height: 3em;"
                        />
                        <span v-else>—</span>
                      </td>
                      <td class="text-center">
                        <template v-for="(item, idx) in formatImprovementsList(result.improvements, result.improvementsQuality)" :key="item.tile + '-' + idx">
                          <img
                            :src="resolveTileImage(item.tile)"
                            :alt="item.tile"
                            class="inline-block align-middle object-contain"
                            style="width: 2em; height: 3em;"
                          />
                          <span class="improvement-dots" :aria-label="t('threeHundred.table.improvements') + ' ' + item.tile + ' ' + item.count">
                            <span
                              v-for="n in 4"
                              :key="item.tile + '-dot-' + n"
                              :class="[
                                'improvement-dot',
                                {
                                  'improvement-dot--on': n <= item.count && !(shantenNum === 1 && item.goodShape === false),
                                  'improvement-dot--bad': n <= item.count && shantenNum === 1 && item.goodShape === false
                                }
                              ]"
                            ></span>
                          </span>
                        </template>
                      </td>
                      <td class="font-bold text-center">{{ result.goodShapeRate.toFixed(0) }}%</td>
                      <td class="font-bold text-center">{{ Math.round(expectedPointResults[tile] || 0) }}</td>
                      <td class="font-bold text-center">{{ result.totalCount }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
    <li class="list-row flex flex-row justify-between items-center gap-2 w-full">
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        :disabled="currentIndex === 0"
        @click="prevArticle"
      >
        {{ t('threeHundred.buttons.prev') }}
      </button>
      <div class="flex items-center gap-2">
        <input
          type="number"
          v-model="jumpToId"
          min="1"
          :max="articles.length"
          class="input input-bordered input-sm w-16 text-sm sm:text-base"
          @keyup.enter="jumpToArticle"
        >
        <button
          class="btn btn-sm text-sm sm:text-base px-4"
          @click="jumpToArticle"
        >
          {{ t('threeHundred.buttons.jump') }}
        </button>
      </div>
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        :disabled="currentIndex === articles.length - 1"
        @click="nextArticle"
      >
        {{ t('threeHundred.buttons.next') }}
      </button>
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
  </ul>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Shanten } from '../utils/shanten'
import { evaluateHand, evaluateStatus } from '../utils/evaluation'
import { articles as articlesRaw } from '../data/articles'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const ARTICLE_STORAGE_KEY = 'threehundred-301-current-id'

const route = useRoute()
const router = useRouter()

const img = n => `/mahjongfiles/${n}.png`
const m = n => img(`${n}m`)
const p = n => img(`${n}p`)
const s = n => img(`${n}s`)
const z = n => img(`${n}z`)

const mArr = Array.from({ length: 10 }, (_, i) => m(i))
const pArr = Array.from({ length: 10 }, (_, i) => p(i))
const sArr = Array.from({ length: 10 }, (_, i) => s(i))
const zArr = Array.from({ length: 7 }, (_, i) => z(i + 1))

const IMAGE_TO_TILE_MAP = {
  ...Object.fromEntries(mArr.map((v, i) => [v, `${i}m`])),
  ...Object.fromEntries(pArr.map((v, i) => [v, `${i}p`])),
  ...Object.fromEntries(sArr.map((v, i) => [v, `${i}s`])),
  ...Object.fromEntries(zArr.map((v, i) => [v, `${i + 1}z`]))
}

// 从路由参数或 localStorage 获取初始题目ID
const getInitialArticleIndex = () => {
  // 优先使用路由参数
  if (route.params.id) {
    const id = parseInt(route.params.id)
    if (id >= 1 && id <= articlesRaw.length) {
      return id - 1
    }
  }
  
  // 其次使用 localStorage
  try {
    const savedId = localStorage.getItem(ARTICLE_STORAGE_KEY)
    if (savedId) {
      const index = parseInt(savedId) - 1
      return index >= 0 && index < articlesRaw.length ? index : 0
    }
  } catch (error) {
    console.warn('无法读取 localStorage:', error)
  }
  return 0
}

// 更新路由URL
const updateRoute = (index) => {
  const newId = index + 1
  if (route.params.id !== newId.toString()) {
    router.replace({ name: 'DiscardTrain', params: { id: newId } })
  }
}

const articles = ref(articlesRaw)
const currentIndex = ref(getInitialArticleIndex())
const isAnswerCollapsed = ref(false)
const currentArticle = computed(() => articles.value[currentIndex.value])
const jumpToId = ref('')
const handInput = ref('')
const showResult = ref(false)
const shantenNum = ref(null)
const improvementResults = ref({})
const expectedPointResults = ref({})
// 小屏幕切换：false=指标概览(A)，true=进张列表(B)
const showSmallWaits = ref(false)
const errorMessage = ref(null)
const isCalculating = ref(false)
let analysisTimer = null
let analysisToken = 0
const cancelAnalysis = () => {
  analysisToken += 1
  if (analysisTimer) {
    clearTimeout(analysisTimer)
    analysisTimer = null
  }
  isCalculating.value = false
}

// 新增：提交方式（沿用 EfficiencyTrain 的 i18n）
const submitMode = ref('instant') // 'instant' | 'button'
const selectedAnswer = ref(null)
const isSmallScreen = ref(false)
const questionNumberRef = ref(null)
const submitModeOptions = computed(() => [
  { value: 'instant', label: t('efficiencyTrain.options.submitMode.instant') },
  { value: 'button', label: t('efficiencyTrain.options.submitMode.button') }
])
const WIDTH_STORAGE_KEY = 'threehundred-content-width'
const WIDTH_CHANGE_EVENT = 'threehundred-content-width-change'
const clampWidth = (value) => Math.min(100, Math.max(40, Number.isFinite(value) ? value : 100))
const getSavedContentWidth = () => {
  try {
    const v = parseInt(localStorage.getItem(WIDTH_STORAGE_KEY))
    return clampWidth(Number.isFinite(v) ? v : 100)
  } catch (e) {
    console.warn('无法读取 contentWidth:', e)
    return 100
  }
}
const contentWidth = ref(getSavedContentWidth())
let widthUpdateFromEvent = false
const contentWidthStyle = computed(() => ({
  width: `${isSmallScreen.value ? 100 : contentWidth.value}%`,
  marginLeft: 'auto',
  marginRight: 'auto'
}))

const handleWidthBroadcast = (event) => {
  if (typeof event.detail !== 'number') return
  const clamped = clampWidth(event.detail)
  if (clamped === contentWidth.value) return
  widthUpdateFromEvent = true
  contentWidth.value = clamped
}

const handleKeydown = (event) => {
  const target = event.target
  const tagName = target?.tagName
  if (target?.isContentEditable) return
  if (tagName === 'TEXTAREA' || tagName === 'SELECT') return
  if (tagName === 'INPUT') {
    const type = (target?.type || '').toLowerCase()
    if (type !== 'checkbox' && type !== 'radio' && type !== 'button' && type !== 'submit') {
      return
    }
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prevArticle()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    nextArticle()
  }
}

const resolveTileImage = (code) => {
  if (!code) return ''
  const normalized = code.trim()
  if (!normalized) return ''
  if (normalized === 'ph') return img('ph')
  if (normalized === 'z0') return img('-1')
  const letterFirst = normalized.match(/^([mpsz])(\d)$/)
  const numberFirst = normalized.match(/^(\d)([mpsz])$/)
  let suitKey, numStr
  if (letterFirst) {
    suitKey = letterFirst[1]
    numStr = letterFirst[2]
  } else if (numberFirst) {
    suitKey = numberFirst[2]
    numStr = numberFirst[1]
  } else {
    return ''
  }
  const num = Number(numStr)
  if (!Number.isFinite(num)) return ''
  if (suitKey === 'm') return m(num)
  if (suitKey === 'p') return p(num)
  if (suitKey === 's') return s(num)
  if (suitKey === 'z') return z(num)
  return ''
}

const pushTextWithBreaks = (tokens, text) => {
  text.split(/\n/).forEach((segment, idx, arr) => {
    if (segment) tokens.push({ type: 'text', value: segment })
    if (idx < arr.length - 1) tokens.push({ type: 'br' })
  })
}

const parseExplanationSegment = (input) => {
  if (input == null) return []
  let segment = typeof input === 'string' ? input : String(input)
  if (!segment) return []
  if (segment.endsWith('.png')) return [{ type: 'tile', src: segment }]
  const tokens = []
  const regex = /\{\{(.*?)\}\}/g
  let lastIndex = 0
  let match
  while ((match = regex.exec(segment)) !== null) {
    if (match.index > lastIndex) {
      pushTextWithBreaks(tokens, segment.slice(lastIndex, match.index))
    }
    const code = match[1]?.trim()
    const src = resolveTileImage(code)
    if (src) tokens.push({ type: 'tile', src, code })
    else pushTextWithBreaks(tokens, match[0])
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < segment.length) {
    pushTextWithBreaks(tokens, segment.slice(lastIndex))
  }
  return tokens
}

const explanationTokens = computed(() => {
  const explanation = currentArticle.value?.explanation
  if (!explanation) return []
  const segments = Array.isArray(explanation) ? explanation : [explanation]
  return segments.flatMap(parseExplanationSegment)
})

// 进张显示格式：6p(2), 9p(3)
const formatImprovementsList = (improvements, improvementsQuality = {}) => {
  if (!improvements || typeof improvements !== 'object') return []
  return Object.entries(improvements)
    .filter(([, count]) => (count || 0) > 0)
    .map(([tile, count]) => ({ tile, count, goodShape: improvementsQuality?.[tile] }))
}

const updateScreenSize = () => {
  isSmallScreen.value = window.innerWidth < 640
  if (!isSmallScreen.value && submitMode.value === 'button') {
    submitMode.value = 'instant'
  }
}

const scrollToQuestionNumber = () => {
  nextTick(() => {
    const el = questionNumberRef.value
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const handleAnalysisToggle = () => {
  if (showResult.value && Object.keys(improvementResults.value).length === 0 && !isCalculating.value) {
    handleSubmit()
  }
}

const sortedImprovementResults = computed(() =>
  Object.entries(improvementResults.value)
    .sort((a, b) => b[1].totalCount - a[1].totalCount)
)

// 添加保存当前索引的函数
const saveCurrentIndex = (index) => {
  try {
    localStorage.setItem(ARTICLE_STORAGE_KEY, (index + 1).toString())
  } catch (error) {
    console.warn('无法保存到 localStorage:', error)
  }
}

const resetAnalysis = () => {
  handInput.value = ''
  showResult.value = false
  shantenNum.value = null
  improvementResults.value = {}
  expectedPointResults.value = {}
  errorMessage.value = null
  // 新增：清空已选答案
  selectedAnswer.value = null
  cancelAnalysis()
}

const prevArticle = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    isAnswerCollapsed.value = false
    resetAnalysis()
  }
}

const nextArticle = () => {
  if (currentIndex.value < articles.value.length - 1) {
    currentIndex.value++
    isAnswerCollapsed.value = false
    resetAnalysis()
    scrollToQuestionNumber()
  }
}

const jumpToArticle = () => {
  const id = parseInt(jumpToId.value)
  if (id >= 1 && id <= articles.value.length) {
    currentIndex.value = id - 1
    isAnswerCollapsed.value = false
    resetAnalysis()
  } else {
    alert(t('threeHundred.messages.invalidId'))
  }
  jumpToId.value = ''
}

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    const id = parseInt(newId)
    if (id >= 1 && id <= articles.value.length) {
      const newIndex = id - 1
      if (newIndex !== currentIndex.value) {
        currentIndex.value = newIndex
        isAnswerCollapsed.value = false
        resetAnalysis()
      }
    }
  }
})

// 监听 currentIndex 变化，自动保存并更新路由
watch(currentIndex, (newIndex) => {
  saveCurrentIndex(newIndex)
  updateRoute(newIndex)
  isAnswerCollapsed.value = false
  showResult.value = false
  scheduleAnalysis()
})

// 新增：监听宽度变化，保存到 localStorage
watch(contentWidth, (val) => {
  const clamped = clampWidth(val)
  if (clamped !== val) {
    contentWidth.value = clamped
    return
  }
  if (widthUpdateFromEvent) {
    widthUpdateFromEvent = false
    return
  }
  try {
    localStorage.setItem(WIDTH_STORAGE_KEY, String(clamped))
  } catch (e) {
    console.warn('无法保存 contentWidth:', e)
  }
  window.dispatchEvent(new CustomEvent(WIDTH_CHANGE_EVENT, { detail: clamped }))
})

// 组件挂载时初始化
onMounted(() => {
  // 确保当前索引在有效范围内
  if (currentIndex.value >= articles.value.length) {
    currentIndex.value = 0
  }
  // 初始化时更新路由
  updateRoute(currentIndex.value)
  scheduleAnalysis()
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
  window.addEventListener(WIDTH_CHANGE_EVENT, handleWidthBroadcast)
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
  window.removeEventListener(WIDTH_CHANGE_EVENT, handleWidthBroadcast)
  window.removeEventListener('keydown', handleKeydown)
  cancelAnalysis()
})

defineProps(['changeComponent'])

const convertToTiles34Arr = handTiles => {
  const tiles34Arr = Array(34).fill(0)
  handTiles.forEach(tile => {
    const num = tile.replace(/\D/g, "")
    const type = tile.slice(-1)
    let index
    if (type === "m") index = num === "0" ? 4 : +num - 1
    else if (type === "p") index = 9 + (num === "0" ? 4 : +num - 1)
    else if (type === "s") index = 18 + (num === "0" ? 4 : +num - 1)
    else if (type === "z") index = 27 + (+num - 1)
    if (index !== undefined) tiles34Arr[index]++
  })
  return tiles34Arr
}

const calculateShanten = tiles34Arr => new Shanten().calculateShanten(tiles34Arr)

const generateTiles = () => {
  const types = ["m", "p", "s"], tiles = []
  types.forEach(type => {
    for (let num = 1; num <= 9; num++) {
      if (num === 5) {
        tiles.push(...Array(3).fill(`${num}${type}`))
        tiles.push(`0${type}`)
      } else {
        tiles.push(...Array(4).fill(`${num}${type}`))
      }
    }
  })
  for (let num = 1; num <= 7; num++) tiles.push(...Array(4).fill(`${num}z`))
  return tiles
}

// 好型率分析
const ALL_TILES = generateTiles()
const BASE_COUNT_MAP = (() => {
  const m = {}
  for (const t of ALL_TILES) m[t] = (m[t] || 0) + 1
  return m
})()
const UNIQUE_TILES = Object.keys(BASE_COUNT_MAP)

// tile -> 34 索引映射（避免反复正则与分支）
const TILE_TO_INDEX = (() => {
  const map = {}
  const numIdx = (num, type) => {
    if (type === 'm') return num === 0 ? 4 : num - 1
    if (type === 'p') return 9 + (num === 0 ? 4 : num - 1)
    if (type === 's') return 18 + (num === 0 ? 4 : num - 1)
    if (type === 'z') return 27 + (num - 1)
  }
  for (const type of ['m','p','s']) {
    for (let n = 1; n <= 9; n++) {
      if (n === 5) {
        map[`5${type}`] = numIdx(5, type)
        map[`0${type}`] = numIdx(0, type)
      } else {
        map[`${n}${type}`] = numIdx(n, type)
      }
    }
  }
  for (let n = 1; n <= 7; n++) map[`${n}z`] = numIdx(n,'z')
  return map
})()

// 构建当前手牌计数（字符串层面，用于剩余牌推算）
function buildHandCountMap(hand) {
  const cnt = {}
  for (const t of hand) cnt[t] = (cnt[t] || 0) + 1
  return cnt
}

const imagesToTiles = (images) => {
  if (!Array.isArray(images)) return []
  return images
    .map(img => IMAGE_TO_TILE_MAP[img])
    .filter(Boolean)
}

const buildCountsKey = (counts) => {
  if (!counts) return ''
  const keys = Object.keys(counts).sort()
  if (keys.length === 0) return ''
  return keys.map(k => `${k}:${counts[k]}`).join(',')
}

// 生成剩余可用牌计数（不复制大对象，只按需要计算）
function remainingCounts(handCount, extraCounts) {
  const res = {}
  for (const tile of UNIQUE_TILES) {
    const left = BASE_COUNT_MAP[tile]
      - (handCount[tile] || 0)
      - (extraCounts?.[tile] || 0)
    if (left > 0) res[tile] = left
  }
  return res
}

// 记忆化好型率计算（保持原逻辑，减少重复构造与排序）
const calculateGoodShapeRate = (() => {
  const cache = new Map()
  const MAX_DEPTH = 3
  function inner(hand, tiles34Arr, knownCounts, knownKey, depth = 0) {
    const key = tiles34Arr.join(',') + '|' + depth + '|' + (knownKey || '')
    if (cache.has(key)) return cache.get(key)
    if (depth > MAX_DEPTH) return 0

    const shanten = calculateShanten(tiles34Arr)
    if (shanten === 0) {
      const handCount = buildHandCountMap(hand)
      const rem = remainingCounts(handCount, knownCounts)
      let waitTypes = new Set(), waitCount = 0
      for (const [tile, count] of Object.entries(rem)) {
        const tempHand = [...hand, tile]
        const tempTiles34 = convertToTiles34Arr(tempHand)
        if (calculateShanten(tempTiles34) === -1) {
          waitTypes.add(tile)
          waitCount += count
        }
      }
      const result = (waitTypes.size > 1 && waitCount > 4) ? 1 : 0
      cache.set(key, result)
      return result
    }

    const handCount = buildHandCountMap(hand)
    const rem = remainingCounts(handCount, knownCounts)

    let totalPaths = 0, goodShapePaths = 0
    for (const [tile, count] of Object.entries(rem)) {
      const tempHand = [...hand, tile]
      const tempTiles34 = convertToTiles34Arr(tempHand)
      const newShanten = calculateShanten(tempTiles34)
      if (newShanten < shanten) {
        let bestPathRate = 0
        const seen = new Set()
        for (let i = 0; i < tempHand.length; i++) {
          const dTile = tempHand[i]
            // 去重
          if (seen.has(dTile)) continue
          seen.add(dTile)
          const discardHand = tempHand.slice()
          discardHand.splice(i,1)
          const discardTiles34 = convertToTiles34Arr(discardHand)
          if (calculateShanten(discardTiles34) < shanten) {
            bestPathRate = Math.max(bestPathRate, inner(discardHand, discardTiles34, knownCounts, knownKey, depth + 1))
          }
        }
        totalPaths += count
        goodShapePaths += count * bestPathRate
      }
    }
    const result = totalPaths === 0 ? 0 : (goodShapePaths / totalPaths)
    cache.set(key, result)
    return result
  }
  return inner
})()

// 听牌好型判定（与 calculateGoodShapeRate 中的听牌判定逻辑一致）
const isGoodShapeTenpai = (hand, knownCounts) => {
  if (!Array.isArray(hand) || hand.length === 0) return false

  const isGoodWaitsFor13 = (hand13) => {
    const handCount = buildHandCountMap(hand13)
    const rem = remainingCounts(handCount, knownCounts)
    let waitTypes = new Set(), waitCount = 0
    for (const [tile, count] of Object.entries(rem)) {
      const tempHand = [...hand13, tile]
      const tempTiles34 = convertToTiles34Arr(tempHand)
      if (calculateShanten(tempTiles34) === -1) {
        waitTypes.add(tile)
        waitCount += count
      }
    }
    return (waitTypes.size > 1 && waitCount > 4)
  }

  // 若为14张（摸牌后），先尝试弃一张进入听牌再判好型
  if (hand.length % 3 === 2) {
    let hasTenpai = false
    for (let i = 0; i < hand.length; i++) {
      const reduced = hand.slice(0, i).concat(hand.slice(i + 1))
      const reducedTiles34 = convertToTiles34Arr(reduced)
      if (calculateShanten(reducedTiles34) === 0) {
        hasTenpai = true
        if (isGoodWaitsFor13(reduced)) return true
      }
    }
    return false
  }

  return isGoodWaitsFor13(hand)
}

// 提效率分析
const analyzeImprovement = (currentHand, currentTiles34, knownCounts, knownKey) => {
  const results = {}
  const originalShanten = calculateShanten(currentTiles34)
  const globalHandCount = buildHandCountMap(currentHand)

  currentHand.forEach((tileToDiscard, discardIndex) => {
    // 构建去掉该牌后的手牌
    const newHand = currentHand.filter((_, i) => i !== discardIndex)
    // 更新计数（局部复制一次，避免全量重算）
    const newHandCount = { ...globalHandCount }
    newHandCount[tileToDiscard]--
    if (newHandCount[tileToDiscard] === 0) delete newHandCount[tileToDiscard]

    const newTiles34 = convertToTiles34Arr(newHand)
    const rem = remainingCounts(newHandCount, knownCounts)

    const improvements = {}
    const improvementsQuality = {}
    let totalCount = 0
    for (const [tile, count] of Object.entries(rem)) {
      const tempHand = [...newHand, tile]
      const tempTiles34 = convertToTiles34Arr(tempHand)
      const newShanten = calculateShanten(tempTiles34)
      if (newShanten < originalShanten) {
        improvements[tile] = count
        totalCount += count
        if (originalShanten === 1 && newShanten === 0) {
          improvementsQuality[tile] = isGoodShapeTenpai(tempHand, knownCounts)
        }
      }
    }

    if (totalCount > 0) {
      const goodShapeRate = Math.max(0, calculateGoodShapeRate(newHand, newTiles34, knownCounts, knownKey) * 100)
      results[tileToDiscard] = { improvements, improvementsQuality, totalCount, goodShapeRate }
    }
  })
  return results
}

const parseHandTiles = input => {
  const tiles = input.match(/(\d+)([mpsz])/g) || []
  let handTiles = []
  tiles.forEach(tile => {
    const [_, numbers, type] = tile.match(/(\d+)([mpsz])/)
    for (const n of numbers) handTiles.push(`${n}${type}`)
  })
  if (handTiles.some(tile => ["8z", "9z", "0z"].includes(tile))) return null
  const tileCount = handTiles.reduce((acc, t) => (acc[t] = (acc[t] || 0) + 1, acc), {})
  if (Object.values(tileCount).some(count => count >= 5)) return null
  return handTiles
}

const convertImages2ToHandString = images2 => {
  const tileMap = {
    ...Object.fromEntries(mArr.map((v, i) => [v, `${i}m`])),
    ...Object.fromEntries(pArr.map((v, i) => [v, `${i}p`])),
    ...Object.fromEntries(sArr.map((v, i) => [v, `${i}s`])),
    ...Object.fromEntries(zArr.map((v, i) => [v, `${i + 1}z`]))
  }
  const groupedTiles = { m: [], p: [], s: [], z: [] }
  images2.forEach(img => {
    const tile = tileMap[img]
    if (tile) {
      const type = tile.slice(-1)
      const num = tile.slice(0, -1)
      groupedTiles[type].push(num)
    }
  })
  let handString = ''
  for (const type of ['m', 'p', 's', 'z']) {
    if (groupedTiles[type].length) {
      groupedTiles[type].sort((a, b) => +a - +b)
      handString += groupedTiles[type].join('') + type
    }
  }
  return handString
}

const buildAnalysisPayload = () => {
  const handString = convertImages2ToHandString(currentArticle.value.images2)
  handInput.value = handString
  const handTiles = parseHandTiles(handString)
  if (!handTiles) return null
  const knownTiles = imagesToTiles(currentArticle.value.images1)
  const knownCounts = buildHandCountMap(knownTiles)
  const knownKey = buildCountsKey(knownCounts)
  return { handTiles, knownCounts, knownKey }
}

const calculateAndStoreAnalysis = (payload) => {
  const { handTiles, knownCounts, knownKey } = payload
  const tiles34Arr = convertToTiles34Arr(handTiles)
  shantenNum.value = calculateShanten(tiles34Arr)
  improvementResults.value = analyzeImprovement(handTiles, tiles34Arr, knownCounts, knownKey)
  expectedPointResults.value = {}
  const handCount = buildHandCountMap(handTiles)
  const remMap = remainingCounts(handCount, knownCounts)
  const isPreDraw = (handTiles.length % 3 === 1)
  if (isPreDraw) {
    const status = evaluateStatus(handTiles, remMap)
    if (status.totalCount > 0) {
      expectedPointResults.value = { '': status.evIndex }
    }
  } else {
    const results = evaluateHand(handTiles, remMap)
    for (const [tile, data] of Object.entries(results)) {
      if (data.totalCount > 0 || data.evIndex > 0) {
        expectedPointResults.value[tile] = data.evIndex
      }
    }
  }
  errorMessage.value = null
}

const scheduleAnalysis = () => {
  cancelAnalysis()
  const payload = buildAnalysisPayload()
  if (!payload) {
    errorMessage.value = t('threeHundred.messages.invalidHand')
    return
  }
  const token = analysisToken
  isCalculating.value = true
  analysisTimer = setTimeout(() => {
    if (token !== analysisToken) return
    calculateAndStoreAnalysis(payload)
    isCalculating.value = false
  }, 50)
}

const handleSubmit = () => {
  if (Object.keys(improvementResults.value).length > 0) {
    errorMessage.value = null
    return
  }
  const payload = buildAnalysisPayload()
  if (!payload) {
    errorMessage.value = t('threeHundred.messages.invalidHand')
    showResult.value = true
    return
  }
  calculateAndStoreAnalysis(payload)
}

// 新增：提交动作抽取（复用原判题流程）
const commitAnswer = (img) => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const showMsg = (msg, bg) => {
    const div = document.createElement('div')
    div.textContent = msg
    Object.assign(div.style, {
      position: 'fixed',
      top: '15%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: bg,
      color: isDark ? '#fff' : '#222',
      padding: '0.6em 1.5em',
      borderRadius: '10px',
      fontSize: '1.1em',
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    })
    document.body.appendChild(div)
    setTimeout(() => document.body.removeChild(div), 900)
  }
  if (img === currentArticle.value.answerImg) {
    showMsg(t('threeHundred.result.correct'), isDark ? 'rgba(80, 120, 180, 0.8)' : 'rgba(120, 180, 255, 0.25)')
    selectedAnswer.value = null
    nextArticle()
  } else {
    showMsg(t('threeHundred.result.wrong'), isDark ? 'rgba(80, 80, 80, 0.65)' : 'rgba(0, 0, 0, 0.06)')
    isAnswerCollapsed.value = true
    showResult.value = true
    handleSubmit()
    selectedAnswer.value = null
  }
}

// 修改：图片点击逻辑，支持两种提交方式
const handleImageClick = img => {
  if (isSmallScreen.value && submitMode.value === 'button') {
    selectedAnswer.value = img
    return
  }
  commitAnswer(img)
}

// 新增：提交按钮回调（仅按钮模式）
const handleSubmitAnswer = () => {
  if (!selectedAnswer.value) return
  commitAnswer(selectedAnswer.value)
}
</script>

<style>
.first-image {
  transform: rotate(-90deg) translateY(-16.67%) translateX(-20%);
  transform-origin: center;
}
.explanation-text {
  display: block;
  line-height: 1.75;
  white-space: normal;
  word-break: break-word;
  text-wrap: normal;
}
.explanation-text span {
  display: inline;
  margin-right: 0.25em;
}
.explanation-text img {
  display: inline-block;
  vertical-align: middle;
  margin: 0 0.25em;
}
.improvement-muted {
  opacity: 0.5;
}
 .improvement-dots {
   display: inline-grid;
   grid-template-columns: repeat(2, 0.4em);
   grid-template-rows: repeat(2, 0.4em);
   gap: 0.1em;
   margin: 0 0.3em;
   vertical-align: middle;
 }
 .improvement-dot {
   width: 0.32em;
   height: 0.32em;
   border-radius: 999px;
   background: rgba(34, 197, 94, 0.18);
   display: inline-block;
 }
 .improvement-dot--on {
   background: rgba(34, 197, 94, 0.9);
 }
.improvement-dot--bad {
  background: rgba(239, 68, 68, 0.9);
}
.improvement-count--on {
  color: rgba(34, 197, 94, 0.9);
  opacity: 0.7;
}
.improvement-count--bad {
  color: rgba(239, 68, 68, 0.9);
  opacity: 0.7;
}

.question-number {
  scroll-margin-top: 24px;
}
@media (min-width: 640px) {
  .question-number {
    scroll-margin-top: 8px;
  }
}
</style>
