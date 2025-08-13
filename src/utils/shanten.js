// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

/*
1. 正确性与精度：七对子公式修正；孤张位回退已正确；字牌相关逻辑增加注释。
2. 算法级：加入简单下界剪枝 + 局部记忆化（按花色 9 格窗口编码）。
3. 结构与清晰性：增加变量/函数注释，拆出下界/编码函数；风险逻辑注释。
4. 实现级微优化：使用 Uint8Array 复用工作数组；局部引用缓存；减少重复循环；跳过空花色。
*/

const TERMINAL_INDICES = [0, 8, 9, 17, 18, 26];
const HONOR_INDICES   = [27, 28, 29, 30, 31, 32, 33];

const TILE_COUNT = 34;
const NUMERAL_COUNT = 27;          // 数牌 (m/p/s) 范围 0~26
const HAND_MAX_TILES = 14;
const MAX_SHANTEN = 8;
const TERMINAL_HONOR_INDICES = [...TERMINAL_INDICES, ...HONOR_INDICES];

class Shanten {
    constructor() {
        this.AGARI_STATE = -1;

        // 运行期变量
        this.tiles = null;                // 指向工作副本
        this.number_melds = 0;
        this.number_tatsu = 0;
        this.number_pairs = 0;
        this.number_jidahai = 0;          // 字牌相关的“惩罚/补正”下界
        this.number_characters = 0;       // 数牌 0~26 的“4 张集合”位集 + 第 27 位为字牌覆盖标记
        this.number_isolated_tiles = 0;   // 孤张位集 + 第 27 位为存在任意字牌孤张标记
        this.min_shanten = 0;

        // 复用的 TypedArray 工作区
        this._workTiles = new Uint8Array(TILE_COUNT);

        // 记忆化表（按花色窗口编码）
        this._memo = null;
    }

    calculateShanten(tiles34, useChiitoitsu = true, useKokushi = true) {
        const shantenResults = [];

        if (useChiitoitsu) {
            const s = this.calculateShantenForChiitoitsuHand(tiles34);
            shantenResults.push(s);
            if (s === this.AGARI_STATE) return this.AGARI_STATE;
        }
        if (useKokushi) {
            const s = this.calculateShantenForKokushiHand(tiles34);
            shantenResults.push(s);
            if (s === this.AGARI_STATE) return this.AGARI_STATE;
        }

        shantenResults.push(this.calculateShantenForRegularHand(tiles34));
        return Math.min(...shantenResults);
    }

    // 七对子向听标准公式：
    // pairKinds = >=2 的牌种数
    // distinctKinds = 有牌的不同种类数
    // 若 pairKinds >=7 且 distinctKinds >=7 -> 和牌
    // shanten = 6 - pairKinds + max(0, 7 - distinctKinds)
    calculateShantenForChiitoitsuHand(tiles34) {
        let pairKinds = 0;
        let distinctKinds = 0;
        for (let i = 0; i < TILE_COUNT; i++) {
            const c = tiles34[i];
            if (c > 0) {
                distinctKinds++;
                if (c >= 2) pairKinds++;
            }
        }
        if (pairKinds >= 7 && distinctKinds >= 7) return this.AGARI_STATE;
        return 6 - pairKinds + Math.max(0, 7 - distinctKinds);
    }

    // 国士无双向听
    calculateShantenForKokushiHand(tiles34) {
        let terminals = 0;
        let hasPair = false;
        for (const i of TERMINAL_HONOR_INDICES) {
            const c = tiles34[i];
            if (c > 0) {
                terminals++;
                if (!hasPair && c >= 2) hasPair = true;
            }
        }
        return 13 - terminals - (hasPair ? 1 : 0);
    }

    calculateShantenForRegularHand(tiles34) {
        for (let i = 0; i < TILE_COUNT; i++) this._workTiles[i] = tiles34[i];
        this._init(this._workTiles);

        let countOfTiles = 0;
        for (let i = 0; i < TILE_COUNT; i++) countOfTiles += tiles34[i];
        if (countOfTiles > HAND_MAX_TILES) throw new Error(`Too many tiles = ${countOfTiles}`);

        this._removeCharacterTiles(countOfTiles);

        const initMentsu = Math.floor((14 - countOfTiles) / 3);
        this._scan(initMentsu);

        this._memo = null; // 释放引用
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
        this.min_shanten = MAX_SHANTEN;
    }

    _scan(initMentsu) {
        this.number_characters = 0;
        for (let i = 0; i < NUMERAL_COUNT; i++) {
            this.number_characters |= (this.tiles[i] === 4) << i;
        }
        this.number_melds += initMentsu;
        this._memo = new Map();
        this._run(0);
    }

    // 下界剪枝：估算剩余可以形成的最大增益，若无法优于当前最优则剪
    _canImproveLowerBound(depth) {
        let rem = 0;
        const tiles = this.tiles;
        for (let i = depth; i < NUMERAL_COUNT; i++) rem += tiles[i];
        if (rem === 0) return true;

        const needMentsu = Math.max(0, 4 - this.number_melds);
        const theoreticalNewMentsu = Math.min(needMentsu, Math.floor(rem / 3));
        const leftover = rem - theoreticalNewMentsu * 3;
        const needTatsu = Math.max(0, 4 - (this.number_melds + this.number_tatsu));
        const theoreticalNewTatsu = Math.min(needTatsu, Math.floor(leftover / 2) + (leftover % 2));

        // 估算最乐观向听
        let potentialMeldValue = (this.number_melds + theoreticalNewMentsu) * 2 +
            (this.number_tatsu + theoreticalNewTatsu) +
            this.number_pairs;

        // 对子可能转面子（减一的补偿）简单忽略与当前逻辑一致，偏乐观即可
        let optimisticShanten = 8 - potentialMeldValue;
        if (optimisticShanten < this.AGARI_STATE) optimisticShanten = this.AGARI_STATE;

        return optimisticShanten < this.min_shanten;
    }

    // 编码当前花色 9 格窗口（用于记忆化）
    _encodeSuitWindow(from) {
        const suitBase = Math.floor(from / 9) * 9;
        let key = 0;
        const tiles = this.tiles;
        for (let i = suitBase; i < suitBase + 9; i++) {
            key = key * 5 + tiles[i]; // 0~4
        }
        return key;
    }

    _run(depth) {
        if (this.min_shanten === this.AGARI_STATE) return;

        // 跳过空位
        while (depth < NUMERAL_COUNT && this.tiles[depth] === 0) depth++;
        if (depth >= NUMERAL_COUNT) return this._updateResult();

        // 剪枝
        if (!this._canImproveLowerBound(depth)) return;

        // 只在花色起点做记忆化（减少状态）
        const atSuitHead = depth % 9 === 0;
        let localKey = null;
        if (atSuitHead) {
            localKey = `${depth}|${this._encodeSuitWindow(depth)}|${this.number_melds},${this.number_tatsu},${this.number_pairs}`;
            const cached = this._memo.get(localKey);
            if (cached !== undefined && cached <= this.min_shanten) {
                return;
            }
        }

        const tiles = this.tiles;
        const i = depth % 9;
        const tc = tiles[depth];
        const t1 = tiles[depth + 1];
        const t2 = tiles[depth + 2];
        const t3 = tiles[depth + 3];

        // 4 张
        if (tc === 4) {
            // 刻子
            this._increaseSet(depth);
            if (i < 7 && t2) {
                if (t1) {
                    this._increaseSyuntsu(depth);
                    this._run(depth + 1);
                    this._decreaseSyuntsu(depth);
                }
                this._increaseTatsuSecond(depth);
                this._run(depth + 1);
                this._decreaseTatsuSecond(depth);
            }
            if (i < 8 && t1) {
                this._increaseTatsuFirst(depth);
                this._run(depth + 1);
                this._decreaseTatsuFirst(depth);
            }
            this._increaseIsolatedTile(depth);
            this._run(depth + 1);
            this._decreaseIsolatedTile(depth);
            this._decreaseSet(depth);

            // 两张当对子
            this._increasePair(depth);
            if (i < 7 && t2) {
                if (t1) {
                    this._increaseSyuntsu(depth);
                    this._run(depth);
                    this._decreaseSyuntsu(depth);
                }
                this._increaseTatsuSecond(depth);
                this._run(depth + 1);
                this._decreaseTatsuSecond(depth);
            }
            if (i < 8 && t1) {
                this._increaseTatsuFirst(depth);
                this._run(depth + 1);
                this._decreaseTatsuFirst(depth);
            }
            this._decreasePair(depth);
        }

        // 3 张
        if (tc === 3) {
            this._increaseSet(depth);
            this._run(depth + 1);
            this._decreaseSet(depth);

            this._increasePair(depth);
            if (i < 7 && t1 && t2) {
                this._increaseSyuntsu(depth);
                this._run(depth + 1);
                this._decreaseSyuntsu(depth);
            } else {
                if (i < 7 && t2) {
                    this._increaseTatsuSecond(depth);
                    this._run(depth + 1);
                    this._decreaseTatsuSecond(depth);
                }
                if (i < 8 && t1) {
                    this._increaseTatsuFirst(depth);
                    this._run(depth + 1);
                    this._decreaseTatsuFirst(depth);
                }
            }
            this._decreasePair(depth);

            if (i < 7 && tiles[depth + 2] >= 2 && tiles[depth + 1] >= 2) {
                this._increaseSyuntsu(depth);
                this._increaseSyuntsu(depth);
                this._run(depth);
                this._decreaseSyuntsu(depth);
                this._decreaseSyuntsu(depth);
            }
        }

        // 2 张
        if (tc === 2) {
            this._increasePair(depth);
            this._run(depth + 1);
            this._decreasePair(depth);
            if (i < 7 && t2 && t1) {
                this._increaseSyuntsu(depth);
                this._run(depth);
                this._decreaseSyuntsu(depth);
            }
        }

        // 1 张
        if (tc === 1) {
            if (i < 6 && t1 === 1 && t2 && t3 !== 4) {
                this._increaseSyuntsu(depth);
                this._run(depth + 2);
                this._decreaseSyuntsu(depth);
            } else {
                this._increaseIsolatedTile(depth);
                this._run(depth + 1);
                this._decreaseIsolatedTile(depth);

                if (i < 7 && t2) {
                    if (t1) {
                        this._increaseSyuntsu(depth);
                        this._run(depth + 1);
                        this._decreaseSyuntsu(depth);
                    }
                    this._increaseTatsuSecond(depth);
                    this._run(depth + 1);
                    this._decreaseTatsuSecond(depth);
                }
                if (i < 8 && t1) {
                    this._increaseTatsuFirst(depth);
                    this._run(depth + 1);
                    this._decreaseTatsuFirst(depth);
                }
            }
        }

        if (localKey) {
            // 记录当前 depth 起点状态下已取得的最优向听
            const prev = this._memo.get(localKey);
            if (prev === undefined || this.min_shanten < prev) {
                this._memo.set(localKey, this.min_shanten);
            }
        }
    }

    _updateResult() {
        let retShanten = 8 - this.number_melds * 2 - this.number_tatsu - this.number_pairs;
        let nMentsuKouho = this.number_melds + this.number_tatsu;

        // 至少选一个对子做雀头
        if (this.number_pairs) {
            nMentsuKouho += this.number_pairs - 1;
        } else if (this.number_characters && this.number_isolated_tiles) {
            // 原逻辑：全部孤张被“4 张集合”覆盖时补 1
            if ((this.number_characters | this.number_isolated_tiles) === this.number_characters) {
                retShanten += 1;
            }
        }

        if (nMentsuKouho > 4) {
            retShanten += nMentsuKouho - 4;
        }

        if (retShanten !== this.AGARI_STATE && retShanten < this.number_jidahai) {
            retShanten = this.number_jidahai;
        }

        if (retShanten < this.min_shanten) {
            this.min_shanten = retShanten;
        }
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
        this.tiles[k]     -= 1;
        this.tiles[k + 1] -= 1;
        this.tiles[k + 2] -= 1;
        this.number_melds += 1;
    }
    _decreaseSyuntsu(k) {
        this.tiles[k]     += 1;
        this.tiles[k + 1] += 1;
        this.tiles[k + 2] += 1;
        this.number_melds -= 1;
    }
    _increaseTatsuFirst(k) { // 相邻搭子 (k,k+1)
        this.tiles[k]     -= 1;
        this.tiles[k + 1] -= 1;
        this.number_tatsu += 1;
    }
    _decreaseTatsuFirst(k) {
        this.tiles[k]     += 1;
        this.tiles[k + 1] += 1;
        this.number_tatsu -= 1;
    }
    _increaseTatsuSecond(k) { // 跳张搭子 (k,k+2)
        this.tiles[k]     -= 1;
        this.tiles[k + 2] -= 1;
        this.number_tatsu += 1;
    }
    _decreaseTatsuSecond(k) {
        this.tiles[k]     += 1;
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

    // 处理字牌 27~33：
    // number_jidahai：存在 4 张字牌时 +1（后续在特定余数情况下减 1），用于向听下界修正
    // number / isolated：字牌局部位集合，若所有孤张都被“4 张集合”包含则设置数牌集合的第 27 位
    _removeCharacterTiles(totalCount) {
        let number = 0;
        let isolated = 0;

        for (let i = 27; i < 34; i++) {
            const c = this.tiles[i];
            if (c === 4) {
                this.number_melds += 1;
                this.number_jidahai += 1;
                number |= 1 << (i - 27);
                isolated |= 1 << (i - 27);
            } else if (c === 3) {
                this.number_melds += 1;
            } else if (c === 2) {
                this.number_pairs += 1;
            } else if (c === 1) {
                isolated |= 1 << (i - 27);
            }
        }

        // 依据原实现：当存在四张字牌集合且手牌张数 %3 ==2 时，减 1 以避免过度乐观
        if (this.number_jidahai && totalCount % 3 === 2) {
            this.number_jidahai -= 1;
        }

        if (isolated) {
            this.number_isolated_tiles |= 1 << 27;
            if ((number | isolated) === number) {
                this.number_characters |= 1 << 27;
            }
        }
    }
}

export { Shanten, TERMINAL_INDICES, HONOR_INDICES };
export default Shanten;