// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
  <!-- 外层列表容器，包含所有功能区域 -->
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">

    <!-- 设置区域：选择难度和牌型 -->
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-8">
        <!-- 难度选择 -->
        <fieldset class="fieldset ml-0 flex-1">
          <legend class="text-base">难度</legend>
          <select
            class="select ml-0"
            v-model="difficulty"
            @change="handleDifficultyChange(difficulty)"
          >
            <option v-for="diff in difficultyOptions" :key="diff.value" :value="diff.value">
              {{ diff.label }}（听牌数：{{ diff.range }}）
            </option>
          </select>
        </fieldset>
        <!-- 牌型选择 -->
        <fieldset class="fieldset ml-0 flex-1 mt-4 sm:mt-0">
          <legend class="text-base">牌型</legend>
          <select
            class="select ml-0"
            v-model="tileType"
            @change="handleTileTypeChange(tileType)"
          >
            <option v-for="type in tileTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </fieldset>
      </div>
    </li>

    <!-- 手牌标题 -->
    <li class="p-4 pb-2 opacity-100 tracking-wide text-base sm:text-lg font-semibold">
      <span>手牌</span>
    </li>

    <!-- 手牌显示区域 -->
    <li class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide">
      <div class="flex justify-start w-full" style="gap: 0;">
        <!-- 遍历手牌数组，显示每张牌的图片 -->
        <template v-for="(tile, index) in handTiles" :key="tile + '-' + index">
          <div class="relative group flex-1 min-w-0 flex justify-center">
            <img
              :src="tileImages[tile]"
              :alt="tile"
              class="flex-shrink-0 object-contain"
              style="width: 100%; max-width: none; height: auto;"
            />
          </div>
        </template>
      </div>
    </li>

    <!-- 答案选择标题 -->
    <li class="p-4 pb-2 opacity-100 tracking-wide text-base sm:text-lg font-semibold">
      <span>选择答案</span>
    </li>

    <!-- 答案选择区域：可点击的待牌图片 -->
    <li class="p-4">
      <div class="flex flex-wrap gap-1 justify-center mt-2">
        <div
          v-for="tile in possibleTiles"
          :key="tile"
          @click="handleAnswerChange(tile)"
          class="cursor-pointer p-0.5 transition-transform duration-150 hover:scale-110 active:scale-95"
          style="flex: 1 1 0; max-width: calc(100% / 9); display: flex; justify-content: center;"
        >
          <img
            :src="tileImages[tile]"
            :alt="tile"
            class="rounded-md transition-all duration-150"
            :style="{
              width: '100%',
              maxWidth: '60px',
              minWidth: '0',
              height: 'auto',
              filter: answer.includes(tile) ? 'none' : 'grayscale(100%)',
              opacity: answer.includes(tile) ? 1 : 0.4,
            }"
          />
        </div>
      </div>
    </li>

    <!-- 操作按钮区：重置统计、提交答案、新的手牌 -->
    <li class="list-row flex flex-row justify-between items-center gap-2 w-full p-4">
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        @click="() => { correctAttempts = 0; totalAttempts = 0; }"
      >
        重置统计
      </button>
      <div class="flex-1 flex justify-center">
        <button
          class="btn btn-sm text-sm sm:text-base px-4"
          :disabled="isSubmitted"
          @click="checkAnswer"
        >
          {{ isSubmitted ? "已提交" : "提交答案" }}
        </button>
      </div>
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        @click="initializeGame"
      >
        新的手牌
      </button>
    </li>

    <!-- 答案结果显示区 -->
    <li v-if="isSubmitted" class="p-4">
      <div class="flex flex-col items-center justify-center max-w-full box-border">
        <div class="my-5 p-2.5 rounded-md text-center">
          <!-- 正确/错误徽章 -->
          <div
            :class="isCorrect ? 'badge badge-success' : 'badge badge-error'"
            class="inline-flex items-center gap-1 text-lg font-bold"
          >
            <!-- 正确图标 -->
            <svg v-if="isCorrect" class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle>
                <polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></polyline>
              </g>
            </svg>
            <!-- 错误图标 -->
            <svg v-else class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g fill="currentColor">
                <rect x="1.972" y="11" width="20.056" height="2" transform="translate(-4.971 12) rotate(-45)" fill="currentColor" stroke-width="0"></rect>
                <path d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z" stroke-width="0" fill="currentColor"></path>
              </g>
            </svg>
            {{ isCorrect ? '正确' : '错误' }}
          </div>
          <!-- 显示正确答案（仅错误时） -->
          <div v-if="!isCorrect" class="flex items-center justify-center mt-2">
            <div class="text-base opacity-80">正确答案：</div>
            <div class="flex flex-wrap gap-2 justify-center mt-2">
              <img
                v-for="tile in getCorrectAnswer(handTiles)"
                :key="tile"
                :src="tileImages[tile]"
                :alt="tile"
                class="w-[30px] h-auto rounded-md sm:w-[48px]"
              />
            </div>
          </div>
        </div>
      </div>
    </li>

    <!-- 正确率统计 -->
    <li class="p-4 flex justify-center">
      <div class="flex items-center gap-4">
        <div class="text-sm sm:text-base">
          正确率：{{ totalAttempts > 0 ? ((correctAttempts / totalAttempts) * 100).toFixed(1) : 0 }} %
        </div>
        <div class="text-sm sm:text-base">
          （正确：{{ correctAttempts }} / 总题数：{{ totalAttempts }}）
        </div>
      </div>
    </li>

    <!-- 相关文章推荐 -->
    <li class="p-4 pb-2 opacity-100 tracking-wide text-base sm:text-lg">
      <span>相关文章</span>
    </li>
    <li class="p-4 pb-2 opacity-100 tracking-wide">
      <div class="pl-8 flex items-center space-x-2">
        <span>1.《麻将学习·牌效率》5-3 寻找门前清一色的待牌</span>
        <a href="https://b23.tv/REBabEP" target="_blank" rel="noopener">
          <button class="btn btn-link">Link</button>
        </a>
      </div>
    </li>
  </ul>
</template>

<script setup>
// 引入Vue响应式API和Shanten计算工具
import { ref, computed, onMounted } from 'vue'
import { Shanten } from '../utils/shanten'

// -------------------- 变量与工具函数 --------------------

// 牌图片映射表，key为牌名，value为图片路径
const tileImages = {}
;['m', 'p', 's'].forEach(type => {
  for (let i = 0; i <= 9; i++) {
    tileImages[`${i}${type}`] = `/mahjongfiles/${i}${type}.png`
  }
})
for (let i = 1; i <= 7; i++) {
  tileImages[`${i}z`] = `/mahjongfiles/${i}z.png`
}
tileImages['-1'] = '/mahjongfiles/-1.png'
tileImages['ph'] = '/mahjongfiles/ph.png'

// 响应式状态变量
const tileType = ref('random') // 牌型（万/饼/索/随机）
const difficulty = ref(0) // 难度
const handTiles = ref([]) // 当前手牌
const answer = ref([]) // 用户选择的答案
const isSubmitted = ref(false) // 是否已提交答案
const isCorrect = ref(false) // 答案是否正确
const totalAttempts = ref(0) // 总答题数
const correctAttempts = ref(0) // 正确答题数

// 生成指定花色的所有牌（包括赤5和普通5）
const generateTiles = type => {
  const tiles = []
  for (let num = 1; num <= 9; num++) {
    if (num === 5) {
      tiles.push(...Array(3).fill(`5${type}`), `0${type}`) // 3张普通5和1张赤5
    } else {
      tiles.push(...Array(4).fill(`${num}${type}`)) // 其余各4张
    }
  }
  return tiles
}

// 洗牌算法（Fisher-Yates洗牌）
const shuffleArray = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

// 牌排序（赤5排在普通5后面）
const sortTiles = tiles =>
  [...tiles].sort((a, b) => {
    const getNum = t => (t[0] === '0' ? 5.5 : +t[0])
    return getNum(a) - getNum(b)
  })

// 将牌数组转为34种牌的计数数组
const convertToTiles34Arr = tiles => {
  const arr = Array(34).fill(0)
  tiles.forEach(tile => {
    const num = tile[0] === '0' ? 5 : +tile[0]
    const type = tile[1]
    let idx = { m: 0, p: 9, s: 18 }[type]
    if (idx !== undefined) arr[idx + num - 1]++
  })
  return arr
}

// 计算向听数（封装Shanten工具）
const calculateShanten = arr => new Shanten().calculateShanten(arr, false, false)

// 获取当前手牌的所有听牌（正确答案）
const getCorrectAnswer = tiles => {
  if (!tiles || tiles.length === 0) return [];
  const arr = convertToTiles34Arr(tiles);
  const res = [];
  const typeOffset = { m: 0, p: 9, s: 18 }[realTileType.value];

  const shantenCalculator = new Shanten();

  for (let i = 0; i < 9; i++) {
    const tileIndex = i + typeOffset;
    if (arr[tileIndex] < 4) {
      const tmp = [...arr];
      tmp[tileIndex]++;
      const newShanten = shantenCalculator.calculateShanten(tmp, false, false);
      if (newShanten === -1) {
        // 听牌是5时，只将普通5作为答案
        res.push(`${i + 1}${realTileType.value}`);
      }
    }
  }
  return res;
}

// 计算实际使用的牌型（random时取手牌第一张的花色，否则取选择值）
const realTileType = computed(() => {
  if (tileType.value === 'random') {
    return handTiles.value.length > 0 ? handTiles.value[0][1] : 'm'
  }
  return tileType.value
})

// -------------------- 游戏初始化与流程 --------------------

// 初始化一局游戏（生成手牌，满足难度要求）
const initializeGame = () => {
  let valid = false, hand, type
  // 随机选牌型
  type = tileType.value === 'random'
    ? ['m', 'p', 's'][Math.floor(Math.random() * 3)]
    : tileType.value
  while (!valid) {
    const allTiles = generateTiles(type)
    shuffleArray(allTiles)
    hand = allTiles.slice(0, 13)
    // 计算所有听牌
    const arr = convertToTiles34Arr(hand)
    const res = []
    const shantenCalculator = new Shanten()
    const typeOffset = { m: 0, p: 9, s: 18 }[type]

    for (let i = 0; i < 9; i++) {
      const tileIndex = i + typeOffset
      if (arr[tileIndex] < 4) {
        const tmp = [...arr]
        tmp[tileIndex]++
        if (shantenCalculator.calculateShanten(tmp, false, false) === -1) {
          res.push(i === 4 ? `5${type}` : `${i + 1}${type}`)
        }
      }
    }
    // 根据难度筛选题目
    if (res.length) {
      if (difficulty.value === 0) {
        valid = res.length > 2 || Math.random() < 0.15 // 不限制时，优先多听牌，偶尔允许少听
      } else if (difficulty.value === 1) {
        valid = res.length >= 1 && res.length <= 2 // 简单：1~2听
      } else if (difficulty.value === 2) {
        valid = res.length >= 3 && res.length <= 4 // 普通：3~4听
      } else if (difficulty.value === 3) {
        valid = res.length >= 5 // 困难：5听及以上
      }
    }
  }
  handTiles.value = sortTiles(hand)
  answer.value = []
  isSubmitted.value = false
  isCorrect.value = false
}

// 用户点击答案图片，切换选中状态
const handleAnswerChange = tile => {
  answer.value = answer.value.includes(tile)
    ? answer.value.filter(t => t !== tile)
    : [...answer.value, tile]
}

// 检查用户答案是否正确
const checkAnswer = () => {
  if (isSubmitted.value) return
  const correct = getCorrectAnswer(handTiles.value)
  const ok = correct.length === answer.value.length && correct.every(t => answer.value.includes(t))
  totalAttempts.value++
  if (ok) correctAttempts.value++
  isCorrect.value = ok
  isSubmitted.value = true
}

// 难度变化时重置统计并重新生成题目
const handleDifficultyChange = v => {
  difficulty.value = v
  correctAttempts.value = 0
  totalAttempts.value = 0
  initializeGame()
}
// 牌型变化时重置统计并重新生成题目
const handleTileTypeChange = v => {
  tileType.value = v
  correctAttempts.value = 0
  totalAttempts.value = 0
  initializeGame()
}

// 可选的所有待牌（1~9）
const possibleTiles = computed(() => {
    const tiles = [];
    for (let i = 1; i <= 9; i++) {
        tiles.push(`${i}${realTileType.value}`);
    }
    return tiles;
});

// 难度选项
const difficultyOptions = [
  { value: 0, label: '不限制', range: '任意' },
  { value: 1, label: '简单', range: '1 ~ 2' },
  { value: 2, label: '普通', range: '3 ~ 4' },
  { value: 3, label: '困难', range: '5 +' }
]

// 牌型选项，含随机
const tileTypes = [
  { value: 'random', label: '随机' },
  { value: 'm', label: '万子' },
  { value: 'p', label: '饼子' },
  { value: 's', label: '索子' }
]

// 组件挂载时自动初始化一局
onMounted(initializeGame)
</script>

<style scoped>
</style>
