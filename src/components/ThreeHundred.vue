// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-full px-2 sm:px-8">
    <li class="p-2 sm:p-4 pb-2 text-lg sm:text-xl md:text-2xl opacity-100 tracking-wide font-semibold">
      No. {{ currentArticle.id }}
    </li>
    <br>
    <li class="p-4 sm:p-4 pb-2 text-lg sm:text-xl md:text-2xl opacity-100 tracking-wide">
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
    <br>
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
          <input type="checkbox" v-model="isAnswerCollapsed" />
          <div class="collapse-title text-base md:text-xl font-semibold text-center  pl-12">
            参考答案及解析
          </div>
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
            <div
              class="inline-flex flex-wrap items-center gap-1 text-justify"
              style="text-wrap: balance; word-break: keep-all;"
            >
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
          <input type="checkbox" v-model="showResult" @change="handleAnalysisToggle" />
          <div class="collapse-title text-base md:text-xl font-semibold text-center pl-12">
            进张数分析
          </div>
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
    <br>
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
    <br>
  </ul>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articles as articlesRaw } from '../data/articles'
import {
  convertToTiles34Arr,
  calculateShanten,
  analyzeImprovement,
  parseHandTiles
} from '../utils/efficiency'

// 将题目 images2 转成 牌字符串（与输入格式一致）
function convertImages2ToHandString(images) {
  // 支持文件名形如 /mahjongfiles/5m.png /mahjongfiles/0p.png
  const groups = { m: '', p: '', s: '', z: '' }
  images.forEach(path => {
    const m = path.match(/\/(\d)([mpsz])\.png$/)
    if (!m) return
    const digit = m[1]    // 0 表示红5
    const suit = m[2]
    groups[suit] += digit
  })
  let out = ''
  for (const suit of ['m','p','s','z']) {
    if (groups[suit]) out += groups[suit] + suit
  }
  return out
}

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
  if (route.params.id) {
    const id = parseInt(route.params.id)
    if (id >= 1 && id <= articlesRaw.length) {
      return id - 1
    }
  }
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

watch(currentIndex, (newIndex) => {
  saveCurrentIndex(newIndex)
  updateRoute(newIndex)
})

onMounted(() => {
  if (currentIndex.value >= articles.value.length) {
    currentIndex.value = 0
  }
  updateRoute(currentIndex.value)
})

defineProps(['changeComponent'])

const handleSubmit = () => {
  try {
    const handString = convertImages2ToHandString(currentArticle.value.images2)
    handInput.value = handString
    const handTiles = parseHandTiles(handString)
    if (!handTiles) {
      errorMessage.value = '手牌格式不正确或某牌数量过多'
      showResult.value = true
      improvementResults.value = {}
      return
    }
    const tiles34Arr = convertToTiles34Arr(handTiles)
    shantenNum.value = calculateShanten(tiles34Arr)
    improvementResults.value = analyzeImprovement(handTiles, tiles34Arr)
    errorMessage.value = null
  } catch (e) {
    console.error('[ThreeHundred handleSubmit error]', e)
    errorMessage.value = '分析出错'
    improvementResults.value = {}
  }
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
