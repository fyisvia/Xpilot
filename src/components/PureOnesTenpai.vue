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
import { ref, computed, onMounted } from 'vue';

// 图片导入
import m0 from '/mahjongfiles/0m.png';
import m1 from '/mahjongfiles/1m.png';
import m2 from '/mahjongfiles/2m.png';
import m3 from '/mahjongfiles/3m.png';
import m4 from '/mahjongfiles/4m.png';
import m5 from '/mahjongfiles/5m.png';
import m6 from '/mahjongfiles/6m.png';
import m7 from '/mahjongfiles/7m.png';
import m8 from '/mahjongfiles/8m.png';
import m9 from '/mahjongfiles/9m.png';
import p0 from '/mahjongfiles/0p.png';
import p1 from '/mahjongfiles/1p.png';
import p2 from '/mahjongfiles/2p.png';
import p3 from '/mahjongfiles/3p.png';
import p4 from '/mahjongfiles/4p.png';
import p5 from '/mahjongfiles/5p.png';
import p6 from '/mahjongfiles/6p.png';
import p7 from '/mahjongfiles/7p.png';
import p8 from '/mahjongfiles/8p.png';
import p9 from '/mahjongfiles/9p.png';
import s0 from '/mahjongfiles/0s.png';
import s1 from '/mahjongfiles/1s.png';
import s2 from '/mahjongfiles/2s.png';
import s3 from '/mahjongfiles/3s.png';
import s4 from '/mahjongfiles/4s.png';
import s5 from '/mahjongfiles/5s.png';
import s6 from '/mahjongfiles/6s.png';
import s7 from '/mahjongfiles/7s.png';
import s8 from '/mahjongfiles/8s.png';
import s9 from '/mahjongfiles/9s.png';
import z1 from '/mahjongfiles/1z.png';
import z2 from '/mahjongfiles/2z.png';
import z3 from '/mahjongfiles/3z.png';
import z4 from '/mahjongfiles/4z.png';
import z5 from '/mahjongfiles/5z.png';
import z6 from '/mahjongfiles/6z.png';
import z7 from '/mahjongfiles/7z.png';
import z0 from '/mahjongfiles/-1.png';
import ph from '/mahjongfiles/ph.png';

// 图片映射
const tileImages = {
    '0m': m0,
    '1m': m1,
    '2m': m2,
    '3m': m3,
    '4m': m4,
    '5m': m5,
    '6m': m6,
    '7m': m7,
    '8m': m8,
    '9m': m9,
    '0p': p0,
    '1p': p1,
    '2p': p2,
    '3p': p3,
    '4p': p4,
    '5p': p5,
    '6p': p6,
    '7p': p7,
    '8p': p8,
    '9p': p9,
    '0s': s0,
    '1s': s1,
    '2s': s2,
    '3s': s3,
    '4s': s4,
    '5s': s5,
    '6s': s6,
    '7s': s7,
    '8s': s8,
    '9s': s9,
    '1z': z1,
    '2z': z2,
    '3z': z3,
    '4z': z4,
    '5z': z5,
    '6z': z6,
    '7z': z7,
    '-1': z0,
    'ph': ph,
};

// Shanten 模块
class Shanten {
    constructor() {
        this.AGARI_STATE = -1;
        this.tiles = [];
        this.number_melds = 0;
        this.number_tatsu = 0;
        this.number_pairs = 0;
        this.number_jidahai = 0;
        this.number_characters = 0;
        this.number_isolated_tiles = 0;
        this.min_shanten = 0;
    }

    calculateShanten(tiles34, useChiitoitsu = true, useKokushi = true) {
        const results = [this.calculateShantenForRegularHand(tiles34)];
        if (useChiitoitsu) results.push(this.calculateShantenForChiitoitsuHand(tiles34));
        if (useKokushi) results.push(this.calculateShantenForKokushiHand(tiles34));
        return Math.min(...results);
    }

    calculateShantenForChiitoitsuHand(tiles34) {
        let pairs = 0, uniquePairs = 0;
        for (let i = 0; i < tiles34.length; i++) {
            if (tiles34[i] >= 2) {
                pairs++;
                if (tiles34[i] === 2) uniquePairs++;
            }
        }
        if (tiles34.filter(x => x === 2).length === 4 && tiles34.filter(x => x === 3).length === 2) return 1;
        if (tiles34.filter(x => x === 2).length === 5 && tiles34.filter(x => x === 4).length === 1) return 1;
        if (pairs === 7 && uniquePairs === 7) return this.AGARI_STATE;
        return 6 - pairs;
    }

    calculateShantenForKokushiHand(tiles34) {
        const indices = [...Array(13).keys(), ...Array(7).fill(27).map((x, i) => x + i)];
        let completedTerminals = 0, terminals = 0;
        for (const i of indices) {
            if (tiles34[i] >= 2) completedTerminals++;
            if (tiles34[i] !== 0) terminals++;
        }
        return 13 - terminals - (completedTerminals ? 1 : 0);
    }

    calculateShantenForRegularHand(tiles34) {
        tiles34 = [...tiles34];
        this._init(tiles34);
        const countOfTiles = tiles34.reduce((sum, x) => sum + x, 0);
        if (countOfTiles > 14) throw new Error(`Too many tiles = ${countOfTiles}`);
        this._removeCharacterTiles(countOfTiles);
        const initMentsu = Math.floor((14 - countOfTiles) / 3);
        this._scan(initMentsu);
        return this.min_shanten;
    }

    _init(tiles) {
        this.tiles = tiles;
        this.number_melds = 0;
        this.number_tatsu = 0;
        this.number_pairs = 0;
        this.number_jidahai = 0;
        this.number_characters = 0;
        this.number_isolated_tiles = 0;
        this.min_shanten = 8;
    }

    _scan(initMentsu) {
        this.number_characters = 0;
        for (let i = 0; i < 27; i++) {
            this.number_characters |= (this.tiles[i] === 4) << i;
        }
        this.number_melds += initMentsu;
        this._run(0);
    }

    _run(depth) {
        if (this.min_shanten === this.AGARI_STATE) return;
        while (!this.tiles[depth]) {
            depth++;
            if (depth >= 27) break;
        }
        if (depth >= 27) return this._updateResult();
        let i = depth;
        if (i > 8) i -= 9;
        if (i > 8) i -= 9;

        if (this.tiles[depth] === 4) {
            this._increaseSet(depth);
            if (i < 7 && this.tiles[depth + 2]) {
                if (this.tiles[depth + 1]) {
                    this._increaseSyuntsu(depth);
                    this._run(depth + 1);
                    this._decreaseSyuntsu(depth);
                }
                this._increaseTatsuSecond(depth);
                this._run(depth + 1);
                this._decreaseTatsuSecond(depth);
            }
            if (i < 8 && this.tiles[depth + 1]) {
                this._increaseTatsuFirst(depth);
                this._run(depth + 1);
                this._decreaseTatsuFirst(depth);
            }
            this._increaseIsolatedTile(depth);
            this._run(depth + 1);
            this._decreaseIsolatedTile(depth);
            this._decreaseSet(depth);
            this._increasePair(depth);
            if (i < 7 && this.tiles[depth + 2]) {
                if (this.tiles[depth + 1]) {
                    this._increaseSyuntsu(depth);
                    this._run(depth);
                    this._decreaseSyuntsu(depth);
                }
                this._increaseTatsuSecond(depth);
                this._run(depth + 1);
                this._decreaseTatsuSecond(depth);
            }
            if (i < 8 && this.tiles[depth + 1]) {
                this._increaseTatsuFirst(depth);
                this._run(depth + 1);
                this._decreaseTatsuFirst(depth);
            }
            this._decreasePair(depth);
        }

        if (this.tiles[depth] === 3) {
            this._increaseSet(depth);
            this._run(depth + 1);
            this._decreaseSet(depth);
            this._increasePair(depth);
            if (i < 7 && this.tiles[depth + 1] && this.tiles[depth + 2]) {
                this._increaseSyuntsu(depth);
                this._run(depth + 1);
                this._decreaseSyuntsu(depth);
            } else {
                if (i < 7 && this.tiles[depth + 2]) {
                    this._increaseTatsuSecond(depth);
                    this._run(depth + 1);
                    this._decreaseTatsuSecond(depth);
                }
                if (i < 8 && this.tiles[depth + 1]) {
                    this._increaseTatsuFirst(depth);
                    this._run(depth + 1);
                    this._decreaseTatsuFirst(depth);
                }
            }
            this._decreasePair(depth);
            if (i < 7 && this.tiles[depth + 2] >= 2 && this.tiles[depth + 1] >= 2) {
                this._increaseSyuntsu(depth);
                this._increaseSyuntsu(depth);
                this._run(depth);
                this._decreaseSyuntsu(depth);
                this._decreaseSyuntsu(depth);
            }
        }

        if (this.tiles[depth] === 2) {
            this._increasePair(depth);
            this._run(depth + 1);
            this._decreasePair(depth);
            if (i < 7 && this.tiles[depth + 2] && this.tiles[depth + 1]) {
                this._increaseSyuntsu(depth);
                this._run(depth);
                this._decreaseSyuntsu(depth);
            }
        }

        if (this.tiles[depth] === 1) {
            if (i < 6 && this.tiles[depth + 1] === 1 && this.tiles[depth + 2] && this.tiles[depth + 3] !== 4) {
                this._increaseSyuntsu(depth);
                this._run(depth + 2);
                this._decreaseSyuntsu(depth);
            } else {
                this._increaseIsolatedTile(depth);
                this._run(depth + 1);
                this._decreaseIsolatedTile(depth);
                if (i < 7 && this.tiles[depth + 2]) {
                    if (this.tiles[depth + 1]) {
                        this._increaseSyuntsu(depth);
                        this._run(depth + 1);
                        this._decreaseSyuntsu(depth);
                    }
                    this._increaseTatsuSecond(depth);
                    this._run(depth + 1);
                    this._decreaseTatsuSecond(depth);
                }
                if (i < 8 && this.tiles[depth + 1]) {
                    this._increaseTatsuFirst(depth);
                    this._run(depth + 1);
                    this._decreaseTatsuFirst(depth);
                }
            }
        }
    }

    _updateResult() {
        let retShanten = 8 - this.number_melds * 2 - this.number_tatsu - this.number_pairs;
        let nMentsuKouho = this.number_melds + this.number_tatsu;
        if (this.number_pairs) nMentsuKouho += this.number_pairs - 1;
        else if (this.number_characters && this.number_isolated_tiles) {
            if ((this.number_characters | this.number_isolated_tiles) === this.number_characters) retShanten += 1;
        }
        if (nMentsuKouho > 4) retShanten += nMentsuKouho - 4;
        if (retShanten !== this.AGARI_STATE && retShanten < this.number_jidahai) retShanten = this.number_jidahai;
        if (retShanten < this.min_shanten) this.min_shanten = retShanten;
    }

    _increaseSet(k) {
        this.tiles[k] -= 3;
        this.number_melds += 1;
    }
    _decreaseSet(k) {
        this.tiles[k] += 3;
        this.number_melds -= 1;
    }
    _increasePair(k) {
        this.tiles[k] -= 2;
        this.number_pairs += 1;
    }
    _decreasePair(k) {
        this.tiles[k] += 2;
        this.number_pairs -= 1;
    }
    _increaseSyuntsu(k) {
        this.tiles[k] -= 1;
        this.tiles[k + 1] -= 1;
        this.tiles[k + 2] -= 1;
        this.number_melds += 1;
    }
    _decreaseSyuntsu(k) {
        this.tiles[k] += 1;
        this.tiles[k + 1] += 1;
        this.tiles[k + 2] += 1;
        this.number_melds -= 1;
    }
    _increaseTatsuFirst(k) {
        this.tiles[k] -= 1;
        this.tiles[k + 1] -= 1;
        this.number_tatsu += 1;
    }
    _decreaseTatsuFirst(k) {
        this.tiles[k] += 1;
        this.tiles[k + 1] += 1;
        this.number_tatsu -= 1;
    }
    _increaseTatsuSecond(k) {
        this.tiles[k] -= 1;
        this.tiles[k + 2] -= 1;
        this.number_tatsu += 1;
    }
    _decreaseTatsuSecond(k) {
        this.tiles[k] += 1;
        this.tiles[k + 2] += 1;
        this.number_tatsu -= 1;
    }
    _increaseIsolatedTile(k) {
        this.tiles[k] -= 1;
        this.number_isolated_tiles |= 1 << k;
    }
    _decreaseIsolatedTile(k) {
        this.tiles[k] += 1;
        this.number_isolated_tiles |= 1 << k;
    }
    _removeCharacterTiles(nc) {
        let number = 0, isolated = 0;
        for (let i = 27; i < 34; i++) {
            if (this.tiles[i] === 4) {
                this.number_melds += 1;
                this.number_jidahai += 1;
                number |= 1 << (i - 27);
                isolated |= 1 << (i - 27);
            }
            if (this.tiles[i] === 3) this.number_melds += 1;
            if (this.tiles[i] === 2) this.number_pairs += 1;
            if (this.tiles[i] === 1) isolated |= 1 << (i - 27);
        }
        if (this.number_jidahai && nc % 3 === 2) this.number_jidahai -= 1;
        if (isolated) {
            this.number_isolated_tiles |= 1 << 27;
            if ((number | isolated) === number) this.number_characters |= 1 << 27;
        }
    }
}

// 状态管理
const tileType = ref('m');
const difficulty = ref(0);
const tilesWall = ref([]);
const handTiles = ref([]);
const answer = ref([]);
const isSubmitted = ref(false);
const isCorrect = ref(false);
const totalAttempts = ref(0);
const correctAttempts = ref(0);

// 牌型生成逻辑
const generateTiles = (type) => {
    const tiles = [];
    const tileTypes = { m: 'm', s: 's', p: 'p' };
    for (let num = 1; num <= 9; num++) {
        if (num === 5) {
            tiles.push(...Array(3).fill(`${num}${tileTypes[type]}`));
            tiles.push(`0${tileTypes[type]}`);
        } else {
            tiles.push(...Array(4).fill(`${num}${tileTypes[type]}`));
        }
    }
    return tiles;
};

// Fisher-Yates 洗牌算法
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

// 排序手牌
const sortTiles = (tiles) => {
    return [...tiles].sort((a, b) => {
        const aNum = a.replace(/\D/g, '');
        const bNum = b.replace(/\D/g, '');
        const aSortNum = aNum === '0' ? 5.5 : parseInt(aNum, 10);
        const bSortNum = bNum === '0' ? 5.5 : parseInt(bNum, 10);
        return aSortNum - bSortNum;
    });
};

// 转换为 tiles34Arr 格式
const convertToTiles34Arr = (handTiles) => {
    const tiles34Arr = new Array(34).fill(0);
    handTiles.forEach((tile) => {
        const num = tile.replace(/\D/g, '');
        const index = num === '0' ? 4 : parseInt(num, 10) - 1;
        tiles34Arr[index]++;
    });
    return tiles34Arr;
};

// 转换手牌为字符串
const convertToTilesStr = (handTiles) => {
    const groupedTiles = { m: [], p: [], s: [], z: [] };
    handTiles.forEach((tile) => {
        const type = tile.slice(-1);
        const num = tile.replace(/\D/g, '');
        groupedTiles[type].push(num);
    });
    let result = '';
    Object.entries(groupedTiles).forEach(([type, nums]) => {
        if (nums.length > 0) {
            result += nums.sort((a, b) => (a === '0' ? 5 : a) - (b === '0' ? 5 : b)).join('') + type;
        }
    });
    return result;
};

// 计算向听数
const calculateShanten = (tiles34Arr) => {
    const shanten = new Shanten();
    return shanten.calculateShanten(tiles34Arr);
};

// 获取正确答案
const getCorrectAnswer = (tiles) => {
    const tiles34 = convertToTiles34Arr(tiles);
    const correctTiles = [];
    for (let i = 0; i < 9; i++) {
        if (tiles34[i] < 4) {
            const tempTiles34 = [...tiles34];
            tempTiles34[i]++;
            if (calculateShanten(tempTiles34) === -1) {
                if (tileType.value === 'm') {
                    correctTiles.push(i === 4 ? '5m' : `${i + 1}m`);
                }
                if (tileType.value === 'p') {
                    correctTiles.push(i === 4 ? '5p' : `${i + 1}p`);
                }
                if (tileType.value === 's') {
                    correctTiles.push(i === 4 ? '5s' : `${i + 1}s`);
                }
            }
        }
    }
    return correctTiles;
};

// 初始化游戏
const initializeGame = () => {
    let validHand = false;
    let allTiles, initialHand;
    let initialHand34, tempTiles34;

    while (!validHand) {
        allTiles = generateTiles(tileType.value);
        shuffleArray(allTiles);
        initialHand = allTiles.splice(0, 13);
        initialHand34 = convertToTiles34Arr(initialHand);
        tempTiles34 = [...initialHand34];
        tempTiles34[27] += 1; // 补一张字牌
        const shanten = calculateShanten(tempTiles34);

        if (shanten === 0 && getCorrectAnswer(initialHand).length !== 0) {
            const correctCount = getCorrectAnswer(initialHand).length;
            if (difficulty.value === 0) {
                // 对简单手牌（待牌数为1或2）的处理，降低其出现概率
                if (correctCount >= 1 && correctCount <= 2) {
                    validHand = Math.random() < 0.15; // 仅15%概率接受简单手牌
                } else {
                    validHand = true;
                }
            }
            if (difficulty.value === 1 && getCorrectAnswer(initialHand).length >= 1 && getCorrectAnswer(initialHand).length <= 2) {
                validHand = true;
            }
            if (difficulty.value === 2 && getCorrectAnswer(initialHand).length >= 3 && getCorrectAnswer(initialHand).length <= 4) {
                validHand = true;
            }
            if (difficulty.value === 3 && getCorrectAnswer(initialHand).length >= 5) {
                validHand = true;
            }
        }
    }

    handTiles.value = sortTiles(initialHand);
    tilesWall.value = allTiles;
    answer.value = [];
    isSubmitted.value = false;
    isCorrect.value = false;
};

// 答案选择
const handleAnswerChange = (tile) => {
    if (answer.value.includes(tile)) {
        answer.value = answer.value.filter((t) => t !== tile);
    } else {
        answer.value = [...answer.value, tile];
    }
};

// 检查答案
const checkAnswer = () => {
    if (isSubmitted.value) return;
    const correctTiles = getCorrectAnswer(handTiles.value);
    const isAnswerCorrect = correctTiles.every((tile) => answer.value.includes(tile)) && answer.value.every((tile) => correctTiles.includes(tile));

    totalAttempts.value += 1;
    if (isAnswerCorrect) correctAttempts.value += 1;

    isCorrect.value = isAnswerCorrect;
    isSubmitted.value = true;
};

// 难度和牌型变化
const handleDifficultyChange = (newDifficulty) => {
    difficulty.value = newDifficulty;
    correctAttempts.value = 0;
    totalAttempts.value = 0;
    initializeGame();
};

const handleTileTypeChange = (newType) => {
    tileType.value = newType;
    correctAttempts.value = 0;
    totalAttempts.value = 0;
    initializeGame();
};

// 可选牌型
const possibleTiles = computed(() => {
    return Array.from({ length: 9 }, (_, i) =>
        tileType.value === 'm'
            ? i === 4
                ? '5m'
                : `${i + 1}m`
            : tileType.value === 'p'
            ? i === 4
                ? '5p'
                : `${i + 1}p`
            : tileType.value === 's'
            ? i === 4
                ? '5s'
                : `${i + 1}s`
            : i === 4
            ? '5m'
            : `${i + 1}m`
    );
});

// 难度选项
const difficultyOptions = [
    { value: 0, label: '不限制', range: '任意' },
    { value: 1, label: '简单', range: '1 ~ 2' },
    { value: 2, label: '普通', range: '3 ~ 4' },
    { value: 3, label: '困难', range: '5 +' },
];

// 牌型选项
const tileTypes = [
    { value: 'm', label: '万子' },
    { value: 'p', label: '饼子' },
    { value: 's', label: '索子' },
];

// 初始化
onMounted(() => {
    initializeGame();
});
</script>

<style scoped>
</style>
