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
      <div class="flex items-center gap-2 pb-4">
        <span class="p-0 pb-0 text-base opacity-100 tracking-wide">
          {{ t('discard.palette.title') }}
        </span>
      </div>
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
                      <td class="font-bold text-center">{{ result.goodShapeRate.toFixed(0) }}%</td>
                      <td class="font-bold text-center">{{ Math.round(expectedPointResults[tile] || 0) }}</td>
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
                      <td class="text-center">{{ Object.keys(result.improvements).join(', ') }}</td>
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
                    <td class="font-bold text-center">{{ tile }}</td>
                    <td class="text-center">{{ Object.keys(result.improvements).join(', ') }}</td>
                    <td class="font-bold text-center">{{ result.goodShapeRate.toFixed(0) }}%</td>
                    <!-- 指数（好型率/进张加权后，四舍五入） -->
                    <td class="font-bold text-center">{{ Math.round(expectedPointResults[tile] || 0) }}</td>
                    <td class="font-bold text-center">{{ result.totalCount }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </li>
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
  </ul>
</template>

<script setup>
// 导入与 Props
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Shanten } from '../utils/shanten'
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

// 对对和（精确）：14张和了手，是否可分解为“4刻子+1雀头”（使用34计数；红5并到5）
function isToitoiAgari34(arr34) {
  for (let i = 0; i < 34; i++) {
    if (arr34[i] >= 2) {
      let ok = true
      for (let j = 0; j < 34; j++) {
        const rem = arr34[j] - (j === i ? 2 : 0)
        if (rem < 0 || rem % 3 !== 0) { ok = false; break }
      }
      if (ok) return true
    }
  }
  return false
}

// 三色同顺（启发）：存在任意起点r（1..7），m/p/s三门都各有 r,r+1,r+2 至少1枚
function hasSanshokuDoujun(arr34) {
  const offs = [0, 9, 18]
  for (let r = 0; r <= 6; r++) {
    let ok = true
    for (const o of offs) {
      if (!(arr34[o + r] > 0 && arr34[o + r + 1] > 0 && arr34[o + r + 2] > 0)) { ok = false; break }
    }
    if (ok) return true
  }
  return false
}

// 一气通贯（启发）：同一门 123/456/789 都能至少做出1组
function hasIttsuu(arr34) {
  const offs = [0, 9, 18]
  for (const o of offs) {
    const a = Math.min(arr34[o + 0], arr34[o + 1], arr34[o + 2])
    const b = Math.min(arr34[o + 3], arr34[o + 4], arr34[o + 5])
    const c = Math.min(arr34[o + 6], arr34[o + 7], arr34[o + 8])
    if (a >= 1 && b >= 1 && c >= 1) return true
  }
  return false
}

// 七对、国士
function isChiitoi(hand) {
  // ...实现逻辑同审核稿...
  if (hand.length !== 14) return false
  const cnt = buildHandCountMap(hand)
  let pairs = 0
  for (const c of Object.values(cnt)) {
    if (c === 2) pairs++
    else if (c === 1 || c === 3 || c === 4) return false
  }
  return pairs === 7
}
function isKokushi(hand) {
  if (hand.length !== 14) return false
  const req = new Set(['1m','9m','1p','9p','1s','9s','1z','2z','3z','4z','5z','6z','7z'])
  const cnt = buildHandCountMap(hand)
  let pairFound = false
  for (const r of req) {
    if (!cnt[r]) return false
    if (cnt[r] >= 2) pairFound = true
  }
  for (const t of Object.keys(cnt)) {
    if (!req.has(t)) return false
  }
  return pairFound
}

// 番估计（门清近似）：断幺、混一/清一、三元刻、赤宝；七对单独估计
function estimateHanStandard(hand) {
  const cnt = buildHandCountMap(hand)
  const reds = hand.filter(isRed).length
  const suits = new Set(hand.filter(t => !isHonor(t)).map(suitOf))
  const hasHonor = hand.some(isHonor)
  const arr34 = convertToTiles34Arr(hand)
  let han = 0
  // 混一/清一
  han += (suits.size === 1) ? (hasHonor ? 3 : 6) : 0
  // 断幺
  han += hand.some(t => isHonor(t) || isTerminal(t)) ? 0 : 1
  // 三元刻
  for (const d of ['5z','6z','7z']) if ((cnt[d] || 0) >= 3) han += 1
  // 对对和 / 三色 / 一气（对对和与顺子系互斥，优先加对对和）
  if (isToitoiAgari34(arr34)) {
    han += 2
  } else {
    if (hasSanshokuDoujun(arr34)) han += 2
    if (hasIttsuu(arr34)) han += 2
  }
  // 赤宝
  han += reds
  return han
}
function estimateHanChiitoi(hand) {
  let han = 2
  const hasTerminalOrHonor = hand.some(t => isHonor(t) || isTerminal(t))
  if (!hasTerminalOrHonor) han += 1
  const suits = new Set(hand.filter(t => !isHonor(t)).map(suitOf))
  const hasHonor = hand.some(isHonor)
  if (suits.size === 1) han += hasHonor ? 3 : 6
  han += hand.filter(isRed).length
  return han
}
function calcChildRonPointByHanFu(han, fu) {
  if (han <= 0) return 0
  if (han >= 13) return 32000
  if (han >= 11) return 24000
  if (han >= 8) return 16000
  if (han >= 6) return 12000
  if (han >= 5) return 8000
  const basic = fu * Math.pow(2, 2 + han)
  const ron = basic * 4
  return Math.ceil(ron / 100) * 100
}
function estimateAgariPointIndex(hand14) {
  // 国士
  if (isKokushi(hand14)) return 32000
  // 七对
  if (isChiitoi(hand14)) {
    const han = estimateHanChiitoi(hand14)
    return calcChildRonPointByHanFu(han, 25)
  }
  // 普通手
  let han = estimateHanStandard(hand14)
  // 修复：无役听牌默认可立直，至少 +1 番（不计里宝/一发）
  if (han <= 0) han = 1
  return calcChildRonPointByHanFu(han, 30)
}

// ---------- 预期打点指数（扩展番种 + 概率加权） ----------
// 改为“带权重”的和张/改良枚举（用最大剩余枚数作权重）
function enumerateWaitTilesWeighted(hand13) {
  const res = []
  const rem = remainingCounts(buildHandCountMap(hand13))
  if (calculateShanten(convertToTiles34Arr(hand13)) !== 0) return res
  for (const [t, left] of Object.entries(rem)) {
    const test = [...hand13, t]
    if (calculateShanten(convertToTiles34Arr(test)) === -1) res.push([t, left])
  }
  return res
}
function enumerateImprovingTilesWeighted(hand13) {
  const res = []
  const rem = remainingCounts(buildHandCountMap(hand13))
  const s = calculateShanten(convertToTiles34Arr(hand13))
  for (const [t, left] of Object.entries(rem)) {
    const test = [...hand13, t]
    if (calculateShanten(convertToTiles34Arr(test)) < s) res.push([t, left])
  }
  return res
}

// 递归V13：用权重加权平均
const handKey = (tiles) => [...tiles].sort(compareTiles).join(',')
function makeEvaluator(depthMax = 2) {
  const memo13 = new Map()
  const V13 = (hand13, depth) => {
    const key = handKey(hand13) + '|' + depth
    if (memo13.has(key)) return memo13.get(key)

    const s = calculateShanten(convertToTiles34Arr(hand13))
    // 听牌：按和张剩余枚数加权
    if (s === 0) {
      const waits = enumerateWaitTilesWeighted(hand13)
      if (waits.length === 0) { memo13.set(key, 0); return 0 }
      let wSum = 0, vSum = 0
      for (const [w, cnt] of waits) {
        vSum += cnt * estimateAgariPointIndex([...hand13, w])
        wSum += cnt
      }
      const avg = vSum / wSum
      memo13.set(key, avg)
      return avg
    }

    // 未听：深度用“改良牌剩余枚数”加权
    if (depth <= 0) { memo13.set(key, 0); return 0 }
    const improves = enumerateImprovingTilesWeighted(hand13)
    if (improves.length === 0) { memo13.set(key, 0); return 0 }

    let wSum = 0, vSum = 0
    for (const [draw, cnt] of improves) {
      const afterDraw14 = [...hand13, draw]
      let best = 0
      for (let i = 0; i < afterDraw14.length; i++) {
        const next13 = afterDraw14.slice()
        next13.splice(i, 1)
        best = Math.max(best, V13(next13, depth - 1))
      }
      vSum += cnt * best
      wSum += cnt
    }
    const avg = vSum / wSum
    memo13.set(key, avg)
    return avg
  }

  const expectedPointIndexByDiscard = (hand14, allowedSet) => {
    const map = {}
    const allow = allowedSet ? new Set(allowedSet) : null
    for (let i = 0; i < hand14.length; i++) {
      const d = hand14[i]
      if (allow && !allow.has(d)) continue
      if (map[d] !== undefined) continue
      const next13 = hand14.slice()
      next13.splice(i, 1)
      map[d] = V13(next13, depthMax)
    }
    return map
  }
  const expectedPointIndexFromPreDraw = (hand13) => V13(hand13, depthMax)
  return { expectedPointIndexByDiscard, expectedPointIndexFromPreDraw }
}

// 新增：指数后处理——加重好型率与进张数权重
// 调参：加重好型率/进张；进张采用幂次提升（更看重大进张）
const ALPHA_SHAPE = 1.2   // 好型率权重
const BETA_VOLUME = 1.6   // 进张数权重
const GAMMA_SHAPE = 2.0   // 好型率幂次，略偏向高好型
const GAMMA_VOLUME = 2.4   // 进张幂次，强烈偏向大进张

function applyShapeAndVolumeWeights(baseMap, impMap, currentShanten) {
  // 进张归一化分母：同一手牌下各候选的最大 totalCount
  const totals = Object.values(impMap || {}).map(v => v?.totalCount || 0)
  const maxTotal = Math.max(1, ...(totals.length ? totals : [0]))

  const adjusted = {}
  for (const [k, base] of Object.entries(baseMap || {})) {
    const info = impMap?.[k]
    const shapeNorm = info ? Math.max(0, (info.goodShapeRate || 0) / 100) : 0
    const volumeNorm = info ? Math.min(1, (info.totalCount || 0) / maxTotal) : 0

    const shapeWeighted = Math.pow(shapeNorm, GAMMA_SHAPE)
    const volumeWeighted = Math.pow(volumeNorm, GAMMA_VOLUME)
    adjusted[k] = (base || 1000) * (1 + ALPHA_SHAPE * shapeWeighted) * (1 + BETA_VOLUME * volumeWeighted)
    
  }
  return adjusted
}

// 新增：按切牌数字做指数扣减（1/9 -1，2/8 -2，...，5 -5；赤5按5；字牌不扣）
function tileDigitPenalty(tile) {
  if (!tile || tile.length < 2) return 0
  const type = tile.slice(-1)
  if (type === 'z') return 0
  const nChar = tile[0]
  const val = nChar === '0' ? 5 : parseInt(nChar, 10)
  if (!Number.isFinite(val) || val < 1 || val > 9) return 0
  return val <= 5 ? val : 10 - val
}
function applyDiscardDigitPenalty(map) {
  const res = { ...(map || {}) }
  for (const k of Object.keys(res)) {
    const p = tileDigitPenalty(k)
    if (p > 0) res[k] = (res[k] || 0) - 3 * p
    // 新增：赤5切牌（0m/0p/0s）额外惩罚 -480
    if (k === '0m' || k === '0p' || k === '0s') {
      res[k] = (res[k] || 0) - 480
    }
  }
  return res
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

  showTable.value = true
  const isPreDraw = (count % 3 === 1)
  if (isPreDraw) {
    improvementResults.value = buildPreDrawResults(handTiles, tiles34Arr, shantenNum.value)
  } else {
    improvementResults.value = analyzeImprovement(handTiles, tiles34Arr)
  }
  const allowedKeys = Object.keys(improvementResults.value || {})
  if (!allowedKeys.length) {
    expectedPointResults.value = {}
    loading.value = false
    return
  }
  const { expectedPointIndexByDiscard, expectedPointIndexFromPreDraw } = makeEvaluator(2)
  let baseMap = {}
  if (isPreDraw) {
    if (allowedKeys.includes('')) {
      baseMap[''] = expectedPointIndexFromPreDraw(handTiles)
    }
  } else {
    baseMap = expectedPointIndexByDiscard(handTiles, allowedKeys)
  }
  if (!Object.keys(baseMap).length) {
    expectedPointResults.value = {}
    loading.value = false
    return
  }
  expectedPointResults.value = applyShapeAndVolumeWeights(baseMap, improvementResults.value, shantenNum.value)
  expectedPointResults.value = applyDiscardDigitPenalty(expectedPointResults.value)
  loading.value = false
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