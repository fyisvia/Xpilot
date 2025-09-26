// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-full px-2 sm:px-8">
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
      何切三百问
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
    <li class="p-4 pb-2 text-lg sm:text-xl opacity-100 tracking-wide">
      No. {{ currentArticle.id }}
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
    <li class="p-4 sm:p-4 pb-2 text-lg sm:text-xl opacity-100 tracking-wide">
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
    <!-- <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li> -->
    <li class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide">
      <div class="flex flex-nowrap justify-start" style="gap: 0;">
        <template v-for="(img, index) in currentArticle.images2" :key="img + '-' + index">
          <div class="relative group" style="width: calc(100% / 14);">
            <img
              :src="img"
              alt=""
              class="flex-shrink-0 object-contain transition-transform duration-150 group-active:scale-95 group-hover:scale-110"
              :style="{ width: '100%', height: 'calc(1.5 * 100%)' }"
            />
            <button
              class="absolute inset-0 w-full h-full opacity-0 hover:opacity-50 transition-opacity duration-300"
              @click="handleImageClick(img)"
              tabindex="-1"
              aria-label="选择答案"
              style="pointer-events: auto;"
            ></button>
          </div>
        </template>
      </div>
    </li>
    <li class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide">
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
    <li class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide">
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
    <li class="p-4 pb-2 text-xs md:text-base opacity-80 tracking-wide flex justify-end mx-2">
      <div>⬆️直接点击选择答案</div>
    </li>
    <li class="p-2 sm:p-4 pb-2 text-sm sm:text-base md:text-lg opacity-100 tracking-wide">
      <div class="flex items-center gap-2 pb-4">
        <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
          <input type="checkbox" v-model="isAnswerCollapsed"/>
          <div class="collapse-title text-base md:text-xl font-semibold text-center  pl-12">参考答案及解析</div>
          <div class="collapse-content text-sm sm:text-base md:text-lg mb-0">
            <img
              :src="currentArticle.answerImg"
              alt=""
              class="flex-shrink-0 object-contain"
              :style="{
                width: `calc(1em * (${currentArticle.images2.length} / 5))`,
                height: `calc(1.5em * (${currentArticle.images2.length} / 5))`
              }"
            >
            <br>
            <a class="opacity-100">解析:</a>
            <br>
            <div class="inline-flex flex-wrap items-center gap-1 text-justify" style="text-wrap: balance; word-break: keep-all;">
              <template v-for="(part, idx) in currentArticle.explanation" :key="idx">
                <span v-if="!part.endsWith('.png')" class="opacity-100">{{ part }}</span>
                <img
                  v-else
                  :src="part"
                  alt=""
                  class="inline-block object-contain"
                  :style="{
                    width: `calc(1em * (${currentArticle.images2.length} / 10))`,
                    height: `calc(1.5em * (${currentArticle.images2.length} / 10))`
                  }"
                >
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 pb-4">
        <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
          <input type="checkbox" v-model="showResult" @change="handleAnalysisToggle"/>
            <div class="collapse-title text-base md:text-xl font-semibold text-center pl-12">进张数分析</div>
          <div class="collapse-content text-sm sm:text-base md:text-lg mb-0">
            <div class="overflow-x-auto">
              <div class="responsive-table-wrapper">
                <table class="table table-sm w-full bg-base-100 rounded-lg">
                  <thead>
                    <tr>
                      <th class="text-center">切</th>
                      <th class="text-center">进张</th>
                      <th class="text-center">好型率</th>
                      <th class="text-center">总进张</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="([tile, result], idx) in sortedImprovementResults"
                      :key="tile"
                      :class="idx % 2 === 1 ? 'hover:bg-base-300' : ''"
                    >
                      <td class="font-bold text-center">{{ tile }}</td>
                      <td class="text-center">{{ Object.keys(result.improvements).join(', ') }}</td>
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
    <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
    <li class="list-row flex flex-row justify-between items-center gap-2 w-full">
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        :disabled="currentIndex === 0"
        @click="prevArticle"
      >
        上一题
      </button>
      <div class="flex items-center gap-2">
        <input
          type="number"
          v-model="jumpToId"
          min="1"
          :max="articles.length"
          class="input input-bordered input-sm w-16 text-sm sm:text-base"
          placeholder="编号"
          @keyup.enter="jumpToArticle"
        >
        <button
          class="btn btn-sm text-sm sm:text-base px-4"
          @click="jumpToArticle"
        >
          跳转
        </button>
      </div>
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        :disabled="currentIndex === articles.length - 1"
        @click="nextArticle"
      >
        下一题
      </button>
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
  </ul>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Shanten } from '../utils/shanten'
import { articles as articlesRaw } from '../data/articles'

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
    const savedId = localStorage.getItem('threehundred-current-id')
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
    router.replace({ name: 'ThreeHundred', params: { id: newId } })
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
const errorMessage = ref(null)

const handleAnalysisToggle = () => {
  if (showResult.value && Object.keys(improvementResults.value).length === 0) {
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
    localStorage.setItem('threehundred-current-id', (index + 1).toString())
  } catch (error) {
    console.warn('无法保存到 localStorage:', error)
  }
}

const resetAnalysis = () => {
  handInput.value = ''
  showResult.value = false
  shantenNum.value = null
  improvementResults.value = {}
  errorMessage.value = null
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
  }
}

const jumpToArticle = () => {
  const id = parseInt(jumpToId.value)
  if (id >= 1 && id <= articles.value.length) {
    currentIndex.value = id - 1
    isAnswerCollapsed.value = false
    resetAnalysis()
  } else {
    alert('请输入有效的编号')
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
})

// 组件挂载时初始化
onMounted(() => {
  // 确保当前索引在有效范围内
  if (currentIndex.value >= articles.value.length) {
    currentIndex.value = 0
  }
  // 初始化时更新路由
  updateRoute(currentIndex.value)
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

// 生成剩余可用牌计数（不复制大对象，只按需要计算）
function remainingCounts(handCount) {
  const res = {}
  for (const tile of UNIQUE_TILES) {
    const left = BASE_COUNT_MAP[tile] - (handCount[tile] || 0)
    if (left > 0) res[tile] = left
  }
  return res
}

// 记忆化好型率计算（保持原逻辑，减少重复构造与排序）
const calculateGoodShapeRate = (() => {
  const cache = new Map()
  const MAX_DEPTH = 3
  function inner(hand, tiles34Arr, depth = 0) {
    const key = tiles34Arr.join(',') + '|' + depth
    if (cache.has(key)) return cache.get(key)
    if (depth > MAX_DEPTH) return 0

    const shanten = calculateShanten(tiles34Arr)
    if (shanten === 0) {
      const handCount = buildHandCountMap(hand)
      const rem = remainingCounts(handCount)
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
    const rem = remainingCounts(handCount)

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
            bestPathRate = Math.max(bestPathRate, inner(discardHand, discardTiles34, depth + 1))
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

// 提效率分析
const analyzeImprovement = (currentHand, currentTiles34) => {
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
    const rem = remainingCounts(newHandCount)

    const improvements = {}
    let totalCount = 0
    for (const [tile, count] of Object.entries(rem)) {
      const tempHand = [...newHand, tile]
      const tempTiles34 = convertToTiles34Arr(tempHand)
      if (calculateShanten(tempTiles34) < originalShanten) {
        improvements[tile] = count
        totalCount += count
      }
    }

    if (totalCount > 0) {
      const goodShapeRate = Math.max(0, calculateGoodShapeRate(newHand, newTiles34) * 100)
      results[tileToDiscard] = { improvements, totalCount, goodShapeRate }
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

const handleSubmit = () => {
  const handString = convertImages2ToHandString(currentArticle.value.images2)
  handInput.value = handString
  const handTiles = parseHandTiles(handString)
  if (!handTiles) {
    errorMessage.value = '手牌格式不正确或某牌数量过多'
    showResult.value = true
    return
  }
  const tiles34Arr = convertToTiles34Arr(handTiles)
  shantenNum.value = calculateShanten(tiles34Arr)
  improvementResults.value = analyzeImprovement(handTiles, tiles34Arr)
  errorMessage.value = null
}

const handleImageClick = img => {
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
    showMsg('回答正确！', isDark ? 'rgba(80, 120, 180, 0.8)' : 'rgba(120, 180, 255, 0.25)')
    nextArticle()
  } else {
    showMsg('回答错误！', isDark ? 'rgba(80, 80, 80, 0.65)' : 'rgba(0, 0, 0, 0.06)')
    isAnswerCollapsed.value = true
    showResult.value = true
    handleSubmit()
  }
}
</script>

<style>
.first-image {
  transform: rotate(-90deg) translateY(-16.67%) translateX(-20%);
  transform-origin: center;
}
</style>
