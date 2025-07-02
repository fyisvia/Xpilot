// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-0 sm:px-8">
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide flex justify-center">
            <div v-if="question">
                <div>
                    {{ question.isDealer ? "庄家" : "子家" }} {{ question.isTsumo ? "自摸" : "荣和" }} {{ question.han }} 番 {{ question.fu }} 符
                </div>
            </div>
        </li>
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide flex justify-center">
            <div v-if="question">
                <div v-if="question.isDealer && question.isTsumo" class="flex items-center gap-2">
                    <input
                        type="number"
                        v-model="userInput.dealer"
                        class="input w-60 text-base py-2 px-3"
                        autocomplete="off"
                        @keyup.enter="checkAnswer"
                    />
                    <span>点 All</span>
                </div>
                <div v-else-if="question.isDealer && !question.isTsumo" class="flex items-center gap-2">
                    <input
                        type="number"
                        v-model="userInput.nonDealer"
                        class="input w-60 text-base py-2 px-3"
                        autocomplete="off"
                        @keyup.enter="checkAnswer"
                    />
                    <span>点</span>
                </div>
                <div v-else-if="!question.isDealer && question.isTsumo" class="flex flex-wrap items-center gap-2 justify-center w-full">
                    <input
                        type="number"
                        v-model="userInput.nonDealer"
                        class="input w-60 text-base py-2 px-3"
                        placeholder="子家"
                        autocomplete="off"
                    />
                    <span>点</span>
                    <div class="w-full"></div>
                    <input
                        type="number"
                        v-model="userInput.dealer"
                        class="input w-60 text-base py-2 px-3"
                        placeholder="庄家"
                        autocomplete="off"
                        @keyup.enter="checkAnswer"
                    />
                    <span>点</span>
                </div>
                <div v-else class="flex items-center gap-2">
                    <input
                        type="number"
                        v-model="userInput.nonDealer"
                        class="input w-60 text-base py-2 px-3"
                        autocomplete="off"
                        @keyup.enter="checkAnswer"
                    />
                    <span>点</span>
                </div>
            </div>
        </li>
        <li class="p-4 pb-2 opacity-100 tracking-wide">
            <div class="flex justify-between my-2.5 gap-4" v-if="question">
                
                <div class="flex items-center gap-2">
                    <input type="checkbox" v-model="isTable" class="toggle my-1" />
                    <span class="text-sm sm:text-base my-1 font-semibold">点数表</span>
                </div>
                <div class="flex-1 flex justify-center">
                    <button @click="checkAnswer" class="btn btn-sm text-sm sm:text-base px-4">提交答案</button>
                </div>
                <button class="btn btn-sm text-sm sm:text-base px-4" @click="resetQuestion">下一題</button>
            </div>
        </li>
        <div class="flex flex-col items-center justify-center max-w-full box-border">
            <div v-if="showResult" class="my-5 p-2.5 rounded-md text-center">
                <div :class="isCorrect ? 'badge badge-success' : 'badge badge-error'" class="inline-flex items-center gap-1 text-lg font-bold">
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
                    <div v-if="question.isDealer && question.isTsumo" class="text-base opacity-80">{{ question.correctPoints.tsumo }} 点 All</div>
                    <div v-else-if="question.isDealer && !question.isTsumo" class="text-base opacity-80">{{ question.correctPoints.ron }} 点</div>
                    <div v-else-if="!question.isDealer && question.isTsumo" class="text-base opacity-80">{{ question.correctPoints.tsumo.nonDealer }} 点 / {{ question.correctPoints.tsumo.dealer }} 点</div>
                    <div v-else class="text-base opacity-80">{{ question.correctPoints.ron }} 点</div>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-center my-4">
            <div v-if="isTable" class="mt-4">
                <img
                    v-if="getTheme() === 'light'"
                    :src="PointTableJpg"
                    alt="点数表"
                    class="max-w-full rounded shadow"
                />
                <img
                    v-else
                    :src="PointTableBLJpg"
                    alt="点数表（暗色）"
                    class="max-w-full rounded shadow"
                />
                <br><br>
            </div>
        </div>
    </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PointTableJpg from '/photos/PointsTable.jpg';
import PointTableBLJpg from '/photos/PointsTableBL.jpg';

const calculatePoints = (isDealer, isTsumo, han, fu) => {
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
            const points = Math.ceil((basePoints * 2) / 100) * 100;
            return { tsumo: points, ron: null };
        } else {
            const points = Math.ceil((basePoints * 6) / 100) * 100;
            return { tsumo: null, ron: points };
        }
    } else {
        if (isTsumo) {
            const dealerPoints = Math.ceil((basePoints * 2) / 100) * 100;
            const nonDealerPoints = Math.ceil(basePoints / 100) * 100;
            return { tsumo: { dealer: dealerPoints, nonDealer: nonDealerPoints }, ron: null };
        } else {
            const points = Math.ceil((basePoints * 4) / 100) * 100;
            return { tsumo: null, ron: points };
        }
    }
};

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
        fu = Math.floor(Math.random() * 10) * 10 + 20;

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

    const correctPoints = calculatePoints(isDealer, isTsumo, han, fu);

    return {
        isDealer,
        isTsumo,
        han,
        fu,
        isChiitoitsu,
        correctPoints,
    };
};

const generatePointsTable = () => {
    const dealerTableRows = [];
    const nonDealerTableRows = [];
    const hanList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const fuList = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

    for (let han of hanList) {
        const dealerRow = [];
        const nonDealerRow = [];

        dealerRow.push({ main: `${han}番${han === 13 ? '+' : ''}`, sub: '', bgColor: 'bg-gray-200' });
        nonDealerRow.push({ main: `${han}番${han === 13 ? '+' : ''}`, sub: '', bgColor: 'bg-gray-200' });

        for (let fu of fuList) {
            const dealerPointsTsumo = calculatePoints(true, true, han, fu);
            const nonDealerPointsTsumo = calculatePoints(false, true, han, fu);
            const dealerPointsRon = calculatePoints(true, false, han, fu);
            const nonDealerPointsRon = calculatePoints(false, false, han, fu);

            const getBackgroundColor = (points) => {
                switch (points) {
                    case 4000: return "bg-[#BBFFEE]";
                    case 6000: return "bg-[#CCFF99]";
                    case 8000: return "bg-[#FFFFBB]";
                    case 12000: return "bg-[#FFDDAA]";
                    case 16000: return "bg-[#FFCCCC]";
                    default: return "bg-gray-200";
                }
            };

            if ((han === 1 && fu === 20) || (han === 1 && fu === 25)) {
                dealerRow.push({ main: '-', sub: '', bgColor: getBackgroundColor(dealerPointsTsumo.tsumo) });
                nonDealerRow.push({ main: '-', sub: '', bgColor: getBackgroundColor(dealerPointsTsumo.tsumo) });
            } else if (han === 1 && fu === 110) {
                dealerRow.push({ main: dealerPointsRon.ron, sub: '(-)', bgColor: getBackgroundColor(dealerPointsTsumo.tsumo) });
                nonDealerRow.push({ main: nonDealerPointsRon.ron, sub: '(-)', bgColor: getBackgroundColor(dealerPointsTsumo.tsumo) });
            } else if (han >= 2 && fu === 20) {
                dealerRow.push({ main: '-', sub: `(${dealerPointsTsumo.tsumo} ∀)`, bgColor: getBackgroundColor(dealerPointsTsumo.tsumo) });
                nonDealerRow.push({ main: '-', sub: `(${nonDealerPointsTsumo.tsumo.nonDealer} / ${nonDealerPointsTsumo.tsumo.dealer})`, bgColor: getBackgroundColor(dealerPointsTsumo.tsumo) });
            } else if (han === 2 && fu === 25) {
                dealerRow.push({ main: dealerPointsRon.ron, sub: '(-)', bgColor: getBackgroundColor(dealerPointsTsumo.tsumo) });
                nonDealerRow.push({ main: nonDealerPointsRon.ron, sub: '(-)', bgColor: getBackgroundColor(dealerPointsTsumo.tsumo) });
            } else {
                dealerRow.push({ main: dealerPointsRon.ron, sub: `(${dealerPointsTsumo.tsumo} ∀)`, bgColor: getBackgroundColor(dealerPointsTsumo.tsumo) });
                nonDealerRow.push({ main: nonDealerPointsRon.ron, sub: `(${nonDealerPointsTsumo.tsumo.nonDealer} / ${nonDealerPointsTsumo.tsumo.dealer})`, bgColor: getBackgroundColor(dealerPointsTsumo.tsumo) });
            }
        }

        dealerTableRows.push(dealerRow);
        nonDealerTableRows.push(nonDealerRow);
    }

    return { dealerTableRows, nonDealerTableRows };
};

const question = ref(null);
const userInput = ref({ dealer: "", nonDealer: "" });
const isCorrect = ref(null);
const showResult = ref(false);
const isTable = ref(false);
const { dealerTableRows, nonDealerTableRows } = generatePointsTable();

const getTheme = () => {
    return document.documentElement.getAttribute('data-theme') || 'light';
};

onMounted(() => {
    question.value = generateQuestion();
});

const checkAnswer = () => {
    const { correctPoints } = question.value;
    const { dealer, nonDealer } = userInput.value;

    let isCorrectValue = false;

    if (question.value.isDealer) {
        if (question.value.isTsumo) {
            isCorrectValue = parseInt(dealer) === correctPoints.tsumo;
        } else {
            isCorrectValue = parseInt(nonDealer) === correctPoints.ron;
        }
    } else {
        if (question.value.isTsumo) {
            isCorrectValue = parseInt(dealer) === correctPoints.tsumo.dealer && parseInt(nonDealer) === correctPoints.tsumo.nonDealer;
        } else {
            isCorrectValue = parseInt(nonDealer) === correctPoints.ron;
        }
    }

    isCorrect.value = isCorrectValue;
    showResult.value = true;
};

const resetQuestion = () => {
    question.value = generateQuestion();
    userInput.value = { dealer: "", nonDealer: "" };
    isCorrect.value = null;
    showResult.value = false;
};
</script>
