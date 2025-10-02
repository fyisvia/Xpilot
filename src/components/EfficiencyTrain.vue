// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

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

    <li class="p-4 pb-2 opacity-100 tracking-wide text-base sm:text-lg font-semibold">
      <span>{{ t('efficiencyTrain.ui.handTitle') }}</span>
    </li>

    <li class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide">
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
              transform: hoveredIndex === index ? 'translateY(-5px)' : 'none'
            }"
          />
        </template>
      </div>
    </li>
    
    <li class="p-4 pb-2 text-xs md:text-base opacity-80 tracking-wide flex justify-end mx-2">
      <div>{{ t('efficiencyTrain.ui.clickHint') }}</div>
    </li>

    <li v-if="lastDiscardResult" class="p-2">
      <div class="flex flex-col items-center gap-3">
        <div :class="lastDiscardResult.isCorrect ? 'badge badge-success' : 'badge badge-error'" class="inline-flex items-center gap-1 text-lg font-bold">
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
              <div class="responsive-table-wrapper">
                <table class="table table-sm w-full bg-base-100 rounded-lg">
                  <thead>
                    <tr>
                      <th class="text-center">{{ t('efficiencyTrain.table.cut') }}</th>
                      <th class="text-center">{{ t('efficiencyTrain.table.improvements') }}</th>
                      <th class="text-center">{{ t('efficiencyTrain.table.goodShapeRate') }}</th>
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
import { ref, computed, onMounted } from 'vue'
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
const lastDiscardResult = ref(null)         // 最近一次答题结果（正确/错误）
const showResult = ref(false)               // “进张数分析”折叠是否展开
const shantenDisplayMode = ref('hidden')    // 向听显示模式：hidden / full / tenpaiOnly
const tileSetMode = ref('noHonor')          // 牌堆类型：noHonor/withHonor/m/p/s（清一色）

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

// -------------------- UI/状态更新与判题 --------------------
// 更新当前手牌相关状态
const updateTilesState = (tiles) => {
  tilesStr.value = convertToTilesStr(tiles)
  tiles34Arr.value = convertToTiles34Arr(tiles)
  shantenNum.value = calcShanten(tiles34Arr.value)
}

// 重算进张分析
const recalcImprovementResults = (hand = handTiles.value) => {
  goodShapeCache = new Map() // 清空记忆化缓存，确保结果一致
  improvementResults.value = analyzeImprovement(hand, convertToTiles34Arr(hand))
}

// 折叠展开回调：需要时才计算
const handleAnalysisToggle = () => {
  if (showResult.value) recalcImprovementResults()
}

// 结果表排序：按总进张降序
const sortedImprovementResults = computed(() =>
  Object.entries(improvementResults.value)
    .sort((a, b) => b[1].totalCount - a[1].totalCount)
)

// 判题：以“总进张最多”为标准，数量相同的全部为正确答案
const evaluateDiscardChoice = (discardedTile, results) => {
  const entries = Object.entries(results)
  if (!entries.length) {
    lastDiscardResult.value = {
      type: 'invalid',
      isCorrect: false,
      messageKey: 'efficiencyTrain.result.messages.errShantenBack',
      correctChoices: [],
      discardedTile
    }
    return
  }

  const maxCount = Math.max(...entries.map(([, d]) => d.totalCount))
  const correctChoices = entries.filter(([, d]) => d.totalCount === maxCount).map(([t]) => t)
  const target = results[discardedTile]

  if (!target) {
    lastDiscardResult.value = {
      type: 'invalid',
      isCorrect: false,
      messageKey: 'efficiencyTrain.result.messages.errShantenBack',
      correctChoices,
      discardedTile
    }
    return
  }

  if (target.totalCount === maxCount) {
    lastDiscardResult.value = {
      type: 'best',
      isCorrect: true,
      messageKey: 'efficiencyTrain.result.messages.correct',
      correctChoices,
      discardedTile
    }
    return
  }

  lastDiscardResult.value = {
    type: 'suboptimal',
    isCorrect: false,
    messageKey: 'efficiencyTrain.result.messages.wrongNotMax',
    correctChoices,
    discardedTile
  }
}

// 点击手牌：仅判题并展开分析，不改动手牌/牌山
const handleTileClick = (clickedTile) => {
  if (Object.keys(improvementResults.value).length === 0) {
    recalcImprovementResults()
  }
  evaluateDiscardChoice(clickedTile, improvementResults.value)
  showResult.value = true
}

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