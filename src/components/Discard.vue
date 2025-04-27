<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
            何切分析
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="flex items-center gap-2 pb-4">
                <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
                    <input type="checkbox" />
                    <div class="collapse-title opacity-80">默认分析规则</div>
                    <div class="collapse-content text-xs font-semibold opacity-60 mb-0">
                        1. 默认考虑一般形式，七对子和国士无双。<br>
                        2. 因为没有其他玩家和牌河，剩余枚数为最大值。<br>
                        3. 不考虑巡目。
                        <!-- <br>
                        4. 可以选择是否考虑红五和dora指示牌。<br>                       -->
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
            <!-- <input
                type="radio"
                name="radio-uploadmethod"
                class="radio radio-xs"
                checked="checked"
            /> -->
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

        <!-- <li class="list-row flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <input
                    type="radio"
                    name="radio-uploadmethod"
                    class="radio radio-xs"
                    checked="checked"
                />
                <span class="p-0 pb-0 text-base opacity-100 tracking-wide">
                    从表中选择
                </span>
            </div>
            <input type="text" placeholder="Type here" class="input" />
        </li>

        <li class="p-4 pb-0 text-base opacity-100 tracking-wide">
            <fieldset class="fieldset ml-0">
                <legend class="text-base">场风</legend>
                <select class="select ml-0">
                    <option>东风</option>
                    <option>南风</option>
                    <option>西风</option>
                    <option>北风</option>
                </select>
                <span class="label ml-3">Optional</span>
            </fieldset>
        </li>

        <li class="p-4 pb-0 text-base opacity-100 tracking-wide">
            <fieldset class="fieldset ml-0">
                <legend class="text-base">自风</legend>
                <select class="select ml-0">
                    <option>东风</option>
                    <option>南风</option>
                    <option>西风</option>
                    <option>北风</option>
                </select>
                <span class="label ml-3">Optional</span>
            </fieldset>
        </li>

        <li class="p-4 pb-0 text-base opacity-100 tracking-wide">
            <fieldset class="fieldset ml-0">
                <legend class="text-base">语言</legend>
                <select class="select ml-0">
                    <option>English</option>
                    <option>Chinese (simplified)</option>
                    <option>Japanese</option>
                </select>
                <span class="label ml-3">Optional</span>
            </fieldset>
        </li> -->

        <li class="list-row flex flex-col gap-2">
            <div></div>
            <button class="btn text-lg" @click="handleSubmit">提交</button>
        </li>
        <li v-if="showResult" class="p-4">
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
                <div v-if="shantenNum > 0" class="overflow-x-auto">
                    <div class="responsive-table-wrapper">
                        <table class="table table-sm w-full bg-base-100 rounded-lg">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th class="text-center">切</th>
                                    <th class="text-center">进张</th>
                                    <th class="text-center">总进张</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="([tile, result], idx) in Object.entries(improvementResults).sort((a, b) => b[1].totalCount - a[1].totalCount)"
                                    :key="tile"
                                    :class="idx % 2 === 1 ? 'hover:bg-base-300' : ''"
                                >
                                    <th>{{ idx + 1 }}</th>
                                    <td class="font-bold text-center">{{ tile }}</td>
                                    <td class="text-center">{{ Object.keys(result.improvements).join(', ') }}</td>
                                    <td class="font-bold text-center">{{ result.totalCount }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>

<script setup>
import { ref } from 'vue'
defineProps(["changeComponent"])

// Shanten 模块定义
class Shanten {
    constructor() {
        this.AGARI_STATE = -1
        this.tiles = []
        this.number_melds = 0
        this.number_tatsu = 0
        this.number_pairs = 0
        this.number_jidahai = 0
        this.number_characters = 0
        this.number_isolated_tiles = 0
        this.min_shanten = 0
    }

    calculateShanten(tiles34, useChiitoitsu = true, useKokushi = true) {
        const results = [this.calculateShantenForRegularHand(tiles34)]
        if (useChiitoitsu) results.push(this.calculateShantenForChiitoitsuHand(tiles34))
        if (useKokushi) results.push(this.calculateShantenForKokushiHand(tiles34))
        return Math.min(...results)
    }

    calculateShantenForChiitoitsuHand(tiles34) {
        let pairs = 0, uniquePairs = 0
        for (let i = 0; i < tiles34.length; i++) {
            if (tiles34[i] >= 2) {
                pairs++
                if (tiles34[i] === 2) uniquePairs++
            }
        }
        if (tiles34.filter(x => x === 2).length === 4 && tiles34.filter(x => x === 3).length === 2) return 1
        if (tiles34.filter(x => x === 2).length === 5 && tiles34.filter(x => x === 4).length === 1) return 1
        if (pairs === 7 && uniquePairs === 7) return this.AGARI_STATE
        return 6 - pairs
    }

    calculateShantenForKokushiHand(tiles34) {
        const indices = [...TERMINAL_INDICES, ...HONOR_INDICES]
        let completedTerminals = 0, terminals = 0
        for (const i of indices) {
            if (tiles34[i] >= 2) completedTerminals++
            if (tiles34[i] !== 0) terminals++
        }
        return 13 - terminals - (completedTerminals ? 1 : 0)
    }

    calculateShantenForRegularHand(tiles34) {
        tiles34 = [...tiles34]
        this._init(tiles34)
        const countOfTiles = tiles34.reduce((sum, x) => sum + x, 0)
        if (countOfTiles > 14) throw new Error(`Too many tiles = ${countOfTiles}`)
        this._removeCharacterTiles(countOfTiles)
        const initMentsu = Math.floor((14 - countOfTiles) / 3)
        this._scan(initMentsu)
        return this.min_shanten
    }

    _init(tiles) {
        this.tiles = tiles
        this.number_melds = 0
        this.number_tatsu = 0
        this.number_pairs = 0
        this.number_jidahai = 0
        this.number_characters = 0
        this.number_isolated_tiles = 0
        this.min_shanten = 8
    }

    _scan(initMentsu) {
        this.number_characters = 0
        for (let i = 0; i < 27; i++) {
            this.number_characters |= (this.tiles[i] === 4) << i
        }
        this.number_melds += initMentsu
        this._run(0)
    }

    _run(depth) {
        if (this.min_shanten === this.AGARI_STATE) return
        while (!this.tiles[depth]) {
            depth++
            if (depth >= 27) break
        }
        if (depth >= 27) return this._updateResult()
        let i = depth
        if (i > 8) i -= 9
        if (i > 8) i -= 9

        if (this.tiles[depth] === 4) {
            this._increaseSet(depth)
            if (i < 7 && this.tiles[depth + 2]) {
                if (this.tiles[depth + 1]) {
                    this._increaseSyuntsu(depth)
                    this._run(depth + 1)
                    this._decreaseSyuntsu(depth)
                }
                this._increaseTatsuSecond(depth)
                this._run(depth + 1)
                this._decreaseTatsuSecond(depth)
            }
            if (i < 8 && this.tiles[depth + 1]) {
                this._increaseTatsuFirst(depth)
                this._run(depth + 1)
                this._decreaseTatsuFirst(depth)
            }
            this._increaseIsolatedTile(depth)
            this._run(depth + 1)
            this._decreaseIsolatedTile(depth)
            this._decreaseSet(depth)
            this._increasePair(depth)
            if (i < 7 && this.tiles[depth + 2]) {
                if (this.tiles[depth + 1]) {
                    this._increaseSyuntsu(depth)
                    this._run(depth)
                    this._decreaseSyuntsu(depth)
                }
                this._increaseTatsuSecond(depth)
                this._run(depth + 1)
                this._decreaseTatsuSecond(depth)
            }
            if (i < 8 && this.tiles[depth + 1]) {
                this._increaseTatsuFirst(depth)
                this._run(depth + 1)
                this._decreaseTatsuFirst(depth)
            }
            this._decreasePair(depth)
        }

        if (this.tiles[depth] === 3) {
            this._increaseSet(depth)
            this._run(depth + 1)
            this._decreaseSet(depth)
            this._increasePair(depth)
            if (i < 7 && this.tiles[depth + 1] && this.tiles[depth + 2]) {
                this._increaseSyuntsu(depth)
                this._run(depth + 1)
                this._decreaseSyuntsu(depth)
            } else {
                if (i < 7 && this.tiles[depth + 2]) {
                    this._increaseTatsuSecond(depth)
                    this._run(depth + 1)
                    this._decreaseTatsuSecond(depth)
                }
                if (i < 8 && this.tiles[depth + 1]) {
                    this._increaseTatsuFirst(depth)
                    this._run(depth + 1)
                    this._decreaseTatsuFirst(depth)
                }
            }
            this._decreasePair(depth)
            if (i < 7 && this.tiles[depth + 2] >= 2 && this.tiles[depth + 1] >= 2) {
                this._increaseSyuntsu(depth)
                this._increaseSyuntsu(depth)
                this._run(depth)
                this._decreaseSyuntsu(depth)
                this._decreaseSyuntsu(depth)
            }
        }

        if (this.tiles[depth] === 2) {
            this._increasePair(depth)
            this._run(depth + 1)
            this._decreasePair(depth)
            if (i < 7 && this.tiles[depth + 2] && this.tiles[depth + 1]) {
                this._increaseSyuntsu(depth)
                this._run(depth)
                this._decreaseSyuntsu(depth)
            }
        }

        if (this.tiles[depth] === 1) {
            if (i < 6 && this.tiles[depth + 1] === 1 && this.tiles[depth + 2] && this.tiles[depth + 3] !== 4) {
                this._increaseSyuntsu(depth)
                this._run(depth + 2)
                this._decreaseSyuntsu(depth)
            } else {
                this._increaseIsolatedTile(depth)
                this._run(depth + 1)
                this._decreaseIsolatedTile(depth)
                if (i < 7 && this.tiles[depth + 2]) {
                    if (this.tiles[depth + 1]) {
                        this._increaseSyuntsu(depth)
                        this._run(depth + 1)
                        this._decreaseSyuntsu(depth)
                    }
                    this._increaseTatsuSecond(depth)
                    this._run(depth + 1)
                    this._decreaseTatsuSecond(depth)
                }
                if (i < 8 && this.tiles[depth + 1]) {
                    this._increaseTatsuFirst(depth)
                    this._run(depth + 1)
                    this._decreaseTatsuFirst(depth)
                }
            }
        }
    }

    _updateResult() {
        let retShanten = 8 - this.number_melds * 2 - this.number_tatsu - this.number_pairs
        let nMentsuKouho = this.number_melds + this.number_tatsu
        if (this.number_pairs) nMentsuKouho += this.number_pairs - 1
        else if (this.number_characters && this.number_isolated_tiles) {
            if ((this.number_characters | this.number_isolated_tiles) === this.number_characters) retShanten += 1
        }
        if (nMentsuKouho > 4) retShanten += nMentsuKouho - 4
        if (retShanten !== this.AGARI_STATE && retShanten < this.number_jidahai) retShanten = this.number_jidahai
        if (retShanten < this.min_shanten) this.min_shanten = retShanten
    }

    _increaseSet(k) {
        this.tiles[k] -= 3
        this.number_melds += 1
    }
    _decreaseSet(k) {
        this.tiles[k] += 3
        this.number_melds -= 1
    }
    _increasePair(k) {
        this.tiles[k] -= 2
        this.number_pairs += 1
    }
    _decreasePair(k) {
        this.tiles[k] += 2
        this.number_pairs -= 1
    }
    _increaseSyuntsu(k) {
        this.tiles[k] -= 1
        this.tiles[k + 1] -= 1
        this.tiles[k + 2] -= 1
        this.number_melds += 1
    }
    _decreaseSyuntsu(k) {
        this.tiles[k] += 1
        this.tiles[k + 1] += 1
        this.tiles[k + 2] += 1
        this.number_melds -= 1
    }
    _increaseTatsuFirst(k) {
        this.tiles[k] -= 1
        this.tiles[k + 1] -= 1
        this.number_tatsu += 1
    }
    _decreaseTatsuFirst(k) {
        this.tiles[k] += 1
        this.tiles[k + 1] += 1
        this.number_tatsu -= 1
    }
    _increaseTatsuSecond(k) {
        this.tiles[k] -= 1
        this.tiles[k + 2] -= 1
        this.number_tatsu += 1
    }
    _decreaseTatsuSecond(k) {
        this.tiles[k] += 1
        this.tiles[k + 2] += 1
        this.number_tatsu -= 1
    }
    _increaseIsolatedTile(k) {
        this.tiles[k] -= 1
        this.number_isolated_tiles |= 1 << k
    }
    _decreaseIsolatedTile(k) {
        this.tiles[k] += 1
        this.number_isolated_tiles |= 1 << k
    }
    _removeCharacterTiles(nc) {
        let number = 0, isolated = 0
        for (let i = 27; i < 34; i++) {
            if (this.tiles[i] === 4) {
                this.number_melds += 1
                this.number_jidahai += 1
                number |= 1 << (i - 27)
                isolated |= 1 << (i - 27)
            }
            if (this.tiles[i] === 3) this.number_melds += 1
            if (this.tiles[i] === 2) this.number_pairs += 1
            if (this.tiles[i] === 1) isolated |= 1 << (i - 27)
        }
        if (this.number_jidahai && nc % 3 === 2) this.number_jidahai -= 1
        if (isolated) {
            this.number_isolated_tiles |= 1 << 27
            if ((number | isolated) === number) this.number_characters |= 1 << 27
        }
    }
}

const TERMINAL_INDICES = [0, 8, 9, 17, 18, 26]
const HONOR_INDICES = [27, 28, 29, 30, 31, 32, 33]

// Reactive states
const handInput = ref('')
const showResult = ref(false)
const shantenNum = ref(null)
const improvementResults = ref({})
const errorMessage = ref(null)

// 将手牌转换为 tiles34Arr 格式
const convertToTiles34Arr = (handTiles) => {
    const tiles34Arr = new Array(34).fill(0)
    handTiles.forEach(tile => {
        const num = tile.replace(/\D/g, "")
        const type = tile.slice(-1)
        let index
        if (type === "m") index = num === "0" ? 4 : parseInt(num, 10) - 1
        else if (type === "p") index = 9 + (num === "0" ? 4 : parseInt(num, 10) - 1)
        else if (type === "s") index = 18 + (num === "0" ? 4 : parseInt(num, 10) - 1)
        else if (type === "z") index = 27 + (parseInt(num, 10) - 1)
        if (index !== undefined) tiles34Arr[index]++
    })
    return tiles34Arr
}

// 计算向听数
const calculateShanten = (tiles34Arr) => {
    const shanten = new Shanten()
    return shanten.calculateShanten(tiles34Arr)
}

// 生成所有可能的牌
const generateTiles = () => {
    const types = ["m", "p", "s"], tiles = []
    types.forEach(type => {
        for (let num = 1; num <= 9; num++) {
            if (num === 5) {
                tiles.push(...Array(3).fill(`${num}${type}`))
                tiles.push(`0${type}`)
            } else {
                tiles.push(...Array(4).fill(`${num}${type}`))
            }
        }
    })
    for (let num = 1; num <= 7; num++) tiles.push(...Array(4).fill(`${num}z`))
    return tiles
}

// 分析进张
const analyzeImprovement = (currentHand, currentTiles34) => {
    const results = {}
    const allTiles = generateTiles()
    const initialCountMap = allTiles.reduce((acc, tile) => {
        acc[tile] = (acc[tile] || 0) + 1
        return acc
    }, {})
    currentHand.forEach(tile => { initialCountMap[tile] = (initialCountMap[tile] || 0) - 1 })

    currentHand.forEach((tileToDiscard, discardIndex) => {
        const newHand = currentHand.filter((_, i) => i !== discardIndex)
        const newTiles34 = convertToTiles34Arr(newHand)
        const originalShanten = calculateShanten(currentTiles34)
        const improvements = {}
        let totalCount = 0
        Object.keys(initialCountMap).forEach(tile => {
            if (initialCountMap[tile] <= 0) return
            const tempHand = [...newHand, tile]
            const tempTiles34 = convertToTiles34Arr(tempHand)
            const newShanten = calculateShanten(tempTiles34)
            if (newShanten < originalShanten) {
                const count = initialCountMap[tile]
                if (count > 0) {
                    improvements[tile] = count
                    totalCount += count
                }
            }
        })
        if (Object.keys(improvements).length > 0) {
            results[tileToDiscard] = { improvements, totalCount }
        }
    })
    return results
}

// 解析手牌输入
const parseHandTiles = (input) => {
    const tiles = input.match(/(\d+)([mpsz])/g) || []
    let handTiles = []
    tiles.forEach(tile => {
        const [_, numbers, type] = tile.match(/(\d+)([mpsz])/)
        for (let i = 0; i < numbers.length; i++) handTiles.push(`${numbers[i]}${type}`)
    })
    if (handTiles.some(tile => ["8z", "9z", "0z"].includes(tile))) return null
    const tileCount = handTiles.reduce((acc, tile) => {
        acc[tile] = (acc[tile] || 0) + 1
        return acc
    }, {})
    if (Object.values(tileCount).some(count => count >= 5)) return null
    return handTiles
}

// 处理提交事件
const handleSubmit = () => {
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
    const tiles34Arr = convertToTiles34Arr(handTiles)
    const shanten = calculateShanten(tiles34Arr)
    shantenNum.value = shanten
    const results = analyzeImprovement(handTiles, tiles34Arr)
    improvementResults.value = results
    showResult.value = true
    errorMessage.value = null
}
</script>
