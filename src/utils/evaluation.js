// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

import { Shanten } from './shanten.js'

// -------------------- 基础工具 --------------------

const TYPE_ORDER = { m: 0, p: 1, s: 2, z: 3 }
const numVal = (n) => (n === '0' ? 5.5 : +n)

const sortTiles = (tiles) => {
  return [...tiles].sort((a, b) => {
    const ta = a.slice(-1), tb = b.slice(-1)
    if (TYPE_ORDER[ta] !== TYPE_ORDER[tb]) return TYPE_ORDER[ta] - TYPE_ORDER[tb]
    const na = numVal(a[0]), nb = numVal(b[0])
    return na - nb
  })
}

const convertToTiles34Arr = (tiles) => {
  const arr = Array(34).fill(0)
  for (const t of tiles) {
    const n = t[0] === '0' ? 5 : +t[0]
    const tp = t.slice(-1)
    let idx
    if (tp === 'm') idx = n - 1
    else if (tp === 'p') idx = 9 + (n - 1)
    else if (tp === 's') idx = 18 + (n - 1)
    else if (tp === 'z') idx = 27 + (n - 1)
    if (idx !== undefined) arr[idx]++
  }
  return arr
}

const getTileIndex = (tStr) => {
  const n = tStr[0] === '0' ? 5 : +tStr[0]
  const s = tStr.slice(-1)
  if (s === 'm') return n - 1
  if (s === 'p') return 9 + n - 1
  if (s === 's') return 18 + n - 1
  if (s === 'z') return 27 + n - 1
  return 0
}

const indexToTile = (idx) => {
  let type = ''
  let num = 0
  if (idx < 9) { type = 'm'; num = idx + 1 }
  else if (idx < 18) { type = 'p'; num = idx - 9 + 1 }
  else if (idx < 27) { type = 's'; num = idx - 18 + 1 }
  else { type = 'z'; num = idx - 27 + 1 }
  return num + type
}

const shantenSolver = new Shanten()
const calcShanten = (arr) => shantenSolver.calculateShanten(arr)

const calcShantenCached = (hand34, shantenCache) => {
  const key = hand34.toString()
  if (shantenCache.has(key)) return shantenCache.get(key)
  const val = calcShanten(hand34)
  shantenCache.set(key, val)
  return val
}

// -------------------- 好型率与期望计算逻辑 --------------------

// 缓存无需全局，每次计算时传递即可，或者在 evaluateHand 内部创建
const MAX_GOOD_SHAPE_DEPTH = 3

/**
 * optimizedGoodShapeRate: Integer-array based calculation
 */
const calculateGoodShapeRate34 = (hand34, rem34, shanten, cache, shantenCache, depth = 0) => {
  if (depth > MAX_GOOD_SHAPE_DEPTH) return 0

  const localShantenCache = shantenCache || new Map()
  const currentShanten = (shanten === -2) ? calcShantenCached(hand34, localShantenCache) : shanten

  // 注意：递归过程中 rem34 会被临时修改（摸/切模拟），缓存键必须包含 rem34 与当前向听。
  // 否则会出现“同一 hand34 在不同剩余牌分布下被错误复用”的问题，导致结果依赖计算顺序。
  const key = hand34.toString() + '|' + rem34.toString() + '|' + currentShanten + '|' + depth
  if (cache.has(key)) return cache.get(key)

  // Case: Tenpai (0 Shanten)
  if (currentShanten === 0) {
    let waitTypes = 0
    let waitCount = 0
    for (let i = 0; i < 34; i++) {
      if (rem34[i] <= 0) continue
      hand34[i]++
      if (calcShantenCached(hand34, localShantenCache) === -1) {
        waitTypes++
        waitCount += rem34[i]
      }
      hand34[i]--
    }

    const res = (waitTypes > 1 && waitCount > 4) ? 1 : 0
    cache.set(key, res)
    return res
  }

  let total = 0
  let good = 0

  // Scan all possible draws
  for (let i = 0; i < 34; i++) {
    const count = rem34[i]
    if (count <= 0) continue

    hand34[i]++
    const newShanten = calcShantenCached(hand34, localShantenCache)

    if (newShanten < currentShanten) {
      let bestPath = 0

      // Find best discard to advance
      // rem34[i]-- 对所有弃牌分支都是常量，移出内层循环减少写回
      rem34[i]--
      for (let d = 0; d < 34; d++) {
        if (hand34[d] <= 0) continue
        hand34[d]--
        rem34[d]++

        const val = calculateGoodShapeRate34(hand34, rem34, newShanten, cache, localShantenCache, depth + 1)
        if (val > bestPath) {
          bestPath = val
          if (bestPath === 1) {
            rem34[d]--
            hand34[d]++
            break
          }
        }

        rem34[d]--
        hand34[d]++
      }
      rem34[i]++

      total += count
      good += count * bestPath
    }

    hand34[i]--
  }

  const res = total === 0 ? 0 : good / total
  cache.set(key, res)
  return res
}

// -------------------- 科学打点估算器 (新算法) --------------------

class ScientificScoreEstimator {
  static estimate(hand34, isRiichi = true, redCount = 0) {
    // 1. 特殊役判定：七对子
    let pairCount = 0
    let totalTiles = 0
    for(let i=0; i<34; i++) {
        totalTiles += hand34[i]
        if(hand34[i] === 2) pairCount++
    }

    // 边张加分计算
    let edgeBonus = 0
    // console.log('Estimating hand with edge bonus...')
    for (let i = 0; i < 27; i++) { // m, p, s
        if (hand34[i] > 0) {
            const num = (i % 9) + 1
            let bonus = 0
            // 提高系数以抵消断幺九优势
            if (num === 1 || num === 9) bonus = 0.5
            else if (num === 2 || num === 8) bonus = 0.3
            else if (num === 3 || num === 7) bonus = 0.2
            else if (num === 4 || num === 6) bonus = 0.1
            edgeBonus += bonus * hand34[i]
        }
    }

    // 必须是14张手牌
    if (pairCount === 7 && totalTiles === 14) {
        let han = isRiichi ? 3.5 : 2.5
        if (this.checkHonitsu(hand34)) han += 3
        else if (this.checkChinitsu(hand34)) han += 6
        if (this.checkTanyao(hand34)) han += 1
        han += redCount // 红宝牌
        han += edgeBonus
        // 七对25符
        return this.hanToScore(han, 25)
    }

    // --- 标准面子手判定 ---
    let han = isRiichi ? 1 : 0
    if (isRiichi) han += 1.2 // 里宝牌/一发期望
    
    // 役牌
    for (let i = 31; i <= 33; i++) {
        if (hand34[i] >= 3) han += 1
    }

    // 断幺九
    if (this.checkTanyao(hand34)) han += 1

    // 染手
    const isHonitsu = this.checkHonitsu(hand34)
    const isChinitsu = this.checkChinitsu(hand34)
    if (isChinitsu) han += 5 
    else if (isHonitsu) han += 2 

    // 进阶役种检测
    if (!isHonitsu && !isChinitsu) { 
        if (this.checkToitoi(hand34)) han += 2
        else {
            if (this.checkSanshoku(hand34)) han += 2
            if (this.checkIttsuu(hand34)) han += 2
        }
    }

    // Dora 估算
    han += 0.5 
    han += redCount // 红宝牌加番
    han += edgeBonus

    // 默认30符
    return this.hanToScore(han, 30)
  }

  static checkTanyao(hand34) {
    const terminals = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33]
    for (let i = 0; i < terminals.length; i++) {
        if (hand34[terminals[i]] > 0) return false
    }
    return true
  }

  static checkHonitsu(hand34) {
      let hasM = false, hasP = false, hasS = false, hasZ = false
      for (let i = 0; i < 9; i++) if (hand34[i] > 0) hasM = true
      for (let i = 9; i < 18; i++) if (hand34[i] > 0) hasP = true
      for (let i = 18; i < 27; i++) if (hand34[i] > 0) hasS = true
      for (let i = 27; i < 34; i++) if (hand34[i] > 0) hasZ = true
      const colors = (hasM ? 1 : 0) + (hasP ? 1 : 0) + (hasS ? 1 : 0)
      return colors === 1 && hasZ
  }

  static checkChinitsu(hand34) {
      let hasM = false, hasP = false, hasS = false, hasZ = false
      for (let i = 0; i < 9; i++) if (hand34[i] > 0) hasM = true
      for (let i = 9; i < 18; i++) if (hand34[i] > 0) hasP = true
      for (let i = 18; i < 27; i++) if (hand34[i] > 0) hasS = true
      for (let i = 27; i < 34; i++) if (hand34[i] > 0) hasZ = true
      const colors = (hasM ? 1 : 0) + (hasP ? 1 : 0) + (hasS ? 1 : 0)
      return colors === 1 && !hasZ
  }

  static checkToitoi(hand34) {
      let koutsu = 0
      for(let i=0; i<34; i++) if (hand34[i] >= 3) koutsu++
      return koutsu >= 3 
  }

  static checkSanshoku(hand34) {
      // 检查三色：m, p, s 的同一数字顺子
      for(let i=0; i<7; i++) { 
          const hasM = hand34[i] > 0 && hand34[i+1] > 0 && hand34[i+2] > 0
          const hasP = hand34[i+9] > 0 && hand34[i+10] > 0 && hand34[i+11] > 0
          const hasS = hand34[i+18] > 0 && hand34[i+19] > 0 && hand34[i+20] > 0
          if (hasM && hasP && hasS) return true
      }
      return false
  }

  static checkIttsuu(hand34) {
    // 检查一气通贯：123, 456, 789
    const checkColor = (offset) => {
      const part1 = hand34[offset + 0] > 0 && hand34[offset + 1] > 0 && hand34[offset + 2] > 0
      const part2 = hand34[offset + 3] > 0 && hand34[offset + 4] > 0 && hand34[offset + 5] > 0
      const part3 = hand34[offset + 6] > 0 && hand34[offset + 7] > 0 && hand34[offset + 8] > 0
      return part1 && part2 && part3
    }
    if (checkColor(0)) return true
    if (checkColor(9)) return true
    if (checkColor(18)) return true
    return false
  }

  static hanToScore(han, fu = 30) {
    // 实际上麻将分数不会这么算，但这只是 EV 估算器。
    // 做一个“平滑插值”，让小数番也能在分数上体现差异。
    const floorHan = Math.floor(han)
    const decimal = han - floorHan

    const getBase = (h) => {
      if (h < 1) return 0
      if (h < 2) return 1500
      if (h < 3) return 3000
      if (h < 4) return 5800
      if (h < 5) return 8000
      if (h < 6) return 8000
      if (h < 8) return 12000
      if (h < 11) return 16000
      if (h < 13) return 24000
      return 32000
    }

    const low = getBase(floorHan)

    // 平滑插值处理
    if (floorHan >= 5) {
      // 修正满贯到跳满的插值 (5-6)
      if (floorHan === 5) {
        // 5 Han = 8000, 6 Han = 12000. Slope = 4000.
        // 当 han=5.5 -> 10000.
        return low + decimal * 4000
      }
      // 跳满以上微量增加
      return low + decimal * 1000
    }

    const high = getBase(floorHan + 1)
    if (high > low) {
      return low + (high - low) * decimal
    }

    // 4番到5番，分数是 5800 -> 8000。
    // 5番到6番，分数是 8000 -> 8000。
    // 希望 5.5 番比 5.0 番分高，保证 0.5 的 bonus 有意义。
    return low + decimal * 1000
  }
}

// -------------------- 科学期望值计算器 (新算法) --------------------

class ScientificExpectedScoreCalculator {
  constructor(config = {}, shantenCache) {
    this.t_curr = config.currentTurn || 7
    this.t_max = config.maxTurn || 18
    this.cache = new Map()
    this.shantenCache = shantenCache || new Map()
  }

  compute(hand34, rem34) {
    // Deprecated: use manual iteration in evaluateHand to support Red Dora
    return {}
  }

  // 计算给定手牌(13张)在当前剩余牌下的期望得分
  getEV(hand34, rem34, turn, startShanten, redCount) {
    return this.drawNode(hand34, rem34, turn, startShanten, -1, redCount)
  }

  drawNode(hand34, rem34, turn, prevShanten, discardType, redCount) {
    if (turn >= this.t_max) return 0

      // Cache key: hand state + turn + redCount
      // 注意：prevShanten 会改变“是否算作向听前进”的判定，必须纳入 key，
      // 否则不同起始向听会互相污染缓存，造成结果依赖弃牌枚举顺序/输入顺序。
    const key = hand34.toString() + '|' + turn + '|' + redCount + '|' + prevShanten
    if (this.cache.has(key)) return this.cache.get(key)

    let sumValidEV = 0
    let validTileCount = 0

    for (let i = 0; i < 34; i++) {
      if (rem34[i] <= 0) continue
      const count = rem34[i]

      hand34[i]++
      const newShanten = calcShantenCached(hand34, this.shantenCache)
      let ev = 0

      if (newShanten === -1) {
        // 听牌 -> 和牌得分 (带红宝牌)
        ev = ScientificScoreEstimator.estimate(hand34, true, redCount)
      } else if (newShanten < prevShanten) {
        // 向听前进 -> 切牌
        ev = this.discardNode(hand34, rem34, turn, newShanten, redCount)
      } else {
        // 向听不变/倒退 -> 这里简化为下一巡继续摸
        ev = this.drawNodeNextTurn(hand34, rem34, turn, prevShanten, i, redCount)
      }

      sumValidEV += ev * count
      validTileCount += count
      hand34[i]--
    }

    const totalRem = validTileCount
    const finalEV = totalRem > 0 ? sumValidEV / totalRem : 0

    this.cache.set(key, finalEV)
    return finalEV
  }
  
  drawNodeNextTurn(hand14, rem34, turn, shanten, tileIdx, redCount) {
    hand14[tileIdx]--
    const ev = this.drawNode(hand14, rem34, turn + 1, shanten, -1, redCount)
    hand14[tileIdx]++
    return ev
  }

  discardNode(hand34, rem34, turn, currentShanten, redCount) {
    let maxEV = 0
    // 尝试切每一张牌，找 EV 最高的
    for (let i = 0; i < 34; i++) {
      if (hand34[i] <= 0) continue
      hand34[i]--

      // 注意：递归过程切牌不减少 redCount，因为红宝牌在初期已被固定算入。
      // 由于 hand34 无法区分同种牌里的红/黑，这里做近似：递归中的切牌不改变 redCount。
      // 依赖 evaluateHand 入口处的精确 redCount 计算。
      const ev = this.drawNode(hand34, rem34, turn + 1, currentShanten, -1, redCount)
      if (ev > maxEV) maxEV = ev
      hand34[i]++
    }
    return maxEV
  }
}

// -------------------- 主入口函数 --------------------

/**
 * 评估 14 张手牌的切牌选择
 * @param {string[]} hand14 
 * @param {Record<string,number>} remMap (Total - hand14)
 */
export function evaluateHand(hand14, remMap, options = {}) {
  const goodShapeCache = new Map() // 本次计算缓存
  const shantenCache = new Map()
  const improvementResults = {}
  const skipEV = options?.skipEV === true
  const skipGoodShapeRate = options?.skipGoodShapeRate === true
  
  const current34 = convertToTiles34Arr(hand14)
  const originalShanten = calcShantenCached(current34, shantenCache)
  
  // Pre-convert remMap to array for optimized calculations
  const rem34 = Array(34).fill(0)
  for (const [k, v] of Object.entries(remMap)) {
    rem34[getTileIndex(k)] += v // Use += to handle 0m/5m merging
  }

  // 根据向听数调整搜索深度
  let maxTurn = 13 // 默认中等
  if (originalShanten === 0) maxTurn = 16 // 听牌算得深一点
  else if (originalShanten === 1) maxTurn = 14
  
  const calculator = skipEV ? null : new ScientificExpectedScoreCalculator({ 
    currentTurn: 5, // 假设当前是第5巡（中期）
    maxTurn: maxTurn
  }, shantenCache)
  
  const processedTiles = new Set()
  const totalRedInHand = hand14.reduce((acc, t) => (t[0] === '0' ? acc + 1 : acc), 0)

  hand14.forEach((tileToDiscard) => {
    if (processedTiles.has(tileToDiscard)) return
    processedTiles.add(tileToDiscard)

    // Construct 13-tile hand state
    const tileIdx = getTileIndex(tileToDiscard)
    const new34 = [...current34]
    new34[tileIdx]--

    // 基准应当是“切牌后的 13 张向听”，否则会把 2->1 的进张误判为不进张
    const shantenAfterDiscard = calcShantenCached(new34, shantenCache)

    // 传统切牌表：不展示“切完向听后退”的选项（否则会让表格出现大量明显不合理的弃牌）。
    if (shantenAfterDiscard > originalShanten) return

    const improvements = {}
    let totalCount = 0
    let shantenImproved = false

    // Check improvements
    for (let i = 0; i < 34; i++) {
      if (rem34[i] <= 0) continue
      new34[i]++
      if (calcShantenCached(new34, shantenCache) < shantenAfterDiscard) {
        let handled = false
        // 特殊处理红宝牌显示
        if (i === 4 && remMap['0m'] > 0) {
          improvements['0m'] = remMap['0m']
          if (rem34[i] > remMap['0m']) improvements['5m'] = rem34[i] - remMap['0m']
          handled = true
        } else if (i === 13 && remMap['0p'] > 0) {
          improvements['0p'] = remMap['0p']
          if (rem34[i] > remMap['0p']) improvements['5p'] = rem34[i] - remMap['0p']
          handled = true
        } else if (i === 22 && remMap['0s'] > 0) {
          improvements['0s'] = remMap['0s']
          if (rem34[i] > remMap['0s']) improvements['5s'] = rem34[i] - remMap['0s']
          handled = true
        }

        if (!handled) {
          // Find format for display (e.g. 1m)
          const impTile = indexToTile(i)
          improvements[impTile] = rem34[i]
        }
        
        totalCount += rem34[i]
        shantenImproved = true
      }
      new34[i]--
    }

    let rate = null
    if (!skipGoodShapeRate && shantenImproved) {
      // Use optimized array-based calculation
      rate = calculateGoodShapeRate34([...new34], [...rem34], shantenAfterDiscard, goodShapeCache, shantenCache)
    }

    // 2. EV Calculation
    const redCount = totalRedInHand - (tileToDiscard[0] === '0' ? 1 : 0)

    // Calculate EV from the 13-tile state
    const ev = skipEV ? 0 : calculator.getEV([...new34], rem34, 7, shantenAfterDiscard, redCount)

    if (totalCount > 0 || ev > 0) {
      improvementResults[tileToDiscard] = {
        improvements,
        totalCount,
        goodShapeRate: rate === null ? null : Math.max(0, rate * 100),
        evIndex: Math.floor(ev * 10)
      }
    }
  })
  
  return improvementResults
}

/**
 * 评估 13 张手牌的状态（进张、好型率、指数）
 * @param {string[]} hand13
 * @param {Record<string,number>} remMap (Total - hand13)
 */
export function evaluateStatus(hand13, remMap, options = {}) {
  const goodShapeCache = new Map()
  const shantenCache = new Map()
  const skipEV = options?.skipEV === true
  const skipGoodShapeRate = options?.skipGoodShapeRate === true
  
  const current34 = convertToTiles34Arr(hand13)
  const shanten = calcShantenCached(current34, shantenCache)
  
  const rem34 = Array(34).fill(0)
  for (const [k, v] of Object.entries(remMap)) {
    rem34[getTileIndex(k)] += v
  }

  const improvements = {}
  let totalCount = 0
  
  for (let i = 0; i < 34; i++) {
    if (rem34[i] > 0) {
      current34[i]++
      if (calcShantenCached(current34, shantenCache) < shanten) {
        let handled = false

        if (i === 4 && remMap['0m'] > 0) {
          improvements['0m'] = remMap['0m']
          if (rem34[i] > remMap['0m']) improvements['5m'] = rem34[i] - remMap['0m']
          handled = true
        } else if (i === 13 && remMap['0p'] > 0) {
          improvements['0p'] = remMap['0p']
          if (rem34[i] > remMap['0p']) improvements['5p'] = rem34[i] - remMap['0p']
          handled = true
        } else if (i === 22 && remMap['0s'] > 0) {
          improvements['0s'] = remMap['0s']
          if (rem34[i] > remMap['0s']) improvements['5s'] = rem34[i] - remMap['0s']
          handled = true
        }

        if (!handled) {
          improvements[indexToTile(i)] = rem34[i]
        }

        totalCount += rem34[i]
      }
      current34[i]--
    }
  }
  
  // Use optimized call
  let goodShapeRate = null
  if (!skipGoodShapeRate) {
    const rate = calculateGoodShapeRate34([...current34], [...rem34], shanten, goodShapeCache, shantenCache)
    goodShapeRate = Math.max(0, rate * 100)
  }
  
  let ev = 0
  if (!skipEV) {
    const redCount = hand13.filter(t => t[0] === '0').length
    const calculator = new ScientificExpectedScoreCalculator({ currentTurn: 7, maxTurn: 15 }, shantenCache)
    ev = calculator.getEV(current34, rem34, 7, shanten, redCount)
  }
  
  return {
    improvements,
    totalCount,
    goodShapeRate,
    evIndex: Math.floor(ev * 10)
  }
}
