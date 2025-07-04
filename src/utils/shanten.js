// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

// Shanten计算模块

export const TERMINAL_INDICES = [0, 8, 9, 17, 18, 26]; // 终端牌索引（1,9万/筒/条）
export const HONOR_INDICES = [27, 28, 29, 30, 31, 32, 33]; // 字牌索引（东、南、西、北、白、发、中）

export class Shanten {
    constructor() {
        this.AGARI_STATE = -1; // 和牌状态，向听数为-1
        this.tiles = []; // 存储34种牌的计数（索引0-33）
        this.number_melds = 0; // 面子（刻子或顺子）数量
        this.number_tatsu = 0; // 搭子（两张可形成面子的组合）数量
        this.number_pairs = 0; // 对子数量
        this.number_jidahai = 0; // 字牌刻子数量
        this.number_characters = 0; // 字牌或四张牌的位标记
        this.number_isolated_tiles = 0; // 孤立牌的位标记
        this.min_shanten = 8; // 最小向听数，初始为最大值
    }

    // 计算向听数，返回普通、七对子、国士无双三种形式的最小值
    calculateShanten(tiles34, useChiitoitsu = true, useKokushi = true) {
        const results = [this.calculateShantenForRegularHand(tiles34)]; // 计算普通手牌向听数
        if (useChiitoitsu) results.push(this.calculateShantenForChiitoitsuHand(tiles34)); // 计算七对子向听数
        if (useKokushi) results.push(this.calculateShantenForKokushiHand(tiles34)); // 计算国士无双向听数
        return Math.min(...results); // 返回最小向听数
    }

    // 计算七对子向听数，逻辑与原始代码一致
    calculateShantenForChiitoitsuHand(tiles34) {
        let pairs = 0, uniquePairs = 0; // pairs: 对子总数，uniquePairs: 恰好两张的对子数
        for (let i = 0; i < tiles34.length; i++) {
            if (tiles34[i] >= 2) { // 检查每种牌是否至少有两张
                pairs++;
                if (tiles34[i] === 2) uniquePairs++;
            }
        }
        // 特殊情况：4双+2三张 或 5双+1四张，距离和牌差1
        if (tiles34.filter(x => x === 2).length === 4 && tiles34.filter(x => x === 3).length === 2) return 1;
        if (tiles34.filter(x => x === 2).length === 5 && tiles34.filter(x => x === 4).length === 1) return 1;
        // 7个双张且无三张/四张，直接和牌
        if (pairs === 7 && uniquePairs === 7) return this.AGARI_STATE;
        return 6 - pairs; // 七对子向听数 = 6 - 对子数
    }

    // 计算国士无双向听数，逻辑与原始代码一致
    calculateShantenForKokushiHand(tiles34) {
        const indices = [...TERMINAL_INDICES, ...HONOR_INDICES]; // 国士无双所需牌（幺九牌+字牌）
        let completedTerminals = 0, terminals = 0; // completedTerminals: 有两张以上的牌，terminals: 有至少一张的牌
        for (const i of indices) {
            if (tiles34[i] >= 2) completedTerminals++; // 统计至少两张的牌
            if (tiles34[i] !== 0) terminals++; // 统计至少一张的牌
        }
        return 13 - terminals - (completedTerminals ? 1 : 0); // 国士向听数 = 13 - 已有牌种 - (是否有对子 ? 1 : 0)
    }

    // 计算普通手牌向听数，优化了数组复制和初始化
    calculateShantenForRegularHand(tiles34) {
        this._init(tiles34); // 初始化手牌，减少复制开销
        const countOfTiles = this.tiles.reduce((sum, x) => sum + x, 0); // 计算总牌数
        if (countOfTiles > 14) throw new Error(`Too many tiles = ${countOfTiles}`); // 校验牌数
        this._removeCharacterTiles(countOfTiles); // 处理字牌
        const initMentsu = Math.floor((14 - countOfTiles) / 3); // 计算初始面子数（已叫牌）
        this.number_melds += initMentsu; // 更新面子数
        this._scan(); // 开始递归扫描
        return this.min_shanten; // 返回最小向听数
    }

    // 初始化手牌和计数器，优化为直接引用输入
    _init(tiles) {
        this.tiles = tiles; // 直接使用输入数组，避免复制
        this.number_melds = 0; // 重置面子数
        this.number_tatsu = 0; // 重置搭子数
        this.number_pairs = 0; // 重置对子数
        this.number_jidahai = 0; // 重置字牌刻子数
        this.number_characters = 0; // 重置字牌/四张牌标记
        this.number_isolated_tiles = 0; // 重置孤立牌标记
        this.min_shanten = 8; // 重置最小向听数
    }

    // 扫描手牌，标记四张牌并开始递归
    _scan() {
        this.number_characters = 0; // 重置四张牌标记
        for (let i = 0; i < 27; i++) { // 只处理数牌（0-26）
            if (this.tiles[i] === 4) this.number_characters |= 1 << i; // 标记四张牌
        }
        this._run(0); // 从索引0开始递归
    }

    // 递归处理数牌，尝试所有面子、搭子、孤立牌组合，优化了分支剪裁
    _run(depth) {
        if (this.min_shanten === this.AGARI_STATE) return; // 提前终止：已找到和牌状态
        // 计算当前向听数的下界，若无法优于最小值则终止
        const remainingTiles = this.tiles.slice(depth).reduce((sum, x) => sum + x, 0);
        const potentialMelds = Math.floor(remainingTiles / 3) + this.number_melds;
        const potentialShanten = 8 - potentialMelds * 2 - this.number_tatsu - this.number_pairs;
        if (potentialShanten >= this.min_shanten) return; // 剪裁无效分支

        while (depth < 27 && !this.tiles[depth]) depth++; // 跳过无牌的索引
        if (depth >= 27) { // 到达末尾，更新向听数
            this._updateResult();
            return;
        }

        let i = depth % 9; // 计算当前牌在花色中的位置（0-8）

        // 处理四张牌的情况
        if (this.tiles[depth] === 4) {
            this._increaseSet(depth); // 尝试组成刻子
            if (i < 7 && this.tiles[depth + 2]) { // 检查顺子或搭子（2间隔）
                if (this.tiles[depth + 1]) { // 检查顺子
                    this._increaseSyuntsu(depth);
                    this._run(depth + 1);
                    this._decreaseSyuntsu(depth);
                }
                this._increaseTatsuSecond(depth); // 尝试间隔搭子（如1-3）
                this._run(depth + 1);
                this._decreaseTatsuSecond(depth);
            }
            if (i < 8 && this.tiles[depth + 1]) { // 检查连续搭子（如1-2）
                this._increaseTatsuFirst(depth);
                this._run(depth + 1);
                this._decreaseTatsuFirst(depth);
            }
            this._increaseIsolatedTile(depth); // 尝试孤立牌
            this._run(depth + 1);
            this._decreaseIsolatedTile(depth);
            this._decreaseSet(depth); // 撤销刻子
            this._increasePair(depth); // 尝试组成对子
            if (i < 7 && this.tiles[depth + 2]) { // 再次检查顺子或搭子
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
            this._decreasePair(depth); // 撤销对子
        }

        // 处理三张牌的情况
        if (this.tiles[depth] === 3) {
            this._increaseSet(depth); // 尝试组成刻子
            this._run(depth + 1);
            this._decreaseSet(depth);
            this._increasePair(depth); // 尝试组成对子
            if (i < 7 && this.tiles[depth + 1] && this.tiles[depth + 2]) { // 检查顺子
                this._increaseSyuntsu(depth);
                this._run(depth + 1);
                this._decreaseSyuntsu(depth);
            } else {
                if (i < 7 && this.tiles[depth + 2]) { // 检查间隔搭子
                    this._increaseTatsuSecond(depth);
                    this._run(depth + 1);
                    this._decreaseTatsuSecond(depth);
                }
                if (i < 8 && this.tiles[depth + 1]) { // 检查连续搭子
                    this._increaseTatsuFirst(depth);
                    this._run(depth + 1);
                    this._decreaseTatsuFirst(depth);
                }
            }
            this._decreasePair(depth); // 撤销对子
            if (i < 7 && this.tiles[depth + 2] >= 2 && this.tiles[depth + 1] >= 2) { // 检查双顺子
                this._increaseSyuntsu(depth);
                this._increaseSyuntsu(depth);
                this._run(depth);
                this._decreaseSyuntsu(depth);
                this._decreaseSyuntsu(depth);
            }
        }

        // 处理两张牌的情况
        if (this.tiles[depth] === 2) {
            this._increasePair(depth); // 尝试组成对子
            this._run(depth + 1);
            this._decreasePair(depth);
            if (i < 7 && this.tiles[depth + 1] && this.tiles[depth + 2]) { // 检查顺子
                this._increaseSyuntsu(depth);
                this._run(depth);
                this._decreaseSyuntsu(depth);
            }
        }

        // 处理单张牌的情况
        if (this.tiles[depth] === 1) {
            if (i < 6 && this.tiles[depth + 1] === 1 && this.tiles[depth + 2] && this.tiles[depth + 3] !== 4) { // 检查特殊顺子
                this._increaseSyuntsu(depth);
                this._run(depth + 2);
                this._decreaseSyuntsu(depth);
            } else {
                this._increaseIsolatedTile(depth); // 尝试孤立牌
                this._run(depth + 1);
                this._decreaseIsolatedTile(depth);
                if (i < 7 && this.tiles[depth + 2]) { // 检查顺子或间隔搭子
                    if (this.tiles[depth + 1]) {
                        this._increaseSyuntsu(depth);
                        this._run(depth + 1);
                        this._decreaseSyuntsu(depth);
                    }
                    this._increaseTatsuSecond(depth);
                    this._run(depth + 1);
                    this._decreaseTatsuSecond(depth);
                }
                if (i < 8 && this.tiles[depth + 1]) { // 检查连续搭子
                    this._increaseTatsuFirst(depth);
                    this._run(depth + 1);
                    this._decreaseTatsuFirst(depth);
                }
            }
        }
    }

    // 更新当前组合的向听数，优化了计算逻辑
    _updateResult() {
        let retShanten = 8 - this.number_melds * 2 - this.number_tatsu - this.number_pairs; // 基础向听数
        let nMentsuKouho = this.number_melds + this.number_tatsu; // 面子候选数
        if (this.number_pairs) nMentsuKouho += this.number_pairs - 1; // 考虑对子作为候选
        else if (this.number_characters && this.number_isolated_tiles && (this.number_characters | this.number_isolated_tiles) === this.number_characters) {
            retShanten += 1; // 孤立牌与字牌重叠时调整
        }
        if (nMentsuKouho > 4) retShanten += nMentsuKouho - 4; // 面子候选超限调整
        if (retShanten !== this.AGARI_STATE && retShanten < this.number_jidahai) retShanten = this.number_jidahai; // 字牌刻子限制
        if (retShanten < this.min_shanten) this.min_shanten = retShanten; // 更新最小向听数
    }

    // 增加刻子（三张相同牌）
    _increaseSet(k) {
        this.tiles[k] -= 3;
        this.number_melds += 1;
    }

    // 撤销刻子
    _decreaseSet(k) {
        this.tiles[k] += 3;
        this.number_melds -= 1;
    }

    // 增加对子
    _increasePair(k) {
        this.tiles[k] -= 2;
        this.number_pairs += 1;
    }

    // 撤销对子
    _decreasePair(k) {
        this.tiles[k] += 2;
        this.number_pairs -= 1;
    }

    // 增加顺子（三张连续牌）
    _increaseSyuntsu(k) {
        this.tiles[k] -= 1;
        this.tiles[k + 1] -= 1;
        this.tiles[k + 2] -= 1;
        this.number_melds += 1;
    }

    // 撤销顺子
    _decreaseSyuntsu(k) {
        this.tiles[k] += 1;
        this.tiles[k + 1] += 1;
        this.tiles[k + 2] += 1;
        this.number_melds -= 1;
    }

    // 增加连续搭子（如1-2）
    _increaseTatsuFirst(k) {
        this.tiles[k] -= 1;
        this.tiles[k + 1] -= 1;
        this.number_tatsu += 1;
    }

    // 撤销连续搭子
    _decreaseTatsuFirst(k) {
        this.tiles[k] += 1;
        this.tiles[k + 1] += 1;
        this.number_tatsu -= 1;
    }

    // 增加间隔搭子（如1-3）
    _increaseTatsuSecond(k) {
        this.tiles[k] -= 1;
        this.tiles[k + 2] -= 1;
        this.number_tatsu += 1;
    }

    // 撤销间隔搭子
    _decreaseTatsuSecond(k) {
        this.tiles[k] += 1;
        this.tiles[k + 2] += 1;
        this.number_tatsu -= 1;
    }

    // 增加孤立牌，优化位操作
    _increaseIsolatedTile(k) {
        this.tiles[k] -= 1;
        this.number_isolated_tiles |= 1 << k;
    }

    // 撤销孤立牌，修正位操作
    _decreaseIsolatedTile(k) {
        this.tiles[k] += 1;
        this.number_isolated_tiles &= ~(1 << k);
    }

    // 处理字牌（索引27-33），优化了计数逻辑
    _removeCharacterTiles(nc) {
        let isolated = 0; // 合并number和isolated，减少临时变量
        for (let i = 27; i < 34; i++) {
            const count = this.tiles[i];
            if (count === 4) { // 四张字牌作为刻子
                this.number_melds += 1;
                this.number_jidahai += 1;
                isolated |= 1 << (i - 27);
                this.number_characters |= 1 << (i - 27); // 直接标记四张牌
            } else if (count === 3) { // 三张字牌作为刻子
                this.number_melds += 1;
            } else if (count === 2) { // 两张字牌作为对子
                this.number_pairs += 1;
            } else if (count === 1) { // 单张字牌作为孤立牌
                isolated |= 1 << (i - 27);
            }
        }
        if (this.number_jidahai && nc % 3 === 2) this.number_jidahai -= 1; // 调整字牌刻子计数
        if (isolated) {
            this.number_isolated_tiles |= 1 << 27; // 标记字牌区域有孤立牌
            if (this.number_characters && (this.number_characters | isolated) === this.number_characters) {
                this.number_characters |= 1 << 27; // 标记字牌区域特殊情况
            }
        }
    }
}