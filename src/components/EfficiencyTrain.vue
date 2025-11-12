// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">

    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>

    <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
      {{ t('efficiencyTrain.title') }}
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>

    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-8">
        <fieldset class="fieldset ml-0 flex-1">
          <legend class="text-base">{{ t('efficiencyTrain.settings.shantenDisplayLegend') }}</legend>
          <select
            class="select ml-0 w-full sm:w-auto"
            v-model="shantenDisplayMode"
            @change="handleShantenDisplayChange(shantenDisplayMode)"
          >
            <option
              v-for="option in shantenDisplayOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </fieldset>
        <fieldset class="fieldset ml-0 flex-1 mt-4 sm:mt-0">
          <legend class="text-base">{{ t('efficiencyTrain.settings.tileSetLegend') }}</legend>
          <select
            class="select ml-0 w-full sm:w-auto"
            v-model="tileSetMode"
            @change="handleTileSetChange(tileSetMode)"
          >
            <option
              v-for="option in tileSetOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </fieldset>
      </div>
      <!-- 新增：判断标准与提交方式 -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-8 mt-4">
        <fieldset class="fieldset ml-0 flex-1">
          <legend class="text-base">{{ t('efficiencyTrain.settings.judgeCriteriaLegend') }}</legend>
          <select
            class="select ml-0 w-full sm:w-auto"
            v-model="judgeCriteria"
          >
            <option
              v-for="option in judgeCriteriaOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </fieldset>
        <fieldset class="fieldset ml-0 flex-1 mt-4 sm:mt-0">
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

    <li v-if="shantenDisplayMode !== 'hidden' && shantenNum !== null" aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>

    <li
      v-if="shantenDisplayMode !== 'hidden' && shantenNum !== null"
      class="p-2 flex justify-center"
    >
      <div class="badge badge-neutral text-lg font-semibold">
        <div v-if="shantenNum === -1">
          {{ t('efficiencyTrain.status.mahjong') }}
        </div>
        <div v-else-if="shantenNum === 0">
          {{ t('efficiencyTrain.status.tenpai') }}
        </div>
        <div v-else-if="shantenDisplayMode === 'full'">
          {{ t('efficiencyTrain.status.shanten', { n: shantenNum }) }}
        </div>
        <div v-else>
          {{ t('efficiencyTrain.status.noten') }}
        </div>
      </div>
    </li>

    <li class="p-4 pb-2 opacity-100 tracking-wide text-base sm:text-lg font-semibold" :style="contentWidthStyle">
      <span>{{ t('efficiencyTrain.ui.handTitle') }}</span>
    </li>

    <li
      class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide"
      :style="contentWidthStyle"
    >
      <div
        class="grid w-full"
        :style="{
          gridTemplateColumns: `repeat(${handTiles.length || 1}, 1fr)`,
          gap: '0px'
        }"
      >
        <template v-for="(tile, index) in handTiles" :key="tile + '-' + index">
          <img
            :src="tileSrc(tile)"
            :alt="tile"
            @click="handleTileClick(tile, index)"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
            class="tile-img transition-transform duration-150 cursor-pointer"
            :style="{
              borderRadius: '5px',
              transform: hoveredIndex === index ? 'translateY(-5px)' : 'none',
              // 新增：按钮提交模式下，已选择牌变灰
              filter: (isSmallScreen && submitMode === 'button' && selectedDiscard === tile) ? 'grayscale(100%) brightness(0.9)' : undefined,
              opacity: (isSmallScreen && submitMode === 'button' && selectedDiscard === tile) ? '0.8' : undefined
            }"
          />
        </template>
      </div>
    </li>
    
    <li
      v-if="!(isSmallScreen && submitMode === 'button')"
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
        <span class="opacity-80">{{ contentWidthDisplay }}%</span>
      </div>
      <div class="ml-auto">{{ t('threeHundred.ui.clickHint') }}</div>
    </li>

    <li
      v-else
      class="p-4 pb-2 text-xs md:text-base opacity-80 tracking-wide flex justify-start items-center mx-2"
      :style="contentWidthStyle"
    >
      <div class="ml-auto text-right opacity-70">
        {{ t('threeHundred.ui.clickHint') }}
      </div>
    </li>

    <li v-if="lastDiscardResult" class="p-2" :style="contentWidthStyle">
      <div class="flex flex-col items-center gap-3">
        <!-- 合并静态 class 与动态 :class，避免解析器误判 -->
        <div :class="['inline-flex items-center gap-1 text-lg font-bold', lastDiscardResult.isCorrect ? 'badge badge-success' : 'badge badge-error']">
          <svg v-if="lastDiscardResult.isCorrect" class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle>
              <polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></polyline>
            </g>
          </svg>
          <svg v-else class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g fill="currentColor">
              <rect x="1.972" y="11" width="20.056" height="2" transform="translate(-4.971 12) rotate(-45)" fill="currentColor" stroke-width="0"></rect>
              <path d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z" stroke-width="0" fill="currentColor"></path>
            </g>
          </svg>
          {{ t(lastDiscardResult.messageKey) }}
        </div>
        <div class="flex flex-col items-center gap-2 w-full">
          <div class="text-base opacity-80">{{ t('efficiencyTrain.result.correctAnswersTitle') }}</div>
          <div class="flex flex-wrap justify-center items-center w-full" style="gap: 0;">
            <div
              v-for="tile in lastDiscardResult.correctChoices"
              :key="'correct-' + tile"
              class="flex justify-center"
              :style="{
                maxWidth: 'calc(100% / 13.5)'
              }"
            >
              <img
                :src="tileSrc(tile)"
                :alt="tile"
                class="tile-img"
              />
            </div>
          </div>
        </div>
      </div>
    </li>

    <!-- 改为 上一题 / 下一题 按钮，左右分布 -->
    <li class="list-row flex flex-row justify-between items-center gap-2 w-full">
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        :disabled="currentIndex === 0"
        @click="prevQuestion"
      >
        {{ t('efficiencyTrain.buttons.prev') }}
      </button>
      <button
        v-if="isSmallScreen && submitMode === 'button'"
        class="btn btn-sm text-sm sm:text-base px-4 btn-primary"
        :disabled="!selectedDiscard"
        @click="handleSubmitDiscard"
      >
        {{ t('efficiencyTrain.buttons.submit') }}
      </button>
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        @click="nextQuestion"
      >
        {{ t('efficiencyTrain.buttons.next') }}
      </button>
    </li>

    <li class="p-4">
      <div class="flex items-center gap-2 pb-4">
        <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
          <input type="checkbox" v-model="showResult" @change="handleAnalysisToggle"/>
          <div class="collapse-title text-base sm:text-lg font-semibold text-center pl-12">{{ t('efficiencyTrain.analysis.title') }}</div>
          <div class="collapse-content text-sm sm:text-base md:text-lg mb-0">
            <div class="overflow-x-auto">
              <!-- 新增：小屏幕切换按钮 + 两套视图 -->
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

                <!-- 小屏视图A：切牌/好型率/指数/进张数 -->
                <div class="responsive-table-wrapper" v-if="!showSmallWaits">
                  <table class="table table-xs w-full bg-base-100 rounded-lg">
                    <thead>
                      <tr>
                        <th class="text-center">{{ t('efficiencyTrain.table.cut') }}</th>
                        <th class="text-center">{{ t('efficiencyTrain.table.goodShapeRate') }}</th>
                        <th class="text-center">{{ t('discard.table.index') }}</th>
                        <th class="text-center">{{ t('efficiencyTrain.table.total') }}</th>
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

                <!-- 小屏视图B：切牌/进张 -->
                <div class="responsive-table-wrapper" v-else>
                  <table class="table table-xs w-full bg-base-100 rounded-lg">
                    <thead>
                      <tr>
                        <th class="text-center">{{ t('efficiencyTrain.table.cut') }}</th>
                        <th class="text-center">{{ t('efficiencyTrain.table.improvements') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="([tile, result], idx) in sortedImprovementResults"
                        :key="'smB-' + (tile || '-')"
                        :class="idx % 2 === 1 ? 'hover:bg-base-300' : ''"
                      >
                        <td class="font-bold text-center">{{ tile || '—' }}</td>
                        <td class="text-center">{{ formatImprovements(result.improvements) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 大屏完整表格 -->
              <div class="responsive-table-wrapper hidden sm:block">
                <table class="table table-sm w-full bg-base-100 rounded-lg">
                  <thead>
                    <tr>
                      <th class="text-center">{{ t('efficiencyTrain.table.cut') }}</th>
                      <th class="text-center">{{ t('efficiencyTrain.table.improvements') }}</th>
                      <th class="text-center">{{ t('efficiencyTrain.table.goodShapeRate') }}</th>
                      <!-- 新增：指数列 -->
                      <th class="text-center">{{ t('discard.table.index') }}</th>
                      <th class="text-center">{{ t('efficiencyTrain.table.total') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="([tile, result], idx) in sortedImprovementResults"
                      :key="tile"
                      :class="idx % 2 === 1 ? 'hover:bg-base-300' : ''"
                    >
                      <td class="font-bold text-center">{{ tile }}</td>
                      <td class="text-center">{{ formatImprovements(result.improvements) }}</td>
                      <td class="font-bold text-center">{{ result.goodShapeRate.toFixed(0) }}%</td>
                      <!-- 指数（四舍五入展示） -->
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
  </ul>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Shanten } from '../utils/shanten'

const { t } = useI18n()

// 统一的图片路径函数
const tileSrc = (tile) => `/mahjongfiles/${tile}.png`

// -------------------- 响应式状态 --------------------
const tilesWall = ref([])                   // 牌山（当前实现不在出牌时摸牌，但保留以兼容已有逻辑）
const handTiles = ref([])                   // 手牌（14张）
const tilesStr = ref('')                    // 手牌字符串（UI展示）
const tiles34Arr = ref([])                  // 手牌34进制数组
const shantenNum = ref(null)                // 当前向听数
const hoveredIndex = ref(null)              // 手牌悬浮态
const improvementResults = ref({})          // 计算出的进张列表
// 新增：每个切牌的“预期打点指数”
const expectedPointResults = ref({})

// 新增：小屏表格切换（false=指标视图，true=进张视图）
const showSmallWaits = ref(false)

// 新增：设置项与结果状态（需在 prevTileSetMode 使用前声明）
const shantenDisplayMode = ref('full')      // 'hidden' | 'full' | 'tenpaiOnly'
const tileSetMode = ref('noHonor')        // 'noHonor' | 'withHonor' | 'm' | 'p' | 's'
const showResult = ref(false)
const lastDiscardResult = ref(null)

// 新增：判断标准与提交方式
const judgeCriteria = ref('default')      // 'default' | 'volume' | 'shape' | 'index'
const submitMode = ref('instant')         // 'instant' | 'button'
// 新增：暂存用户点击的牌（按钮提交模式）
const selectedDiscard = ref(null)

// 历史题目记录（上一题/下一题）
const questions = ref([])                   // [{ hand: string[], baseCount: Record<string, number>, tileSet: string }]
const currentIndex = ref(0)                 // 当前题目索引
const prevTileSetMode = ref(tileSetMode.value) // 最近一次选择的牌堆类型（用于变更时触发重开题）

// -------------------- 选项常量（国际化） --------------------
const shantenDisplayOptions = computed(() => [
  { value: 'hidden', label: t('efficiencyTrain.options.shantenDisplay.hidden') },
  { value: 'full', label: t('efficiencyTrain.options.shantenDisplay.full') },
  { value: 'tenpaiOnly', label: t('efficiencyTrain.options.shantenDisplay.tenpaiOnly') }
])
const tileSetOptions = computed(() => [
  { value: 'noHonor', label: t('efficiencyTrain.options.tileSet.noHonor') },
  { value: 'withHonor', label: t('efficiencyTrain.options.tileSet.withHonor') },
  { value: 'm', label: t('efficiencyTrain.options.tileSet.m') },
  { value: 'p', label: t('efficiencyTrain.options.tileSet.p') },
  { value: 's', label: t('efficiencyTrain.options.tileSet.s') }
])
// 新增：判断标准与提交方式选项
const judgeCriteriaOptions = computed(() => [
  { value: 'default', label: t('efficiencyTrain.options.judgeCriteria.default') },
  { value: 'volume', label: t('efficiencyTrain.options.judgeCriteria.volume') },
  { value: 'shape', label: t('efficiencyTrain.options.judgeCriteria.shape') },
  { value: 'index', label: t('efficiencyTrain.options.judgeCriteria.index') }
])
const submitModeOptions = computed(() => [
  { value: 'instant', label: t('efficiencyTrain.options.submitMode.instant') },
  { value: 'button', label: t('efficiencyTrain.options.submitMode.button') }
])

// -------------------- 公共计算/常量 --------------------
let goodShapeCache = new Map()
const baseCountMap = ref({})
const uniqueTiles = computed(() => Object.keys(baseCountMap.value))

// 牌面宽度（用于显示“正确答案”的图片宽度与题面保持一致）
const tileWidthPercent = computed(() => {
  const count = Math.max(handTiles.value.length, 1)
  return `${100 / count}%`
})

// Shanten 计算器
const calcShanten = (arr) => new Shanten().calculateShanten(arr)

// 牌面排序用：花色权重
const TYPE_ORDER = { m: 0, p: 1, s: 2, z: 3 }
// 牌面数值：'0' 视为 5.5（赤5 与普通5之间）
const numVal = (n) => (n === '0' ? 5.5 : +n)

// -------------------- 牌堆/洗牌/排序 --------------------
// 生成某一花色全套牌（包括赤5）
const buildSuitTiles = (type) => {
  const tiles = []
  for (let n = 1; n <= 9; n++) {
    if (n === 5) {
      tiles.push(...Array(3).fill(`5${type}`), `0${type}`)
    } else {
      tiles.push(...Array(4).fill(`${n}${type}`))
    }
  }
  return tiles
}

// 按牌堆模式生成完整牌山
const generateTiles = (mode) => {
  const suits = ['m', 'p', 's']
  const tiles = []
  if (mode === 'noHonor' || mode === 'withHonor') {
    for (const type of suits) tiles.push(...buildSuitTiles(type))
  } else {
    // 清一色：仅生成一种花色
    tiles.push(...buildSuitTiles(mode))
  }
  if (mode === 'withHonor') {
    for (let n = 1; n <= 7; n++) tiles.push(...Array(4).fill(`${n}z`))
  }
  return tiles
}

// 计数映射（tile -> count）
const buildCountMap = (tiles) => {
  const map = {}
  for (const t of tiles) map[t] = (map[t] || 0) + 1
  return map
}

// Fisher-Yates 洗牌
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

// 统一的手牌排序：m->p->s->z；同花色按数值升序（赤5介于5与6之间）
const sortTiles = (tiles) => {
  return [...tiles].sort((a, b) => {
    const ta = a.slice(-1), tb = b.slice(-1)
    if (TYPE_ORDER[ta] !== TYPE_ORDER[tb]) return TYPE_ORDER[ta] - TYPE_ORDER[tb]
    const na = numVal(a[0]), nb = numVal(b[0])
    return na - nb
  })
}

// 渲染进张时进行稳定排序（避免受 Object.keys 插入顺序影响）
const formatImprovements = (improvements) =>
  sortTiles(Object.keys(improvements)).join(', ')

// 手牌 -> 紧凑字符串（UI展示用）
const convertToTilesStr = (tiles) => {
  const grouped = { m: [], p: [], s: [], z: [] }
  for (const t of tiles) {
    const tp = t.slice(-1)
    const n = t[0]
    grouped[tp].push(n)
  }
  let res = ''
  for (const tp of ['m', 'p', 's', 'z']) {
    if (!grouped[tp].length) continue
    grouped[tp].sort((a, b) => numVal(a) - numVal(b))
    res += grouped[tp].join('') + tp
  }
  return res
}

// 手牌 -> 34进制计数数组（更轻量的字符串处理）
const convertToTiles34Arr = (tiles) => {
  const arr = Array(34).fill(0)
  for (const t of tiles) {
    const n = t[0] === '0' ? 5 : +t[0]        // 红5归一化为5
    const tp = t.slice(-1)
    let idx
    if (tp === 'm') idx = n - 1
    else if (tp === 'p') idx = 9 + (n - 1)
    else if (tp === 's') idx = 18 + (n - 1)
    else if (tp === 'z') idx = 27 + (n - 1)
    if (idx !== undefined) arr[idx]++
  }
  return arr
}

// -------------------- 剩余牌/好型率 --------------------
// 构建手牌计数（对象形式）
const buildHandCountMap = (hand) => {
  const cnt = {}
  for (const t of hand) cnt[t] = (cnt[t] || 0) + 1
  return cnt
}

// 计算剩余牌（基于 baseCountMap 与当前手牌计数）
const remainingCounts = (handCount) => {
  const res = {}
  for (const tile of uniqueTiles.value) {
    const left = (baseCountMap.value[tile] || 0) - (handCount[tile] || 0)
    if (left > 0) res[tile] = left
  }
  return res
}

// 好型率计算（递归+记忆化，深度有限）
// 说明：保持 ThreeHundred/Discard 中同样判断标准与实现
const MAX_GOOD_SHAPE_DEPTH = 3
const calculateGoodShapeRate = (hand, arr34, depth = 0) => {
  const key = arr34.join(',') + '|' + depth
  if (goodShapeCache.has(key)) return goodShapeCache.get(key)
  if (depth > MAX_GOOD_SHAPE_DEPTH) return 0

  const shanten = calcShanten(arr34)
  // 听牌时：统计和张数量与种类，用“>1种且>4张”视为好型
  if (shanten === 0) {
    const handCount = buildHandCountMap(hand)
    const rem = remainingCounts(handCount)
    const waitTypes = new Set()
    let waitCount = 0
    for (const [tile, count] of Object.entries(rem)) {
      const tempHand = [...hand, tile]
      const temp34 = convertToTiles34Arr(tempHand)
      if (calcShanten(temp34) === -1) {
        waitTypes.add(tile)
        waitCount += count
      }
    }
    const res = (waitTypes.size > 1 && waitCount > 4) ? 1 : 0
    goodShapeCache.set(key, res)
    return res
  }

  // 非听牌：探索改良路径（摸一张/打一张），取路径最佳率的期望
  const handCount = buildHandCountMap(hand)
  const rem = remainingCounts(handCount)
  let total = 0
  let good = 0

  for (const [tile, count] of Object.entries(rem)) {
    const tempHand = [...hand, tile]
    const temp34 = convertToTiles34Arr(tempHand)
    const newShanten = calcShanten(temp34)
    if (newShanten < shanten) {
      let bestPath = 0
      const seen = new Set()
      for (let i = 0; i < tempHand.length; i++) {
        const d = tempHand[i]
        if (seen.has(d)) continue
        seen.add(d)
        const discardHand = tempHand.slice()
        discardHand.splice(i, 1)
        const discard34 = convertToTiles34Arr(discardHand)
        if (calcShanten(discard34) < shanten) {
          bestPath = Math.max(bestPath, calculateGoodShapeRate(discardHand, discard34, depth + 1))
        }
      }
      total += count
      good += count * bestPath
    }
  }

  const res = total === 0 ? 0 : good / total
  goodShapeCache.set(key, res)
  return res
}

// -------------------- 进张分析（切牌 -> 摸牌改良） --------------------
const analyzeImprovement = (currentHand, current34) => {
  const results = {}
  const originalShanten = calcShanten(current34)
  const globalHandCount = buildHandCountMap(currentHand)

  currentHand.forEach((tileToDiscard, discardIndex) => {
    // 去掉某张的手牌
    const newHand = currentHand.filter((_, i) => i !== discardIndex)

    // 局部更新计数（避免全量重算）
    const newHandCount = { ...globalHandCount }
    newHandCount[tileToDiscard]--
    if (newHandCount[tileToDiscard] === 0) delete newHandCount[tileToDiscard]

    const new34 = convertToTiles34Arr(newHand)
    const rem = remainingCounts(newHandCount)

    const improvements = {}
    let totalCount = 0

    for (const [tile, count] of Object.entries(rem)) {
      const tempHand = [...newHand, tile]
      const temp34 = convertToTiles34Arr(tempHand)
      if (calcShanten(temp34) < originalShanten) {
        improvements[tile] = count
        totalCount += count
      }
    }

    if (totalCount > 0) {
      const goodShapeRate = Math.max(0, calculateGoodShapeRate(newHand, new34) * 100)
      results[tileToDiscard] = { improvements, totalCount, goodShapeRate }
    }
  })

  return results
}

// ==================== 指数计算：番估计 / 期望递归 / 加权与惩罚 ====================
// 基础分类与工具
const isHonor = (t) => t.endsWith('z')
const isTerminal = (t) => !isHonor(t) && (t[0] === '1' || t[0] === '9')
const suitOf = (t) => t.slice(-1)
const isRed = (t) => t[0] === '0'

// 对对和（14张）：4刻子1雀头（红5并到5处理）
function isToitoiAgari34(arr34) {
  for (let i = 0; i < 34; i++) {
    if (arr34[i] >= 2) {
      let ok = true
      for (let j = 0; j < 34; j++) {
        const rem = arr34[j] - (j === i ? 2 : 0)
        if (rem < 0 || rem % 3 !== 0) { ok = false; break }
      }
      if (ok) return true
    }
  }
  return false
}
// 三色同顺（启发）
function hasSanshokuDoujun(arr34) {
  const offs = [0, 9, 18]
  for (let r = 0; r <= 6; r++) {
    let ok = true
    for (const o of offs) {
      if (!(arr34[o + r] > 0 && arr34[o + r + 1] > 0 && arr34[o + r + 2] > 0)) { ok = false; break }
    }
    if (ok) return true
  }
  return false
}
// 一气通贯（启发）
function hasIttsuu(arr34) {
  const offs = [0, 9, 18]
  for (const o of offs) {
    const a = Math.min(arr34[o + 0], arr34[o + 1], arr34[o + 2])
    const b = Math.min(arr34[o + 3], arr34[o + 4], arr34[o + 5])
    const c = Math.min(arr34[o + 6], arr34[o + 7], arr34[o + 8])
    if (a >= 1 && b >= 1 && c >= 1) return true
  }
  return false
}
// 七对/国士
function isChiitoi(hand) {
  if (hand.length !== 14) return false
  const cnt = buildHandCountMap(hand)
  let pairs = 0
  for (const c of Object.values(cnt)) {
    if (c === 2) pairs++
    else if (c === 1 || c === 3 || c === 4) return false
  }
  return pairs === 7
}
function isKokushi(hand) {
  if (hand.length !== 14) return false
  const req = new Set(['1m','9m','1p','9p','1s','9s','1z','2z','3z','4z','5z','6z','7z'])
  const cnt = buildHandCountMap(hand)
  let pairFound = false
  for (const r of req) {
    if (!cnt[r]) return false
    if (cnt[r] >= 2) pairFound = true
  }
  for (const t of Object.keys(cnt)) if (!req.has(t)) return false
  return pairFound
}

// 番估计（门清近似）
function estimateHanStandard(hand) {
  const cnt = buildHandCountMap(hand)
  const reds = hand.filter(isRed).length
  const suits = new Set(hand.filter(t => !isHonor(t)).map(suitOf))
  const hasHonor = hand.some(isHonor)
  const arr34 = convertToTiles34Arr(hand)
  let han = 0
  // 混一/清一
  han += (suits.size === 1) ? (hasHonor ? 3 : 6) : 0
  // 断幺
  han += hand.some(t => isHonor(t) || isTerminal(t)) ? 0 : 1
  // 三元刻
  for (const d of ['5z','6z','7z']) if ((cnt[d] || 0) >= 3) han += 1
  // 对对和 或 顺子类
  if (isToitoiAgari34(arr34)) {
    han += 2
  } else {
    if (hasSanshokuDoujun(arr34)) han += 2
    if (hasIttsuu(arr34)) han += 2
  }
  // 赤宝
  han += reds
  return han
}
function estimateHanChiitoi(hand) {
  let han = 2
  const hasTermOrHonor = hand.some(t => isHonor(t) || isTerminal(t))
  if (!hasTermOrHonor) han += 1
  const suits = new Set(hand.filter(t => !isHonor(t)).map(suitOf))
  const hasHonor = hand.some(isHonor)
  if (suits.size === 1) han += hasHonor ? 3 : 6
  han += hand.filter(isRed).length
  return han
}
function calcChildRonPointByHanFu(han, fu) {
  if (han <= 0) return 0
  if (han >= 13) return 32000
  if (han >= 11) return 24000
  if (han >= 8) return 16000
  if (han >= 6) return 12000
  if (han >= 5) return 8000
  const basic = fu * Math.pow(2, 2 + han)
  const ron = basic * 4
  return Math.ceil(ron / 100) * 100
}
function estimateAgariPointIndex(hand14) {
  if (isKokushi(hand14)) return 32000
  if (isChiitoi(hand14)) {
    const han = estimateHanChiitoi(hand14)
    return calcChildRonPointByHanFu(han, 25)
  }
  let han = estimateHanStandard(hand14)
  if (han <= 0) han = 1 // 立直
  return calcChildRonPointByHanFu(han, 30)
}

// 权重枚举
function enumerateWaitTilesWeighted(hand13) {
  const res = []
  const rem = remainingCounts(buildHandCountMap(hand13))
  if (calcShanten(convertToTiles34Arr(hand13)) !== 0) return res
  for (const [t, left] of Object.entries(rem)) {
    const test = [...hand13, t]
    if (calcShanten(convertToTiles34Arr(test)) === -1) res.push([t, left])
  }
  return res
}
function enumerateImprovingTilesWeighted(hand13) {
  const res = []
  const rem = remainingCounts(buildHandCountMap(hand13))
  const s = calcShanten(convertToTiles34Arr(hand13))
  for (const [t, left] of Object.entries(rem)) {
    const test = [...hand13, t]
    if (calcShanten(convertToTiles34Arr(test)) < s) res.push([t, left])
  }
  return res
}

// 递归V13（带权）
const handKey = (tiles) => sortTiles(tiles).join(',')
function makeEvaluator(depthMax = 2) {
  const memo13 = new Map()
  const V13 = (hand13, depth) => {
    const key = handKey(hand13) + '|' + depth
    if (memo13.has(key)) return memo13.get(key)

    const s = calcShanten(convertToTiles34Arr(hand13))
    if (s === 0) {
      const waits = enumerateWaitTilesWeighted(hand13)
      if (waits.length === 0) { memo13.set(key, 0); return 0 }
      let wSum = 0, vSum = 0
      for (const [w, cnt] of waits) {
        vSum += cnt * estimateAgariPointIndex([...hand13, w])
        wSum += cnt
      }
      const avg = vSum / wSum
      memo13.set(key, avg)
      return avg
    }

    if (depth <= 0) { memo13.set(key, 0); return 0 }
    const improves = enumerateImprovingTilesWeighted(hand13)
    if (improves.length === 0) { memo13.set(key, 0); return 0 }

    let wSum = 0, vSum = 0
    for (const [draw, cnt] of improves) {
      const afterDraw14 = [...hand13, draw]
      let best = 0
      for (let i = 0; i < afterDraw14.length; i++) {
        const next13 = afterDraw14.slice()
        next13.splice(i, 1)
        best = Math.max(best, V13(next13, depth - 1))
      }
      vSum += cnt * best
      wSum += cnt
    }
    const avg = vSum / wSum
    memo13.set(key, avg)
    return avg
  }

  const expectedPointIndexByDiscard = (hand14, allowedSet) => {
    const map = {}
    const allow = allowedSet ? new Set(allowedSet) : null
    for (let i = 0; i < hand14.length; i++) {
      const d = hand14[i]
      if (allow && !allow.has(d)) continue
      if (map[d] !== undefined) continue
      const next13 = hand14.slice()
      next13.splice(i, 1)
      map[d] = V13(next13, depthMax)
    }
    return map
  }
  return { expectedPointIndexByDiscard }
}

// 加权与惩罚项
const ALPHA_SHAPE = 1.2
const BETA_VOLUME = 1.6
const GAMMA_SHAPE = 2.0
const GAMMA_VOLUME = 2.4
function applyShapeAndVolumeWeights(baseMap, impMap) {
  const totals = Object.values(impMap || {}).map(v => v?.totalCount || 0)
  const maxTotal = Math.max(1, ...(totals.length ? totals : [0]))
  const adjusted = {}
  for (const [k, base] of Object.entries(baseMap || {})) {
    const info = impMap?.[k]
    const shapeNorm = info ? Math.max(0, (info.goodShapeRate || 0) / 100) : 0
    const volumeNorm = info ? Math.min(1, (info.totalCount || 0) / maxTotal) : 0
    const shapeWeighted = Math.pow(shapeNorm, GAMMA_SHAPE)
    const volumeWeighted = Math.pow(volumeNorm, GAMMA_VOLUME)
    adjusted[k] = (base || 1000) * (1 + ALPHA_SHAPE * shapeWeighted) * (1 + BETA_VOLUME * volumeWeighted)
  }
  return adjusted
}
function tileDigitPenalty(tile) {
  if (!tile || tile.length < 2) return 0
  const type = tile.slice(-1)
  if (type === 'z') return 0
  const nChar = tile[0]
  const val = nChar === '0' ? 5 : parseInt(nChar, 10)
  if (!Number.isFinite(val) || val < 1 || val > 9) return 0
  return val <= 5 ? val : 10 - val
}
function applyDiscardDigitPenalty(map) {
  const res = { ...(map || {}) }
  for (const k of Object.keys(res)) {
    const p = tileDigitPenalty(k)
    if (p > 0) res[k] = (res[k] || 0) - 3 * p
    // 新增：赤5切牌（0m/0p/0s）额外惩罚 -480
    if (k === '0m' || k === '0p' || k === '0s') {
      res[k] = (res[k] || 0) - 480
    }
  }
  return res
}

// -------------------- UI/状态更新与判题 --------------------
// 判题容差（指数差值<=100 视为正确）
const INDEX_CORRECT_TOLERANCE = 100

// 更新当前手牌相关状态
const updateTilesState = (tiles) => {
  tilesStr.value = convertToTilesStr(tiles)
  tiles34Arr.value = convertToTiles34Arr(tiles)
  shantenNum.value = calcShanten(tiles34Arr.value)
}

// 重算进张分析 + 指数
const recalcImprovementResults = (hand = handTiles.value) => {
  goodShapeCache = new Map()
  improvementResults.value = analyzeImprovement(hand, convertToTiles34Arr(hand))
  const allowedDiscards = Object.keys(improvementResults.value || {})
  if (!allowedDiscards.length) {
    expectedPointResults.value = {}
    return
  }
  const { expectedPointIndexByDiscard } = makeEvaluator(2)
  const baseMap = expectedPointIndexByDiscard(hand, allowedDiscards)
  if (!Object.keys(baseMap).length) {
    expectedPointResults.value = {}
    return
  }
  expectedPointResults.value = applyShapeAndVolumeWeights(baseMap, improvementResults.value)
  expectedPointResults.value = applyDiscardDigitPenalty(expectedPointResults.value)
}

// 折叠展开回调：需要时才计算
const handleAnalysisToggle = () => {
  if (showResult.value) recalcImprovementResults()
}

// 结果表排序：按判定逻辑切换排序依据
const sortedImprovementResults = computed(() => {
  const entries = Object.entries(improvementResults.value || {})
  const criterion = judgeCriteria.value

  if (criterion === 'shape') {
    // 好型率优先，其次进张数
    return entries.sort(
      (a, b) =>
        ((b[1].goodShapeRate || 0) - (a[1].goodShapeRate || 0)) ||
        ((b[1].totalCount || 0) - (a[1].totalCount || 0))
    )
  } else if (criterion === 'index') {
    // 指数优先，其次进张数
    return entries.sort(
      (a, b) =>
        ((expectedPointResults.value[b[0]] || 0) - (expectedPointResults.value[a[0]] || 0)) ||
        ((b[1].totalCount || 0) - (a[1].totalCount || 0))
    )
  } else {
    // 默认（混合）与进张数：按总进张，其次指数
    return entries.sort(
      (a, b) =>
        ((b[1].totalCount || 0) - (a[1].totalCount || 0)) ||
        ((expectedPointResults.value[b[0]] || 0) - (expectedPointResults.value[a[0]] || 0))
    )
  }
})

// 判题：指数容差内判对（<= 60）并列全对
const evaluateDiscardChoice = (discardedTile, results) => {
  if (!Object.keys(results).length) {
    lastDiscardResult.value = {
      type: 'invalid',
      isCorrect: false,
      messageKey: 'efficiencyTrain.result.messages.errShantenBack',
      correctChoices: [],
      discardedTile
    }
    return
  }
  if (!Object.keys(expectedPointResults.value || {}).length) {
    recalcImprovementResults()
  }
  const idxMap = expectedPointResults.value || {}
  let correctChoices = []

  if (judgeCriteria.value === 'volume') {
    const maxVol = Math.max(...Object.values(results).map(r => r.totalCount || 0))
    correctChoices = Object.keys(results).filter(k => (results[k]?.totalCount || 0) === maxVol)
  } else if (judgeCriteria.value === 'shape') {
    const maxShape = Math.max(...Object.values(results).map(r => r.goodShapeRate || 0))
    const threshold = maxShape - 2
    correctChoices = Object.keys(results).filter(k => (results[k]?.goodShapeRate || 0) >= threshold)
  } else if (judgeCriteria.value === 'index') {
    const vals = Object.values(idxMap)
    if (!vals.length) {
      lastDiscardResult.value = {
        type: 'invalid',
        isCorrect: false,
        messageKey: 'efficiencyTrain.result.messages.errShantenBack',
        correctChoices: [],
        discardedTile
      }
      return
    }
    const maxVal = Math.max(...vals)
    const threshold = maxVal - INDEX_CORRECT_TOLERANCE
    correctChoices = Object.keys(idxMap).filter(k => (idxMap[k] || 0) >= threshold - 1e-9)
  } else {
    // default
    const maxVol = Math.max(...Object.values(results).map(r => r.totalCount || 0))
    const volCandidates = new Set(Object.keys(results).filter(k => (results[k]?.totalCount || 0) === maxVol))
    const vals = Object.values(idxMap)
    if (!vals.length) {
      correctChoices = Array.from(volCandidates)
    } else {
      const maxIdx = Math.max(...vals)
      const threshold = maxIdx - INDEX_CORRECT_TOLERANCE
      const idxCandidates = new Set(Object.keys(idxMap).filter(k => (idxMap[k] || 0) >= threshold - 1e-9))
      correctChoices = Array.from(new Set([...volCandidates, ...idxCandidates]))
    }
  }

  // 新增：当 0m/0p/0s 不作为“唯一的答案”时，从答案里去掉它们
  // 仅当正确答案集合“恰好为一个且为赤5”时保留赤5；否则过滤掉 0m/0p/0s
  {
    const redFives = new Set(['0m', '0p', '0s'])
    const keepRedFiveOnly = (correctChoices.length === 1 && redFives.has(correctChoices[0]))
    if (!keepRedFiveOnly) {
      correctChoices = correctChoices.filter(k => !redFives.has(k))
    }
  }

  const isCorrect = correctChoices.includes(discardedTile)
  lastDiscardResult.value = {
    type: isCorrect ? 'best' : 'suboptimal',
    isCorrect,
    messageKey: isCorrect ? 'efficiencyTrain.result.messages.correct' : 'efficiencyTrain.result.messages.wrongNotMax',
    correctChoices,
    discardedTile
  }
}

// 修改：点击手牌逻辑（按提交方式分流）
const handleTileClick = (clickedTile) => {
  if (Object.keys(improvementResults.value).length === 0) {
    recalcImprovementResults()
  }
  if (submitMode.value === 'instant') {
    evaluateDiscardChoice(clickedTile, improvementResults.value)
    showResult.value = true
    selectedDiscard.value = null
  } else {
    selectedDiscard.value = clickedTile
  }
}

// 新增：提交按钮回调
const handleSubmitDiscard = () => {
  if (!selectedDiscard.value) return
  evaluateDiscardChoice(selectedDiscard.value, improvementResults.value)
  showResult.value = true
  selectedDiscard.value = null
}

// 新增：屏幕尺寸监听（大屏时强制 instant）
const isSmallScreen = ref(false)
const WIDTH_STORAGE_KEY = 'threehundred-content-width'
const WIDTH_CHANGE_EVENT = 'threehundred-content-width-change'
const clampWidth = (value) => Math.min(100, Math.max(40, Number.isFinite(value) ? value : 100))
const getSavedContentWidth = () => {
  try {
    const stored = parseInt(localStorage.getItem(WIDTH_STORAGE_KEY), 10)
    return clampWidth(Number.isFinite(stored) ? stored : 100)
  } catch {
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
const contentWidthDisplay = computed(() => (isSmallScreen.value ? 100 : contentWidth.value))

const updateScreenSize = () => {
  isSmallScreen.value = window.innerWidth < 640
  if (!isSmallScreen.value && submitMode.value === 'button') {
    submitMode.value = 'instant'
  }
}
const handleWidthBroadcast = (event) => {
  if (typeof event.detail !== 'number') return
  const clamped = clampWidth(event.detail)
  if (clamped === contentWidth.value) return
  widthUpdateFromEvent = true
  contentWidth.value = clamped
}
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
  try { localStorage.setItem(WIDTH_STORAGE_KEY, String(clamped)) } catch {}
  window.dispatchEvent(new CustomEvent(WIDTH_CHANGE_EVENT, { detail: clamped }))
})
onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
  window.addEventListener(WIDTH_CHANGE_EVENT, handleWidthBroadcast)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
  window.removeEventListener(WIDTH_CHANGE_EVENT, handleWidthBroadcast)
})

// -------------------- 题目生成（含清一色目标向听概率） --------------------
// 清一色下目标向听概率：10%两向听，60%一向听，30%听牌
const pickTargetShanten = () => {
  const r = Math.random()
  if (r < 0.10) return 2
  if (r < 0.70) return 1
  return 0
}

const genDeckAndHand14 = (mode) => {
  const deck = generateTiles(mode)
  shuffleArray(deck)
  return { deck, hand14: deck.slice(0, 14) }
}

const shantenOf14 = (hand14) => calcShanten(convertToTiles34Arr(hand14))

// 初始化或生成新题（内部使用）
const initializeGame = () => {
  // 清一色：按概率锁定目标向听
  if (['m', 'p', 's'].includes(tileSetMode.value)) {
    const target = pickTargetShanten()
    const MAX_TRY = 8000
    let chosen = null
    let best = null
    let bestDiff = Infinity

    for (let i = 0; i < MAX_TRY; i++) {
      const cand = genDeckAndHand14(tileSetMode.value)
      const s = shantenOf14(cand.hand14)
      if (s === target) { chosen = cand; break }
      const diff = Math.abs(s - target)
      if (diff < bestDiff) { best = cand; bestDiff = diff }
    }

    const finalPack = chosen || best
    const deck = finalPack.deck
    const initialHand = finalPack.hand14

    // 修复：用“未洗牌的有序全牌集”来构建计数映射，保证键顺序稳定
    baseCountMap.value = buildCountMap(generateTiles(tileSetMode.value))
    tilesWall.value = deck.slice(14)

    const sorted13 = sortTiles(initialHand.slice(0, 13))
    const newHand = [...sorted13, initialHand[13]]

    handTiles.value = newHand
    showResult.value = false
    lastDiscardResult.value = null
    updateTilesState(newHand)
    recalcImprovementResults(newHand)
    return
  }

  // 非清一色：普通随机
  const deck = generateTiles(tileSetMode.value)
  baseCountMap.value = buildCountMap(deck)
  shuffleArray(deck)
  const initialHand = deck.slice(0, 14)
  tilesWall.value = deck.slice(14)

  const sorted13 = sortTiles(initialHand.slice(0, 13))
  const newHand = [...sorted13, initialHand[13]]

  handTiles.value = newHand
  showResult.value = false
  lastDiscardResult.value = null
  updateTilesState(newHand)
  recalcImprovementResults(newHand)
}

// -------------------- 历史题目（上一题/下一题） --------------------
// 拍快照（保存必要状态）
const snapshotCurrentQuestion = () => ({
  hand: [...handTiles.value],
  baseCount: { ...baseCountMap.value },
  tileSet: tileSetMode.value
})

// 应用快照（还原状态）
const applyQuestionSnapshot = (q) => {
  tileSetMode.value = q.tileSet
  baseCountMap.value = { ...q.baseCount }
  handTiles.value = [...q.hand]
  showResult.value = false
  lastDiscardResult.value = null
  updateTilesState(handTiles.value)
  recalcImprovementResults(handTiles.value)
}

// 下一题：生成新题并入栈
const nextQuestion = () => {
  // 若用户回看历史题目，前进需丢弃“未来历史”
  if (currentIndex.value < questions.value.length - 1) {
    questions.value = questions.value.slice(0, currentIndex.value + 1)
  }
  initializeGame()
  questions.value.push(snapshotCurrentQuestion())
  currentIndex.value = questions.value.length - 1
}

// 上一题：回退历史并还原
const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
    applyQuestionSnapshot(questions.value[currentIndex.value])
  }
}

// 牌堆类型变化：若与上次不同，清空历史并生成新题
const handleTileSetChange = (newMode) => {
  if (newMode !== prevTileSetMode.value) {
    prevTileSetMode.value = newMode
    questions.value = []
    currentIndex.value = 0
    nextQuestion()
  }
}

// 向听显示变化：只影响显示，不重开题
const handleShantenDisplayChange = (mode) => {
  shantenDisplayMode.value = mode
}

// 初始化：首次进入生成第一题
onMounted(() => {
  nextQuestion()
})
</script>

<style scoped>
/* 牌面图片：自适应容器宽度，保持纵横比 */
.tile-img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
</style>