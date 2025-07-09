// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

// Shanten计算模块

export const TERMINAL_INDICES = [0, 8, 9, 17, 18, 26];
export const HONOR_INDICES = [27, 28, 29, 30, 31, 32, 33];

export class Shanten {
    constructor() {
        this.AGARI_STATE = -1; // 和牌状态的标志，向听数为-1表示已经和牌
        this.tiles = []; // 当前手牌的34种牌计数数组
        this.number_melds = 0; // 面子的数量（如刻子、顺子）
        this.number_tatsu = 0; // 搭子的数量（两张连续或间隔的牌）
        this.number_pairs = 0; // 对子的数量
        this.number_jidahai = 0; // 字牌的数量（用于国士无双的特殊处理）
        this.number_characters = 0; // 字牌的位掩码表示
        this.number_isolated_tiles = 0; // 孤张的位掩码表示
        this.min_shanten = 0; // 当前最小向听数
        this.cache = new Map(); // 记忆化缓存，用于优化递归计算
    }

    calculateShanten(tiles34, useChiitoitsu = true, useKokushi = true) {
        // 先计算特殊牌型，它们计算更快
        const results = [];
        
        if (useKokushi) results.push(this.calculateShantenForKokushiHand(tiles34)); // 计算国士无双的向听数
        if (useChiitoitsu) results.push(this.calculateShantenForChiitoitsuHand(tiles34)); // 计算七对子向听数
        
        // 如果特殊牌型已经是和牌状态，无需计算常规牌型
        if (!results.includes(this.AGARI_STATE)) {
            results.push(this.calculateShantenForRegularHand(tiles34)); // 计算常规牌型的向听数
        }
        
        return Math.min(...results); // 返回最小的向听数
    }

    calculateShantenForChiitoitsuHand(tiles34) {
        let pairs = 0, uniqueTiles = 0; // 对子的数量和不重复牌的数量
        
        // 遍历所有牌
        for (let i = 0; i < tiles34.length; i++) {
            if (tiles34[i] > 0) {
                uniqueTiles++; // 统计不重复的牌
                if (tiles34[i] >= 2) {
                    pairs++; // 统计对子数量
                }
            }
        }

        // 七对子特殊情况的判断
        if (uniqueTiles <= 7 && pairs === 7) return this.AGARI_STATE; // 如果已经是七对子和牌状态，返回-1
        
        // 优化：直接计算向听数，无需额外判断特殊情况
        return Math.max(6 - pairs, 7 - uniqueTiles);
    }

    calculateShantenForKokushiHand(tiles34) {
        const indices = [...TERMINAL_INDICES, ...HONOR_INDICES]; // 幺九牌和字牌的索引
        let uniqueTerminals = 0; // 不重复的幺九牌数量
        let hasPair = false; // 是否有对子
        
        // 遍历所有幺九牌和字牌
        for (const i of indices) {
            if (tiles34[i] > 0) {
                uniqueTerminals++; // 统计不重复的幺九牌
                if (tiles34[i] >= 2 && !hasPair) {
                    hasPair = true; // 如果有对子，标记为true
                }
            }
        }
        
        // 国士无双需要13种幺九牌，加1个对子
        return 13 - uniqueTerminals - (hasPair ? 1 : 0);
    }

    calculateShantenForRegularHand(tiles34) {
        tiles34 = [...tiles34]; // 复制数组，避免修改原始数据
        this._init(tiles34); // 初始化状态变量
        
        const countOfTiles = tiles34.reduce((sum, x) => sum + x, 0); // 计算手牌总数
        if (countOfTiles > 14) throw new Error(`Too many tiles = ${countOfTiles}`); // 如果手牌超过14张，抛出异常
        
        this._removeCharacterTiles(countOfTiles); // 处理字牌的特殊情况
        const initMentsu = Math.floor((14 - countOfTiles) / 3); // 计算初始面子数量
        
        this.cache.clear(); // 清空缓存
        this._scan(initMentsu); // 开始递归扫描
        return this.min_shanten; // 返回最小向听数
    }

    _init(tiles) {
        this.tiles = tiles; // 初始化手牌
        this.number_melds = 0; // 初始化面子数量
        this.number_tatsu = 0; // 初始化搭子数量
        this.number_pairs = 0; // 初始化对子数量
        this.number_jidahai = 0; // 初始化字牌数量
        this.number_characters = 0; // 初始化字牌位掩码
        this.number_isolated_tiles = 0; // 初始化孤张位掩码
        this.min_shanten = 8; // 初始化最小向听数为8（最大可能值）
    }

    _scan(initMentsu) {
        this.number_characters = 0; // 初始化字牌位掩码
        
        // 优化：仅检查数牌部分
        for (let i = 0; i < 27; i++) {
            if (this.tiles[i] === 4) {
                this.number_characters |= (1 << i); // 更新字牌位掩码
            }
        }
        
        this.number_melds += initMentsu; // 加上初始面子数量
        this._run(0); // 开始递归
    }

    _getCacheKey(depth) {
        // 创建一个唯一标识当前状态的键
        return `${depth}-${this.number_melds}-${this.number_tatsu}-${this.number_pairs}-${this.number_isolated_tiles}`;
    }

    _run(depth) {
        if (this.min_shanten === this.AGARI_STATE) return; // 如果已经和牌，提前终止
    
        const cacheKey = this._getCacheKey(depth); // 获取当前状态的缓存键
        if (this.cache.has(cacheKey)) return; // 如果状态已计算过，直接返回
    
        while (depth < 27 && !this.tiles[depth]) {
            depth++; // 跳过空牌
        }
        
        if (depth >= 27) {
            this._updateResult(); // 如果遍历完成，更新结果
            return;
        }
        
        const i = depth % 9; // 当前牌在其花色中的索引
    
        // 根据当前牌的数量执行不同逻辑
        if (this.tiles[depth] === 4) {
            this._handleFourTiles(depth, i);
        } else if (this.tiles[depth] === 3) {
            this._handleThreeTiles(depth, i);
        } else if (this.tiles[depth] === 2) {
            this._handleTwoTiles(depth, i);
        } else if (this.tiles[depth] === 1) {
            this._handleOneTile(depth, i);
        }
    
        this.cache.set(cacheKey, true); // 记录当前状态
    }
    
    // 优化：拆分_run方法为多个更小的方法，提高可读性和维护性
    _handleFourTiles(depth, i) {
        // 作为刻子使用一种情况
        this._increaseSet(depth);
        this._trySequencePatterns(depth, i);
        this._decreaseSet(depth);
        
        // 作为对子使用一种情况
        this._increasePair(depth);
        this._trySequencePatterns(depth, i);
        this._decreasePair(depth);
    }
    
    _handleThreeTiles(depth, i) {
        // 作为刻子
        this._increaseSet(depth);
        this._run(depth + 1);
        this._decreaseSet(depth);
        
        // 作为对子+单张
        this._increasePair(depth);
        this._trySequencePatterns(depth, i);
        this._decreasePair(depth);
        
        // 特殊情况：检查是否可以形成两个顺子
        if (i < 7 && this.tiles[depth + 1] >= 2 && this.tiles[depth + 2] >= 2) {
            this._increaseSyuntsu(depth);
            this._increaseSyuntsu(depth);
            this._run(depth);
            this._decreaseSyuntsu(depth);
            this._decreaseSyuntsu(depth);
        }
    }
    
    _handleTwoTiles(depth, i) {
        // 作为对子
        this._increasePair(depth);
        this._run(depth + 1);
        this._decreasePair(depth);
        
        // 尝试形成顺子
        if (i < 7 && this.tiles[depth + 1] > 0 && this.tiles[depth + 2] > 0) {
            this._increaseSyuntsu(depth);
            this._run(depth);
            this._decreaseSyuntsu(depth);
        }
    }
    
    _handleOneTile(depth, i) {
        // 优化：先检查是否可以形成顺子的特殊情况
        if (i < 6 && this.tiles[depth + 1] === 1 && this.tiles[depth + 2] > 0 && this.tiles[depth + 3] !== 4) {
            this._increaseSyuntsu(depth);
            this._run(depth + 2);
            this._decreaseSyuntsu(depth);
            return;
        }
        
        // 作为孤张
        this._increaseIsolatedTile(depth);
        this._run(depth + 1);
        this._decreaseIsolatedTile(depth);
        
        this._trySequencePatterns(depth, i);
    }
    
    // 优化：抽取共用的顺子相关尝试逻辑
    _trySequencePatterns(depth, i) {
        // 尝试形成顺子
        if (i < 7 && this.tiles[depth + 1] > 0 && this.tiles[depth + 2] > 0) {
            this._increaseSyuntsu(depth);
            this._run(depth + 1);
            this._decreaseSyuntsu(depth);
        } 
        // 尝试形成搭子(二间搭)
        else if (i < 7 && this.tiles[depth + 2] > 0) {
            this._increaseTatsuSecond(depth);
            this._run(depth + 1);
            this._decreaseTatsuSecond(depth);
        }
        
        // 尝试形成搭子(两连张)
        if (i < 8 && this.tiles[depth + 1] > 0) {
            this._increaseTatsuFirst(depth);
            this._run(depth + 1);
            this._decreaseTatsuFirst(depth);
        }
    }

    _updateResult() {
        // 优化：直接计算向听数
        let retShanten = 8 - this.number_melds * 2 - this.number_tatsu - this.number_pairs;
        
        // 计算完成面子和搭子的总数
        let nMentsuKouho = this.number_melds + this.number_tatsu;
        
        // 处理对子情况
        if (this.number_pairs) {
            nMentsuKouho += this.number_pairs - 1;
        } 
        // 处理字牌和孤张情况
        else if (this.number_characters && this.number_isolated_tiles) {
            if ((this.number_characters | this.number_isolated_tiles) === this.number_characters) {
                retShanten += 1;
            }
        }
        
        // 处理超过4组面子/搭子的情况
        if (nMentsuKouho > 4) {
            retShanten += nMentsuKouho - 4;
        }
        
        // 考虑打出牌的数量
        if (retShanten !== this.AGARI_STATE && retShanten < this.number_jidahai) {
            retShanten = this.number_jidahai;
        }
        
        // 更新最小向听数
        if (retShanten < this.min_shanten) {
            this.min_shanten = retShanten;
        }
    }

    // 辅助方法
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
        this.number_isolated_tiles &= ~(1 << k); 
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