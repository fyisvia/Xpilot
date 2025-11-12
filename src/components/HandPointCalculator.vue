// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>

    <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
      {{ t('handpointcalculator.title') }}
    </li>

    <!-- 基本设置 -->
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <!-- 风选择（采用 PureOnesTenpai 的样式结构） -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-8">
        <!-- 场风 -->
        <fieldset class="fieldset ml-0 flex-1">
          <legend class="text-base">{{ t('handpointcalculator.roundWind') }}</legend>
          <select class="select ml-0 w-full sm:w-auto" v-model="form.roundWind">
            <option value="east">{{ t('handpointcalculation.winds.east') }}</option>
            <option value="south">{{ t('handpointcalculation.winds.south') }}</option>
            <option value="west">{{ t('handpointcalculation.winds.west') }}</option>
            <option value="north">{{ t('handpointcalculation.winds.north') }}</option>
          </select>
        </fieldset>
        <!-- 自风 -->
        <fieldset class="fieldset ml-0 flex-1 mt-4 sm:mt-0">
          <legend class="text-base">{{ t('handpointcalculator.seatWind') }}</legend>
          <select class="select ml-0 w-full sm:w-auto" v-model="form.seatWind">
            <option value="east">{{ t('handpointcalculation.winds.east') }}</option>
            <option value="south">{{ t('handpointcalculation.winds.south') }}</option>
            <option value="west">{{ t('handpointcalculation.winds.west') }}</option>
            <option value="north">{{ t('handpointcalculation.winds.north') }}</option>
          </select>
        </fieldset>
      </div>
    </li>

    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <!-- 自摸/荣和切换 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <label class="cursor-pointer flex items-center gap-2">
          <input type="radio" name="win-type" class="radio" v-model="form.isTsumo" :value="true" />
          <span>{{ t('pointCalc.winTypes.tsumo') }}</span>
        </label>
        <label class="cursor-pointer flex items-center gap-2">
          <input type="radio" name="win-type" class="radio" v-model="form.isTsumo" :value="false" />
          <span>{{ t('pointCalc.winTypes.ron') }}</span>
        </label>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <label class="cursor-pointer flex items-center gap-2">
          <input type="checkbox" class="checkbox" v-model="form.isRiichi" />
          <span>{{ t('handpointcalculation.badges.riichi') }}</span>
        </label>
        <label class="cursor-pointer flex items-center gap-2">
          <input type="checkbox" class="checkbox" v-model="form.isDaburuRiichi" />
          <span>{{ t('handpointcalculation.badges.daburuRiichi') }}</span>
        </label>
        <label class="cursor-pointer flex items-center gap-2">
          <input type="checkbox" class="checkbox" v-model="form.isIppatsu" />
          <span>{{ t('handpointcalculation.badges.ippatsu') }}</span>
        </label>
        <label class="cursor-pointer flex items-center gap-2" :class="{ 'opacity-50 pointer-events-none': !form.isTsumo }">
          <input type="checkbox" class="checkbox" v-model="form.isHaitei" :disabled="!form.isTsumo" />
          <span>{{ t('handpointcalculation.badges.haitei') }}</span>
        </label>
        <label class="cursor-pointer flex items-center gap-2" :class="{ 'opacity-50 pointer-events-none': form.isTsumo }">
          <input type="checkbox" class="checkbox" v-model="form.isHoutei" :disabled="form.isTsumo" />
          <span>{{ t('handpointcalculation.badges.houtei') }}</span>
        </label>
        <label class="cursor-pointer flex items-center gap-2">
          <input type="checkbox" class="checkbox" v-model="form.isRinshan" />
          <span>{{ t('handpointcalculation.badges.rinshan') }}</span>
        </label>
        <label class="cursor-pointer flex items-center gap-2" :class="{ 'opacity-50 pointer-events-none': form.isTsumo }">
          <input type="checkbox" class="checkbox" v-model="form.isChankan" :disabled="form.isTsumo" />
          <span>{{ t('handpointcalculation.badges.chankan') }}</span>
        </label>
      </div>
    </li>

    <!-- 宝牌 -->
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <fieldset class="fieldset w-full">
          <legend class="fieldset-legend text-base font-medium">{{ t('handpointcalculation.labels.doraIndicators') }}</legend>
          <input type="text" class="input w-full" v-model="form.doraIndicators" placeholder="1m 6z" />
        </fieldset>
        <fieldset class="fieldset w-full">
          <legend class="fieldset-legend text-base font-medium">{{ t('handpointcalculation.labels.uraDoraIndicators') }}</legend>
          <input type="text" class="input w-full" v-model="form.riichiDoraIndicators" placeholder="5p" />
        </fieldset>
      </div>
    </li>

    <!-- 副露 -->
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <fieldset class="fieldset w-full">
          <legend class="fieldset-legend text-base font-medium">{{ t('handpointcalculator.chiipon') }}</legend>
          <input type="text" class="input w-full" v-model="form.furoChiPon" placeholder="123m; 777p" />
        </fieldset>
        <fieldset class="fieldset w-full">
          <legend class="fieldset-legend text-base font-medium">{{ t('handpointcalculator.kan') }}</legend>
          <input type="text" class="input w-full" v-model="form.furoKong" placeholder="minkan:1s; ankan:5m" />
        </fieldset>
      </div>
    </li>

    <!-- 手牌（门前部分，不含副露） + 和牌 -->
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <fieldset class="fieldset w-full">
          <legend class="fieldset-legend text-base font-medium">{{ t('handpointcalculator.closedHand') }}</legend>
          <input type="text" class="input w-full" v-model="form.closedHand" placeholder="123m456p789s11z" />
        </fieldset>
        <fieldset class="fieldset w-full">
          <legend class="fieldset-legend text-base font-medium">{{ t('handpointcalculator.winningTile') }}</legend>
          <input type="text" class="input w-full" v-model="form.winningTile" placeholder="5m" />
        </fieldset>
      </div>
    </li>

            <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>

    <!-- 操作 -->
    <li class="list-row flex flex-row justify-center items-center gap-6 w-full">
      <button class="btn btn-sm text-sm sm:text-base px-4" @click="handleSubmit">{{ t('handpointcalculator.commit') }}</button>
      <button class="btn btn-sm text-sm sm:text-base px-4" @click="reset">{{ t('handpointcalculator.clear') }}</button>
    </li>



    <!-- 结果 -->
    <li class="p-4 pb-2 text-base opacity-100 tracking-wide" v-if="resultState.show">
      <div v-if="resultState.error" class="flex justify-center items-center mb-4">
        <div class="text-lg font-semibold badge badge-error">{{ resultState.error }}</div>
      </div>

      <template v-else>
        <div class="flex justify-center items-center mb-4">
          <div class="text-lg font-semibold badge badge-success">
            {{ summaryLine }}
          </div>
        </div>

        <!-- 番 -->
        <div class="mt-2 w-full text-center">
          <div class="inline-flex flex-wrap justify-center items-center gap-2 text-sm sm:text-base">
            <span>{{ t('handpointcalculation.labels.hanPrefix') }}</span>
            <template v-if="best.hanResult.yakuman">
              <span v-for="(y, i) in localizedYakumanList" :key="'yakuman-' + i" class="whitespace-nowrap">{{ y }}</span>
              <span class="whitespace-nowrap">{{ t('handpointcalculation.labels.yakumanTimes', { n: best.hanResult.yakuman }) }}</span>
            </template>
            <template v-else>
              <span v-for="(y, i) in localizedYakuList" :key="'yaku-' + i" class="whitespace-nowrap">{{ y }}</span>
              <span class="whitespace-nowrap">{{ t('handpointcalculation.labels.hanTotal', { han: best.hanResult.han }) }}</span>
            </template>
          </div>
        </div>

        <!-- 符 -->
        <div v-if="best.hanResult.yakuman === 0" class="mt-4 w-full text-center">
          <div class="inline-flex flex-wrap justify-center items-center gap-2 text-sm sm:text-base">
            <span>{{ t('handpointcalculation.labels.fuPrefix') }}</span>
            <template v-if="best.fuResult.isPinfuTsumo">
              <span class="whitespace-nowrap">{{ t('handpointcalculation.labels.pinfuTsumo20') }}</span>
            </template>
            <template v-else-if="best.fuResult.isChowTwentyFu">
              <span class="whitespace-nowrap">{{ t('handpointcalculation.labels.chowThirtyFu') }}</span>
            </template>
            <template v-else>
              <span v-for="(m, i) in filteredMeldFuMessages" :key="'fu-' + i" class="whitespace-nowrap">{{ m }}</span>
              <span class="whitespace-nowrap">{{ t('handpointcalculation.labels.baseFu20') }}</span>
              <span v-if="!best.isTsumo && best.isMenzen" class="whitespace-nowrap">{{ t('handpointcalculation.labels.menzenRon10') }}</span>
              <span v-if="best.isTsumo" class="whitespace-nowrap">{{ t('handpointcalculation.labels.tsumo2') }}</span>
              <span v-if="best.waitType === 'tanki-machi'" class="whitespace-nowrap">{{ t('handpointcalculation.labels.waitTanki2') }}</span>
              <span v-if="best.waitType === 'penchan-machi'" class="whitespace-nowrap">{{ t('handpointcalculation.labels.waitPenchan2') }}</span>
              <span v-if="best.waitType === 'kanchan-machi'" class="whitespace-nowrap">{{ t('handpointcalculation.labels.waitKanchan2') }}</span>
              <span v-if="best.fuResult.fuNotCeil === best.fuResult.fu" class="whitespace-nowrap">{{ t('handpointcalculation.labels.fuTotalExact', { fu: best.fuResult.fu }) }}</span>
              <template v-else>
                <span class="whitespace-nowrap">{{ t('handpointcalculation.labels.fuTotalRaw', { fu: best.fuResult.fuNotCeil }) }}</span>
              </template>
            </template>
          </div>
        </div>
      </template>
    </li>

    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
  </ul>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { HandDivider, YakuList } from '../utils/yakucalculation'

const { t } = useI18n()

// 表单数据
const form = reactive({
  roundWind: 'east',
  seatWind: 'east',
  get isDealer() { return this.seatWind === 'east' },
  isTsumo: true,
  isRiichi: false,
  isDaburuRiichi: false,
  isIppatsu: false,
  isHaitei: false,
  isHoutei: false,
  isRinshan: false,
  isChankan: false,
  doraIndicators: '',
  riichiDoraIndicators: '',
  furoChiPon: '',
  furoKong: '',
  closedHand: '',
  winningTile: ''
})

// 结果状态
const resultState = reactive({ show: false, error: '' })
const best = ref(null)

// 输入解析
function parseTilesStr(input) {
  const tiles = (input || '').trim().match(/(\d+)([mpsz])/g) || []
  const arr = []
  for (const token of tiles) {
    const m = token.match(/(\d+)([mpsz])/)
    if (!m) continue
    const digits = m[1], suit = m[2]
    for (const ch of digits) {
      const tile = `${ch}${suit}`
      if (tile === '0z' || tile === '8z' || tile === '9z') return null
      arr.push(tile)
    }
  }
  return arr
}
function parseTileSingle(s) {
  const m = (s || '').trim().match(/^([0-9])(m|p|s|z)$/)
  if (!m) return null
  const tile = m[0]
  if (tile === '0z' || tile === '8z' || tile === '9z') return null
  return tile
}
function parseIndicators(s) {
  // 新实现：整串扫描，支持 "1s4p"、"1s,4p"、"12m" 等写法
  const res = []
  const str = (s || '').trim()
  if (!str) return res
  const regex = /(\d+)([mpsz])/gi
  for (const m of str.matchAll(regex)) {
    const digits = m[1]
    const suit = m[2].toLowerCase()
    for (const ch of digits) {
      // 单张展开
      if (!/^[0-9]$/.test(ch)) continue
      const tile = `${ch}${suit}`
      // 过滤无效字牌指示
      if (tile === '0z' || tile === '8z' || tile === '9z') continue
      res.push(tile)
    }
  }
  return res
}

// 吃/碰：分号分隔；不写 chii/pon，自动判定（连续为吃，三同为碰；字牌仅允许碰）
function parseFuroChiPon(s) {
  const res = []
  const parts = (s || '').split(/[；;]+/).map(p => p.trim()).filter(Boolean)
  for (const p of parts) {
    const m = p.match(/^([0-9]{3})(m|p|s|z)$/i)
    if (!m) continue
    const digits = m[1]
    const suit = m[2].toLowerCase()
    const a = +digits[0], b = +digits[1], c = +digits[2]
    if (suit === 'z') {
      // 字牌只能碰：三同
      if (a === b && b === c) {
        res.push({ type: 'pon', tiles: [`${a}${suit}`, `${b}${suit}`, `${c}${suit}`] })
      }
      continue
    }
    if (a === b && b === c) {
      res.push({ type: 'pon', tiles: [`${a}${suit}`, `${b}${suit}`, `${c}${suit}`] })
    } else if (a + 1 === b && b + 1 === c) {
      res.push({ type: 'chii', tiles: [`${a}${suit}`, `${b}${suit}`, `${c}${suit}`] })
    }
  }
  return res
}

// 杠：沿用 minkan/ankan 语法
function parseFuroKong(s) {
  // "minkan:1s; ankan:5m"
  const res = []
  const parts = (s || '').split(/[；;]+/).map(p => p.trim()).filter(Boolean)
  for (const p of parts) {
    const m = p.match(/^(minkan|ankan)\s*:\s*([0-9])([mps|z])$/i)
    if (!m) continue
    const type = m[1].toLowerCase()
    const d = m[2]
    const suit = m[3].toLowerCase()
    res.push({ type, tiles: [`${d}${suit}`, `${d}${suit}`, `${d}${suit}`, `${d}${suit}`] })
  }
  return res
}

// Dora 映射
function indicatorToDora(tile) {
  const num = parseInt(tile[0], 10), type = tile[1]
  if (type === 'z') {
    const map = { '1z':'2z','2z':'3z','3z':'4z','4z':'1z','5z':'6z','6z':'7z','7z':'5z' }
    return map[tile] || tile
  }
  return (num === 9 ? '1' : String(num + 1)) + type
}

// 役/符/点数 计算（从 HandPointCalculation 复用）
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
    if (isTsumo) return { tsumo: Math.ceil((basePoints * 2) / 100) * 100, ron: null }
    return { tsumo: null, ron: Math.ceil((basePoints * 6) / 100) * 100 }
  } else {
    if (isTsumo) {
      return {
        tsumo: { dealer: Math.ceil((basePoints * 2) / 100) * 100, nonDealer: Math.ceil(basePoints / 100) * 100 },
        ron: null
      }
    }
    return { tsumo: null, ron: Math.ceil((basePoints * 4) / 100) * 100 }
  }
}

function calculateFu(hand) {
  const meldFuMessage = []
  let fu = 20
  let isPairAddFu = false
  let isPinfuTsumo = false
  let isChowTwentyFu = false
  const terminalsAndHonours = ['1m','9m','1p','9p','1s','9s','1z','2z','3z','4z','5z','6z','7z']
  const windMap = { 'east':'1z', 'south':'2z', 'west':'3z', 'north':'4z' }

  hand.melds.forEach((m, i) => {
    // 互斥判断 + 杠牌增加长度保护
    if (m.type === 'handshuntsu') {
      meldFuMessage.push({ fu: 0, key: 'handpointcalculation.meldFu.sequence' })
    } else if (m.type === 'handkouutsu') {
      const isTh = m.tiles.some(t => terminalsAndHonours.includes(t))
      if (hand.isTsumo) {
        fu += isTh ? 8 : 4
        meldFuMessage.push({ fu: isTh?8:4, key: isTh ? 'handpointcalculation.meldFu.tripletClosedTerminal' : 'handpointcalculation.meldFu.tripletClosedSimple' })
      } else {
        if (hand.winningMeldIndex === i) {
          fu += isTh ? 4 : 2
          meldFuMessage.push({ fu: isTh?4:2, key: isTh ? 'handpointcalculation.meldFu.tripletOpenTerminal' : 'handpointcalculation.meldFu.tripletOpenSimple' })
        } else {
          fu += isTh ? 8 : 4
          meldFuMessage.push({ fu: isTh?8:4, key: isTh ? 'handpointcalculation.meldFu.tripletClosedTerminal' : 'handpointcalculation.meldFu.tripletClosedSimple' })
        }
      }
    } else if (m.type === 'handtoitsu') {
      if (windMap[hand.roundWind] === m.tiles[0] && windMap[hand.seatWind] !== m.tiles[0]) { fu += 2; meldFuMessage.push({ fu: 2, key: 'handpointcalculation.meldFu.pairRoundWind' }); isPairAddFu = true }
      else if (windMap[hand.roundWind] !== m.tiles[0] && windMap[hand.seatWind] === m.tiles[0]) { fu += 2; meldFuMessage.push({ fu: 2, key: 'handpointcalculation.meldFu.pairSeatWind' }); isPairAddFu = true }
      else if (windMap[hand.roundWind] === m.tiles[0] && windMap[hand.seatWind] === m.tiles[0]) { fu += 4; meldFuMessage.push({ fu: 4, key: 'handpointcalculation.meldFu.pairDoubleWind' }); isPairAddFu = true }
      else if (m.tiles.some(t => ['5z','6z','7z'].includes(t))) { fu += 2; meldFuMessage.push({ fu: 2, key: 'handpointcalculation.meldFu.pairDragons' }); isPairAddFu = true }
      else { meldFuMessage.push({ fu: 0, key: 'handpointcalculation.meldFu.pairNonYaku' }); isPairAddFu = false }
    } else if (m.type === 'chii') {
      meldFuMessage.push({ fu: 0, key: 'handpointcalculation.meldFu.sequence' })
    } else if (m.type === 'pon' && m.tiles.length === 3) {
      const isTh = m.tiles.some(t => terminalsAndHonours.includes(t))
      fu += isTh ? 4 : 2
      meldFuMessage.push({ fu: isTh?4:2, key: isTh ? 'handpointcalculation.meldFu.tripletOpenTerminal' : 'handpointcalculation.meldFu.tripletOpenSimple' })
    } else if (m.type === 'minkan' && m.tiles.length === 4) {
      const isTh = m.tiles.some(t => terminalsAndHonours.includes(t))
      fu += isTh ? 16 : 8
      meldFuMessage.push({ fu: isTh?16:8, key: isTh ? 'handpointcalculation.meldFu.kongOpenTerminal' : 'handpointcalculation.meldFu.kongOpenSimple' })
    } else if (m.type === 'ankan' && m.tiles.length === 4) {
      const isTh = m.tiles.some(t => terminalsAndHonours.includes(t))
      fu += isTh ? 32 : 16
      meldFuMessage.push({ fu: isTh?32:16, key: isTh ? 'handpointcalculation.meldFu.kongClosedTerminal' : 'handpointcalculation.meldFu.kongClosedSimple' })
    }
  })

  if (hand.isMenzen && !hand.isTsumo) fu += 10
  if (hand.isTsumo) fu += 2
  if (['tanki-machi','penchan-machi','kanchan-machi'].includes(hand.waitType)) fu += 2

  if (hand.isMenzen && hand.isTsumo && hand.melds.every(x => ['handshuntsu','handtoitsu'].includes(x.type)) && hand.waitType === 'ryanmen-machi' && isPairAddFu === false) {
    isPinfuTsumo = true; fu = 20
  }
  if (!hand.isMenzen && !hand.isTsumo && hand.melds.every(x => ['handshuntsu','handtoitsu','chii'].includes(x.type))
      && hand.melds.some(x => x.type === 'chii') && hand.waitType === 'ryanmen-machi' && isPairAddFu === false) {
    isChowTwentyFu = true; fu = 30
  }

  return { fuNotCeil: fu, fu: Math.ceil(fu/10)*10, meldFuMessage, isPinfuTsumo, isChowTwentyFu }
}

// 自动门清识别：存在 chii/pon/minkan 则非门清；暗杠不破门清
const autoMenzen = computed(() => {
  const f1 = parseFuroChiPon(form.furoChiPon)
  const f2 = parseFuroKong(form.furoKong)
  return f1.length === 0 && f2.every(m => m.type !== 'minkan')
})

// 红5与宝牌匹配：0x 视作 5x
function tileMatchesDora(tile, doraTile) {
  if (tile === doraTile) return true
  if (tile && tile[0] === '0') return ('5' + tile[1]) === doraTile
  return false
}

// 将门前+和牌中的 5m/5p/5s 按用户输入的 0m/0p/0s 数量替换
function applyAkaToHand(sel, akaCounts) {
  // 仅对手内面子/雀头替换；副露保持用户输入（其中的 0 已经保留）
  const targetTypes = new Set(['handshuntsu','handkouutsu','handtoitsu'])
  const left = { m: akaCounts['0m'] || 0, p: akaCounts['0p'] || 0, s: akaCounts['0s'] || 0 }
  const out = sel.map(m => ({ ...m, tiles: [...m.tiles] }))
  for (const meld of out) {
    if (!targetTypes.has(meld.type)) continue
    for (let i = 0; i < meld.tiles.length; i++) {
      const t = meld.tiles[i]
      if (!t || t.length < 2) continue
      const num = t[0], suit = t[1]
      if (num === '5' && (suit === 'm' || suit === 'p' || suit === 's') && left[suit] > 0) {
        meld.tiles[i] = '0' + suit
        left[suit]--
        if (left.m === 0 && left.p === 0 && left.s === 0) return out
      }
    }
  }
  return out
}

// 运行主流程
function handleSubmit() {
  resultState.show = true
  resultState.error = ''
  best.value = null

  // 基本输入校验
  const closed = parseTilesStr(form.closedHand)
  const win = parseTileSingle(form.winningTile)
  if (!closed || !win) {
    resultState.error = t('handpointcalculator.error.invalidTiles')
    return
  }
  const furoChiPon = parseFuroChiPon(form.furoChiPon)
  const furoKong = parseFuroKong(form.furoKong)
  const furo = [...furoChiPon, ...furoKong]
  const divider = new HandDivider()

  // 门前分解（包含和牌）
  const concealedAll = [...closed, win]
  const decomposed = divider.decomposeHand(concealedAll)
  if (!decomposed.length) {
    resultState.error = t('handpointcalculator.error.cannotDecompose')
    return
  }

  // 自动门清：有 chii/pon/minkan 则非门清（暗杠不破门清）
  const isMenzen = (furoChiPon.length === 0) && furoKong.every(m => m.type !== 'minkan')

  // 统计门前部分的赤5数量（仅对门前替换；副露内的 0x 已保留）
  const akaClosedCounts = {
    '0m': closed.filter(t => t === '0m').length + (win === '0m' ? 1 : 0),
    '0p': closed.filter(t => t === '0p').length + (win === '0p' ? 1 : 0),
    '0s': closed.filter(t => t === '0s').length + (win === '0s' ? 1 : 0),
  }

  // Dora 统计
  const doraInds = parseIndicators(form.doraIndicators)
  const uraInds = parseIndicators(form.riichiDoraIndicators)
  const doras = doraInds.map(indicatorToDora)
  const uras = uraInds.map(indicatorToDora)

  // 构造候选，判定待型/役/符/点
  const yakuList = new YakuList()
  const candidates = []
  const typeOrder = { handshuntsu:1, handkouutsu:2, handtoitsu:3, chii:4, pon:5, minkan:6, ankan:7 }

  for (const res of decomposed) {
    // 先合并，再将手内的 5x 按门前赤5数量替换为 0x
    const merged = [...res, ...furo].sort((a,b) => (typeOrder[a.type]??99) - (typeOrder[b.type]??99))
    const sel = applyAkaToHand(merged, akaClosedCounts)

    // 收集所有可能的“和牌所在面子 + 牌位”，避免只命中第一个导致坎张被忽略
    const handPart = sel.filter(x => ['handshuntsu','handkouutsu','handtoitsu'].includes(x.type))
    const tileNum = (t) => (t && t[0] === '0') ? 5 : parseInt(t[0], 10)
    const winPlaces = []
    handPart.forEach((m) => {
      const meldIndex = sel.indexOf(m)
      const idxs = m.tiles.map((t,i) => t === win ? i : -1).filter(i => i !== -1)
      idxs.forEach(i => winPlaces.push({ meldIndex, tileIndex: i }))
    })
    if (winPlaces.length === 0) continue

    // Dora/赤宝统计（对同一 sel 不变）
    const allTiles = sel.flatMap(x => x.tiles)
    const doraNum = allTiles.reduce((c, t) => c + doras.filter(d => tileMatchesDora(t, d)).length, 0)
    const uraNum  = (form.isRiichi || form.isDaburuRiichi)
      ? allTiles.reduce((c, t) => c + uras.filter(d => tileMatchesDora(t, d)).length, 0)
      : 0
    const akaDoraNum = allTiles.filter(t => t === '0m' || t === '0p' || t === '0s').length

    // 针对每一种“和牌落点”分别生成候选
    for (const wp of winPlaces) {
      let waitType = ''
      const meld = sel[wp.meldIndex]
      if (meld.type === 'handkouutsu') {
        waitType = 'shanpon'
      } else if (meld.type === 'handtoitsu') {
        waitType = 'tanki-machi'
      } else if (meld.type === 'handshuntsu') {
        // 稳健判定：顺子按数值排序，赤5按 5 处理
        const numsSorted = meld.tiles.map(tileNum).sort((a,b) => a - b)
        const wn = tileNum(win)
        if (wn === numsSorted[1]) {
          waitType = 'kanchan-machi'
        } else if (wn === numsSorted[0]) {
          waitType = (numsSorted[0] === 7 && numsSorted[1] === 8 && numsSorted[2] === 9) ? 'penchan-machi' : 'ryanmen-machi'
        } else {
          waitType = (numsSorted[0] === 1 && numsSorted[1] === 2 && numsSorted[2] === 3) ? 'penchan-machi' : 'ryanmen-machi'
        }
      }

      const r = {
        melds: sel,
        winningMeldIndex: wp.meldIndex,
        winningTileIndex: wp.tileIndex,
        waitType,
        roundWind: form.roundWind,
        seatWind: form.seatWind,
        isDealer: form.isDealer,
        isMenzen,
        isTsumo: form.isTsumo,
        isRiichi: form.isRiichi,
        isDaburuRiichi: form.isDaburuRiichi,
        isIppatsu: form.isIppatsu,
        isHaitei: form.isHaitei,
        isHoutei: form.isHoutei,
        isRinshan: form.isRinshan,
        isChankan: form.isChankan,
        doraNum,
        riichiDoraNum: uraNum,
        akaDoraNum
      }

      // 各役
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
      if (yakuList.checkRyanpeikou(r.melds)) { r.isIipeikou = false; r.isRyanpeikou = true } else r.isRyanpeikou = false
      r.isChinitsu = yakuList.checkChinitsu(r.melds)
      r.isDaisangen = yakuList.checkDaisangen(r.melds)
      r.isShousuushii = yakuList.checkShousuushii(r.melds)
      r.isDaisushi = yakuList.checkDaisushi(r.melds)
      r.isTsuuiisou = yakuList.checkTsuuiisou(r.melds)
      r.isRyuuiisou = yakuList.checkRyuuiisou(r.melds)
      r.isChinroutou = yakuList.checkChinroutou(r.melds)
      r.isSuuankou = yakuList.checkSuuankou(r.melds, r.isMenzen, r.isTsumo, r.waitType)
      r.isSuuankouTanki = yakuList.checkSuuankouTanki(r.melds, r.isMenzen, r.waitType)
      r.isChuurenPoutou = false
      r.isJunseiChuurenPoutou = false
      r.isSuukantsu = yakuList.checkSuukantsu(r.melds)

      // 符与番收集
      r.fuResult = calculateFu(r)
      let yakuman = 0, yakumanList = []
      if (r.isDaisangen) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.daisangen') }
      if (r.isShousuushii) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.shousuushii') }
      if (r.isDaisushi) { yakuman+=2; yakumanList.push('handpointcalculation.yakuman.daisushi') }
      if (r.isTsuuiisou) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.tsuuiisou') }
      if (r.isRyuuiisou) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.ryuuiisou') }
      if (r.isChinroutou) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.chinroutou') }
      if (r.isSuuankou) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.suuankou') }
      if (r.isSuuankouTanki) { yakuman+=2; yakumanList.push('handpointcalculation.yakuman.suuankouTanki') }
      if (r.isSuukantsu) { yakuman+=1; yakumanList.push('handpointcalculation.yakuman.suukantsu') }

      let han = 0, yList = []
      if (yakuman === 0) {
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
        if (r.doraNum) { han += r.doraNum; yList.push({ key: 'handpointcalculation.hanLines.dora', params: { n: r.doraNum } }) }
        if (r.akaDoraNum) { han += r.akaDoraNum; yList.push({ key: 'handpointcalculation.hanLines.akaDora', params: { n: r.akaDoraNum } }) }
        if (r.riichiDoraNum) { han += r.riichiDoraNum; yList.push({ key: 'handpointcalculation.hanLines.uraDora', params: { n: r.riichiDoraNum } }) }
      }
      r.hanResult = { isYaku: !(yakuman===0 && han===0), yakuman, yakumanList, han, yakuList: yList }

      // 点数
      let points
      if (r.hanResult.yakuman) {
        if (r.isDealer) points = r.isTsumo ? { tsumo: 16000*r.hanResult.yakuman, ron: null } : { tsumo:null, ron: 48000*r.hanResult.yakuman }
        else points = r.isTsumo ? { tsumo: { dealer: 16000*r.hanResult.yakuman, nonDealer: 8000*r.hanResult.yakuman }, ron: null } : { tsumo:null, ron: 32000*r.hanResult.yakuman }
      } else {
        points = calculatePoints(r.isDealer, r.isTsumo, r.hanResult.han, r.fuResult.fu)
      }
      r.pointsResult = points
      candidates.push(r)
    }
  }

  if (!candidates.length) {
    resultState.error = t('handpointcalculator.error.noValidWinningShape')
    return
  }

  // 选最大点法
  function pickMax(arr) {
    if (arr[0].isDealer && arr[0].isTsumo) {
      return arr.reduce((mi, cur, idx, a) => {
        const mt = a[mi].pointsResult.tsumo
        if (cur.pointsResult.tsumo > mt) return idx
        if (cur.pointsResult.tsumo === mt) {
          const ha = cur.hanResult.han, hb = a[mi].hanResult.han
          if (ha > hb) return idx
          if (ha === hb) return cur.fuResult.fuNotCeil > a[mi].fuResult.fuNotCeil ? idx : mi
        }
        return mi
      }, 0)
    } else if (!arr[0].isDealer && arr[0].isTsumo) {
      return arr.reduce((mi, cur, idx, a) => {
        const md = a[mi].pointsResult.tsumo.dealer
        if (cur.pointsResult.tsumo.dealer > md) return idx
        if (cur.pointsResult.tsumo.dealer === md) {
          const ha = cur.hanResult.han, hb = a[mi].hanResult.han
          if (ha > hb) return idx
          if (ha === hb) return cur.fuResult.fuNotCeil > a[mi].fuResult.fuNotCeil ? idx : mi
        }
        return mi
      }, 0)
    } else {
      return arr.reduce((mi, cur, idx, a) => {
        const mr = a[mi].pointsResult.ron
        if (cur.pointsResult.ron > mr) return idx
        if (cur.pointsResult.ron === mr) {
          const ha = cur.hanResult.han, hb = a[mi].hanResult.han
          if (ha > hb) return idx
          if (ha === hb) return cur.fuResult.fuNotCeil > a[mi].fuResult.fuNotCeil ? idx : mi
        }
        return mi
      }, 0)
    }
  }

  best.value = candidates[pickMax(candidates)]
}

function reset() {
  form.roundWind = 'east'
  form.seatWind = 'east'
  form.isTsumo = true
  form.isRiichi = false
  form.isDaburuRiichi = false
  form.isIppatsu = false
  form.isHaitei = false
  form.isHoutei = false
  form.isRinshan = false
  form.isChankan = false
  form.doraIndicators = ''
  form.riichiDoraIndicators = ''
  form.furoChiPon = ''
  form.furoKong = ''
  form.closedHand = ''
  form.winningTile = ''
  resultState.show = false
  resultState.error = ''
  best.value = null
}

// 展示相关
const summaryLine = computed(() => {
  if (!best.value) return ''
  const role = best.value.isDealer ? t('pointCalc.roles.dealer') : t('pointCalc.roles.nonDealer')
  const win = best.value.isTsumo ? t('pointCalc.winTypes.tsumo') : t('pointCalc.winTypes.ron')
  const hanFu = best.value.hanResult.yakuman
    ? t('handpointcalculation.labels.yakumanTimes', { n: best.value.hanResult.yakuman })
    : t('handpointcalculation.labels.ansHanTotal', { han: best.value.hanResult.han }) + ' ' +
      t('handpointcalculation.labels.ansFuTotal', { fu: best.value.fuResult.fu })
  let pts = ''
  if (best.value.isDealer && best.value.isTsumo) {
    pts = `${best.value.pointsResult.tsumo} ${t('pointCalc.labels.pointsAll')}`
  } else if (!best.value.isDealer && best.value.isTsumo) {
    pts = `${best.value.pointsResult.tsumo.nonDealer} ${t('pointCalc.labels.points')} / ${best.value.pointsResult.tsumo.dealer} ${t('pointCalc.labels.points')}`
  } else {
    pts = `${best.value.pointsResult.ron} ${t('pointCalc.labels.points')}`
  }
  return `${role} ${win} ${hanFu} ${pts}`
})

const localizedYakumanList = computed(() => {
  if (!best.value) return []
  return (best.value.hanResult.yakumanList || []).map(item => t(item))
})
const localizedYakuList = computed(() => {
  if (!best.value) return []
  return (best.value.hanResult.yakuList || []).map(item => {
    if (typeof item === 'string') return t(item)
    return t(item.key, item.params || {})
  })
})
const filteredMeldFuMessages = computed(() => {
  if (!best.value) return []
  const list = best.value?.fuResult?.meldFuMessage || []
  return list
    .filter(item => (typeof item.fu === 'number' ? item.fu > 0 : true))
    .map(item => t(item.key, { fu: item.fu }))
})
</script>
