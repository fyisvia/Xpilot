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
              // 新增：按钮提交模式下，已选择牌变灰；计算中半透明
              filter: ((isSmallScreen && submitMode === 'button' && selectedDiscard === tile) || isCalculating) ? 'grayscale(0%) brightness(1)' : undefined,
              opacity: ((isSmallScreen && submitMode === 'button' && selectedDiscard === tile) || isCalculating) ? '1' : undefined,
              pointerEvents: isCalculating ? 'none' : undefined
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
        :disabled="currentIndex === 0 || isCalculating"
        @click="prevQuestion"
      >
        {{ t('efficiencyTrain.buttons.prev') }}
      </button>
      <button
        v-if="isSmallScreen && submitMode === 'button'"
        class="btn btn-sm text-sm sm:text-base px-4 btn-primary"
        :disabled="!selectedDiscard || isCalculating"
        @click="handleSubmitDiscard"
      >
        {{ t('efficiencyTrain.buttons.submit') }}
      </button>
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        :disabled="isCalculating"
        @click="nextQuestion"
      >
        {{ t('efficiencyTrain.buttons.next') }}
      </button>
    </li>

    <li class="p-4">
      <div class="flex items-center gap-2 pb-4">
        <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
          <input type="checkbox" v-model="showResult" @change="handleAnalysisToggle" :disabled="isCalculating"/>
          <div class="collapse-title text-base sm:text-lg font-semibold text-center pl-12">
            {{ isCalculating ? t('discard.loading') : t('efficiencyTrain.analysis.title') }}
            <span v-if="isCalculating" class="loading loading-spinner loading-sm ml-2"></span>
          </div>
          <div class="collapse-content text-sm sm:text-base md:text-lg mb-0" :class="{ '!p-0 !pb-0 !min-h-0 !border-0': isCalculating }">
            <div class="overflow-x-auto" v-if="!isCalculating">
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
                      <td class="font-bold text-center">
                        <img
                          v-if="tile"
                          :src="tileSrc(tile)"
                          :alt="tile"
                          class="inline-block align-middle object-contain"
                          style="width: 2em; height: 3em;"
                        />
                        <span v-else>—</span>
                      </td>
                      <td class="text-center">
                        <template v-for="(item, idx) in formatImprovementsList(result.improvements, result.improvementsQuality)" :key="item.tile + '-' + idx">
                          <img
                            :src="tileSrc(item.tile)"
                            :alt="item.tile"
                            class="inline-block align-middle object-contain"
                            style="width: 2em; height: 3em;"
                          />
                          <span class="improvement-dots" :aria-label="t('efficiencyTrain.table.improvements') + ' ' + item.tile + ' ' + item.count">
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
import { evaluateHand } from '../utils/evaluation'

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
// 新增：计算状态
const isCalculating = ref(false)

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
// let goodShapeCache = new Map() // Moved to utils/evaluation
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
const formatImprovementsList = (improvements, improvementsQuality = {}) => {
  if (!improvements || typeof improvements !== 'object') return []
  return sortTiles(Object.keys(improvements))
    .filter((tile) => (improvements[tile] || 0) > 0)
    .map((tile) => ({ tile, count: improvements[tile], goodShape: improvementsQuality?.[tile] }))
}

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

// 听牌好型判定（与 calculateGoodShapeRate 中的听牌判定逻辑一致）
const isGoodShapeTenpai = (hand) => {
  if (!Array.isArray(hand) || hand.length === 0) return false

  const isGoodWaitsFor13 = (hand13) => {
    const handCount = buildHandCountMap(hand13)
    const rem = remainingCounts(handCount)
    let waitTypes = new Set(), waitCount = 0
    for (const [tile, count] of Object.entries(rem)) {
      const tempHand = [...hand13, tile]
      const tempTiles34 = convertToTiles34Arr(tempHand)
      if (calcShanten(tempTiles34) === -1) {
        waitTypes.add(tile)
        waitCount += count
      }
    }
    return (waitTypes.size > 1 && waitCount > 4)
  }

  // 若为14张（摸牌后），先尝试弃一张进入听牌再判好型
  if (hand.length % 3 === 2) {
    for (let i = 0; i < hand.length; i++) {
      const reduced = hand.slice(0, i).concat(hand.slice(i + 1))
      const reducedTiles34 = convertToTiles34Arr(reduced)
      if (calcShanten(reducedTiles34) === 0) {
        if (isGoodWaitsFor13(reduced)) return true
      }
    }
    return false
  }

  return isGoodWaitsFor13(hand)
}


// (Logic moved to @/utils/evaluation.js)


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
  // Use new utility
  const handCount = buildHandCountMap(hand)
  const remMap = remainingCounts(handCount)
  const results = evaluateHand(hand, remMap)

  const imp = {}
  const exp = {}

  for (const [tile, data] of Object.entries(results)) {
    // Only include if it makes sense (part of hand)
    const improvementsQuality = {}
    if (shantenNum.value === 1) {
      const discardIndex = hand.findIndex((x) => x === tile)
      const baseHand = discardIndex >= 0 ? hand.slice(0, discardIndex).concat(hand.slice(discardIndex + 1)) : [...hand]
      for (const [impTile] of Object.entries(data.improvements || {})) {
        const tempHand = [...baseHand, impTile]
        const tempTiles34 = convertToTiles34Arr(tempHand)
        if (calcShanten(tempTiles34) === 0) {
          improvementsQuality[impTile] = isGoodShapeTenpai(tempHand)
        }
      }
    }
    imp[tile] = {
        totalCount: data.totalCount,
        goodShapeRate: data.goodShapeRate || 0,
        improvements: data.improvements,
        improvementsQuality
    }
    exp[tile] = data.evIndex
  }

  improvementResults.value = imp
  expectedPointResults.value = exp
}


// 折叠展开回调：不再重复计算，因为已预先计算并缓存
const handleAnalysisToggle = () => {
  // if (showResult.value) recalcImprovementResults()
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
  if (isCalculating.value) return
  
  if (Object.keys(improvementResults.value).length === 0) {
    // 理论上已经在 initializeGame 中计算了，但为了保险
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
    
    // 异步计算，避免阻塞 UI 渲染
    improvementResults.value = {}
    expectedPointResults.value = {}
    isCalculating.value = true
    setTimeout(() => {
        recalcImprovementResults(newHand)
        isCalculating.value = false
    }, 50)
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

  // 异步计算
  improvementResults.value = {}
  expectedPointResults.value = {}
  isCalculating.value = true
  setTimeout(() => {
      recalcImprovementResults(newHand)
      isCalculating.value = false
  }, 50)
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
  
  // 异步计算
  improvementResults.value = {}
  expectedPointResults.value = {}
  isCalculating.value = true
  setTimeout(() => {
    recalcImprovementResults(handTiles.value)
    isCalculating.value = false
  }, 50)
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
</style>