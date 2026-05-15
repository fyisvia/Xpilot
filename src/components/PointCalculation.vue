// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-0 sm:px-8">
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
        <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
            {{ t('pointCalc.title') }}
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="flex items-center gap-2 pb-4">
                <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
                    <input type="checkbox" />
                    <div class="collapse-title opacity-80">{{ t('pointCalc.hint.title') }}</div>
                    <div class="collapse-content text-xs font-semibold opacity-60 mb-0">
                        {{ t('pointCalc.hint.l1') }}<br>
                        {{ t('pointCalc.hint.l2') }}<br>
                        {{ t('pointCalc.hint.l3') }}
                    </div>
                </div>
            </div>
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide flex justify-center">
            <div v-if="question">
                <div>
                    {{
                      t('pointCalc.question.summary', {
                        role: t(question.isDealer ? 'pointCalc.roles.dealer' : 'pointCalc.roles.nonDealer'),
                        win: t(question.isTsumo ? 'pointCalc.winTypes.tsumo' : 'pointCalc.winTypes.ron'),
                        han: question.han,
                        fu: question.fu,
                        honba: question.honba
                      })
                    }}
                </div>
            </div>
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide flex justify-center">
            <div v-if="question">
                <div v-if="question.isDealer && question.isTsumo" class="flex items-center gap-2">
                    <input
                        type="text"
                        v-model="userInput.dealer"
                        @input="handleInput('dealer', $event)"
                        class="input w-60 text-base py-2 px-3"
                        autocomplete="off"
                        @keyup.enter="checkAnswer"
                        :aria-label="t('pointCalc.aria.inputDealerAll')"
                        ref="inputDealer"
                    />
                    <span>{{ t('pointCalc.labels.pointsAll') }}</span>
                </div>
                <div v-else-if="question.isDealer && !question.isTsumo" class="flex items-center gap-2">
                    <input
                        type="text"
                        v-model="userInput.nonDealer"
                        @input="handleInput('nonDealer', $event)"
                        class="input w-60 text-base py-2 px-3"
                        autocomplete="off"
                        @keyup.enter="checkAnswer"
                        :aria-label="t('pointCalc.aria.inputDealerRon')"
                        ref="inputNonDealer"
                    />
                    <span>{{ t('pointCalc.labels.points') }}</span>
                </div>
                <div v-else-if="!question.isDealer && question.isTsumo" class="flex flex-wrap items-center gap-2 justify-center w-full">
                    <input
                        type="text"
                        v-model="userInput.nonDealer"
                        @input="handleInput('nonDealer', $event)"
                        class="input w-60 text-base py-2 px-3"
                        :placeholder="t('pointCalc.placeholders.nonDealer')"
                        autocomplete="off"
                        :aria-label="t('pointCalc.aria.inputNonDealerTsumoNonDealer')"
                        ref="inputNonDealer"
                        @keyup.enter="focusDealerInput"
                    />
                    <span>{{ t('pointCalc.labels.points') }}</span>
                    <div class="w-full"></div>
                    <input
                        type="text"
                        v-model="userInput.dealer"
                        @input="handleInput('dealer', $event)"
                        class="input w-60 text-base py-2 px-3"
                        :placeholder="t('pointCalc.placeholders.dealer')"
                        autocomplete="off"
                        @keyup.enter="checkAnswer"
                        :aria-label="t('pointCalc.aria.inputNonDealerTsumoDealer')"
                        ref="inputDealer"
                    />
                    <span>{{ t('pointCalc.labels.points') }}</span>
                </div>
                <div v-else class="flex items-center gap-2">
                    <input
                        type="text"
                        v-model="userInput.nonDealer"
                        @input="handleInput('nonDealer', $event)"
                        class="input w-60 text-base py-2 px-3"
                        autocomplete="off"
                        @keyup.enter="checkAnswer"
                        :aria-label="t('pointCalc.aria.inputNonDealerRon')"
                        ref="inputNonDealer"
                    />
                    <span>{{ t('pointCalc.labels.points') }}</span>
                </div>
            </div>
        </li>
        <li class="p-4 pb-2 opacity-100 tracking-wide">
            <div class="flex justify-between my-2.5 gap-4" v-if="question">
                <div class="flex items-center gap-2">
                    <input type="checkbox" v-model="isTable" class="toggle my-1" :aria-label="t('pointCalc.aria.showTable')" />
                    <span class="text-sm sm:text-base my-1 font-semibold">{{ t('pointCalc.labels.pointTable') }}</span>
                </div>
                <div class="flex-1 flex justify-center">
                    <button @click="checkAnswer" class="btn btn-sm text-sm sm:text-base px-4">{{ t('pointCalc.actions.submit') }}</button>
                </div>
                <button class="btn btn-sm text-sm sm:text-base px-4" @click="resetQuestion">{{ t('pointCalc.actions.next') }}</button>
            </div>
        </li>
        <div class="flex flex-col items-center justify-center max-w-full box-border">
            <div v-if="showResult" class="my-5 p-2.5 rounded-md text-center">
                <div :class="isCorrect ? 'badge badge-success' : 'badge badge-error'" class="inline-flex items-center gap-1 text-lg font-bold">
                    <!-- ...existing code icons... -->
                    {{ isCorrect ? t('pointCalc.result.correct') : t('pointCalc.result.wrong') }}
                </div>
                <div v-if="!isCorrect" class="flex items-center justify-center mt-2">
                    <div class="text-base opacity-80">{{ t('pointCalc.result.correctAnswer') }}</div>
                    <div v-if="question.isDealer && question.isTsumo" class="text-base opacity-80">{{ question.correctPoints.tsumo }} {{ t('pointCalc.labels.pointsAll') }}</div>
                    <div v-else-if="question.isDealer && !question.isTsumo" class="text-base opacity-80">{{ question.correctPoints.ron }} {{ t('pointCalc.labels.points') }}</div>
                    <div v-else-if="!question.isDealer && question.isTsumo" class="text-base opacity-80">{{ question.correctPoints.tsumo.nonDealer }} {{ t('pointCalc.labels.points') }} / {{ question.correctPoints.tsumo.dealer }} {{ t('pointCalc.labels.points') }}</div>
                    <div v-else class="text-base opacity-80">{{ question.correctPoints.ron }} {{ t('pointCalc.labels.points') }}</div>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-center my-4">
            <div v-if="isTable" class="mt-4">
                <img
                    v-if="theme === 'light'"
                    :src="PointTableJpg"
                    :alt="t('pointCalc.images.alt.tableLight')"
                    class="max-w-full rounded shadow"
                />
                <img
                    v-else
                    :src="PointTableBLJpg"
                    :alt="t('pointCalc.images.alt.tableDark')"
                    class="max-w-full rounded shadow"
                />
                <br><br>
            </div>
        </div>
    </ul>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import PointTableJpg from '/photos/PointsTable.jpg';
import PointTableBLJpg from '/photos/PointsTableBL.jpg';

const { t } = useI18n();

// 解析输入点数（支持 k/w 后缀及简写）
const parsePointInput = (str) => {
    if (!str) return 0;
    let s = String(str).trim().toUpperCase();
    if (!s) return 0;

    // 处理 W (万)
    if (s.includes('W')) {
        const parts = s.split('W');
        let val = parseFloat(parts[0]) * 10000;
        if (parts[1]) {
            const minorStr = parts[1];
            const minorVal = parseFloat(minorStr);
            if (!isNaN(minorVal)) {
                val += minorVal * (10000 / Math.pow(10, minorStr.length));
            }
        }
        return Math.round(val);
    }
    
    // 处理 K (千)
    if (s.includes('K')) {
        const parts = s.split('K');
        let val = parseFloat(parts[0]) * 1000;
        if (parts[1]) {
            const minorStr = parts[1];
            const minorVal = parseFloat(minorStr);
            if (!isNaN(minorVal)) {
                val += minorVal * (1000 / Math.pow(10, minorStr.length));
            }
        }
        return Math.round(val);
    }

    // 纯数字处理
    if (/^\d+$/.test(s)) {
        let val = parseInt(s, 10);
        // 1或2位数自动乘100
        if (s.length <= 2) {
            val *= 100;
        }
        return val;
    }
    
    return NaN;
};

// 输入过滤：只允许数字和字母
const handleInput = (field, event) => {
    const val = event.target.value;
    const sanitized = val.replace(/[^0-9a-zA-Z]/g, '');
    userInput.value[field] = sanitized;
    // 如果过滤导致值变化，手动更新 input 显示
    if (val !== sanitized) {
        event.target.value = sanitized;
    }
};

// 点数计算核心算法（加入本场加点）
const calculatePoints = (isDealer, isTsumo, han, fu, honba = 0) => {
    let basePoints;

    if (han >= 13) {
        basePoints = 8000;
    } else if (han >= 11) {
        basePoints = 6000;
    } else if (han >= 8) {
        basePoints = 4000;
    } else if (han >= 6) {
        basePoints = 3000;
    } else if (han >= 5) {
        basePoints = 2000;
    } else {
        let tempBasePoints = fu * Math.pow(2, han + 2);
        if (tempBasePoints >= 2000) {
            basePoints = 2000;
        } else {
            basePoints = tempBasePoints;
        }
    }

    if (isDealer) {
        if (isTsumo) {
            let points = Math.ceil((basePoints * 2) / 100) * 100;
            points += honba * 100; // 自摸 All 加本场*100
            return { tsumo: points, ron: null };
        } else {
            let points = Math.ceil((basePoints * 6) / 100) * 100;
            points += honba * 300; // 荣和加本场*300
            return { tsumo: null, ron: points };
        }
    } else {
        if (isTsumo) {
            let dealerPoints = Math.ceil((basePoints * 2) / 100) * 100;
            let nonDealerPoints = Math.ceil(basePoints / 100) * 100;
            dealerPoints += honba * 100;     // 自摸每家均加本场*100
            nonDealerPoints += honba * 100;
            return { tsumo: { dealer: dealerPoints, nonDealer: nonDealerPoints }, ron: null };
        } else {
            let points = Math.ceil((basePoints * 4) / 100) * 100;
            points += honba * 300; // 荣和加本场*300
            return { tsumo: null, ron: points };
        }
    }
};

// 生成本场数（30%为0，30%为1，20%为2，10%为3，10%为4-8随机）
const generateHonba = () => {
    const r = Math.random();
    if (r < 0.35) return 0;
    if (r < 0.7) return 1;
    if (r < 0.85) return 2;
    if (r < 0.9) return 3;
    return Math.floor(Math.random() * 5) + 4; // 4-8
};

// 符数加权随机：20/30/40 占 70%（各25%、25%、20%），50-110 共占 30%（均分）
const generateFu = () => {
    const r = Math.random();
    if (r < 0.3) return 20;
    if (r < 0.6) return 30;
    if (r < 0.8) return 40;
    // 剩余 30%：从 50,60,70,80,90,100,110 均匀选择
    const idx = Math.floor(Math.random() * 7); // 0..6
    return 50 + idx * 10;
};

// 随机题目生成
const generateQuestion = () => {
    let isDealer = Math.random() < 0.5;
    let isTsumo = Math.random() < 0.5;
    let isChiitoitsu = Math.random() < 0.1;
    let isMangan = Math.random() < 0.2;
    let han, fu;

    if (isChiitoitsu) {
        if (isTsumo) {
            if (isMangan) {
                han = Math.floor(Math.random() * 9) + 5;
            } else {
                han = Math.floor(Math.random() * 2) + 3;
            }
        } else {
            if (isMangan) {
                han = Math.floor(Math.random() * 9) + 5;
            } else {
                han = Math.floor(Math.random() * 3) + 2;
            }
        }
        fu = 25;
    } else {
        // 原先均匀 20~110 改为加权随机，降低 50 符及以上概率
        fu = generateFu();

        if (fu === 20) {
            isTsumo = true;
            if (isMangan) {
                han = Math.floor(Math.random() * 9) + 5;
            } else {
                han = Math.floor(Math.random() * 3) + 2;
            }
        } else if (fu === 30) {
            if (isMangan) {
                han = Math.floor(Math.random() * 4) + 1;
            } else {
                han = Math.floor(Math.random() * 4) + 1;
            }
        } else if (fu === 40 || fu === 50 || fu === 60) {
            if (isMangan) {
                han = Math.floor(Math.random() * 10) + 4;
            } else {
                han = Math.floor(Math.random() * 3) + 1;
            }
        } else if (fu === 70 || fu === 80 || fu === 90 || fu === 100) {
            if (isMangan) {
                han = Math.floor(Math.random() * 11) + 3;
            } else {
                han = Math.floor(Math.random() * 2) + 1;
            }
        } else if (fu === 110) {
            if (isTsumo) {
                if (isMangan) {
                    han = Math.floor(Math.random() * 11) + 3;
                } else {
                    han = 2;
                }
            } else {
                if (isMangan) {
                    han = Math.floor(Math.random() * 11) + 3;
                } else {
                    han = Math.floor(Math.random() * 2) + 1;
                }
            }
        } else {
            han = Math.floor(Math.random() * 13) + 1;
        }
    }

    const honba = generateHonba();
    const correctPoints = calculatePoints(isDealer, isTsumo, han, fu, honba);

    return {
        isDealer,
        isTsumo,
        han,
        fu,
        isChiitoitsu,
        honba,
        correctPoints,
    };
};

const question = ref(null);
const userInput = ref({ dealer: "", nonDealer: "" });
const isCorrect = ref(null);
const showResult = ref(false);
const isTable = ref(false);

// 输入框引用，用于自动聚焦与切换
const inputDealer = ref(null);
const inputNonDealer = ref(null);

// 监听主题变化
const getTheme = () => document.documentElement.getAttribute('data-theme') || 'light';
const theme = ref(getTheme());
let observer;
onMounted(() => {
  observer = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'attributes' && m.attributeName === 'data-theme')
        theme.value = getTheme();
    }
  });
  observer.observe(document.documentElement, { attributes: true });
  question.value = generateQuestion();
  // 进入页面后自动聚焦第一个输入框
  focusFirstInput();
});
onUnmounted(() => {
  observer.disconnect();
});

// 提交答案／下一题逻辑
const checkAnswer = () => {
    const { correctPoints } = question.value;
    const { dealer, nonDealer } = userInput.value;

    // 使用新的解析函数
    const dealerVal = parsePointInput(dealer);
    const nonDealerVal = parsePointInput(nonDealer);

    let isCorrectValue = false;

    if (question.value.isDealer) {
        if (question.value.isTsumo) {
            isCorrectValue = dealerVal === correctPoints.tsumo;
        } else {
            isCorrectValue = nonDealerVal === correctPoints.ron;
        }
    } else {
        if (question.value.isTsumo) {
            isCorrectValue = dealerVal === correctPoints.tsumo.dealer && nonDealerVal === correctPoints.tsumo.nonDealer;
        } else {
            isCorrectValue = nonDealerVal === correctPoints.ron;
        }
    }

    isCorrect.value = isCorrectValue;
    showResult.value = true;
};

// 回车从第一个输入框跳到第二个输入框（仅两输入场景用）
const focusDealerInput = () => {
  nextTick(() => {
    inputDealer.value?.focus();
  });
};

// 根据题目场景自动聚焦第一个需要输入的输入框
const focusFirstInput = () => {
  nextTick(() => {
    if (!question.value) return;
    const { isDealer: d, isTsumo: tsumo } = question.value;
    if (d && tsumo) {
      // 亲家自摸：只有一个输入（亲家全收）
      inputDealer.value?.focus();
    } else if (d && !tsumo) {
      // 亲家荣和：只有一个输入（他家支付）
      inputNonDealer.value?.focus();
    } else if (!d && tsumo) {
      // 子家自摸：第一个输入是他家（子家）的失点
      inputNonDealer.value?.focus();
    } else {
      // 子家荣和：只有一个输入（放铳家支付）
      inputNonDealer.value?.focus();
    }
  });
};

const resetQuestion = () => {
    question.value = generateQuestion();
    userInput.value = { dealer: "", nonDealer: "" };
    isCorrect.value = null;
    showResult.value = false;
    // 下一题后自动进入第一个输入框
    focusFirstInput();
};
</script>

