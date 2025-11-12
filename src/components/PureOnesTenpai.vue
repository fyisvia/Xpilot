// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
  <!-- 外层列表容器，包含所有功能区域 -->
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">

    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>

    <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
      {{ t('pureOnesTenpai.title') }}
    </li>

    <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>

    <!-- 设置区域：选择难度和牌型 -->
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-8">
        <!-- 难度选择 -->
        <fieldset class="fieldset ml-0 flex-1">
          <legend class="text-base">{{ t('pureOnesTenpai.settings.difficultyLegend') }}</legend>
          <select
            class="select ml-0 w-full sm:w-auto"
            v-model="difficulty"
            @change="handleDifficultyChange(difficulty)"
          >
            <option v-for="diff in difficultyOptions" :key="diff.value" :value="diff.value">
              {{ t(`pureOnesTenpai.options.difficulty.${diff.value}.label`) }}（{{ t('pureOnesTenpai.settings.waitCountPrefix') }}{{ t(`pureOnesTenpai.options.difficulty.${diff.value}.range`) }}）
            </option>
          </select>
        </fieldset>
        <!-- 牌型选择 -->
        <fieldset class="fieldset ml-0 flex-1 mt-4 sm:mt-0">
          <legend class="text-base">{{ t('pureOnesTenpai.settings.tileTypeLegend') }}</legend>
          <select
            class="select ml-0 w-full sm:w-auto"
            v-model="tileType"
            @change="handleTileTypeChange(tileType)"
          >
            <option v-for="type in tileTypes" :key="type.value" :value="type.value">
              {{ t(`pureOnesTenpai.options.tileType.${type.value}`) }}
            </option>
          </select>
        </fieldset>
      </div>
    </li>

    <!-- 手牌标题 -->
    <li class="p-4 pb-2 opacity-100 tracking-wide text-base sm:text-lg font-semibold" :style="contentWidthStyle">
      <span>{{ t('pureOnesTenpai.handTitle') }}</span>
    </li>

    <!-- 手牌显示区域 -->
    <li class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide" :style="contentWidthStyle">
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
    <li class="p-4 pb-2 opacity-100 tracking-wide text-base sm:text-lg font-semibold" :style="contentWidthStyle">
      <span>{{ t('pureOnesTenpai.pickAnswerTitle') }}</span>
    </li>

    <!-- 答案选择区域：可点击的待牌图片 -->
    <li class="p-4" :style="contentWidthStyle">
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
              width: '80%',
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

    <!-- 屏幕宽度控制（仅大屏显示） -->
    <li v-if="!isSmallScreen" class="p-4 pb-2 text-xs md:text-base opacity-80 tracking-wide flex justify-start">
      <div class="flex items-center gap-3">
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
    </li>

    <!-- 操作按钮区：重置统计、提交答案、新的手牌 -->
    <li class="list-row flex flex-row justify-between items-center gap-2 w-full p-4">
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        @click="() => { correctAttempts = 0; totalAttempts = 0; }"
      >
        {{ t('pureOnesTenpai.actions.resetStats') }}
      </button>
      <div class="flex-1 flex justify-center">
        <button
          class="btn btn-sm text-sm sm:text-base px-4"
          :disabled="isSubmitted"
          @click="checkAnswer"
        >
          {{ isSubmitted ? t('pureOnesTenpai.actions.submitted') : t('pureOnesTenpai.actions.submit') }}
        </button>
      </div>
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        @click="initializeGame"
      >
        {{ t('pureOnesTenpai.actions.newHand') }}
      </button>
    </li>

    <!-- 答案结果显示区 -->
    <li v-if="isSubmitted" class="p-4">
      <div class="flex flex-col items-center justify-center max-w-full box-border">
        <div class="my-5 p-2.5 rounded-md text-center">
          <div
            :class="isCorrect ? 'badge badge-success' : 'badge badge-error'"
            class="inline-flex items-center gap-1 text-lg font-bold"
          >
            <!-- 正确/错误图标，保持不变 -->
            <!-- ...existing code icons... -->
            {{ isCorrect ? t('pureOnesTenpai.result.correct') : t('pureOnesTenpai.result.wrong') }}
          </div>
          <!-- 显示正确答案（仅错误时） -->
          <div v-if="!isCorrect" class="flex items-center justify-center mt-2">
            <div class="text-base opacity-80">{{ t('pureOnesTenpai.result.correctAnswer') }}</div>
            &nbsp;&nbsp;
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
          {{ t('pureOnesTenpai.stats.accuracy', { percent: totalAttempts > 0 ? ((correctAttempts / totalAttempts) * 100).toFixed(1) : 0 }) }}
        </div>
        <div class="text-sm sm:text-base">
          {{ t('pureOnesTenpai.stats.summary', { correct: correctAttempts, total: totalAttempts }) }}
        </div>
      </div>
    </li>

    <!-- 相关文章推荐 -->
    <li class="p-4 pb-2 opacity-100 tracking-wide text-base sm:text-lg">
      <span>{{ t('pureOnesTenpai.articles.title') }}</span>
    </li>
    <li class="p-4 pb-2 opacity-100 tracking-wide">
      <div class="pl-8 flex items-center space-x-2">
        <span>{{ t('pureOnesTenpai.articles.item1') }}</span>
        <a href="https://b23.tv/REBabEP" target="_blank" rel="noopener">
          <button class="btn btn-link">{{ t('pureOnesTenpai.articles.link') }}</button>
        </a>
      </div>
    </li>

    <!-- ...existing code... -->
  </ul>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Shanten } from '../utils/shanten'

const { t } = useI18n()

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

// 难度选项（仅存 value，显示文本使用 i18n）
const difficultyOptions = [
  { value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }
]

// 牌型选项，含随机（显示文本使用 i18n）
const tileTypes = [
  { value: 'random' },
  { value: 'm' },
  { value: 'p' },
  { value: 's' }
]

const updateScreenSize = () => {
  isSmallScreen.value = window.innerWidth < 640
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
onMounted(initializeGame)
</script>

<style scoped>
</style>