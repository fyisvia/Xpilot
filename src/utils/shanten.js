// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

// 原有常量
const TERMINAL_INDICES = [0, 8, 9, 17, 18, 26];
const HONOR_INDICES   = [27, 28, 29, 30, 31, 32, 33];

// 统一常量
const TILE_COUNT = 34;
const NUMERAL_COUNT = 27;
const HAND_MAX_TILES = 14;
const MAX_SHANTEN = 8;
const TERMINAL_HONOR_INDICES = [...TERMINAL_INDICES, ...HONOR_INDICES];

class Shanten {
    constructor() {
        this.AGARI_STATE = -1;

        // 运行期变量（每次计算前通过 _init 重置）
        this.tiles = [];                    // 当前 34 张牌的计数数组
        this.number_melds = 0;              // 面子数（顺子/刻子）
        this.number_tatsu = 0;              // 搭子数（两面/嵌张/边张候选，按本实现的定义）
        this.number_pairs = 0;              // 对子数
        this.number_jidahai = 0;            // 字牌相关（用于特殊修正）
        this.number_characters = 0;         // 数牌 0~26 中 4 张的位集（以及第 27 位用于综合标记）
        this.number_isolated_tiles = 0;     // 孤张位集（含第 27 位用于字牌整体标记）
        this.min_shanten = 0;               // 当前最小向听数
        this._workTiles = new Array(TILE_COUNT); // 复用的工作数组，避免频繁分配
    }

    // 统一对外入口
    // tiles34: 长度 34 的数组
    // useChiitoitsu / useKokushi：是否包含七对子与国士无双的计算
    calculateShanten(tiles34, useChiitoitsu = true, useKokushi = true) {
        // 优化：先算特殊形，若已和牌可跳过复杂递归
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
        // 一般形最后算（与原最终最小值一致）
        shantenResults.push(this.calculateShantenForRegularHand(tiles34));
        return Math.min(...shantenResults);
    }

    // 七对子向听：
    // 统计 >=2 的牌作为 pairs
    // uniquePairs 仅统计正好 2 张的不同对子
    // 特殊情形：4 个 x2 + 2 个 x3 -> 向听 1
    //           5 个 x2 + 1 个 x4 -> 向听 1
    // 达成条件：7 个不同的唯一对子（每种恰好 2 张） -> 和牌
    calculateShantenForChiitoitsuHand(tiles34) {
        // 单次循环统计，避免多次 filter
        let cnt2 = 0, cnt3 = 0, cnt4 = 0;
        for (let i = 0; i < TILE_COUNT; i++) {
            const c = tiles34[i];
            if (c === 2) cnt2++;
            else if (c === 3) cnt3++;
            else if (c === 4) cnt4++;
        }
        // 特殊情况保持原逻辑判定
        if (cnt2 === 4 && cnt3 === 2) return 1;
        if (cnt2 === 5 && cnt4 === 1) return 1;
        // 7 对必须全部是恰好 2 张
        if (cnt2 === 7) return this.AGARI_STATE;
        const pairs = cnt2 + cnt3 + cnt4; // >=2 的牌种数
        return 6 - pairs;
    }

    // 国士无双向听：
    // 统计 13 种幺九牌中出现的种类数 terminals
    // 若其中存在一个种类达到 >=2（即完成一对），则多减 1
    calculateShantenForKokushiHand(tiles34) {
        // 使用预合并数组 TERMINAL_HONOR_INDICES，避免每次展开
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

    // 一般形向听
    calculateShantenForRegularHand(tiles34) {
        // 复用缓冲数组，避免 [...tiles34]
        for (let i = 0; i < TILE_COUNT; i++) this._workTiles[i] = tiles34[i];
        this._init(this._workTiles);

        // 微优化：for 累加替代 reduce
        let countOfTiles = 0;
        for (let i = 0; i < TILE_COUNT; i++) countOfTiles += tiles34[i];
        if (countOfTiles > HAND_MAX_TILES) {
            throw new Error(`Too many tiles = ${countOfTiles}`);
        }

        // 处理字牌（风牌/三元牌）的面子、对子与孤张
        this._removeCharacterTiles(countOfTiles);

        // initMentsu：用于补足手牌不足 14 张时的“虚拟面子”占位
        const initMentsu = Math.floor((14 - countOfTiles) / 3);
        this._scan(initMentsu);

        return this.min_shanten;
    }

    // 初始化运行期变量
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

    // 预处理数牌的 4 张集合标记，并启动递归
    _scan(initMentsu) {
        this.number_characters = 0;
        for (let i = 0; i < NUMERAL_COUNT; i++) {
            this.number_characters |= (this.tiles[i] === 4) << i;
        }
        this.number_melds += initMentsu;
        this._run(0);
    }

    // 递归搜索
    _run(depth) {
        if (this.min_shanten === this.AGARI_STATE) return;
        while (depth < NUMERAL_COUNT && this.tiles[depth] === 0) depth++;
        if (depth >= NUMERAL_COUNT) return this._updateResult();

        const tiles = this.tiles;          // 局部缓存引用
        const i = depth % 9;
        const tc = tiles[depth];
        const t1 = tiles[depth + 1];
        const t2 = tiles[depth + 2];
        const t3 = tiles[depth + 3];

        // 4 张
        if (tc === 4) {
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

            // 两个顺子（如 3 3 3 与后面 4 4 / 5 5 等）情况
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
            // 特殊快速组合：1 1 X 且后续不为 4
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
    }

    // 依据当前统计更新最小向听
    _updateResult() {
        let retShanten = 8 - this.number_melds * 2 - this.number_tatsu - this.number_pairs;
        let nMentsuKouho = this.number_melds + this.number_tatsu;

        if (this.number_pairs) {
            nMentsuKouho += this.number_pairs - 1;
        } else if (this.number_characters && this.number_isolated_tiles) {
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

    // 以下为修改牌数组及计数的辅助函数
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
        // 修复：恢复孤张需清除位（原实现 |= 导致位无法回退）
        this.number_isolated_tiles &= ~(1 << k);
    }

    // 处理字牌(27~33)：统计面子 / 对子 / 孤张，并做相应位表示
    _removeCharacterTiles(nc) {
        let number = 0;
        let isolated = 0;

        for (let i = 27; i < 34; i++) {
            if (this.tiles[i] === 4) {
                this.number_melds += 1;
                this.number_jidahai += 1;
                number |= 1 << (i - 27);
                isolated |= 1 << (i - 27);
            }
            if (this.tiles[i] === 3) {
                this.number_melds += 1;
            }
            if (this.tiles[i] === 2) {
                this.number_pairs += 1;
            }
            if (this.tiles[i] === 1) {
                isolated |= 1 << (i - 27);
            }
        }

        // 调整国士/七对冲突时的字牌惩罚
        if (this.number_jidahai && nc % 3 === 2) {
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