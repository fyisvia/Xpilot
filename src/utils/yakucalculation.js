// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

class YakuList {
    /**
     * 断幺九（所有面子都不能包含幺九或字牌）
     * @param {Array<{type: string, tiles: string[]}>} hand
     * @returns {boolean}
     */
    checkTanyao(hand) {
        const yaochuuTiles = new Set([
            "1m",
            "9m",
            "1p",
            "9p",
            "1s",
            "9s",
            "1z",
            "2z",
            "3z",
            "4z",
            "5z",
            "6z",
            "7z",
        ]);
        return hand.every((item) => item.tiles.every((tile) => !yaochuuTiles.has(tile)));
    }

    /**
     * 场风东
     * @param {Array} hand
     * @param {"east"|"south"|"west"|"north"} roundWind
     * @returns {boolean}
     */
    checkRoundEast(hand, roundWind) {
        if (roundWind !== "east") return false;
        return hand.some(
            (item) => item.tiles.join("") === "1z1z1z" || item.tiles.join("") === "1z1z1z1z"
        );
    }

    /**
     * 场风南
     */
    checkRoundSouth(hand, roundWind) {
        if (roundWind !== "south") return false;
        return hand.some(
            (item) => item.tiles.join("") === "2z2z2z" || item.tiles.join("") === "2z2z2z2z"
        );
    }

    /**
     * 场风西
     */
    checkRoundWest(hand, roundWind) {
        if (roundWind !== "west") return false;
        return hand.some(
            (item) => item.tiles.join("") === "3z3z3z" || item.tiles.join("") === "3z3z3z3z"
        );
    }

    /**
     * 自风东
     */
    checkSeatEast(hand, seatWind) {
        if (seatWind !== "east") return false;
        return hand.some(
            (item) => item.tiles.join("") === "1z1z1z" || item.tiles.join("") === "1z1z1z1z"
        );
    }

    /**
     * 自风南
     */
    checkSeatSouth(hand, seatWind) {
        if (seatWind !== "south") return false;
        return hand.some(
            (item) => item.tiles.join("") === "2z2z2z" || item.tiles.join("") === "2z2z2z2z"
        );
    }

    /**
     * 自风西
     */
    checkSeatWest(hand, seatWind) {
        if (seatWind !== "west") return false;
        return hand.some(
            (item) => item.tiles.join("") === "3z3z3z" || item.tiles.join("") === "3z3z3z3z"
        );
    }

    /**
     * 自风北
     */
    checkSeatNorth(hand, seatWind) {
        if (seatWind !== "north") return false;
        return hand.some(
            (item) => item.tiles.join("") === "4z4z4z" || item.tiles.join("") === "4z4z4z4z"
        );
    }

    /**
     * 白
     */
    checkHaku(hand) {
        return hand.some(
            (item) => item.tiles.join("") === "5z5z5z" || item.tiles.join("") === "5z5z5z5z"
        );
    }

    /**
     * 发
     */
    checkHatsu(hand) {
        return hand.some(
            (item) => item.tiles.join("") === "6z6z6z" || item.tiles.join("") === "6z6z6z6z"
        );
    }

    /**
     * 中
     */
    checkChun(hand) {
        return hand.some(
            (item) => item.tiles.join("") === "7z7z7z" || item.tiles.join("") === "7z7z7z7z"
        );
    }

    /**
     * 门清自摸
     * @param {boolean} isMenzen
     * @param {boolean} isTsumo
     */
    checkMenzenTsumo(isMenzen, isTsumo) {
        return isMenzen && isTsumo;
    }

    /**
     * 平和（全顺子、两面听、雀头不能是场风/自风/三元）
     * @param {Array} hand
     * @param {"ryanmen-machi"|"shanpon"|"tanki-machi"|string} waitType
     * @param {"east"|"south"|"west"|"north"} roundWind
     * @param {"east"|"south"|"west"|"north"} seatWind
     */
    checkPinfu(hand, waitType, roundWind, seatWind) {
        const windMap = {
            east: "1z",
            south: "2z",
            west: "3z",
            north: "4z",
        };
        const honorTiles = ["5z", "6z", "7z"];

        // 必须全部是顺子或一对雀头
        const allMeldsValid = hand.every(
            (item) => item.type === "handshuntsu" || item.type === "handtoitsu"
        );

        // 必须是两面听
        const validWaitType = waitType === "ryanmen-machi";

        // 雀头不能是场风/自风/三元
        let validPair = false;
        hand
            .filter((item) => item.type === "handtoitsu")
            .forEach((item) => {
                const yakuMeld = [windMap[roundWind], windMap[seatWind], ...honorTiles];
                const tile = item.tiles[0];
                validPair = yakuMeld.includes(tile) ? false : true;
            });

        return allMeldsValid && validWaitType && validPair;
    }

    /**
     * 一杯口（门清时，含有两组完全相同的顺子）
     */
    checkIipeikou(hand, isMenzen) {
        if (!isMenzen) return false;
        const sequences = hand
            .filter((item) => item.type === "handshuntsu")
            .map((item) => item.tiles.slice().sort().join(","));
        const sequenceCount = new Map();
        sequences.forEach((seq) => {
            sequenceCount.set(seq, (sequenceCount.get(seq) || 0) + 1);
        });
        for (const count of sequenceCount.values()) {
            if (count >= 2) return true;
        }
        return false;
    }

    /**
     * 对对和（全部为刻子/杠子 + 雀头）
     */
    checkToitoi(hand) {
        return hand.every(
            (item) =>
                item.type === "handkouutsu" ||
                item.type === "pon" ||
                item.type === "ankan" ||
                item.type === "minkan" ||
                item.type === "handtoitsu"
        );
    }

    /**
     * 三暗刻（暗刻/暗杠合计为3。荣和双碰时，听牌那组不算暗刻）
     * @param {Array} hand
     * @param {"shanpon"|"ryanmen-machi"|"tanki-machi"|string} waitType
     * @param {boolean} isTsumo
     */
    checkSanankou(hand, waitType, isTsumo) {
        let ankouCount = hand.filter(
            (item) => item.type === "handkouutsu" || item.type === "ankan"
        ).length;

        if (waitType === "shanpon" && !isTsumo) {
            ankouCount = ankouCount - 1;
        }
        return ankouCount === 3;
    }

    /**
     * 三杠子（明杠/暗杠合计为3）
     */
    checkSankantsu(hand) {
        const kantsuCount = hand.filter(
            (item) => item.type === "minkan" || item.type === "ankan"
        ).length;
        return kantsuCount === 3;
    }

    /**
     * 三色同刻（同数字万/筒/索各一组刻子）
     */
    checkSanshokuDoko(hand) {
        const tripletMap = new Map();
        hand.forEach((item) => {
            if (
                item.type === "handkouutsu" ||
                item.type === "pon" ||
                item.type === "ankan" ||
                item.type === "minkan"
            ) {
                const numPart = item.tiles[0][0];
                const suit = item.tiles[0][1];
                if (!["m", "p", "s"].includes(suit)) return;
                if (!tripletMap.has(numPart)) tripletMap.set(numPart, new Set());
                tripletMap.get(numPart).add(suit);
            }
        });
        return Array.from(tripletMap.values()).some((suits) => suits.size === 3);
    }

    /**
     * 混老头（仅幺九与字牌组成，且必须包含字牌与数牌）
     */
    checkHonrouto(hand) {
        const honorTiles = ["1z", "2z", "3z", "4z", "5z", "6z", "7z"];
        const terminalTiles = ["1m", "9m", "1p", "9p", "1s", "9s"];
        const honorAndTerminalTiles = [...honorTiles, ...terminalTiles];

        const isHonorTile = (tile) => honorTiles.includes(tile);
        const isTerminalTile = (tile) => terminalTiles.includes(tile);

        const allMeldsContainOnlyHonorOrTerminal = hand.every((item) =>
            item.tiles.every((tile) => honorAndTerminalTiles.includes(tile))
        );

        const onlyAllowedTypes = hand.every((item) =>
            ["handkouutsu", "handtoitsu", "pon", "minkan", "ankan"].includes(item.type)
        );

        const hasHonorTileInAtLeastOneMeld = hand.some((item) =>
            item.tiles.some((tile) => isHonorTile(tile))
        );
        const hasTerminalTileInAtLeastOneMeld = hand.some((item) =>
            item.tiles.some((tile) => isTerminalTile(tile))
        );

        return (
            allMeldsContainOnlyHonorOrTerminal &&
            onlyAllowedTypes &&
            hasHonorTileInAtLeastOneMeld &&
            hasTerminalTileInAtLeastOneMeld
        );
    }

    /**
     * 小三元（两组三元牌刻子 + 一组三元牌雀头）
     */
    checkShouSangen(hand) {
        const dragonTiles = ["5z", "6z", "7z"];
        let dragonCount = { "5z": 0, "6z": 0, "7z": 0 };

        hand.forEach((item) => {
            if (
                item.type === "handkouutsu" ||
                item.type === "pon" ||
                item.type === "minkan" ||
                item.type === "ankan"
            ) {
                if (dragonTiles.includes(item.tiles[0])) {
                    dragonCount[item.tiles[0]]++;
                }
            } else if (item.type === "handtoitsu" && dragonTiles.includes(item.tiles[0])) {
                dragonCount[item.tiles[0]] += 0.5;
            }
        });

        const dragons = Object.values(dragonCount);
        return dragons.filter((count) => count >= 1).length === 2 && dragons.includes(0.5);
    }

    /**
     * 三色同顺（同数字顺子各一组覆盖万/筒/索三色）
     */
    checkSanshokuDoujun(hand) {
        const sequenceMap = new Map();
        hand.forEach((item) => {
            if (item.type === "handshuntsu" || item.type === "chii") {
                const numPart = item.tiles.map((tile) => tile[0]).join("");
                const suit = item.tiles[0][1];
                if (!["m", "p", "s"].includes(suit)) return;
                if (!sequenceMap.has(numPart)) sequenceMap.set(numPart, new Set());
                sequenceMap.get(numPart).add(suit);
            }
        });
        return Array.from(sequenceMap.values()).some((suits) => suits.size === 3);
    }

    /**
     * 一气通贯（同一花色的 123、456、789 各一组，顺子可来自吃或手内）
     */
    checkIttsu(hand) {
        const sequences = { m: [], p: [], s: [] };
        hand.forEach((meld) => {
            if (meld.type === "handshuntsu" || meld.type === "chii") {
                const suit = meld.tiles[0][1];
                sequences[suit].push(meld.tiles);
            }
        });

        const checkColor = (melds) => {
            const needed = [
                ["1", "2", "3"],
                ["4", "5", "6"],
                ["7", "8", "9"],
            ];
            const usedMelds = new Set();

            for (const group of needed) {
                const matchIndex = melds.findIndex(
                    (meld) =>
                        group.every((num) => meld.includes(num + meld[0][1])) &&
                        !usedMelds.has(meld)
                );
                if (matchIndex === -1) return false;
                usedMelds.add(melds[matchIndex]);
            }
            return true;
        };

        return checkColor(sequences.m) || checkColor(sequences.p) || checkColor(sequences.s);
    }

    /**
     * 混全带幺九（每组面子/雀头都必须含幺九，且至少有一组包含字牌，且至少有一组是顺子）
     */
    checkChanta(hand) {
        const yaojiuTiles = new Set([
            "1m",
            "9m",
            "1p",
            "9p",
            "1s",
            "9s",
            "1z",
            "2z",
            "3z",
            "4z",
            "5z",
            "6z",
            "7z",
        ]);
        const honorTiles = ["1z", "2z", "3z", "4z", "5z", "6z", "7z"];
        const isHonorTile = (tile) => honorTiles.includes(tile);

        let hasSequence = false;
        for (const item of hand) {
            const containsYaojiu = item.tiles.some((tile) => yaojiuTiles.has(tile));
            if (!containsYaojiu) return false;
            if (item.type === "handshuntsu" || item.type === "chii") hasSequence = true;
        }
        const hasHonorTileInAtLeastOneMeld = hand.some((item) =>
            item.tiles.some((tile) => isHonorTile(tile))
        );
        return hasSequence && hasHonorTileInAtLeastOneMeld;
    }

    /**
     * 混一色（包含字牌，且仅由一种数牌花色 + 字牌组成）
     */
    checkHonitsu(hand) {
        const suitSet = new Set();
        let hasHonorTile = false;
        for (const item of hand) {
            let containsHonor = false;
            for (const tile of item.tiles) {
                const suit = tile.at(-1);
                suitSet.add(suit);
                if (suit === "z") containsHonor = true;
            }
            if (containsHonor) hasHonorTile = true;
        }
        return suitSet.size === 2 && suitSet.has("z") && hasHonorTile;
    }

    /**
     * 纯全带幺九（每组面子/雀头都必须含幺九，且全部为数牌，至少有一组顺子）
     */
    checkJunchan(hand) {
        const yaojiuTiles = new Set(["1m", "9m", "1p", "9p", "1s", "9s"]);
        let hasSequence = false;
        for (const item of hand) {
            const containsYaojiu = item.tiles.some((tile) => yaojiuTiles.has(tile));
            if (!containsYaojiu) return false;
            if (item.type === "handshuntsu" || item.type === "chii") hasSequence = true;
        }
        return hasSequence;
    }

    /**
     * 两杯口（门清四顺子一雀头，且正好两组不同顺子各重复一次）
     */
    checkRyanpeikou(hand) {
        const melds = hand.filter((item) => item.type === "handshuntsu");
        const pair = hand.find((item) => item.type === "handtoitsu");
        if (melds.length !== 4 || !pair) return false;

        const meldStrings = melds.map((m) => m.tiles.sort().join(""));
        const countMap = {};
        for (const meld of meldStrings) {
            countMap[meld] = (countMap[meld] || 0) + 1;
        }
        return Object.values(countMap).filter((count) => count === 2).length === 2;
    }

    /**
     * 清一色（仅一种数牌花色，不能包含字牌）
     */
    checkChinitsu(hand) {
        const suitSet = new Set();
        for (const item of hand) {
            for (const tile of item.tiles) {
                const suit = tile.at(-1);
                if (suit === "z") return false;
                suitSet.add(suit);
            }
        }
        return suitSet.size === 1;
    }

    /**
     * 大三元（白/发/中三组刻子/杠子）
     */
    checkDaisangen(hand) {
        const daisangenSets = [
            "5z5z5z",
            "6z6z6z",
            "7z7z7z",
            "5z5z5z5z",
            "6z6z6z6z",
            "7z7z7z7z",
        ];
        const count = hand.filter((item) => daisangenSets.includes(item.tiles.join(""))).length;
        return count === 3;
    }

    /**
     * 小四喜（三组风牌刻子/杠子 + 一组风牌雀头）
     */
    checkShousuushii(hand) {
        const windSets = ["1z", "2z", "3z", "4z"];
        let windCount = 0;
        let headWind = null;

        hand.forEach((item) => {
            if (
                item.type === "handkouutsu" ||
                item.type === "pon" ||
                item.type === "minkan" ||
                item.type === "ankan"
            ) {
                const tile = item.tiles[0];
                if (windSets.includes(tile)) windCount++;
            }
            if (item.type === "handtoitsu") {
                headWind = item.tiles[0];
            }
        });

        return windCount === 3 && windSets.includes(headWind);
    }

    /**
     * 大四喜（四组风牌刻子/杠子）
     */
    checkDaisushi(hand) {
        const windSets = ["1z", "2z", "3z", "4z"];
        let windCount = 0;
        hand.forEach((item) => {
            if (
                item.type === "handkouutsu" ||
                item.type === "pon" ||
                item.type === "minkan" ||
                item.type === "ankan"
            ) {
                const tile = item.tiles[0];
                if (windSets.includes(tile)) windCount++;
            }
        });
        return windCount === 4;
    }

    /**
     * 字一色（全部为字牌）
     */
    checkTsuuiisou(hand) {
        const honorTiles = ["1z", "2z", "3z", "4z", "5z", "6z", "7z"];
        return hand.every((item) => item.tiles.every((tile) => honorTiles.includes(tile)));
    }

    /**
     * 绿一色（仅 2s/3s/4s/6s/8s 与 发（6z））
     */
    checkRyuuiisou(hand) {
        const greenTiles = ["2s", "3s", "4s", "6s", "8s", "6z"];
        return hand.every((item) => item.tiles.every((tile) => greenTiles.includes(tile)));
    }

    /**
     * 清老头（仅 1/9 数牌，不含字牌）
     */
    checkChinroutou(hand) {
        const chinroutouTiles = ["1m", "9m", "1p", "9p", "1s", "9s"];
        return hand.every((item) => item.tiles.every((tile) => chinroutouTiles.includes(tile)));
    }

    /**
     * 四暗刻（门清 + 自摸 + 四暗刻/暗杠）
     * 注：本实现保留原逻辑要求 waitType === "shanpon" 时自摸，属于既有业务设定。
     */
    checkSuuankou(hand, isMenzen, isTsumo, waitType) {
        if (!isMenzen) return false;
        if (!isTsumo) return false;
        if (waitType !== "shanpon") return false;
        const ankouCount = hand.filter(
            (item) => item.type === "handkouutsu" || item.type === "ankan"
        ).length;
        return ankouCount === 4;
    }

    /**
     * 四暗刻单骑（门清 + 单骑听 + 四暗刻/暗杠）
     */
    checkSuuankouTanki(hand, isMenzen, waitType) {
        if (!isMenzen) return false;
        if (waitType !== "tanki-machi") return false;
        const ankouCount = hand.filter(
            (item) => item.type === "handkouutsu" || item.type === "ankan"
        ).length;
        return ankouCount === 4;
    }

    /**
     * 九莲宝灯（门清 + 同一花色 + 九莲结构且非纯正形）
     * @param {Array} hand
     * @param {boolean} isMenzen
     * @param {number} winningMeldIndex 胡牌所在面子下标
     * @param {number} winningTileIndex 胡牌在该面子内的下标
     */
    checkChuurenPoutou(hand, isMenzen, winningMeldIndex, winningTileIndex) {
        if (!isMenzen) return false;

        const suitSet = new Set();
        for (const item of hand) {
            for (const tile of item.tiles) {
                const suit = tile.at(-1);
                if (suit === "z") return false;
                suitSet.add(suit);
            }
        }
        if (suitSet.size !== 1) return false;

        const allTiles = [];
        const allTilesExcludingWinningTile = [];
        hand.forEach((item, index) => {
            allTiles.push(...item.tiles);
            if (index === winningMeldIndex) {
                allTilesExcludingWinningTile.push(
                    ...item.tiles.filter((_, i) => i !== winningTileIndex)
                );
            } else {
                allTilesExcludingWinningTile.push(...item.tiles);
            }
        });

        const validDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

        // 是否符合九莲牌姿（含胡牌）
        const validHands = (() => {
            const digitCount = allTiles.reduce((count, tile) => {
                const digit = tile[0];
                if (validDigits.includes(digit)) {
                    count[digit] = (count[digit] || 0) + 1;
                } else {
                    return null;
                }
                return count;
            }, {});
            if (digitCount === null) return false;
            if ((digitCount["1"] || 0) < 3 || (digitCount["9"] || 0) < 3) return false;
            for (let i = 2; i <= 8; i++) {
                if ((digitCount[String(i)] || 0) < 1) return false;
            }
            return true;
        })();

        // 去掉胡牌是否为九面听（若仍为九莲即为纯正形，本函数需否定它）
        const validHandsExcludingWinningTile = (() => {
            const digitCount = allTilesExcludingWinningTile.reduce((count, tile) => {
                const digit = tile[0];
                if (validDigits.includes(digit)) {
                    count[digit] = (count[digit] || 0) + 1;
                } else {
                    return null;
                }
                return count;
            }, {});
            if (digitCount === null) return false;
            if ((digitCount["1"] || 0) !== 3 || (digitCount["9"] || 0) !== 3) return false;
            for (let i = 2; i <= 8; i++) {
                if ((digitCount[String(i)] || 0) !== 1) return false;
            }
            return true;
        })();

        return validHands && !validHandsExcludingWinningTile;
    }

    /**
     * 纯正九莲宝灯（门清 + 同一花色 + 九面听纯正形）
     */
    checkJunseiChuurenPoutou(hand, isMenzen, winningMeldIndex, winningTileIndex) {
        if (!isMenzen) return false;

        const suitSet = new Set();
        for (const item of hand) {
            for (const tile of item.tiles) {
                const suit = tile.at(-1);
                if (suit === "z") return false;
                suitSet.add(suit);
            }
        }
        if (suitSet.size !== 1) return false;

        const allTiles = [];
        const allTilesExcludingWinningTile = [];
        hand.forEach((item, index) => {
            allTiles.push(...item.tiles);
            if (index === winningMeldIndex) {
                allTilesExcludingWinningTile.push(
                    ...item.tiles.filter((_, i) => i !== winningTileIndex)
                );
            } else {
                allTilesExcludingWinningTile.push(...item.tiles);
            }
        });

        const validDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

        const validHands = (() => {
            const digitCount = allTiles.reduce((count, tile) => {
                const digit = tile[0];
                if (validDigits.includes(digit)) {
                    count[digit] = (count[digit] || 0) + 1;
                } else {
                    return null;
                }
                return count;
            }, {});
            if (digitCount === null) return false;
            if ((digitCount["1"] || 0) < 3 || (digitCount["9"] || 0) < 3) return false;
            for (let i = 2; i <= 8; i++) {
                if ((digitCount[String(i)] || 0) < 1) return false;
            }
            return true;
        })();

        const validHandsExcludingWinningTile = (() => {
            const digitCount = allTilesExcludingWinningTile.reduce((count, tile) => {
                const digit = tile[0];
                if (validDigits.includes(digit)) {
                    count[digit] = (count[digit] || 0) + 1;
                } else {
                    return null;
                }
                return count;
            }, {});
            if (digitCount === null) return false;
            if ((digitCount["1"] || 0) !== 3 || (digitCount["9"] || 0) !== 3) return false;
            for (let i = 2; i <= 8; i++) {
                if ((digitCount[String(i)] || 0) !== 1) return false;
            }
            return true;
        })();

        return validHands && validHandsExcludingWinningTile;
    }

    /**
     * 四杠子（明杠/暗杠合计为4）
     */
    checkSuukantsu(hand) {
        const kantsuCount = hand.filter(
            (item) => item.type === "minkan" || item.type === "ankan"
        ).length;
        return kantsuCount === 4;
    }
}

/**
 * 手牌分解器
 * 说明：
 * - 负责从 14 张（或被动传入的可分解数组）中找出所有可能的“面子+雀头”组合（不考虑吃碰杠来源，只看牌面）。
 * - 标准化赤宝牌：0m/0p/0s -> 5m/5p/5s。
 * - type:
 *   - handshuntsu: 手内顺子
 *   - handkouutsu: 手内刻子
 *   - handtoitsu:  雀头（对子）
 */
class HandDivider {
    constructor() {
        this.tileTypes = ["m", "p", "s", "z"];
    }

    /**
     * 标准化牌（将赤宝 0x 统一视作 5x）
     * @param {string} tile
     * @returns {string}
     */
    normalizeTile(tile) {
        const [num, type] = tile.split(/(\D)/);
        if (num === "0") return `5${type}`;
        return tile;
    }

    /**
     * 是否为刻子（三张完全相同）
     * @param {string[]} tiles
     */
    isTriplet(tiles) {
        return tiles[0] === tiles[1] && tiles[1] === tiles[2];
    }

    /**
     * 是否为顺子（同花色且数字连续）
     * @param {string[]} tiles
     */
    isSequence(tiles) {
        const [tile1, tile2, tile3] = tiles;
        const [num1, type1] = tile1.split(/(\D)/);
        const [num2, type2] = tile2.split(/(\D)/);
        const [num3, type3] = tile3.split(/(\D)/);
        return (
            type1 === type2 &&
            type2 === type3 &&
            parseInt(num1) + 1 === parseInt(num2) &&
            parseInt(num2) + 1 === parseInt(num3)
        );
    }

    /**
     * 是否为面子（刻子或顺子）
     * @param {string[]} tiles
     */
    isMeld(tiles) {
        return this.isTriplet(tiles) || this.isSequence(tiles);
    }

    /**
     * 递归查找所有面子组合（含雀头）
     * @param {string[]} hand 已标准化并排序的牌数组
     * @param {string[][]} currentMelds 当前累积的面子/雀头
     * @param {string[][][]} results 结果集合
     */
    findMelds(hand, currentMelds = [], results = []) {
        if (hand.length === 2) {
            if (hand[0] === hand[1]) {
                results.push([...currentMelds, hand]);
            }
            return;
        }

        for (let i = 0; i < hand.length - 2; i++) {
            for (let j = i + 1; j < hand.length - 1; j++) {
                for (let k = j + 1; k < hand.length; k++) {
                    const candidate = [hand[i], hand[j], hand[k]];

                    // 字牌只能做刻子：若三张字牌不相同，直接跳过
                    const isAllHonor = candidate.every((tile) => tile.endsWith("z"));
                    if (isAllHonor && new Set(candidate).size !== 1) continue;

                    if (this.isMeld(candidate)) {
                        const remaining = hand.filter(
                            (_, index) => index !== i && index !== j && index !== k
                        );
                        this.findMelds(remaining, [...currentMelds, candidate], results);
                    }
                }
            }
        }
    }

    /**
     * 主分解方法：返回所有可能的面子结构（不去重时会较多，故进行字符串级去重）
     * @param {string[]} hand 原始手牌（含 0m/0p/0s 时会自动标准化）
     * @returns {Array<{type: string, tiles: string[]}>[]} 分解后的所有可能组合
     */
    decomposeHand(hand) {
        const normalizedHand = hand.map((tile) => this.normalizeTile(tile)).sort();
        const results = [];
        this.findMelds(normalizedHand, [], results);

        const uniqueResults = Array.from(
            new Set(
                results.map((melds) =>
                    JSON.stringify({
                        melds: melds.sort(),
                    })
                )
            )
        ).map((jsonStr) => JSON.parse(jsonStr));

        const formattedResults = uniqueResults.map((result) => {
            return result.melds.map((meld) => ({ type: this.getMeldType(meld), tiles: meld }));
        });
        return formattedResults;
    }

    /**
     * 面子类型判定
     * @param {string[]} meld
     * @returns {"handkouutsu"|"handshuntsu"|"handtoitsu"|"unknowntype"}
     */
    getMeldType(meld) {
        if (meld.length === 3) {
            if (this.isTriplet(meld)) return "handkouutsu";
            if (this.isSequence(meld)) return "handshuntsu";
        }
        if (meld.length === 2) return "handtoitsu";
        return "unknowntype";
    }
}

export { YakuList, HandDivider };