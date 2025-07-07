// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <!-- <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
            清一色听牌练习
        </li> -->

        <!-- 设置区域 -->
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-8">
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

        <li class="p-4 pb-2 opacity-100 tracking-wide text-base sm:text-lg font-semibold">
            <span>手牌</span>
        </li>

        <!-- 手牌显示 -->
        <li class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide">
            <div class="flex justify-start w-full" style="gap: 0;">
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
        <li class="p-4 pb-2 opacity-100 tracking-wide text-base sm:text-lg font-semibold">
            <span>选择答案</span>
        </li>

        <!-- 回答区域 -->
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

        <!-- 按钮 -->
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

        <!-- 结果显示 -->
        <li v-if="isSubmitted" class="p-4">
            <div class="flex flex-col items-center justify-center max-w-full box-border">
                <div class="my-5 p-2.5 rounded-md text-center">
                    <div
                        :class="isCorrect ? 'badge badge-success' : 'badge badge-error'"
                        class="inline-flex items-center gap-1 text-lg font-bold"
                    >
                        <svg v-if="isCorrect" class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                        {{ isCorrect ? '正确' : '错误' }}
                    </div>
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
import { ref, computed, onMounted } from 'vue'
import { Shanten } from '../utils/shanten'

// 图片映射（恢复原逻辑）
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

// 状态
const tileType = ref('random')
const difficulty = ref(0)
const handTiles = ref([])
const answer = ref([])
const isSubmitted = ref(false)
const isCorrect = ref(false)
const totalAttempts = ref(0)
const correctAttempts = ref(0)

// 生成指定花色所有牌
const generateTiles = type => {
  const tiles = []
  for (let num = 1; num <= 9; num++) {
    if (num === 5) {
      tiles.push(...Array(3).fill(`5${type}`), `0${type}`)
    } else {
      tiles.push(...Array(4).fill(`${num}${type}`))
    }
  }
  return tiles
}

// 洗牌
const shuffleArray = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

// 排序
const sortTiles = tiles =>
  [...tiles].sort((a, b) => {
    const getNum = t => (t[0] === '0' ? 5.5 : +t[0])
    return getNum(a) - getNum(b)
  })

// 转34数组
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

// 计算向听
const calculateShanten = arr => new Shanten().calculateShanten(arr)

// 获取正确答案
const getCorrectAnswer = tiles => {
  const arr = convertToTiles34Arr(tiles)
  const res = []
  const typeOffset = { m: 0, p: 9, s: 18 }[realTileType.value]
  
  // 创建新的 Shanten 实例来避免状态污染
  const shantenCalculator = new Shanten()
  
  for (let i = 0; i < 9; i++) {
    const tileIndex = i + typeOffset
    // 确保手牌中该牌少于4张时才考虑添加
    if (arr[tileIndex] < 4) {
      const tmp = [...arr]  // 使用扩展运算符确保深拷贝
      tmp[tileIndex]++
      
      // 重新计算向听数
      const newShanten = shantenCalculator.calculateShantenForRegularHand(tmp)
      if (newShanten === -1) {
        if (i === 4) {
          res.push(`5${realTileType.value}`)
        } else {
          res.push(`${i + 1}${realTileType.value}`)
        }
      }
    }
  }
  return res
}

// 实际使用的牌型（处理random）
const realTileType = computed(() => {
  if (tileType.value === 'random') {
    return handTiles.value.length > 0 ? handTiles.value[0][1] : 'm'
  }
  return tileType.value
})

// 初始化
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
    // 这里用 type 传递给 getCorrectAnswer
    const arr = convertToTiles34Arr(hand)
    // 临时计算答案
    const res = []
    const shantenCalculator = new Shanten()
    const typeOffset = { m: 0, p: 9, s: 18 }[type]
    
    for (let i = 0; i < 9; i++) {
      const tileIndex = i + typeOffset
      // 确保手牌中该牌少于4张时才考虑添加（包括有3张的情况）
      if (arr[tileIndex] < 4) {
        const tmp = [...arr]
        tmp[tileIndex]++
        if (shantenCalculator.calculateShantenForRegularHand(tmp) === -1) {
          res.push(i === 4 ? `5${type}` : `${i + 1}${type}`)
        }
      }
    }
    if (res.length) {
      if (difficulty.value === 0) {
        valid = res.length > 2 || Math.random() < 0.15
      } else if (difficulty.value === 1) {
        valid = res.length >= 1 && res.length <= 2
      } else if (difficulty.value === 2) {
        valid = res.length >= 3 && res.length <= 4
      } else if (difficulty.value === 3) {
        valid = res.length >= 5
      }
    }
  }
  handTiles.value = sortTiles(hand)
  answer.value = []
  isSubmitted.value = false
  isCorrect.value = false
}

// 答案选择
const handleAnswerChange = tile => {
  answer.value = answer.value.includes(tile)
    ? answer.value.filter(t => t !== tile)
    : [...answer.value, tile]
}

// 检查答案
const checkAnswer = () => {
  if (isSubmitted.value) return
  const correct = getCorrectAnswer(handTiles.value)
  const ok = correct.length === answer.value.length && correct.every(t => answer.value.includes(t))
  totalAttempts.value++
  if (ok) correctAttempts.value++
  isCorrect.value = ok
  isSubmitted.value = true
}

// 难度和牌型变化
const handleDifficultyChange = v => {
  difficulty.value = v
  correctAttempts.value = 0
  totalAttempts.value = 0
  initializeGame()
}
const handleTileTypeChange = v => {
  tileType.value = v
  correctAttempts.value = 0
  totalAttempts.value = 0
  initializeGame()
}

// 可选牌型
const possibleTiles = computed(() =>
  Array.from({ length: 9 }, (_, i) =>
    i === 4 ? `5${realTileType.value}` : `${i + 1}${realTileType.value}`
  )
)

// 难度选项
const difficultyOptions = [
  { value: 0, label: '不限制', range: '任意' },
  { value: 1, label: '简单', range: '1 ~ 2' },
  { value: 2, label: '普通', range: '3 ~ 4' },
  { value: 3, label: '困难', range: '5 +' }
]

// 牌型选项，增加随机
const tileTypes = [
  { value: 'random', label: '随机' },
  { value: 'm', label: '万子' },
  { value: 'p', label: '饼子' },
  { value: 's', label: '索子' }
]

onMounted(initializeGame)
</script>

<style scoped>
</style>
