// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
    <ul ref="outerEl" class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>

        <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
          {{ t('handpointcalculation.title') }}
        </li>

        <!-- 基本信息 -->
        <li class="p-4 pb-2 text-lg opacity-100 tracking-wide">
            <div class="mt-2 text-center">
                <div class="text-lg">
                    {{
                      t('handpointcalculation.summary', {
                        round: localizedRound,
                        seat: localizedSeat,
                        win: handData.isTsumo ? t('pointCalc.winTypes.tsumo') : t('pointCalc.winTypes.ron')
                      })
                    }}
                </div>
                <div
                  v-if="(handData.isRiichi || handData.isDaburuRiichi || handData.isIppatsu || handData.isHaitei || handData.isHoutei || handData.isRinshan || handData.isChankan)"
                  class="flex flex-wrap items-center justify-center gap-2 mt-2 text-lg"
                >
                    <span v-if="handData.isRiichi" class="badge badge-lg badge-primary">{{ t('handpointcalculation.badges.riichi') }}</span>
                    <span v-if="handData.isDaburuRiichi" class="badge badge-lg badge-primary">{{ t('handpointcalculation.badges.daburuRiichi') }}</span>
                    <span v-if="handData.isIppatsu" class="badge badge-lg badge-primary">{{ t('handpointcalculation.badges.ippatsu') }}</span>
                    <span v-if="handData.isHaitei" class="badge badge-lg badge-accent">{{ t('handpointcalculation.badges.haitei') }}</span>
                    <span v-if="handData.isHoutei" class="badge badge-lg badge-accent">{{ t('handpointcalculation.badges.houtei') }}</span>
                    <span v-if="handData.isRinshan" class="badge badge-lg badge-info">{{ t('handpointcalculation.badges.rinshan') }}</span>
                    <span v-if="handData.isChankan" class="badge badge-lg badge-warning">{{ t('handpointcalculation.badges.chankan') }}</span>
                </div>
            </div>
        </li>

        <!-- 宝牌/里宝牌 -->
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
          <div class="flex flex-row gap-6 sm:gap-8 mt-2 justify-center">
            <div class="text-center">
              <div class="text-base mb-1">{{ t('handpointcalculation.labels.doraIndicators') }}</div>
              <div class="flex justify-center" style="gap: 0;">
                <img
                  v-for="(tile, i) in normalizedDoraIndicators"
                  :key="'dora-' + i"
                  :src="getTileSrc(tile)"
                  :alt="tile"
                  class="rounded object-contain"
                  :style="tileSizeStyle"
                />
              </div>
            </div>
            <div class="text-center">
              <div class="text-base mb-1">{{ t('handpointcalculation.labels.uraDoraIndicators') }}</div>
              <div class="flex justify-center" style="gap: 0;">
                <img
                  v-for="(tile, i) in normalizedRiichiDoraIndicators"
                  :key="'rdora-' + i"
                  :src="getTileSrc(tile)"
                  :alt="tile"
                  class="rounded object-contain"
                  :style="tileSizeStyle"
                />
              </div>
            </div>
          </div>
        </li>

        <!-- 手牌展示（统一 object-contain 与 gap:0） -->
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
          <div class="w-full mt-2 overflow-x-auto">
            <div class="mx-auto">
              <table class="whitespace-nowrap mx-auto">
                <tbody>
                  <tr>
                    <!-- 门前手牌（不包含和牌那一张） -->
                    <td class="align-bottom p-1">
                      <template v-for="(tile, idx) in handMainTilesWithoutWinning" :key="'main-' + idx">
                        <img :src="getTileSrc(tile)" :alt="tile" class="rounded inline-block object-contain" :style="tileSizeStyle" />
                      </template>
                    </td>
                    <!-- 和牌 -->
                    <td class="align-bottom p-1">
                      <template v-for="(tile, idx) in winningTileOnly" :key="'win-' + idx">
                        <img :src="getTileSrc(tile)" :alt="tile" class="rounded inline-block object-contain" :style="[tileSizeStyle, winningTileFilter]" />
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </li>
        <!-- 手牌展示（统一 object-contain 与 gap:0） -->
        <li class="p-0 pb-0 text-base opacity-100 tracking-wide">
          <div class="w-full mt-2 overflow-x-auto">
            <div class="mx-auto">
              <table class="whitespace-nowrap mx-auto">
                <tbody>
                  <tr>
                    <!-- 副露 -->
                    <template v-for="(meld, i) in furoMelds" :key="'furo-' + i">
                      <td class="align-bottom p-1">
                        <!-- chii -->
                        <template v-if="meld.type === 'chii'">
                          <template v-for="(t, j) in chowTiles(meld.tiles)" :key="'chow-' + i + '-' + j">
                            <img :src="getTileSrc(t)" :alt="t" class="rounded inline-block object-contain" :style="tileDisplayStyle(t)" />
                          </template>
                        </template>
                        <!-- pon -->
                        <template v-else-if="meld.type === 'pon'">
                          <template v-for="(t, j) in pongTiles(meld.tiles)" :key="'pong-' + i + '-' + j">
                            <img :src="getTileSrc(t)" :alt="t" class="rounded inline-block object-contain" :style="tileDisplayStyle(t)" />
                          </template>
                        </template>
                        <!-- 明杠 -->
                        <template v-else-if="meld.type === 'minkan'">
                          <template v-for="(t, j) in exposedKongTiles(meld.tiles)" :key="'ek-' + i + '-' + j">
                            <img :src="getTileSrc(t)" :alt="t" class="rounded inline-block object-contain" :style="tileDisplayStyle(t)" />
                          </template>
                        </template>
                        <!-- 暗杠 -->
                        <template v-else-if="meld.type === 'ankan'">
                          <template v-for="(src, j) in concealedKongImgs(meld.tiles)" :key="'ck-' + i + '-' + j">
                            <img :src="src" alt="ak" class="rounded inline-block object-contain" :style="tileSizeStyle" />
                          </template>
                        </template>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </li>

        <!-- 输入区域（与 PointCalculation 一致的输入样式与交互） -->
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
          <div class="p-2 text-base opacity-100 tracking-wide flex justify-center w-full">
            <div>
              <div v-if="handData.isDealer && handData.isTsumo" class="flex items-center gap-2">
                <input
                  type="number"
                  v-model="userInput.dealer"
                  class="input w-60 text-base py-2 px-3"
                  autocomplete="off"
                  @keyup.enter="checkAnswer"
                  :aria-label="t('pointCalc.aria.inputDealerAll')"
                />
                <span>{{ t('pointCalc.labels.pointsAll') }}</span>
              </div>
              <div v-else-if="handData.isDealer && !handData.isTsumo" class="flex items-center gap-2">
                <input
                  type="number"
                  v-model="userInput.nonDealer"
                  class="input w-60 text-base py-2 px-3"
                  autocomplete="off"
                  @keyup.enter="checkAnswer"
                  :aria-label="t('pointCalc.aria.inputDealerRon')"
                />
                <span>{{ t('pointCalc.labels.points') }}</span>
              </div>
              <div v-else-if="!handData.isDealer && handData.isTsumo" class="flex flex-wrap items-center gap-2 justify-center w-full">
                <input
                  type="number"
                  v-model="userInput.nonDealer"
                  class="input w-60 text-base py-2 px-3"
                  :placeholder="t('pointCalc.placeholders.nonDealer')"
                  autocomplete="off"
                  :aria-label="t('pointCalc.aria.inputNonDealerTsumoNonDealer')"
                />
                <span>{{ t('pointCalc.labels.points') }}</span>
                <div class="w-full"></div>
                <input
                  type="number"
                  v-model="userInput.dealer"
                  class="input w-60 text-base py-2 px-3"
                  :placeholder="t('pointCalc.placeholders.dealer')"
                  autocomplete="off"
                  @keyup.enter="checkAnswer"
                  :aria-label="t('pointCalc.aria.inputNonDealerTsumoDealer')"
                />
                <span>{{ t('pointCalc.labels.points') }}</span>
              </div>
              <div v-else class="flex items-center gap-2">
                <input
                  type="number"
                  v-model="userInput.nonDealer"
                  class="input w-60 text-base py-2 px-3"
                  autocomplete="off"
                  @keyup.enter="checkAnswer"
                  :aria-label="t('pointCalc.aria.inputNonDealerRon')"
                />
                <span>{{ t('pointCalc.labels.points') }}</span>
              </div>
            </div>
          </div>
        </li>

        <!-- 操作按钮（统一按钮尺寸与布局风格） -->
        <li class="list-row flex flex-row justify-between items-center gap-2 w-full">
          <button
            class="btn btn-sm text-sm sm:text-base px-4"
            @click="prevQuestion"
            :disabled="!canGoPrev"
          >
            {{ t('pointCalc.actions.prev') }}
          </button>
          <button class="btn btn-sm text-sm sm:text-base px-4" @click="checkAnswer">
            {{ t('pointCalc.actions.submit') }}
          </button>
          <button class="btn btn-sm text-sm sm:text-base px-4" @click="resetQuestion">
            {{ t('pointCalc.actions.next') }}
          </button>
        </li>

        <!-- 结果区域（与其他页面统一使用 badge 与居中容器） -->
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
          <div class="flex flex-col items-center justify-center max-w-full box-border">
            <div v-if="showResult" class="my-5 p-2.5 rounded-md text-center">
              <!-- 合并 class 与 :class，避免重复属性；逻辑不变 -->
              <div
                :class="[
                  'inline-flex items-center gap-1 text-lg font-bold',
                  isCorrect ? 'badge badge-success' : 'badge badge-error'
                ]"
              >
                {{ isCorrect ? t('pointCalc.result.correct') : t('pointCalc.result.wrong') }}
              </div>
              <div v-if="!isCorrect" class="flex items-center justify-center mt-2">
                <div class="text-sm sm:text-base opacity-80">{{ t('pointCalc.result.correctAnswer') }}</div>
                <div class="text-sm sm:text-base opacity-80 ml-2">{{ correctAnswerText }}</div>
              </div>
            </div>
          </div>

          <!-- 飜数展示（与其他页面字号一致，居中、换行友好） -->
          <div v-if="showResult" class="mt-2 w-full text-center">
            <div class="inline-flex flex-wrap justify-center items-center gap-2 text-sm sm:text-base">
              <span>{{ t('handpointcalculation.labels.hanPrefix') }}</span>
              <template v-if="handData.hanResult.yakumanList && handData.hanResult.yakumanList.length">
                <span v-for="(y, i) in localizedYakumanList" :key="'yakuman-inline-' + i" class="whitespace-nowrap">
                  {{ y }}
                </span>
                <span class="whitespace-nowrap">
                  {{ t('handpointcalculation.labels.yakumanTimes', { n: handData.hanResult.yakuman }) }}
                </span>
              </template>
              <template v-else>
                <span v-for="(y, i) in localizedYakuList" :key="'yaku-inline-' + i" class="whitespace-nowrap">
                  {{ y }}
                </span>
                <span class="whitespace-nowrap">
                  {{ t('handpointcalculation.labels.hanTotal', { han: handData.hanResult.han }) }}
                </span>
              </template>
            </div>
          </div>

          <!-- 符数展示（文本行，字号与风格统一） -->
          <div v-if="showResult && handData.hanResult.yakuman === 0" class="mt-4 w-full text-center">
            <div class="inline-flex flex-wrap justify-center items-center gap-2 text-sm sm:text-base">
              <span>{{ t('handpointcalculation.labels.fuPrefix') }}</span>

              <template v-if="handData.fuResult.isPinfuTsumo">
                <span class="whitespace-nowrap">{{ t('handpointcalculation.labels.pinfuTsumo20') }}</span>
              </template>
              <template v-else-if="handData.fuResult.isChowTwentyFu">
                <span class="whitespace-nowrap">{{ t('handpointcalculation.labels.chowThirtyFu') }}</span>
              </template>
              <template v-else>
                <span
                  v-for="(m, i) in filteredMeldFuMessages"
                  :key="'fu-inline-' + i"
                  class="whitespace-nowrap"
                >
                  {{ m }}
                </span>
                <span class="whitespace-nowrap">{{ t('handpointcalculation.labels.baseFu20') }}</span>
                <span v-if="!handData.isTsumo && handData.isMenzen" class="whitespace-nowrap">{{ t('handpointcalculation.labels.menzenRon10') }}</span>
                <span v-if="handData.isTsumo" class="whitespace-nowrap">{{ t('handpointcalculation.labels.tsumo2') }}</span>
                <span v-if="handData.waitType === 'tanki-machi'" class="whitespace-nowrap">{{ t('handpointcalculation.labels.waitTanki2') }}</span>
                <span v-if="handData.waitType === 'penchan-machi'" class="whitespace-nowrap">{{ t('handpointcalculation.labels.waitPenchan2') }}</span>
                <span v-if="handData.waitType === 'kanchan-machi'" class="whitespace-nowrap">{{ t('handpointcalculation.labels.waitKanchan2') }}</span>

                <span v-if="handData.fuResult.fuNotCeil === handData.fuResult.fu" class="whitespace-nowrap">
                  {{ t('handpointcalculation.labels.fuTotalExact', { fu: handData.fuResult.fu }) }}
                </span>
                <template v-else>
                  <span class="whitespace-nowrap">
                    {{ t('handpointcalculation.labels.fuTotalRaw', { fu: handData.fuResult.fuNotCeil }) }}
                  </span>
                </template>
              </template>
            </div>
          </div>
        </li>

        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    </ul>
</template>

<script setup>
// 说明：本文件所有注释均使用简体中文；仅优化注释文案与个别措辞，不改动任何业务逻辑或字符串常量
// 提示：代码中用于判定的类型与等待形式（如“handshuntsu”“handtoitsu”“chii/pon/minkan/ankan”“tanki-machi/penchan-machi/kanchan-machi/ryanmen-machi”等）为字符串常量，保持不变以避免影响逻辑。

import { onMounted, onBeforeUnmount, reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { HandDivider, YakuList } from '../utils/yakucalculation'

const { t } = useI18n()

// 图片与旋转相关：统一使用 object-contain；支持将带前缀的牌图（-，=，v）旋转后显示
const img = n => `/mahjongfiles/${n}.png`
const imgUrl = img
const BACK_TILE = '-1'
const tileGenTick = ref(0)
const rotatedCache = new Map()
const rotatingSet = new Set()

// 根据前缀确定旋转角度：'-' 表示逆时针 90°；'=' 表示顺时针 90°；'v' 也按逆时针 90° 处理（可按需调整）
function rotationOf(prefix) {
  if (prefix === '-') return -90
  if (prefix === '=') return 90
  if (prefix === 'v') return -90
  return 0
}

// 生成旋转后的牌图（返回 dataURL，带缓存）；生成过程完成后通过计数器触发重渲染
function ensureRotated(tileWithPrefix) {
  if (rotatedCache.has(tileWithPrefix) || rotatingSet.has(tileWithPrefix)) return
  const prefix = tileWithPrefix[0]
  const base = tileWithPrefix.slice(1)
  const angle = rotationOf(prefix)
  if (!angle) return

  rotatingSet.add(tileWithPrefix)
  const baseImg = new Image()
  baseImg.src = img(base)
  baseImg.onload = () => {
    const w = baseImg.width
    const h = baseImg.height
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) { rotatingSet.delete(tileWithPrefix); return }

    if (Math.abs(angle) === 90) {
      canvas.width = h
      canvas.height = w
      if (angle === -90) {
        ctx.translate(0, canvas.height)
        ctx.rotate(-Math.PI / 2)
      } else {
        ctx.translate(canvas.width, 0)
        ctx.rotate(Math.PI / 2)
      }
    } else {
      canvas.width = w
      canvas.height = h
      ctx.translate(canvas.width, canvas.height)
      ctx.rotate(Math.PI)
    }
    ctx.drawImage(baseImg, 0, 0)
    const url = canvas.toDataURL('image/png')
    rotatedCache.set(tileWithPrefix, url)
    rotatingSet.delete(tileWithPrefix)
    tileGenTick.value++
  }
  baseImg.onerror = () => rotatingSet.delete(tileWithPrefix)
}

// 统一获取牌图地址：若命中旋转前缀则优先返回缓存；生成期间用原图占位
function getTileSrc(tile) {
  // 建立依赖，生成完成时触发重渲染
  // eslint-disable-next-line no-unused-expressions
  tileGenTick.value

  if (!tile) return ''
  if (tile === BACK_TILE) return img(BACK_TILE)

  // 旋转前缀处理（修复：'\v' 应为 'v'）
  if (/^[-=v]/.test(tile)) {
    if (rotatedCache.has(tile)) return rotatedCache.get(tile)
    ensureRotated(tile)
    // 生成期间先用原图（未旋转）占位
    return img(tile.slice(1))
  }
  return img(tile)
}

// 页面状态（题面/手牌/番符/点数/输入等）
const handData = reactive({
  melds: [],
  winningMeldIndex: 0,
  winningTileIndex: 0,
  waitType: '',
  roundWind: 'east',
  seatWind: 'east',
  isDealer: false,
  isMenzen: true,
  isTsumo: true,
  isRiichi: false,
  isDaburuRiichi: false,
  isIppatsu: false,
  isHaitei: false,
  isHoutei: false,
  isRinshan: false,
  isChankan: false,
  doraIndicators: [],
  riichiDoraIndicators: [],
  fuResult: { fu: 20, fuNotCeil: 20, meldFuMessage: [], isPinfuTsumo: false, isChowTwentyFu: false },
  hanResult: { isYaku: false, yakuman: 0, yakumanList: [], han: 0, yakuList: [] },
  pointsResult: { tsumo: 0, ron: 0 }
})
const userInput = reactive({ dealer: '', nonDealer: '' })
const isCorrect = ref(null)
const showResult = ref(false)
const randomNumber = ref(Math.random())

// 结果正确答案的本地化展示（不更改逻辑，仅描述优化）
const correctAnswerText = computed(() => {
  const role = handData.isDealer ? t('pointCalc.roles.dealer') : t('pointCalc.roles.nonDealer')
  const win = handData.isTsumo ? t('pointCalc.winTypes.tsumo') : t('pointCalc.winTypes.ron')
  const hanFu = handData.hanResult.yakuman !== 0
    ? t('handpointcalculation.labels.yakumanTimes', { n: handData.hanResult.yakuman })
    : t('handpointcalculation.labels.ansHanTotal', { han: handData.hanResult.han }) + ' ' +
      t('handpointcalculation.labels.ansFuTotal', { fu: handData.fuResult.fu })
  let pts = ''
  if (handData.isDealer && handData.isTsumo) {
    pts = `${handData.pointsResult.tsumo} ${t('pointCalc.labels.pointsAll')}`
  } else if (!handData.isDealer && handData.isTsumo) {
    pts = `${handData.pointsResult.tsumo.nonDealer} ${t('pointCalc.labels.points')} / ${handData.pointsResult.tsumo.dealer} ${t('pointCalc.labels.points')}`
  } else {
    pts = `${handData.pointsResult.ron} ${t('pointCalc.labels.points')}`
  }
  return `${role} ${win} ${hanFu} ${pts}`
})

// 将 fu 明细从对象化键（i18n key + fu）映射为当前语言的可读文本；过滤掉 0 符项
const filteredMeldFuMessages = computed(() => {
  const list = handData?.fuResult?.meldFuMessage || []
  if (list.length && typeof list[0] === 'object' && list[0] !== null) {
    return list
      .filter(item => (typeof item.fu === 'number' ? item.fu > 0 : true))
      .map(item => t(item.key, { fu: item.fu }))
  }
  return list.filter((msg) => {
    const m = String(msg).match(/(\d+)\s*符/)
    if (!m) return true
    return parseInt(m[1], 10) > 0
  })
})

// 将役满/役列表做本地化映射，切换语言时自动更新
const localizedYakumanList = computed(() => {
  const list = handData?.hanResult?.yakumanList || []
  return list.map((item) => {
    // 兼容：对象 { key, params }，或直接 i18n 键字符串，或已翻译字符串
    if (item && typeof item === 'object') return t(item.key, item.params || {})
    if (typeof item === 'string' && item.startsWith('handpointcalculation.')) return t(item)
    return item
  })
})
const localizedYakuList = computed(() => {
  const list = handData?.hanResult?.yakuList || []
  return list.map((item) => {
    if (item && typeof item === 'object') return t(item.key, item.params || {})
    if (typeof item === 'string' && item.startsWith('handpointcalculation.')) return t(item)
    return item
  })
})

const TILE_PER_ROW = 17

// 使用 CSS 变量统一牌图尺寸与垂直偏移，随容器宽度自适应
const tileSizeStyle = { width: 'var(--tile-size)', maxWidth: 'var(--tile-size)', height: 'auto' }
const winningTileFilter = { filter: '' }

// 宽牌（旋转/倾斜显示的牌）在视觉上略放宽，避免挤压
const tileWideSizeStyle = (t) => {
  const isWide = typeof t === 'string' && /^[\-=v]/.test(t)
  return {
    width: isWide ? 'calc(var(--tile-size) * 1.3)' : 'var(--tile-size)',
    maxWidth: isWide ? 'calc(var(--tile-size) * 1.3)' : 'var(--tile-size)',
    height: 'auto'
  }
}

// 旋转牌图在展示时向下错位，模拟叠放效果
const isRotated = (t) => typeof t === 'string' && /^[\-=v]/.test(t)
const tileDisplayStyle = (t) => {
  const base = tileWideSizeStyle(t)
  // 使用外层变量 --tile-offset 控制下移
  return isRotated(t) ? { ...base, marginTop: 'var(--tile-offset)' } : base
}

// 监听外层容器宽度，计算并写入 --tile-size 与 --tile-offset，完成自适应
const outerEl = ref(null)
let ro = null
function updateTileVars() {
  const el = outerEl.value
  if (!el) return
  const w = el.clientWidth
  const tilePx = (w / TILE_PER_ROW)
  el.style.setProperty('--tile-size', `${tilePx}px`)
  el.style.setProperty('--tile-offset', `${tilePx * 0.5}px`)
}
onMounted(() => {
  // 初始设置与监听容器大小变化
  updateTileVars()
  ro = new ResizeObserver(() => updateTileVars())
  if (outerEl.value) ro.observe(outerEl.value)
})
onBeforeUnmount(() => { if (ro) ro.disconnect() })

// 新增：根据语言本地化 场风/自风
const localizedRound = computed(() => t(`handpointcalculation.winds.${handData.roundWind}`))
const localizedSeat = computed(() => t(`handpointcalculation.winds.${handData.seatWind}`))

// 计算展示所需的手牌（去掉和牌那张，仅用于 UI 展示）
const handMainTilesWithoutWinning = computed(() => {
  // 移除未使用变量：保留生成逻辑不变
  // const wm = handData.melds[handData.winningMeldIndex]
  const filtered = (handData.melds || [])
    .map((m, mi) => mi === handData.winningMeldIndex
      ? { ...m, tiles: m.tiles.filter((_, ti) => ti !== handData.winningTileIndex) }
      : m)
    .filter((m) => ['handkouutsu', 'handshuntsu', 'handtoitsu'].includes(m.type))
    .flatMap((m) => m.tiles)
  return sortTiles(filtered)
})
const winningTileOnly = computed(() => {
  const wm = handData.melds[handData.winningMeldIndex]
  if (!wm) return []
  return [wm.tiles[handData.winningTileIndex]]
})
const furoMelds = computed(() => (handData.melds || []).filter((m) => ['chii', 'pon', 'minkan', 'ankan'].includes(m.type)))

// 宝牌指示牌/里宝指示牌展示：补齐到 5 张背面牌，保持布局稳定
const normalizedDoraIndicators = computed(() => {
  const arr = handData?.doraIndicators || []
  return [...arr, ...Array(5 - arr.length).fill(BACK_TILE)].slice(0, 5)
})
const normalizedRiichiDoraIndicators = computed(() => {
  const arr = handData?.riichiDoraIndicators || []
  return [...arr, ...Array(5 - arr.length).fill(BACK_TILE)].slice(0, 5)
})

// 历史栈：支持“上一题”回退（保存题面与输入、结果状态）
const historyStack = ref([])
const canGoPrev = computed(() => historyStack.value.length > 0)
const deepClone = (v) => JSON.parse(JSON.stringify(v))

function snapshotCurrent() {
  return {
    handData: deepClone(handData),
    userInput: deepClone(userInput),
    isCorrect: isCorrect.value,
    showResult: showResult.value,
    randomNumber: randomNumber.value
  }
}
function restoreFromSnapshot(snap) {
  Object.assign(handData, snap.handData)
  Object.assign(userInput, snap.userInput)
  isCorrect.value = snap.isCorrect
  showResult.value = snap.showResult
  randomNumber.value = snap.randomNumber
}
function prevQuestion() {
  if (!canGoPrev.value) return
  const snap = historyStack.value.pop()
  restoreFromSnapshot(snap)
}

// 初始化一题：保证有役（isYaku 为 true）
onMounted(() => {
  initialize()
})
function initialize() {
  let valid = false
  let data = {}
  while (!valid) {
    data = generateValidHand()
    valid = data.hanResult.isYaku
  }
  Object.assign(handData, data)
  showResult.value = false
  randomNumber.value = Math.random()
}

// 判题：不改动判定规则，仅保留行为
function checkAnswer() {
  const points = handData.pointsResult
  const { dealer, nonDealer } = userInput
  let ok = false

  if (handData.isDealer) {
    ok = handData.isTsumo
      ? parseInt(dealer) === points.tsumo
      : parseInt(nonDealer) === points.ron
  } else {
    ok = handData.isTsumo
      ? (parseInt(dealer) === points.tsumo.dealer && parseInt(nonDealer) === points.tsumo.nonDealer)
      : parseInt(nonDealer) === points.ron
  }
  isCorrect.value = ok
  showResult.value = true
}

// 下一题：入栈当前题面，清空输入与结果显示
function resetQuestion() {
  // 下一题前入栈当前题目快照
  historyStack.value.push(snapshotCurrent())

  initialize()
  userInput.dealer = ''
  userInput.nonDealer = ''
  isCorrect.value = null
  showResult.value = false
}

// 牌面排序：万/饼/索/字；赤五按 5.5 参与排序
function sortTiles(tiles) {
  const typeOrder = { m: 0, p: 1, s: 2, z: 3 }
  return [...tiles].sort((a, b) => {
    const aType = a.slice(-1)
    const aNum = a.replace(/\D/g, '')
    const aSortNum = aNum === '0' ? 5.5 : parseInt(aNum, 10)
    const bType = b.slice(-1)
    const bNum = b.replace(/\D/g, '')
    const bSortNum = bNum === '0' ? 5.5 : parseInt(bNum, 10)
    if (typeOrder[aType] !== typeOrder[bType]) return typeOrder[aType] - typeOrder[bType]
    return aSortNum - bSortNum
  })
}

// 生成整墙（含字牌）
function generateWall() {
  const types = ['m', 'p', 's']
  const wall = []
  types.forEach((type) => { for (let num=1; num<=9; num++) wall.push(...Array(4).fill(`${num}${type}`)) })
  for (let num=1; num<=7; num++) wall.push(...Array(4).fill(`${num}z`))
  return wall
}

// 校验是否能从牌墙中取出指定组合
function canExtractTiles(wall, choice) {
  const wc = new Map()
  for (const t of wall) wc.set(t, (wc.get(t)||0)+1)
  const need = new Map()
  for (const t of choice.tiles) need.set(t, (need.get(t)||0)+1)
  for (const [t, c] of need) if ((wc.get(t)||0) < c) return false
  return true
}

// ---- 明/暗副露展示转换：将组合映射为展示用顺序/旋转形式 ----
function chowTiles(tiles) {
  const result = tiles.map((tile, index) => [`-${tile}`, ...tiles.filter((_, i) => i !== index)])
  return result[Math.floor(randomNumber.value * result.length)]
}
function pongTiles(tiles) {
  const result = tiles.map((tile, index) => {
    const nt = [...tiles]; nt[index] = `-${tile}`; return nt
  })
  return result[Math.floor(randomNumber.value * result.length)]
}
function exposedKongTiles(tiles) {
  const result = []
  result.push([`-${tiles[0]}`, tiles[1], tiles[2], tiles[3]])
  result.push([tiles[0], `-${tiles[1]}`, tiles[2], tiles[3]])
  result.push([tiles[0], tiles[1], tiles[2], `-${tiles[3]}`])
  const asV = (t) => (t === '0m' || t === '0p' || t === '0s') ? `v${t}` : `=${t}`
  result.push([asV(tiles[0]), tiles[1], tiles[2], tiles[3]])
  result.push([tiles[0], asV(tiles[1]), tiles[2], tiles[3]])
  result.push([tiles[0], tiles[1], asV(tiles[2]), tiles[3]])
  return result[Math.floor(randomNumber.value * result.length)]
}
function concealedKongImgs(tiles) {
  // 使用 BACK_TILE 背面，按示例映射 5m/0m -> [背, 0m, 5m, 背] 等
  if (tiles[0] === '5m' || tiles[0] === '0m') {
    return [img(BACK_TILE), img('0m'), img('5m'), img(BACK_TILE)]
  } else if (tiles[0] === '5s' || tiles[0] === '0s') {
    return [img(BACK_TILE), img('0s'), img('5s'), img(BACK_TILE)]
  } else if (tiles[0] === '5p' || tiles[0] === '0p') {
    return [img(BACK_TILE), img('0p'), img('5p'), img(BACK_TILE)]
  } else {
    return [img(BACK_TILE), img(tiles[1]), img(tiles[2]), img(BACK_TILE)]
  }
}

// 顺子/刻子/雀头的和牌高亮
function seqTripPairImgStyle(kind, meldIndex, tileIndex) {
  const base = { ...tileSizeStyle }
  if (handData.winningMeldIndex !== meldIndex) return base
  if (kind === 'handkouutsu' && tileIndex === 2) return { ...base, ...winningTileFilter }
  if (kind === 'handtoitsu' && tileIndex === 1) return { ...base, ...winningTileFilter }
  if (kind === 'handshuntsu' && tileIndex === handData.winningTileIndex) return { ...base, ...winningTileFilter }
  return base
}

// ---------------- 核心算法（移植示例，保持逻辑不变） ----------------
function generateValidHand() {
  // 构造可选组合（顺子/刻子/副露/杠等）
  const wall = generateWall()
  const sequenceOptions = []
  const tripletOptions = []
  const chowOptions = []
  const pongOptions = []
  const exposedKongOptions = []
  const concealedKongOptions = []

  const createMeld = () => {
    // chii/顺子
    ;['m','s','p'].forEach((suit) => {
      for (let i=1;i<=7;i++) {
        chowOptions.push({ type: 'chii', tiles: [`${i}${suit}`, `${i+1}${suit}`, `${i+2}${suit}`] })
        sequenceOptions.push({ type: 'handshuntsu', tiles: [`${i}${suit}`, `${i+1}${suit}`, `${i+2}${suit}`] })
      }
    })
    // pon/刻子/杠
    ;['m','s','p'].forEach((suit) => {
      for (let i=1;i<=9;i++) {
        pongOptions.push({ type: 'pon', tiles: [`${i}${suit}`,`${i}${suit}`,`${i}${suit}`] })
        tripletOptions.push({ type: 'handkouutsu', tiles: [`${i}${suit}`,`${i}${suit}`,`${i}${suit}`] })
        exposedKongOptions.push({ type: 'minkan', tiles: [`${i}${suit}`,`${i}${suit}`,`${i}${suit}`,`${i}${suit}`] })
        concealedKongOptions.push({ type: 'ankan', tiles: [`${i}${suit}`,`${i}${suit}`,`${i}${suit}`,`${i}${suit}`] })
      }
    })
    ;['z'].forEach((suit) => {
      for (let i=1;i<=7;i++) {
        pongOptions.push({ type: 'pon', tiles: [`${i}${suit}`,`${i}${suit}`,`${i}${suit}`] })
        tripletOptions.push({ type: 'handkouutsu', tiles: [`${i}${suit}`,`${i}${suit}`,`${i}${suit}`] })
        exposedKongOptions.push({ type: 'minkan', tiles: [`${i}${suit}`,`${i}${suit}`,`${i}${suit}`,`${i}${suit}`] })
        concealedKongOptions.push({ type: 'ankan', tiles: [`${i}${suit}`,`${i}${suit}`,`${i}${suit}`,`${i}${suit}`] })
      }
    })
  }
  createMeld()

  const roundWind = ['east','south','west'][Math.floor(Math.random()*3)]
  const seatWind = ['east','south','west','north'][Math.floor(Math.random()*4)]
  let isDealer = seatWind === 'east'
  let isMenzen = Math.random() > 0.5
  let isTsumo = Math.random() > 0.5
  let isRiichi = false
  let isDaburuRiichi = false
  let isIppatsu = false
  let isHaitei = false
  let isHoutei = false
  let isRinshan = false
  let isChankan = false
  let selected = []

  if (isMenzen) {
    while (selected.length < 4) {
      const r = Math.random()
      let choice
      if (r < 0.8) choice = sequenceOptions[Math.floor(Math.random()*sequenceOptions.length)]
      else if (r < 0.95) choice = tripletOptions[Math.floor(Math.random()*tripletOptions.length)]
      else choice = concealedKongOptions[Math.floor(Math.random()*concealedKongOptions.length)]
      if (canExtractTiles(wall, choice)) {
        selected.push(choice)
        choice.tiles.forEach((t) => { const idx = wall.indexOf(t); if (idx !== -1) wall.splice(idx,1) })
      }
    }
    // 选雀头
    const countMap = new Map()
    wall.forEach((t)=>countMap.set(t,(countMap.get(t)||0)+1))
    const candidates = [...countMap.entries()].filter(([t,c])=>c>=2).map(([t])=>t)
    const pairTile = candidates[Math.floor(Math.random()*candidates.length)]
    const idxs=[]
    wall.forEach((t,i)=>{ if (t===pairTile) idxs.push(i)})
    if (idxs.length>=2) { wall.splice(idxs[1],1); wall.splice(idxs[0],1) }
    selected.push({ type:'handtoitsu', tiles: [pairTile, pairTile] })

    const riichiType = Math.random()
    isRiichi = riichiType < 0.8
    if (roundWind === 'east') isDaburuRiichi = (riichiType >= 0.8 && riichiType < 0.85)
    if (isRiichi || isDaburuRiichi) isIppatsu = Math.random() < 0.05

    if (isTsumo) {
      isHaitei = Math.random() < 0.01
      if (!isHaitei && !isIppatsu && selected.some((x)=>x.type==='ankan')) isRinshan = Math.random() < 0.01
    } else {
      isHoutei = Math.random() < 0.01
      if (!isHoutei) isChankan = Math.random() < 0.01
    }
  } else {
    // 副露（缩减仅保留样例随机策略的主线，细分略）
    const yakuType = Math.random()
    const yakuHaiOptions = []
    yakuHaiOptions.push({ type:'handkouutsu', tiles:['5z','5z','5z'] })
    yakuHaiOptions.push({ type:'handkouutsu', tiles:['6z','6z','6z'] })
    yakuHaiOptions.push({ type:'handkouutsu', tiles:['7z','7z','7z'] })
    yakuHaiOptions.push({ type:'pon', tiles:['5z','5z','5z'] })
    yakuHaiOptions.push({ type:'pon', tiles:['6z','6z','6z'] })
    yakuHaiOptions.push({ type:'pon', tiles:['7z','7z','7z'] })
    const windToZ = { 'east':'1z', 'south':'2z', 'west':'3z', 'north':'4z' }
    ;['east','south','west','north'].forEach((w)=>{
      if (roundWind===w || seatWind===w) {
        yakuHaiOptions.push({ type:'handkouutsu', tiles:[windToZ[w], windToZ[w], windToZ[w]] })
        yakuHaiOptions.push({ type:'pon', tiles:[windToZ[w], windToZ[w], windToZ[w]] })
      }
    })
    if (yakuType < 0.4) {
      let choice = yakuHaiOptions[Math.floor(Math.random()*yakuHaiOptions.length)]
      if (canExtractTiles(wall, choice)) {
        selected.push(choice)
        choice.tiles.forEach((t)=>{ const idx=wall.indexOf(t); if (idx!==-1) wall.splice(idx,1) })
      }
      while (selected.length<4) {
        const r = Math.random()
        let choice
        if (r < 0.3) choice = sequenceOptions[Math.floor(Math.random()*sequenceOptions.length)]
        else if (r < 0.6) choice = chowOptions[Math.floor(Math.random()*chowOptions.length)]
        else if (r < 0.75) choice = tripletOptions[Math.floor(Math.random()*tripletOptions.length)]
        else if (r < 0.9) choice = pongOptions[Math.floor(Math.random()*pongOptions.length)]
        else if (r < 0.95) choice = concealedKongOptions[Math.floor(Math.random()*concealedKongOptions.length)]
        else choice = exposedKongOptions[Math.floor(Math.random()*exposedKongOptions.length)]
        if (canExtractTiles(wall, choice)) {
          selected.push(choice)
          choice.tiles.forEach((t)=>{ const idx=wall.indexOf(t); if (idx!==-1) wall.splice(idx,1) })
        }
      }
      const countMap = new Map()
      wall.forEach((t)=>countMap.set(t,(countMap.get(t)||0)+1))
      const candidates = [...countMap.entries()].filter(([t,c])=>c>=2).map(([t])=>t)
      const pairTile = candidates[Math.floor(Math.random()*candidates.length)]
      const idxs=[]
      wall.forEach((t,i)=>{ if (t===pairTile) idxs.push(i)})
      if (idxs.length>=2) { wall.splice(idxs[1],1); wall.splice(idxs[0],1) }
      selected.push({ type:'handtoitsu', tiles: [pairTile, pairTile] })
    } else if (yakuType < 0.9) {
      // 断幺或混一色（保留主逻辑，细分筛选同样按样例）
      while (selected.length<4) {
        const r = Math.random()
        let choice
        if (r < 0.3) choice = sequenceOptions[Math.floor(Math.random()*sequenceOptions.length)]
        else if (r < 0.6) choice = chowOptions[Math.floor(Math.random()*chowOptions.length)]
        else if (r < 0.75) choice = tripletOptions[Math.floor(Math.random()*tripletOptions.length)]
        else if (r < 0.9) choice = pongOptions[Math.floor(Math.random()*pongOptions.length)]
        else if (r < 0.95) choice = concealedKongOptions[Math.floor(Math.random()*concealedKongOptions.length)]
        else choice = exposedKongOptions[Math.floor(Math.random()*exposedKongOptions.length)]
        if (canExtractTiles(wall, choice)) {
          selected.push(choice)
          choice.tiles.forEach((t)=>{ const idx=wall.indexOf(t); if (idx!==-1) wall.splice(idx,1) })
        }
      }
      const countMap = new Map()
      wall.forEach((t)=>countMap.set(t,(countMap.get(t)||0)+1))
      const candidates = [...countMap.entries()].filter(([t,c])=>c>=2).map(([t])=>t)
      const pairTile = candidates[Math.floor(Math.random()*candidates.length)]
      const idxs=[]
      wall.forEach((t,i)=>{ if (t===pairTile) idxs.push(i)})
      if (idxs.length>=2) { wall.splice(idxs[1],1); wall.splice(idxs[0],1) }
      selected.push({ type:'handtoitsu', tiles: [pairTile, pairTile] })
    } else {
      // 10% 其他
      while (selected.length<4) {
        const r = Math.random()
        let choice
        if (r < 0.3) choice = sequenceOptions[Math.floor(Math.random()*sequenceOptions.length)]
        else if (r < 0.6) choice = chowOptions[Math.floor(Math.random()*chowOptions.length)]
        else if (r < 0.75) choice = tripletOptions[Math.floor(Math.random()*tripletOptions.length)]
        else if (r < 0.9) choice = pongOptions[Math.floor(Math.random()*pongOptions.length)]
        else if (r < 0.95) choice = concealedKongOptions[Math.floor(Math.random()*concealedKongOptions.length)]
        else choice = exposedKongOptions[Math.floor(Math.random()*exposedKongOptions.length)]
        if (canExtractTiles(wall, choice)) {
          selected.push(choice)
          choice.tiles.forEach((t)=>{ const idx=wall.indexOf(t); if (idx!==-1) wall.splice(idx,1) })
        }
      }
      const countMap = new Map()
      wall.forEach((t)=>countMap.set(t,(countMap.get(t)||0)+1))
      const candidates = [...countMap.entries()].filter(([t,c])=>c>=2).map(([t])=>t)
      const pairTile = candidates[Math.floor(Math.random()*candidates.length)]
      const idxs=[]
      wall.forEach((t,i)=>{ if (t===pairTile) idxs.push(i)})
      if (idxs.length>=2) { wall.splice(idxs[1],1); wall.splice(idxs[0],1) }
      selected.push({ type:'handtoitsu', tiles: [pairTile, pairTile] })
    }

    if (isTsumo) {
      isHaitei = Math.random() < 0.01
      // 说明：此处 includes('kan') 用于同时命中 'minkan' 与 'ankan'，表示存在任何形式的杠
      if (!isHaitei && selected.some((x)=>x.type.includes('kan'))) isRinshan = Math.random() < 0.01
    } else {
      isHoutei = Math.random() < 0.01
      if (!isHoutei) isChankan = Math.random() < 0.01
    }
  }

  if (selected.length === 5 && selected.every((x)=>['handshuntsu','handkouutsu','handtoitsu','ankan'].includes(x.type))) {
    isMenzen = true
  }

  const typeOrder = { handshuntsu:1, handkouutsu:2, handtoitsu:3, chii:4, pon:5, minkan:6, ankan:7 }
  selected.sort((a,b)=> (typeOrder[a.type]??Infinity) - (typeOrder[b.type]??Infinity))

  const handSets = selected.filter((x)=>['handshuntsu','handkouutsu','handtoitsu'].includes(x.type))
  const notHandSets = selected.filter((x)=>['chii','pon','minkan','ankan'].includes(x.type))
  const allHandSetsTiles = []
  handSets.forEach((s)=> allHandSetsTiles.push(...s.tiles))
  const handDivider = new HandDivider()
  const dividedresults = handDivider.decomposeHand(allHandSetsTiles)
  const selectedList = []
  dividedresults.forEach((res)=>{
    selectedList.push([...res, ...notHandSets].sort((a,b)=> (typeOrder[a.type]??Infinity) - (typeOrder[b.type]??Infinity)))
  })

  let results = []
  const uniqueAllHandSetsTiles = [...new Set(allHandSetsTiles)]
  const winningTile = uniqueAllHandSetsTiles[Math.floor(Math.random()*uniqueAllHandSetsTiles.length)]

  selectedList.forEach((sel)=>{
    const winningTileData = sel
      .filter((it)=>['handshuntsu','handkouutsu','handtoitsu'].includes(it.type))
      .reduce((acc, it, idx)=>{
        let idxs = it.tiles.map((t,i)=>(t===winningTile?i:-1)).filter((x)=>x!==-1)
        if (idxs.length>0) {
          if (it.type==='handkouutsu') idxs=[2]
          else if (it.type==='handtoitsu') idxs=[1]
          acc.push({ winningMeldIndex: idx, winningTileIndex: idxs[0] })
        }
        return acc
      }, [])
    winningTileData.forEach((data)=>{
      let waitType = ''
      if (sel[data.winningMeldIndex].type==='handkouutsu') {
        waitType = 'shanpon'
      } else if (sel[data.winningMeldIndex].type==='handtoitsu') {
        waitType = 'tanki-machi'
      } else if (sel[data.winningMeldIndex].type==='handshuntsu') {
        // 稳健判定：顺子按数值升序，赤5按 5 处理
        const tileNum = (t) => (t && t[0] === '0') ? 5 : parseInt(t[0], 10)
        const numsSorted = sel[data.winningMeldIndex].tiles.map(tileNum).sort((a,b)=>a-b)
        const wn = parseInt(winningTile[0], 10) // 生成阶段 winningTile 不会是赤5
        if (wn === numsSorted[1]) {
          waitType = 'kanchan-machi'
        } else if (wn === numsSorted[0]) {
          waitType = (numsSorted[0]===7 && numsSorted[1]===8 && numsSorted[2]===9) ? 'penchan-machi' : 'ryanmen-machi'
        } else {
          waitType = (numsSorted[0]===1 && numsSorted[1]===2 && numsSorted[2]===3) ? 'penchan-machi' : 'ryanmen-machi'
        }
      }

      results.push({
        melds: sel,
        winningMeldIndex: data.winningMeldIndex,
        winningTileIndex: data.winningTileIndex,
        waitType,
        roundWind,
        seatWind,
        isDealer,
        isMenzen,
        isTsumo,
        isRiichi,
        isDaburuRiichi,
        isIppatsu,
        isHaitei,
        isHoutei,
        isRinshan,
        isChankan
      })
    })
  })

  const yakuList = new YakuList()
  results.forEach((r)=>{
    r.isTanyao = yakuList.checkTanyao(r.melds)
    r.isRoundEast = yakuList.checkRoundEast(r.melds, r.roundWind)
    r.isRoundSouth = yakuList.checkRoundSouth(r.melds, r.roundWind)
    r.isRoundWest = yakuList.checkRoundWest(r.melds, r.roundWind)
    r.isSeatEast = yakuList.checkSeatEast(r.melds, r.seatWind)
    r.isSeatSouth = yakuList.checkSeatSouth(r.melds, r.seatWind)
    r.isSeatWest = yakuList.checkSeatWest(r.melds, r.seatWind)
    r.isSeatNorth = yakuList.checkSeatNorth(r.melds, r.seatWind)
    r.isHaku = yakuList.checkHaku(r.melds)
    r.isHatsu = yakuList.checkHatsu(r.melds)
    r.isChun = yakuList.checkChun(r.melds)
    r.isMenzenTsumo = yakuList.checkMenzenTsumo(r.isMenzen, r.isTsumo)
    r.isPinfu = yakuList.checkPinfu(r.melds, r.waitType, r.roundWind, r.seatWind)
    r.isIipeikou = yakuList.checkIipeikou(r.melds, r.isMenzen)
    r.isToitoi = yakuList.checkToitoi(r.melds)
    r.isSanankou = yakuList.checkSanankou(r.melds, r.waitType, r.isTsumo)
    r.isSankantsu = yakuList.checkSankantsu(r.melds)
    r.isSanshokuDoko = yakuList.checkSanshokuDoko(r.melds)
    r.isHonrouto = yakuList.checkHonrouto(r.melds)
    r.isShouSangen = yakuList.checkShouSangen(r.melds)
    r.isSanshokuDoujun = yakuList.checkSanshokuDoujun(r.melds)
    r.isIttsu = yakuList.checkIttsu(r.melds)
    r.isChanta = yakuList.checkChanta(r.melds)
    r.isHonitsu = yakuList.checkHonitsu(r.melds)
    r.isJunchan = yakuList.checkJunchan(r.melds)
    if (yakuList.checkRyanpeikou(r.melds)) { r.isIipeikou=false; r.isRyanpeikou=true } else r.isRyanpeikou=false
    r.isChinitsu = yakuList.checkChinitsu(r.melds)
    r.isDaisangen = yakuList.checkDaisangen(r.melds)
    r.isShousuushii = yakuList.checkShousuushii(r.melds)
    r.isDaisushi = yakuList.checkDaisushi(r.melds)
    r.isTsuuiisou = yakuList.checkTsuuiisou(r.melds)
    r.isRyuuiisou = yakuList.checkRyuuiisou(r.melds)
    r.isChinroutou = yakuList.checkChinroutou(r.melds)
    r.isSuuankou = yakuList.checkSuuankou(r.melds, r.isMenzen, r.isTsumo, r.waitType)
    r.isSuuankouTanki = yakuList.checkSuuankouTanki(r.melds, r.isMenzen, r.waitType)
    r.isChuurenPoutou = yakuList.checkChuurenPoutou(r.melds, r.isMenzen, r.winningMeldIndex, r.winningTileIndex)
    r.isJunseiChuurenPoutou = yakuList.checkJunseiChuurenPoutou(r.melds, r.isMenzen, r.winningMeldIndex, r.winningTileIndex)
    r.isSuukantsu = yakuList.checkSuukantsu(r.melds)
  })

  // 宝牌指示数
  const doraIndicatorNum = selected.filter((x)=>x.type==='minkan' || x.type==='ankan').length + 1
  const doraIndicators = []
  const riichiDoraIndicators = []
  for (let i=0;i<doraIndicatorNum;i++) doraIndicators.push(wall.splice(Math.floor(Math.random()*wall.length),1)[0])
  if (isRiichi || isDaburuRiichi) {
    for (let i=0;i<doraIndicatorNum;i++) riichiDoraIndicators.push(wall.splice(Math.floor(Math.random()*wall.length),1)[0])
  }
  const doras = doraIndicators.map((tile)=> {
    const num = parseInt(tile[0],10), type = tile[1]
    if (type==='z') {
      const map = { '1z':'2z','2z':'3z','3z':'4z','4z':'1z','5z':'6z','6z':'7z','7z':'5z' }
      return map[tile] || tile
    } else { return (num===9?'1':String(num+1)) + type }
  })
  const riichiDoras = riichiDoraIndicators.map((tile)=> {
    const num = parseInt(tile[0],10), type = tile[1]
    if (type==='z') {
      const map = { '1z':'2z','2z':'3z','3z':'4z','4z':'1z','5z':'6z','6z':'7z','7z':'5z' }
      return map[tile] || tile
    } else { return (num===9?'1':String(num+1)) + type }
  })

  const allHandTiles = []
  selected.forEach((it)=> allHandTiles.push(...it.tiles))
  const doraNum = allHandTiles.reduce((c,t)=> c + doras.filter((d)=>d===t).length, 0)
  const riichiDoraNum = allHandTiles.reduce((c,t)=> c + riichiDoras.filter((d)=>d===t).length, 0)

  // 抢杠特殊情况
  const allAndIndicators = [...allHandTiles, ...doraIndicators, ...riichiDoraIndicators]
  const winningTileCount = allAndIndicators.filter((t)=>t===winningTile).length
  if (winningTileCount !== 1) results.forEach((r)=> r.isChankan=false)

  // 赤宝
  const counts = { '5m':0, '5p':0, '5s':0 }
  const maxReplacements = { '5m':0, '5p':0, '5s':0 }
  const akaDoraMap = { '5m':'0m', '5p':'0p', '5s':'0s' }
  allHandTiles.forEach((t)=>{ if (counts.hasOwnProperty(t)) counts[t]++ })
  Object.keys(counts).forEach((tile)=>{
    const num = counts[tile]
    if (num===4) maxReplacements[tile]=1
    else if (num>0) maxReplacements[tile] = (Math.random() < num*0.25) ? 1 : 0
  })
  const akaDoraNum = Object.values(maxReplacements).reduce((s,v)=>s+v,0)

  results.forEach((r)=>{
    const replaced = { '5m':0, '5p':0, '5s':0 }
    r.melds = r.melds.map((g)=>{
      const nt = [...g.tiles]
      for (let i=0;i<nt.length;i++){
        const t = nt[i]
        if (akaDoraMap[t] && replaced[t] < maxReplacements[t]) {
          nt[i] = akaDoraMap[t]; replaced[t]++; break
        }
      }
      return { ...g, tiles: nt }
    })
    r.doraIndicators = doraIndicators
    r.riichiDoraIndicators = riichiDoraIndicators
    r.doraNum = doraNum
    r.riichiDoraNum = riichiDoraNum
    r.akaDoraNum = akaDoraNum
  })

  // 符计算：逐面子累加，含门清荣和/自摸/等待形 +2 等规则；对平和自摸与副露平和型特殊处理
  results.forEach((r)=> { r.fuResult = calculateFu(r) })

  // 统计役/番：以 i18n 键收集，实际渲染时本地化
  results.forEach((r)=>{
    let yakuman=0, yakumanList=[]
    if (r.isDaisangen) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.daisangen') }
    if (r.isShousuushii) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.shousuushii') }
    if (r.isDaisushi) { yakuman+=2; yakumanList.push('handpointcalculation.yakuman.daisushi') }
    if (r.isTsuuiisou) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.tsuuiisou') }
    if (r.isRyuuiisou) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.ryuuiisou') }
    if (r.isChinroutou) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.chinroutou') }
    if (r.isSuuankou) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.suuankou') }
    if (r.isSuuankouTanki) { yakuman+=2; yakumanList.push('handpointcalculation.yakuman.suuankouTanki') }
    if (r.isChuurenPoutou) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.chuurenPoutou') }
    if (r.isJunseiChuurenPoutou) { yakuman+=2; yakumanList.push('handpointcalculation.yakuman.junseiChuurenPoutou') }
    if (r.isSuukantsu) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.suukantsu') }

    let han=0, yList=[]
    if (yakuman===0) {
      if (r.isRiichi) { han+=1; yList.push('handpointcalculation.hanLines.riichi') }
      if (r.isDaburuRiichi) { han+=2; yList.push('handpointcalculation.hanLines.daburuRiichi') }
      if (r.isIppatsu) { han+=1; yList.push('handpointcalculation.hanLines.ippatsu') }
      if (r.isHaitei) { han+=1; yList.push('handpointcalculation.hanLines.haitei') }
      if (r.isHoutei) { han+=1; yList.push('handpointcalculation.hanLines.houtei') }
      if (r.isRinshan) { han+=1; yList.push('handpointcalculation.hanLines.rinshan') }
      if (r.isChankan) { han+=1; yList.push('handpointcalculation.hanLines.chankan') }
      if (r.isTanyao) { han+=1; yList.push('handpointcalculation.hanLines.tanyao') }
      if (r.isRoundEast) { han+=1; yList.push('handpointcalculation.hanLines.roundEast') }
      if (r.isRoundSouth) { han+=1; yList.push('handpointcalculation.hanLines.roundSouth') }
      if (r.isRoundWest) { han+=1; yList.push('handpointcalculation.hanLines.roundWest') }
      if (r.isSeatEast) { han+=1; yList.push('handpointcalculation.hanLines.seatEast') }
      if (r.isSeatSouth) { han+=1; yList.push('handpointcalculation.hanLines.seatSouth') }
      if (r.isSeatWest) { han+=1; yList.push('handpointcalculation.hanLines.seatWest') }
      if (r.isSeatNorth) { han+=1; yList.push('handpointcalculation.hanLines.seatNorth') }
      if (r.isHaku) { han+=1; yList.push('handpointcalculation.hanLines.haku') }
      if (r.isHatsu) { han+=1; yList.push('handpointcalculation.hanLines.hatsu') }
      if (r.isChun) { han+=1; yList.push('handpointcalculation.hanLines.chun') }
      if (r.isMenzenTsumo) { han+=1; yList.push('handpointcalculation.hanLines.menzenTsumo') }
      if (r.isPinfu) { han+=1; yList.push('handpointcalculation.hanLines.pinfu') }
      if (r.isIipeikou) { han+=1; yList.push('handpointcalculation.hanLines.iipeikou') }
      if (r.isToitoi) { han+=2; yList.push('handpointcalculation.hanLines.toitoi') }
      if (r.isSanankou) { han+=2; yList.push('handpointcalculation.hanLines.sanankou') }
      if (r.isSankantsu) { han+=2; yList.push('handpointcalculation.hanLines.sankantsu') }
      if (r.isSanshokuDoko) { han+=2; yList.push('handpointcalculation.hanLines.sanshokuDoko') }
      if (r.isHonrouto) { han+=2; yList.push('handpointcalculation.hanLines.honrouto') }
      if (r.isShouSangen) { han+=2; yList.push('handpointcalculation.hanLines.shouSangen') }
      if (r.isSanshokuDoujun) {
        if (r.isMenzen) { han+=2; yList.push('handpointcalculation.hanLines.sanshokuDoujunMenzen') }
        else { han+=1; yList.push('handpointcalculation.hanLines.sanshokuDoujunOpen') }
      }
      if (r.isIttsu) {
        if (r.isMenzen) { han+=2; yList.push('handpointcalculation.hanLines.ittsuMenzen') }
        else { han+=1; yList.push('handpointcalculation.hanLines.ittsuOpen') }
      }
      if (r.isChanta) {
        if (r.isMenzen) { han+=2; yList.push('handpointcalculation.hanLines.chantaMenzen') }
        else { han+=1; yList.push('handpointcalculation.hanLines.chantaOpen') }
      }
      if (r.isHonitsu) {
        if (r.isMenzen) { han+=3; yList.push('handpointcalculation.hanLines.honitsuMenzen') }
        else { han+=2; yList.push('handpointcalculation.hanLines.honitsuOpen') }
      }
      if (r.isJunchan) {
        if (r.isMenzen) { han+=3; yList.push('handpointcalculation.hanLines.junchanMenzen') }
        else { han+=2; yList.push('handpointcalculation.hanLines.junchanOpen') }
      }
      if (r.isRyanpeikou) { han+=3; yList.push('handpointcalculation.hanLines.ryanpeikou') }
      if (r.isChinitsu) {
        if (r.isMenzen) { han+=6; yList.push('handpointcalculation.hanLines.chinitsuMenzen') }
        else { han+=5; yList.push('handpointcalculation.hanLines.chinitsuOpen') }
      }
    }
    const isYaku = !(yakuman===0 && han===0)
    if (yakuman===0) {
      if (r.doraNum) { han += r.doraNum; yList.push({ key: 'handpointcalculation.hanLines.dora', params: { n: r.doraNum } }) }
      if (r.akaDoraNum) { han += r.akaDoraNum; yList.push({ key: 'handpointcalculation.hanLines.akaDora', params: { n: r.akaDoraNum } }) }
      if (r.riichiDoraNum) { han += r.riichiDoraNum; yList.push({ key: 'handpointcalculation.hanLines.uraDora', params: { n: r.riichiDoraNum } }) }
    }
    r.hanResult = { isYaku, yakuman, yakumanList, han, yakuList: yList }
  })

  // 取最大点法（同点比较：番数优先，其次未进位符）
  const pointsResults = []
  results.forEach((r)=>{
    if (r.hanResult.yakuman !== 0) {
      if (r.isDealer) {
        pointsResults.push(r.isTsumo ? { tsumo: 16000*r.hanResult.yakuman, ron: null } : { tsumo:null, ron: 48000*r.hanResult.yakuman })
      } else {
        pointsResults.push(r.isTsumo
          ? { tsumo: { dealer: 16000*r.hanResult.yakuman, nonDealer: 8000*r.hanResult.yakuman }, ron: null }
          : { tsumo:null, ron: 32000*r.hanResult.yakuman })
      }
    } else {
      pointsResults.push(calculatePoints(r.isDealer, r.isTsumo, r.hanResult.han, r.fuResult.fu))
    }
  })

  let maxIndex
  if (results[0].isDealer && results[0].isTsumo) {
    maxIndex = pointsResults.reduce((mi, cur, idx, arr)=>{
      const mt = arr[mi].tsumo
      if (cur.tsumo > mt) return idx
      if (cur.tsumo === mt) {
        const hanA = results[idx].hanResult.han
        const hanB = results[mi].hanResult.han
        if (hanA > hanB) return idx
        if (hanA === hanB) return results[idx].fuResult.fuNotCeil > results[mi].fuResult.fuNotCeil ? idx : mi
      }
      return mi
    }, 0)
  } else if (!results[0].isDealer && results[0].isTsumo) {
    maxIndex = pointsResults.reduce((mi, cur, idx, arr)=>{
      const md = arr[mi].tsumo.dealer
      if (cur.tsumo.dealer > md) return idx
      if (cur.tsumo.dealer === md) {
        const hanA = results[idx].hanResult.han
        const hanB = results[mi].hanResult.han
        if (hanA > hanB) return idx
        if (hanA === hanB) {
          // 修复：用 fuResult.fuNotCeil 做未进位符比较，避免遗漏坎张 +2 符的更优方案
          return results[idx].fuResult.fuNotCeil > results[mi].fuResult.fuNotCeil ? idx : mi
        }
      }
      return mi
    }, 0)
  } else {
    maxIndex = pointsResults.reduce((mi, cur, idx, arr)=>{
      const mr = arr[mi].ron
      if (cur.ron > mr) return idx
      if (cur.ron === mr) {
        const hanA = results[idx].hanResult.han
        const hanB = results[mi].hanResult.han
        if (hanA > hanB) return idx
        if (hanA === hanB) return results[idx].fuResult.fuNotCeil > results[mi].fuResult.fuNotCeil ? idx : mi
      }
      return mi
    }, 0)

  }

  const maxPointsResult = { ...results[maxIndex], pointsResult: pointsResults[maxIndex] }
  return maxPointsResult
}

// 符计算：逐面子累加，含门清荣和/自摸/等待形 +2 等规则；对平和自摸与副露平和型特殊处理
function calculateFu(hand) {
  const meldFuMessage = []
  let fu = 20
  let isPairAddFu = false
  let isPinfuTsumo = false
  let isChowTwentyFu = false
  const terminalsAndHonours = ['1m','9m','1p','9p','1s','9s','1z','2z','3z','4z','5z','6z','7z']
  const windMap = { 'east':'1z', 'south':'2z', 'west':'3z', 'north':'4z' }

  hand.melds.forEach((m, i)=>{
    // 互斥判断 + 杠牌增加长度保护
    if (m.type==='handshuntsu') {
      meldFuMessage.push({ fu: 0, key: 'handpointcalculation.meldFu.sequence' })
    } else if (m.type==='handkouutsu') {
      const isTh = m.tiles.some((t)=>terminalsAndHonours.includes(t))
      if (hand.isTsumo) {
        fu += isTh?8:4
        meldFuMessage.push({ fu: isTh?8:4, key: isTh ? 'handpointcalculation.meldFu.tripletClosedTerminal' : 'handpointcalculation.meldFu.tripletClosedSimple' })
      } else {
        if (hand.winningMeldIndex===i) {
          fu += isTh?4:2
          meldFuMessage.push({ fu: isTh?4:2, key: isTh ? 'handpointcalculation.meldFu.tripletOpenTerminal' : 'handpointcalculation.meldFu.tripletOpenSimple' })
        } else {
          fu += isTh?8:4
          meldFuMessage.push({ fu: isTh?8:4, key: isTh ? 'handpointcalculation.meldFu.tripletClosedTerminal' : 'handpointcalculation.meldFu.tripletClosedSimple' })
        }
      }
    } else if (m.type==='handtoitsu') {
      if (windMap[hand.roundWind]===m.tiles[0] && windMap[hand.seatWind]!==m.tiles[0]) { fu+=2; meldFuMessage.push({ fu: 2, key: 'handpointcalculation.meldFu.pairRoundWind' }); isPairAddFu=true }
      else if (windMap[hand.roundWind]!==m.tiles[0] && windMap[hand.seatWind]===m.tiles[0]) { fu+=2; meldFuMessage.push({ fu: 2, key: 'handpointcalculation.meldFu.pairSeatWind' }); isPairAddFu=true }
      else if (windMap[hand.roundWind]===m.tiles[0] && windMap[hand.seatWind]===m.tiles[0]) { fu+=4; meldFuMessage.push({ fu: 4, key: 'handpointcalculation.meldFu.pairDoubleWind' }); isPairAddFu=true }
      else if (m.tiles.some((t)=>['5z','6z','7z'].includes(t))) { fu+=2; meldFuMessage.push({ fu: 2, key: 'handpointcalculation.meldFu.pairDragons' }); isPairAddFu=true }
      else { meldFuMessage.push({ fu: 0, key: 'handpointcalculation.meldFu.pairNonYaku' }); isPairAddFu=false }
    } else if (m.type==='chii') {
      meldFuMessage.push({ fu: 0, key: 'handpointcalculation.meldFu.sequence' })
    } else if (m.type==='pon' && m.tiles.length === 3) {
      const isTh = m.tiles.some((t)=>terminalsAndHonours.includes(t))
      fu += isTh?4:2
      meldFuMessage.push({ fu: isTh?4:2, key: isTh ? 'handpointcalculation.meldFu.tripletOpenTerminal' : 'handpointcalculation.meldFu.tripletOpenSimple' })
    } else if (m.type==='minkan' && m.tiles.length === 4) {
      const isTh = m.tiles.some((t)=>terminalsAndHonours.includes(t))
      fu += isTh?16:8
      meldFuMessage.push({ fu: isTh?16:8, key: isTh ? 'handpointcalculation.meldFu.kongOpenTerminal' : 'handpointcalculation.meldFu.kongOpenSimple' })
    } else if (m.type==='ankan' && m.tiles.length === 4) {
      const isTh = m.tiles.some((t)=>terminalsAndHonours.includes(t))
      fu += isTh?32:16
      meldFuMessage.push({ fu: isTh?32:16, key: isTh ? 'handpointcalculation.meldFu.kongClosedTerminal' : 'handpointcalculation.meldFu.kongClosedSimple' })
    }
  })

  if (hand.isMenzen && !hand.isTsumo) fu += 10
  if (hand.isTsumo) fu += 2
  if (['tanki-machi','penchan-machi','kanchan-machi'].includes(hand.waitType)) fu += 2

  if (hand.isMenzen && hand.isTsumo && hand.melds.every((x)=>['handshuntsu','handtoitsu'].includes(x.type)) && hand.waitType==='ryanmen-machi' && isPairAddFu===false) {
    isPinfuTsumo=true; fu=20
  }
  if (!hand.isMenzen && !hand.isTsumo && hand.melds.every((x)=>['handshuntsu','handtoitsu','chii'].includes(x.type))
      && hand.melds.some((x)=>x.type==='chii') && hand.waitType==='ryanmen-machi' && isPairAddFu===false) {
    isChowTwentyFu=true; fu=30
  }

  return { fuNotCeil: fu, fu: Math.ceil(fu/10)*10, meldFuMessage, isPinfuTsumo, isChowTwentyFu }
}

/**
 * 点数计算（不改动规则与逻辑）
 * 说明：
 * - 满贯/跳满/倍满/三倍满/役满：按番数直接取上限 basePoints
 * - 一般情况：basePoints = fu * 2^(han + 2)，但不超过 2000
 * - 亲家/子家、自摸/荣和：按规则倍数换算后以百位进位
 * 返回：
 * - 亲家自摸: { tsumo: 总点, ron: null }
 * - 子家自摸: { tsumo: { dealer: 亲支付, nonDealer: 子支付 }, ron: null }
 * - 荣和:     { tsumo: null, ron: 荣和点数 }
 */
function calculatePoints(isDealer, isTsumo, han, fu) {
  let basePoints
  if (han >= 13) basePoints = 8000
  else if (han >= 11) basePoints = 6000
  else if (han >= 8) basePoints = 4000
  else if (han >= 6) basePoints = 3000
  else if (han >= 5) basePoints = 2000
  else {
    const temp = fu * Math.pow(2, han + 2)
    basePoints = temp >= 2000 ? 2000 : temp
  }

  if (isDealer) {
    if (isTsumo) {
      const pts = Math.ceil((basePoints * 2) / 100) * 100
      return { tsumo: pts, ron: null }
    } else {
      const pts = Math.ceil((basePoints * 6) / 100) * 100
      return { tsumo: null, ron: pts }
    }
  } else {
    if (isTsumo) {
      const dealerPts = Math.ceil((basePoints * 2) / 100) * 100
      const nonDealerPts = Math.ceil(basePoints / 100) * 100
      return { tsumo: { dealer: dealerPts, nonDealer: nonDealerPts }, ron: null }
    } else {
      const pts = Math.ceil((basePoints * 4) / 100) * 100
      return { tsumo: null, ron: pts }
    }
  }
}
</script>

<style scoped>
/* 统一图片展示风格（与其它页面一致） */
:deep(img) {
  object-fit: contain;
}

/* 保持尺寸策略与自适应逻辑 */
</style>