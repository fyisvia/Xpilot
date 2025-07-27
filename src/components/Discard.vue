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
            不需要输入副露的部分，但需要输入摸进的牌。<br>
            举例：<br>
            012m123p123s1156z。<br>
            如果123p为副露，则只输入012m123s1156z。<br>
            可以正常处理的手牌张数为5,8,11,14张。                    
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
          <div v-if="shantenNum > -1" class="overflow-x-auto">
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
import { ref } from 'vue'
import { Shanten } from '../utils/shanten'
defineProps(["changeComponent"])

// 常量
const TERMINAL_INDICES = [0, 8, 9, 17, 18, 26]
const HONOR_INDICES = [27, 28, 29, 30, 31, 32, 33]

// 响应式状态
const handInput = ref('')
const showResult = ref(false)
const shantenNum = ref(null)
const improvementResults = ref({})
const errorMessage = ref(null)
const loading = ref(false) // 新增

// 工具函数
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

const calculateShanten = tiles34Arr => new Shanten().calculateShanten(tiles34Arr)

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

// 记忆化好型率计算
const calculateGoodShapeRate = (() => {
  const cache = new Map()
  const MAX_DEPTH = 3
  function inner(hand, tiles34Arr, depth = 0) {
    const key = hand.slice().sort().join(',') + `|${depth}`
    if (cache.has(key)) return cache.get(key)
    if (depth > MAX_DEPTH) return 0

    const shanten = calculateShanten(tiles34Arr)
    if (shanten === 0) {
      const allTiles = generateTiles()
      const countMap = allTiles.reduce((acc, t) => (acc[t] = (acc[t] || 0) + 1, acc), {})
      hand.forEach(t => countMap[t] = (countMap[t] || 0) - 1)
      let waitTypes = new Set(), waitCount = 0
      Object.entries(countMap).forEach(([tile, count]) => {
        if (count <= 0) return
        const tempHand = [...hand, tile]
        const tempTiles34 = convertToTiles34Arr(tempHand)
        if (calculateShanten(tempTiles34) === -1) {
          waitTypes.add(tile)
          waitCount += count
        }
      })
      // 返回0或1，表示0%或100%的好型率
      const result = (waitTypes.size > 1 && waitCount > 4) ? 1 : 0
      cache.set(key, result)
      return result
    }

    let totalPaths = 0, goodShapePaths = 0
    const allTiles = generateTiles()
    const countMap = allTiles.reduce((acc, t) => (acc[t] = (acc[t] || 0) + 1, acc), {})
    hand.forEach(t => countMap[t] = (countMap[t] || 0) - 1)

    Object.entries(countMap).forEach(([tile, count]) => {
      if (count <= 0) return
      const tempHand = [...hand, tile]
      const tempTiles34 = convertToTiles34Arr(tempHand)
      const newShanten = calculateShanten(tempTiles34)
      if (newShanten < shanten) {
        let bestPathRate = 0
        const unique = new Set()
        for (let i = 0; i < tempHand.length; i++) {
          if (unique.has(tempHand[i])) continue
          unique.add(tempHand[i])
          const discardHand = tempHand.slice()
          discardHand.splice(i, 1)
          const discardTiles34 = convertToTiles34Arr(discardHand)
          if (calculateShanten(discardTiles34) < shanten) {
            // 不再除以100，保持0-1的范围
            bestPathRate = Math.max(bestPathRate, inner(discardHand, discardTiles34, depth + 1))
          }
        }
        totalPaths += count
        goodShapePaths += count * bestPathRate // 移除除以100
      }
    })
    const result = totalPaths === 0 ? 0 : (goodShapePaths / totalPaths)
    cache.set(key, result)
    return result
  }
  return inner
})()

const analyzeImprovement = (currentHand, currentTiles34) => {
  const results = {}
  const allTiles = generateTiles()
  const countMap = allTiles.reduce((acc, t) => (acc[t] = (acc[t] || 0) + 1, acc), {})
  currentHand.forEach(t => countMap[t] = (countMap[t] || 0) - 1)
  const originalShanten = calculateShanten(currentTiles34)

  currentHand.forEach((tileToDiscard, discardIndex) => {
    const newHand = currentHand.filter((_, i) => i !== discardIndex)
    const newTiles34 = convertToTiles34Arr(newHand)
    const improvements = {}
    let totalCount = 0
    Object.keys(countMap).forEach(tile => {
      if (countMap[tile] <= 0) return
      const tempHand = [...newHand, tile]
      const tempTiles34 = convertToTiles34Arr(tempHand)
      if (calculateShanten(tempTiles34) < originalShanten) {
        improvements[tile] = countMap[tile]
        totalCount += countMap[tile]
      }
    })
    if (Object.keys(improvements).length) {
      // 这里原本就是乘以100，现在是正确的
      const goodShapeRate = Math.max(0, calculateGoodShapeRate(newHand, convertToTiles34Arr(newHand)) * 100)
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
  loading.value = true // 开始加载
  showResult.value = true
  errorMessage.value = null
  await new Promise(resolve => setTimeout(resolve, 10)) // 让 loading 有机会渲染
  const tiles34Arr = convertToTiles34Arr(handTiles)
  shantenNum.value = calculateShanten(tiles34Arr)
  improvementResults.value = analyzeImprovement(handTiles, tiles34Arr)
  loading.value = false // 结束加载
}
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