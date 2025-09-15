// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
    <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
      牌效率分析
    </li>
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="flex items-center gap-2 pb-4">
        <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
          <input type="checkbox" />
          <div class="collapse-title opacity-80">默认分析规则</div>
          <div class="collapse-content text-xs font-semibold opacity-60 mb-0">
            1. 默认考虑一般形式，七对子和国士无双。<br>
            2. 因为没有其他玩家和牌河，剩余枚数为最大值。<br>
            3. 不考虑巡目。<br>
            4. 好型的判断标准为听牌时进张数 > 4。
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 pb-4">
        <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
          <input type="checkbox" />
          <div class="collapse-title opacity-80">手牌表示方法</div>
          <div class="collapse-content text-xs font-semibold opacity-60 mb-0">
            " m " 表示万子，
            " p " 表示饼子，
            " s " 表示索子。<br>
            " z " 表示东南西北白发中，
            " 0 " 表示红五。<br>
            不需要输入副露的部分，可以选择是否输入摸进的牌。<br>
            输入摸进的牌时，计算内容包括各种切牌的分析。<br>
            不输入摸进的牌时，计算内容只当前手牌的进张和好型率。<br>
            举例：<br>
            012m123p123s1156z。<br>
            如果123p为副露，则只输入012m123s1156z。                  
          </div>
        </div>
      </div>
    </li>
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="flex items-center gap-2 pb-4">
        <span class="p-0 pb-0 text-base opacity-100 tracking-wide">
          输入手牌
        </span>
      </div>
      <input
        type="text"
        v-model="handInput"
        placeholder="123m456p789s1122z"
        class="input w-full text-base py-3 px-4"
        @keyup.enter="handleSubmit"
        autocomplete="off"
        aria-label="输入手牌"
      />
    </li>
    <li class="list-row flex flex-col gap-2">
      <div></div>
      <button class="btn text-lg" @click="handleSubmit">提交</button>
    </li>
    <li v-if="showResult" class="p-4">
      <div v-if="loading" class="flex justify-center items-center mb-4">
        <div class="text-lg font-semibold badge badge-accent border border-accent">
          <span class="custom-spinner mr-2"></span>
          <span>计算中...</span>
        </div>
      </div>
      <template v-else>
        <div v-if="errorMessage" class="flex justify-center items-center mb-4">
          <div class="text-lg font-semibold badge badge-error">
            <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g fill="currentColor">
                <rect x="1.972" y="11" width="20.056" height="2" transform="translate(-4.971 12) rotate(-45)" fill="currentColor" stroke-width="0"></rect>
                <path d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z" stroke-width="0" fill="currentColor"></path>
              </g>
            </svg>
            {{ errorMessage }}
          </div>
        </div>
        <div v-else>
          <div class="flex justify-center items-center mb-4">
            <div v-if="shantenNum === -1" class="text-lg font-semibold badge badge-success">
              <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle>
                  <polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></polyline>
                </g>
              </svg>
              和牌
            </div>
            <div v-else-if="shantenNum === 0" class="text-lg font-semibold badge badge-success">
              <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle>
                  <polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></polyline>
                </g>
              </svg>
              听牌
            </div>
            <div v-else class="text-lg font-semibold badge badge-info">
              {{ shantenNum }} 向听
            </div>
          </div>
          <div v-if="showTable" class="overflow-x-auto">
            <div class="responsive-table-wrapper">
              <table class="table table-sm w-full bg-base-100 rounded-lg">
                <thead>
                  <tr>
                    <!-- <th></th> -->
                    <th class="text-center">切</th>
                    <th class="text-center">进张</th>
                    <th class="text-center">好型率</th>
                    <th class="text-center">总进张</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="([tile, result], idx) in Object.entries(improvementResults).sort((a, b) => b[1].totalCount - a[1].totalCount)"
                    :key="tile"
                    :class="idx % 2 === 1 ? 'hover:bg-base-300' : ''"
                  >
                    <!-- <th>{{ idx + 1 }}</th> -->
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
      </template>
    </li>
  </ul>
</template>

<script setup>
// 导入与 Props
import { ref } from 'vue'
import { Shanten } from '../utils/shanten'
defineProps(["changeComponent"])

// 响应式状态
const handInput = ref('')
const showResult = ref(false)
const shantenNum = ref(null)
const improvementResults = ref({})
const errorMessage = ref(null)
const loading = ref(false)
const showTable = ref(false)

// 基础常量与映射 (初始化即执行)
// 便于后续扩展或调试的索引集合（当前逻辑中未直接使用）
const TERMINAL_INDICES = [0, 8, 9, 17, 18, 26]
const HONOR_INDICES = [27, 28, 29, 30, 31, 32, 33]

// 生成完整一副牌（含红 0）
const generateTiles = () => {
  const tiles = []
  for (const type of ["m", "p", "s"]) {
    for (let num = 1; num <= 9; num++) {
      if (num === 5) {
        tiles.push(...Array(3).fill(`5${type}`), `0${type}`)
      } else {
        tiles.push(...Array(4).fill(`${num}${type}`))
      }
    }
  }
  for (let num = 1; num <= 7; num++) tiles.push(...Array(4).fill(`${num}z`))
  return tiles
}
const ALL_TILES = generateTiles()
const BASE_COUNT_MAP = (() => {
  const m = {}
  for (const t of ALL_TILES) m[t] = (m[t] || 0) + 1
  return m
})()
const UNIQUE_TILES = Object.keys(BASE_COUNT_MAP)
// tile -> 34 索引映射
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

// 基础工具函数
// 手牌字符串数组 -> 34 进制数组
const convertToTiles34Arr = handTiles => {
  const arr = Array(34).fill(0)
  handTiles.forEach(tile => {
    const num = tile.replace(/\D/g, "")
    const type = tile.slice(-1)
    let idx
    if (type === "m") idx = num === "0" ? 4 : +num - 1
    else if (type === "p") idx = 9 + (num === "0" ? 4 : +num - 1)
    else if (type === "s") idx = 18 + (num === "0" ? 4 : +num - 1)
    else if (type === "z") idx = 27 + (+num - 1)
    if (idx !== undefined) arr[idx]++
  })
  return arr
}
// 向听计算封装
const calculateShanten = tiles34Arr => new Shanten().calculateShanten(tiles34Arr)
// 构建手牌计数
function buildHandCountMap(hand) {
  const cnt = {}
  for (const t of hand) cnt[t] = (cnt[t] || 0) + 1
  return cnt
}
// 计算剩余牌（简化只返回>0部分）
function remainingCounts(handCount) {
  const res = {}
  for (const tile of UNIQUE_TILES) {
    const left = BASE_COUNT_MAP[tile] - (handCount[tile] || 0)
    if (left > 0) res[tile] = left
  }
  return res
}
// 输入解析与合法性校验
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

// 进阶计算函数
// 好型率 (递归 + 记忆化)
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
// 切牌后的提效率/好型率分析
const analyzeImprovement = (currentHand, currentTiles34) => {
  const results = {}
  const originalShanten = calculateShanten(currentTiles34)
  const globalHandCount = buildHandCountMap(currentHand)

  currentHand.forEach((tileToDiscard, discardIndex) => {
    const newHand = currentHand.filter((_, i) => i !== discardIndex)
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
// 未摸牌/预摸场景进张与好型率
function buildPreDrawResults(hand, tiles34Arr, currentShanten) {
  const results = {}
  const handCount = buildHandCountMap(hand)
  const rem = remainingCounts(handCount)
  const improvements = {}
  let totalCount = 0
  for (const [tile, count] of Object.entries(rem)) {
    const tempHand = [...hand, tile]
    const tempTiles34 = convertToTiles34Arr(tempHand)
    const newShanten = calculateShanten(tempTiles34)
    if ((currentShanten === 0 && newShanten === -1) || (currentShanten > 0 && newShanten < currentShanten)) {
      improvements[tile] = count
      totalCount += count
    }
  }
  if (totalCount > 0) {
    let goodShapeRate
    if (currentShanten === 0) {
      const waitTypes = Object.keys(improvements).length
      goodShapeRate = (waitTypes > 1 && totalCount > 4) ? 100 : 0
    } else {
      goodShapeRate = Math.max(0, calculateGoodShapeRate(hand, tiles34Arr) * 100)
    }
    results[''] = { improvements, totalCount, goodShapeRate }
  }
  return results
}

// 主流程入口：提交处理
const handleSubmit = async () => {
  const input = handInput.value.trim()
  if (!input) {
    errorMessage.value = '请输入手牌'
    showResult.value = true
    return
  }
  const handTiles = parseHandTiles(input)
  if (!handTiles) {
    errorMessage.value = '手牌格式不正确或某牌数量过多'
    showResult.value = true
    return
  }

  const count = handTiles.length
  if (count % 3 === 0) {
    errorMessage.value = '手牌格式不正确或某牌数量过多'
    showResult.value = true
    showTable.value = false
    improvementResults.value = {}
    return
  }

  loading.value = true
  showResult.value = true
  errorMessage.value = null
  await new Promise(r => setTimeout(r, 10))

  const tiles34Arr = convertToTiles34Arr(handTiles)
  shantenNum.value = calculateShanten(tiles34Arr)

  showTable.value = true
  const isPreDraw = (count % 3 === 1)
  if (isPreDraw) {
    improvementResults.value = buildPreDrawResults(handTiles, tiles34Arr, shantenNum.value)
  } else {
    improvementResults.value = analyzeImprovement(handTiles, tiles34Arr)
  }

  loading.value = false
}

// 调用链总结
</script>

<style>
  .custom-spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor; /* 使用 currentColor 匹配父元素的文本颜色 */
    border-top-color: transparent; /* 透明顶部边框制造旋转效果 */
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>