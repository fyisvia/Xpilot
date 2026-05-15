// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
      {{ t('discard.title') }}
    </li>
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="flex items-center gap-2 pb-4">
        <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
          <input type="checkbox" />
          <div class="collapse-title opacity-80">{{ t('discard.collapses.rules.title') }}</div>
          <div class="collapse-content text-xs font-semibold opacity-60 mb-0">
            {{ t('discard.collapses.rules.l1') }}<br>
            {{ t('discard.collapses.rules.l2') }}<br>
            {{ t('discard.collapses.rules.l3') }}<br>
            {{ t('discard.collapses.rules.l4') }}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 pb-4">
        <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
          <input type="checkbox" />
          <div class="collapse-title opacity-80">{{ t('discard.collapses.notation.title') }}</div>
          <div class="collapse-content text-xs font-semibold opacity-60 mb-0">
            {{ t('discard.collapses.notation.l1') }}
            {{ t('discard.collapses.notation.l2') }}
            {{ t('discard.collapses.notation.l3') }}<br>
            {{ t('discard.collapses.notation.l4') }}<br>
            {{ t('discard.collapses.notation.l5') }}<br>
            {{ t('discard.collapses.notation.l6') }}<br>
            {{ t('discard.collapses.notation.l7') }}<br>
            {{ t('discard.collapses.notation.l8') }}<br>
            {{ t('discard.collapses.notation.l9') }}<br>
            {{ t('discard.collapses.notation.l10') }}<br>
            {{ t('discard.collapses.notation.l11') }}
          </div>
        </div>
      </div>
    </li>
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="flex items-center gap-2 pb-4">
        <span class="p-0 pb-0 text-base opacity-100 tracking-wide">
          {{ t('discard.input.label') }}
        </span>
      </div>
      <input
        type="text"
        v-model="handInput"
        :placeholder="t('discard.input.placeholder')"
        class="input w-full text-base py-3 px-4"
        @keyup.enter="handleEnter"
        @blur="syncSelectedTilesFromText"
        @change="syncSelectedTilesFromText"
        autocomplete="off"
        :aria-label="t('discard.input.label')"
      />
    </li>

    <!-- 图片选牌面板 -->
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="flex items-center gap-2 pb-4 justify-between">
        <span class="p-0 pb-0 text-base opacity-100 tracking-wide">
          {{ t('discard.palette.title') }}
        </span>
        <!-- 与 PureOnesTenpai 一致的滑动按钮（仅大屏显示） -->
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
      </div>
    </li>
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide" :style="contentWidthStyle">
      <div class="flex flex-col gap-2" v-if="preloadedReady">
        <div
          v-for="tp in ['m','p','s','z']"
          :key="'row-' + tp"
          class="flex items-center gap-2"
        >
          <div class="flex flex-nowrap w-full" style="gap: calc((100% / 14) * (4 / 9));">
            <img
              v-for="tile in paletteBySuit[tp]"
              :key="'opt-' + tile"
              :src="tileSrc(tile)"
              :alt="tile"
              class="object-contain rounded cursor-pointer hover:scale-105 transition"
              :style="{ width: 'calc(100% / 14)', height: 'auto' }"
              @click="addTile(tile)"
              :aria-label="t('discard.a11y.add', { tile })"
            />
          </div>
        </div>
      </div>
    </li>

    <!-- 已选手牌 -->
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2 pb-4">
          <span class="p-0 pb-0 text-base opacity-100 tracking-wide">
            {{ t('discard.selected.title', { count: selectedTiles.length }) }}
          </span>
        </div>
        <div class="flex items-center gap-2 self-start -mt-1">
          <button class="btn btn-sm text-sm sm:text-base px-4" @click="undoTile" :disabled="selectedTiles.length === 0">{{ t('discard.selected.undo') }}</button>
          <button class="btn btn-sm text-sm sm:text-base px-4" @click="clearTiles" :disabled="selectedTiles.length === 0">{{ t('discard.selected.clear') }}</button>
        </div>
      </div>
    </li>
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide" :style="contentWidthStyle">
      <div class="flex flex-wrap" style="gap: 0px;">
        <template v-for="(tTile, idx) in selectedTiles" :key="'sel-' + tTile + '-' + idx">
          <img
            :src="tileSrc(tTile)"
            :alt="tTile"
            class="object-contain rounded cursor-pointer hover:opacity-80 transition"
            :style="{ width: 'calc(100% / 14)', height: 'auto' }"
            @click="removeTileAt(idx)"
            :aria-label="t('discard.a11y.remove', { tile: tTile })"
            :title="t('discard.a11y.remove', { tile: tTile })"
          />
        </template>
      </div>
    </li>

    <li class="list-row flex flex-col gap-2">
      <div></div>
      <button class="btn text-lg" @click="handleSubmit">{{ t('discard.submit') }}</button>
    </li>
    <li v-if="showResult" class="p-4">
      <div v-if="loading" class="flex justify-center items-center mb-4">
        <div class="text-lg font-semibold badge badge-accent border border-accent">
          <span class="custom-spinner mr-2"></span>
          <span>{{ t('discard.loading') }}</span>
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
              {{ t('discard.result.he') }}
            </div>
            <div v-else-if="shantenNum === 0" class="text-lg font-semibold badge badge-success">
              <svg class="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></circle>
                  <polyline points="7 13 10 16 17 8" fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="2"></polyline>
                </g>
              </svg>
              {{ t('discard.result.tenpai') }}
            </div>
            <div v-else class="text-lg font-semibold badge badge-info">
              {{ t('discard.result.shanten', { n: shantenNum }) }}
            </div>
          </div>
          <div v-if="showTable" class="overflow-x-auto">
            <!-- 小屏幕：切换按钮 + 紧凑表格 -->
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

              <!-- 小屏幕视图A：切牌/好型率/指数/进张数 -->
              <div class="responsive-table-wrapper" v-if="!showSmallWaits">
                <table class="table table-xs w-full bg-base-100 rounded-lg">
                  <thead>
                    <tr>
                      <th class="text-center">{{ t('discard.table.cut') }}</th>
                      <th class="text-center">{{ t('discard.table.goodShapeRate') }}</th>
                      <th class="text-center">{{ t('discard.table.index') }}</th>
                      <th class="text-center">{{ t('discard.table.total') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="([tile, result], idx) in Object.entries(improvementResults).sort(
                        (a, b) =>
                          ((b[1].totalCount || 0) - (a[1].totalCount || 0)) ||
                          ((expectedPointResults[b[0]] || 0) - (expectedPointResults[a[0]] || 0))
                      )"
                      :key="'smA-' + (tile || '-')"
                      :class="idx % 2 === 1 ? 'hover:bg-base-300' : ''"
                    >
                      <td class="font-bold text-center">{{ tile || '—' }}</td>
                      <td class="font-bold text-center">{{ formatGoodShapeRate(result.goodShapeRate) }}</td>
                      <td class="font-bold text-center">{{ formatEvIndex(expectedPointResults[tile]) }}</td>
                      <td class="font-bold text-center">{{ result.totalCount }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 小屏幕视图B：切牌/进张 -->
              <div class="responsive-table-wrapper" v-else>
                <table class="table table-xs w-full bg-base-100 rounded-lg">
                  <thead>
                    <tr>
                      <th class="text-center">{{ t('discard.table.cut') }}</th>
                      <th class="text-center">{{ t('discard.table.improvements') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="([tile, result], idx) in Object.entries(improvementResults).sort(
                        (a, b) =>
                          ((b[1].totalCount || 0) - (a[1].totalCount || 0)) ||
                          ((expectedPointResults[b[0]] || 0) - (expectedPointResults[a[0]] || 0))
                      )"
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

            <!-- 大屏幕：保留现有完整表格 -->
            <div class="responsive-table-wrapper hidden sm:block">
              <table class="table table-sm w-full bg-base-100 rounded-lg">
                <thead>
                  <tr>
                    <th class="text-center">{{ t('discard.table.cut') }}</th>
                    <th class="text-center">{{ t('discard.table.improvements') }}</th>
                    <th class="text-center">{{ t('discard.table.goodShapeRate') }}</th>
                    <!-- 新增：指数列 -->
                    <th class="text-center">{{ t('discard.table.index') }}</th>
                    <th class="text-center">{{ t('discard.table.total') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="([tile, result], idx) in Object.entries(improvementResults).sort(
                      (a, b) =>
                        ((b[1].totalCount || 0) - (a[1].totalCount || 0)) ||
                        ((expectedPointResults[b[0]] || 0) - (expectedPointResults[a[0]] || 0))
                    )"
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
                        <span class="improvement-dots" :aria-label="t('discard.table.improvements') + ' ' + item.tile + ' ' + item.count">
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
                    <td class="font-bold text-center">{{ formatGoodShapeRate(result.goodShapeRate) }}</td>
                    <!-- 指数（好型率/进张加权后，四舍五入） -->
                    <td class="font-bold text-center">{{ formatEvIndex(expectedPointResults[tile]) }}</td>
                    <td class="font-bold text-center">{{ result.totalCount }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-if="evDeferred" class="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
            <span class="text-sm opacity-70">{{ t('discard.ev.deferHint') }}</span>
            <button
              class="btn btn-sm"
              @click="handleComputeEv"
              :aria-label="t('discard.ev.compute')"
              :title="t('discard.ev.compute')"
            >
              {{ t('discard.ev.compute') }}
            </button>
          </div>
        </div>
      </template>
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
  </ul>
</template>

<script setup>
// 导入与 Props
import { ref, watch, onMounted, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Shanten } from '../utils/shanten'
import { evaluateHand, evaluateStatus } from '../utils/evaluation'
defineProps(["changeComponent"])

const { t } = useI18n()

// 响应式状态
const handInput = ref('')
const showResult = ref(false)
const shantenNum = ref(null)
const improvementResults = ref({})
const errorMessage = ref(null)
const loading = ref(false)
const showTable = ref(false)

// 小屏幕切换：false=指标概览(A)，true=进张列表(B)
const showSmallWaits = ref(false)

// 新增：指数结果
const expectedPointResults = ref({})

// EV 计算控制
const evDeferred = ref(false)
const lastHandTiles = ref([])
const lastRemMap = ref(null)
const lastIsPreDraw = ref(false)

// 新增：预加载就绪标记
const preloadedReady = ref(false)

// 图片选牌相关
const selectedTiles = ref([])
// 统一图片路径
const tileSrc = (tile) => {
  const rel = `mahjongfiles/${tile}.png`
  if (typeof window !== 'undefined' && typeof window.getPreloadedSrc === 'function') {
    return window.getPreloadedSrc(rel)
  }
  return '/' + rel
}

// 紧凑字符串（与其它页面一致的展示方式）
const convertToTilesStr = (tiles) => {
  const grouped = { m: [], p: [], s: [], z: [] }
  const numVal = (n) => (n === '0' ? 5.5 : +n)
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

// 新增：统一排序工具（m < p < s < z；'0' 视作 5.5）
const TYPE_ORDER = { m: 0, p: 1, s: 2, z: 3 }
const numValGlobal = (n) => (n === '0' ? 5.5 : +n)
const compareTiles = (a, b) => {
  const ta = a.slice(-1), tb = b.slice(-1)
  if (TYPE_ORDER[ta] !== TYPE_ORDER[tb]) return TYPE_ORDER[ta] - TYPE_ORDER[tb]
  const na = numValGlobal(a[0]), nb = numValGlobal(b[0])
  return na - nb
}
const sortSelectedTiles = () => {
  // 赋新数组以触发视图更新
  selectedTiles.value = [...selectedTiles.value].sort(compareTiles)
}

// 牌盘（含赤5；字牌无赤）
const paletteBySuit = {
  m: ['1m','2m','3m','4m','5m','0m','6m','7m','8m','9m'],
  p: ['1p','2p','3p','4p','5p','0p','6p','7p','8p','9p'],
  s: ['1s','2s','3s','4s','5s','0s','6s','7s','8s','9s'],
  z: ['1z','2z','3z','4z','5z','6z','7z']
}

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
    if (type === 'm') return num === '0' ? 4 : num - 1
    if (type === 'p') return 9 + (num === '0' ? 4 : num - 1)
    if (type === 's') return 18 + (num === '0' ? 4 : num - 1)
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

// 新增：图片选牌操作
const addTile = (tile) => {
  if (selectedTiles.value.length >= 14) return
  const cnt = selectedTiles.value.reduce((acc, t) => (t === tile ? acc + 1 : acc), 0)
  if (cnt >= (BASE_COUNT_MAP[tile] || 0)) return
  selectedTiles.value.push(tile)
  // 新增：点击图片输入后自动排序
  sortSelectedTiles()
}
const removeTileAt = (idx) => {
  if (idx >= 0 && idx < selectedTiles.value.length) selectedTiles.value.splice(idx, 1)
}
const undoTile = () => {
  if (selectedTiles.value.length) selectedTiles.value.pop()
}
const clearTiles = () => { selectedTiles.value = [] }

// 双向观感：选牌变化时同步到文本框（紧凑字符串）
watch(selectedTiles, (tiles) => {
  handInput.value = convertToTilesStr(tiles)
}, { deep: true })

// ---------- 新增：预期打点指数（纯JS，赤5、等权重、非听牌近似） ----------
const isHonor = (t) => t.endsWith('z')
const isTerminal = (t) => !isHonor(t) && (t[0] === '1' || t[0] === '9')
// 预留：可能用于扩展
const isSimple = (t) => !isHonor(t) && !isTerminal(t)
const suitOf = (t) => t.slice(-1) // m p s z
const isRed = (t) => t[0] === '0'
const isDragon = (t) => t === '5z' || t === '6z' || t === '7z'

const formatGoodShapeRate = (rate) => {
  if (rate === null || typeof rate !== 'number') return '—'
  return `${rate.toFixed(0)}%`
}

const formatEvIndex = (value) => {
  if (evDeferred.value) return '—'
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return String(Math.round(value))
}

// ---------- evaluateHand Worker (避免主线程卡顿) ----------
let evaluateWorker = null
let evaluateRequestId = 0

const ensureEvaluateWorker = () => {
  if (evaluateWorker || typeof Worker === 'undefined') return
  try {
    evaluateWorker = new Worker(new URL('../workers/evaluateHandWorker.js', import.meta.url), { type: 'module' })
  } catch {
    evaluateWorker = null
  }
}

const evaluateHandInWorker = (handTiles, remMap, options = {}) => {
  ensureEvaluateWorker()
  if (!evaluateWorker) return Promise.resolve(evaluateHand(handTiles, remMap, options))

  const safeHandTiles = Array.isArray(handTiles) ? handTiles.map((t) => String(t)) : []
  const safeRemMap = remMap && typeof remMap === 'object'
    ? Object.fromEntries(Object.entries(remMap).map(([k, v]) => [String(k), Number(v)]))
    : {}
  const safeOptions = {
    skipEV: options?.skipEV === true,
    skipGoodShapeRate: options?.skipGoodShapeRate === true
  }

  const id = ++evaluateRequestId
  return new Promise((resolve, reject) => {
    const handleMessage = (event) => {
      if (!event?.data || event.data.id !== id) return
      evaluateWorker.removeEventListener('message', handleMessage)
      evaluateWorker.removeEventListener('error', handleError)
      if (event.data.ok) resolve(event.data.results)
      else reject(new Error(event.data.error || 'Worker error'))
    }
    const handleError = (err) => {
      evaluateWorker.removeEventListener('message', handleMessage)
      evaluateWorker.removeEventListener('error', handleError)
      reject(err)
    }

    evaluateWorker.addEventListener('message', handleMessage)
    evaluateWorker.addEventListener('error', handleError)
    evaluateWorker.postMessage({ id, handTiles: safeHandTiles, remMap: safeRemMap, options: safeOptions })
  })
}

// 进张显示格式：6p(2), 9p(3)
const formatImprovementsList = (improvements, improvementsQuality = {}) => {
  if (!improvements || typeof improvements !== 'object') return []
  return Object.entries(improvements)
    .filter(([, count]) => (count || 0) > 0)
    .map(([tile, count]) => ({ tile, count, goodShape: improvementsQuality?.[tile] }))
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
      if (calculateShanten(tempTiles34) === -1) {
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
      if (calculateShanten(reducedTiles34) === 0) {
        if (isGoodWaitsFor13(reduced)) return true
      }
    }
    return false
  }

  return isGoodWaitsFor13(hand)
}


// 主流程入口：提交处理（优先使用图片选牌）
const handleSubmit = async () => {
  // 1) 优先使用图片选牌
  let handTiles = selectedTiles.value.length > 0 ? [...selectedTiles.value] : null

  // 2) 文本输入
  if (!handTiles || handTiles.length === 0) {
    const input = handInput.value.trim()
    if (!input) {
      errorMessage.value = t('discard.error.empty')
      showResult.value = true
      showTable.value = false
      improvementResults.value = {}
      expectedPointResults.value = {}
      return
    }
    const parsed = parseHandTiles(input)
    if (!parsed) {
      errorMessage.value = t('discard.error.format')
      showResult.value = true
      showTable.value = false
      improvementResults.value = {}
      expectedPointResults.value = {}
      return
    }
    handTiles = parsed
  }

  const count = handTiles.length
  if (count % 3 === 0) {
    errorMessage.value = t('discard.error.format')
    showResult.value = true
    showTable.value = false
    improvementResults.value = {}
    expectedPointResults.value = {}
    return
  }

  loading.value = true
  showResult.value = true
  errorMessage.value = null
  await new Promise(r => setTimeout(r, 10))

  const tiles34Arr = convertToTiles34Arr(handTiles)
  shantenNum.value = calculateShanten(tiles34Arr)

  const shouldDeferEV = shantenNum.value >= 4
  const shouldSkipGoodShapeRate = shantenNum.value >= 4
  evDeferred.value = shouldDeferEV

  showTable.value = true
  improvementResults.value = {}
  expectedPointResults.value = {}

  // New Logic using utils/evaluation
  const handCount = buildHandCountMap(handTiles)
  const remMap = remainingCounts(handCount)
  const isPreDraw = (count % 3 === 1)
  lastHandTiles.value = handTiles
  lastRemMap.value = remMap
  lastIsPreDraw.value = isPreDraw

  try {
    if (isPreDraw) {
      const status = evaluateStatus(handTiles, remMap, {
        skipEV: shouldDeferEV,
        skipGoodShapeRate: shouldSkipGoodShapeRate
      })
      if (status.totalCount > 0) {
        const improvementsQuality = {}
        if (shantenNum.value === 1) {
          for (const [tile] of Object.entries(status.improvements || {})) {
            const tempHand = [...handTiles, tile]
            const tempTiles34 = convertToTiles34Arr(tempHand)
            if (calculateShanten(tempTiles34) === 0) {
              improvementsQuality[tile] = isGoodShapeTenpai(tempHand)
            }
          }
        }
        improvementResults.value = {
          '': {
            improvements: status.improvements,
            improvementsQuality,
            totalCount: status.totalCount,
            goodShapeRate: status.goodShapeRate
          }
        }
        expectedPointResults.value = { '': status.evIndex }
      }
    } else {
      const results = await evaluateHandInWorker(handTiles, remMap, {
        skipEV: shouldDeferEV,
        skipGoodShapeRate: shouldSkipGoodShapeRate
      })
      for (const [t, data] of Object.entries(results)) {
        if (data.totalCount > 0 || data.evIndex > 0) {
          const improvementsQuality = {}
          if (shantenNum.value === 1) {
            const discardIndex = handTiles.findIndex((x) => x === t)
            const baseHand = discardIndex >= 0 ? handTiles.slice(0, discardIndex).concat(handTiles.slice(discardIndex + 1)) : [...handTiles]
            for (const [tile] of Object.entries(data.improvements || {})) {
              const tempHand = [...baseHand, tile]
              const tempTiles34 = convertToTiles34Arr(tempHand)
              if (calculateShanten(tempTiles34) === 0) {
                improvementsQuality[tile] = isGoodShapeTenpai(tempHand)
              }
            }
          }
          improvementResults.value[t] = {
            improvements: data.improvements,
            improvementsQuality,
            totalCount: data.totalCount,
            goodShapeRate: data.goodShapeRate
          }
          expectedPointResults.value[t] = data.evIndex
        }
      }
    }
  } catch (err) {
    errorMessage.value = err?.message || 'Calculation failed'
    showTable.value = false
    improvementResults.value = {}
    expectedPointResults.value = {}
  } finally {
    loading.value = false
  }
}

const handleComputeEv = async () => {
  if (!evDeferred.value) return
  if (!Array.isArray(lastHandTiles.value) || !lastHandTiles.value.length) return
  if (!lastRemMap.value) return

  loading.value = true
  errorMessage.value = null
  showResult.value = true
  try {
    if (lastIsPreDraw.value) {
      const status = evaluateStatus(lastHandTiles.value, lastRemMap.value)
      if (status.totalCount > 0) {
        const improvementsQuality = {}
        if (shantenNum.value === 1) {
          for (const [tile] of Object.entries(status.improvements || {})) {
            const tempHand = [...lastHandTiles.value, tile]
            const tempTiles34 = convertToTiles34Arr(tempHand)
            if (calculateShanten(tempTiles34) === 0) {
              improvementsQuality[tile] = isGoodShapeTenpai(tempHand)
            }
          }
        }
        improvementResults.value = {
          '': {
            improvements: status.improvements,
            improvementsQuality,
            totalCount: status.totalCount,
            goodShapeRate: status.goodShapeRate
          }
        }
        expectedPointResults.value = { '': status.evIndex }
      }
    } else {
      const results = await evaluateHandInWorker(lastHandTiles.value, lastRemMap.value)
      improvementResults.value = {}
      expectedPointResults.value = {}
      for (const [t, data] of Object.entries(results)) {
        if (data.totalCount > 0 || data.evIndex > 0) {
          const improvementsQuality = {}
          if (shantenNum.value === 1) {
            const discardIndex = lastHandTiles.value.findIndex((x) => x === t)
            const baseHand = discardIndex >= 0
              ? lastHandTiles.value.slice(0, discardIndex).concat(lastHandTiles.value.slice(discardIndex + 1))
              : [...lastHandTiles.value]
            for (const [tile] of Object.entries(data.improvements || {})) {
              const tempHand = [...baseHand, tile]
              const tempTiles34 = convertToTiles34Arr(tempHand)
              if (calculateShanten(tempTiles34) === 0) {
                improvementsQuality[tile] = isGoodShapeTenpai(tempHand)
              }
            }
          }
          improvementResults.value[t] = {
            improvements: data.improvements,
            improvementsQuality,
            totalCount: data.totalCount,
            goodShapeRate: data.goodShapeRate
          }
          expectedPointResults.value[t] = data.evIndex
        }
      }
    }
    evDeferred.value = false
  } catch (err) {
    errorMessage.value = err?.message || 'Calculation failed'
    showTable.value = false
    improvementResults.value = {}
    expectedPointResults.value = {}
  } finally {
    loading.value = false
  }
}

// 同步文本到选牌
const syncSelectedTilesFromText = () => {
  const input = handInput.value?.trim()
  if (!input) return
  const parsed = parseHandTiles(input)
  if (parsed) {
    selectedTiles.value = parsed
    sortSelectedTiles()
  }
}

// 回车触发
const handleEnter = () => {
  syncSelectedTilesFromText()
  handleSubmit()
}

// 等待全局预加载完成后再显示牌面图片，尽量复用预加载缓存
onMounted(() => {
  const p = window.preloadImagesPromise
  if (p && typeof p.then === 'function') {
    p.finally(() => { preloadedReady.value = true })
  } else {
    preloadedReady.value = true
  }
})

// -------------------- 与其他页面通用的宽度控制 --------------------
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

const updateScreenSize = () => { isSmallScreen.value = window.innerWidth < 640 }
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
  if (evaluateWorker) {
    evaluateWorker.terminate()
    evaluateWorker = null
  }
  window.removeEventListener('resize', updateScreenSize)
  window.removeEventListener(WIDTH_CHANGE_EVENT, handleWidthBroadcast)
})

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