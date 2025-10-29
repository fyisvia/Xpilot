// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
        <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
            <div class="text-lg font-semibold">{{ t('navbar.items.basicTerms') }}</div>
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 h-2"></li>
        <li class="p-4 pb-2 opacity-100 tracking-wide">
            <div class="pl-4 flex items-center space-x-2">
                <span>{{ t('guide.disclaimer') }}</span>
            </div>
            <br>
            <div class="pl-4 flex items-center space-x-2">
                <span>作者：清醒红茶汉化组</span>
            </div>
            <div class="pl-4 flex items-center space-x-2">
                <span>{{ t('booksPage.contact', { email: 'contact@fyisvia.com' }) }}</span>
            </div>
        </li>

        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
        <li class="p-4 pb-2 opacity-100 tracking-wide">
            <div class="pl-4 flex items-center space-x-2">
                <label class="input items-center gap-2 sm:max-w-md">
                    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        stroke-width="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input
                    v-model.trim="keyword"
                    :placeholder="t('basicTerms.searchPlaceholder', '搜索术语或关键字…')"
                    class="grow"
                    type="search"
                    />
                </label>
            </div>
        </li>
        <li class="p-4 pb-2 opacity-100 tracking-wide divide-y divide-base-content/10">
            <template v-if="filteredTerms.length">
                <article
                v-for="term in filteredTerms"
                :key="term.id"
                class="p-4 sm:p-6 space-y-3"
                >
                <h2 class="text-sm sm:text-base">
                    {{ term.id }}. {{ term.title }}
                </h2>
                <p
                    v-for="(line, idx) in term.lines"
                    :key="`${term.id}-${idx}`"
                    class="text-xs sm:text-sm leading-relaxed text-base-content/80"
                >
                    {{ line }}
                </p>
                </article>
            </template>
            <div v-else class="p-8 text-center text-sm sm:text-base text-base-content/70">
                {{ t('basicTerms.noResult', '未找到匹配的内容') }}
            </div>
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    </ul>
  
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const keyword = ref('')

const terms = Object.freeze([
  { id: 1, title: '科学麻雀', lines: ['指使用构建数学模型，进行统计学分析等手段，提高每场对战的获胜（得到1或2位）概率，提高平均顺位的期望值的打麻将方法。本词典与对应译著讨论的打牌方式都属于科学麻雀范畴。'] },
  { id: 2, title: '牌山', lines: ['指牌堆，包括配牌完成后正常可摸到的牌69张，岭上牌4张，宝牌指示牌5张，里宝牌指示牌5张。'] },
  { id: 3, title: '王牌', lines: ['宝牌指示牌5张、里宝牌指示牌5张和岭上牌4张共称王牌。（当有人开杠，摸走一张岭上牌后，要把牌山的最后一张牌视为王牌，不能再摸，保持王牌永远是14张。）'] },
  { id: 4, title: '牌河', lines: ['各家打出的牌叫做各家的牌河。（※包括被其他家吃/碰之后的牌）'] },
  { id: 5, title: 'm', lines: ['man，万子。'] },
  { id: 6, title: 's', lines: ['sou，索子（条子）。'] },
  { id: 7, title: 'p', lines: ['pin，饼子（筒子）。'] },
  { id: 8, title: '面子、雀头', lines: ['标准和牌型共需要4副面子和一对雀头，面子分为刻子和顺子。刻子指三张相同，顺子指三张相连。'] },
  { id: 9, title: '切牌', lines: ['打出牌的行为。'] },
  { id: 10, title: '何切问题', lines: ['简称“何切”。在某种特定情况下应该打哪张牌的问题。'] },
  { id: 11, title: '舍牌', lines: ['牌河中打出的牌。'] },
  { id: 12, title: '荣和', lines: ['和别人的牌。与自摸区别。'] },
  { id: 13, title: '振听', lines: [
    '振听有以下三种情况：',
    '舍牌振听：我方进入听牌状态（立直与否均可）时，自己打出的牌（包括自己打出被别人吃、碰、杠的牌）中含有自己所听之牌的一种或几种。（※与具体打出所听之牌的时间无关。无论是刚听牌时发现此前打出的牌中含有所听之牌，还是听牌后将自摸牌打出，都算在这种情况之内。此外，已经自摸的牌不选择自摸而是加杠，并不会导致振听。）',
    '立直振听：宣告立直后，别人点炮，我方却没有荣和。',
    '临时振听（又名同巡振听）：进入听牌状态但未立直，此时别人点炮，我方却没有荣和（如果我方对这张点炮牌进行吃、碰、杠，则不会造成临时振听，但在打牌后很可能进入舍牌振听）（备注：若自己家听牌，别人打出的牌自家满足和牌型但是无役，也不能荣和。此时仍然进入振听状态）。',
    '处在振听状态者不能荣和，只能自摸。只有解除振听后才能恢复荣和权利。'
  ] },
  { id: 14, title: '亲家', lines: ['指庄家。亲家和牌时得点是子家的1.5倍，但被子家自摸时支付的点数是子家的2倍。'] },
  { id: 15, title: '中途流局', lines: ['在规则未特殊说明时，四风连打，九种九牌，四杠散了，四家立直，三家和了（雀魂没有三家和了的规则）会导致提前流局。'] },
  { id: 16, title: '九种九牌', lines: ['当一家在摸完第一张牌后，发现自己的牌中包含9种（9种而非9张）以上的幺九牌，并且之前没有人鸣牌（包括暗杠和拔北宝牌）时，可宣布九种九牌，此时立刻流局。'] },
  { id: 17, title: '拔北宝牌', lines: ['三人麻雀概念，在四人麻雀里不做讨论。'] },
  { id: 18, title: '四风连打', lines: ['在配牌结束后的第一巡，四家打出的第一张牌均为同一种风牌，且四家均没有鸣牌，则视为四风连打，立刻流局。'] },
  { id: 19, title: '四杠散了', lines: ['在对局过程中，若四家的杠牌总数达到4个，则视为四杠散了，开第四杠者摸岭上牌后，打出的牌没有放铳则流局。（四杠不能由同一家开出，若同一家开出四杠则继续进行牌局，而开出四杠家处于役满（四杠）听牌状态。此时其他家不能再开杠。）'] },
  { id: 20, title: '四家立直', lines: ['在对局过程中，若四家均宣布立直，且第四家宣布立直的宣言牌没有放铳，则视为四家立直，立刻流局。'] },
  { id: 21, title: '三家和了', lines: ['俗称一炮三响，一张铳牌同时被三家荣和。'] },
  { id: 22, title: '连庄', lines: ['在规则未特殊说明时（天凤和雀魂均遵守此规则），当亲家和牌或在流局时听牌可以连庄（中途流局不影响庄家连庄）。'] },
  { id: 23, title: '子家', lines: ['指闲家（平家）。'] },
  { id: 24, title: '本场', lines: ['在规则未特殊说明时（天凤和雀魂均遵守此规则），庄家连庄或该局流局（包括中途流局）时，本场数+1（不论庄家连庄与否，流局时本场数均+1），每1本场会使和牌时逆时针计算最靠近放铳的一家（东南西北顺序）和牌得点+300。例如，3本场时，，例如西家铳南家和北家各满贯，则南家得到8000点，而北家得到8900点。当仅子家和牌，庄家下庄的时候，本场数清零。'] },
  { id: 25, title: '番，符', lines: ['和牌大小由番和符决定，番由役种（包括宝牌）决定，符的计算较为复杂，在此不做赘述。'] },
  { id: 26, title: '满贯', lines: ['4番40符及以上、5番，叫做满贯。子家8000点，亲家12000点。'] },
  { id: 27, title: '跳满', lines: ['6、7番叫做跳满。子家12000点，亲家18000点。'] },
  { id: 28, title: '倍满', lines: ['8、9、10番叫做倍满。子家16000点，亲家24000点。'] },
  { id: 29, title: '三倍满', lines: ['11、12番叫做三倍满。子家24000点，亲家36000点。'] },
  { id: 30, title: '役满', lines: ['13番及以上的牌叫做役满（即四倍满）。子家32000点，亲家48000点。'] },
  { id: 31, title: '累计役满', lines: ['当和牌形并非役满形，但番数累计达到了13番及以上，叫做累计役满。（累计役满和役满不能重复计算。比如立直四暗刻宝牌14仅计算一倍役满。）'] },
  { id: 32, title: '自摸', lines: ['和自己摸上的牌。与荣和区别。'] },
  { id: 33, title: '鸣牌', lines: ['进行吃，碰，明杠的行为叫做鸣牌。'] },
  { id: 34, title: '食替', lines: ['手中有一个顺子时，拆除该顺子吃某张牌后，打出该顺子剩余的牌的行为。比如，456吃7打4，456吃4打4，456吃5打5，均称为食替。但是，123456吃7打1，则不算食替。'] },
  { id: 35, title: '门前', lines: ['即门前清，没有进行过鸣牌的情况。'] },
  { id: 36, title: '副露', lines: ['吃，碰，杠（广义上，副露包括明杠和暗杠）之后展示在外面的面子叫做副露。x副露指鸣牌x次，展示了x个面子。'] },
  { id: 37, title: '东风战', lines: ['指从东1局到东4局共1圈的麻雀对战形式。'] },
  { id: 38, title: '半庄战', lines: ['又名南风战，指从东1局到南4局共2圈的标准竞技麻雀对战形式。'] },
  { id: 39, title: '东场', lines: ['东1局到东4局称为东场。'] },
  { id: 40, title: '南场', lines: ['南1局到南4局称为南场。'] },
  { id: 41, title: 'AL', lines: ['All Last的缩写。一次对战的最后一局。东风战的东4局或南风战的南4局被称为AL。'] },
  { id: 42, title: '巡', lines: ['四家各打出一张牌，叫做一巡。在没人鸣牌的情况下，一局麻雀共进行17.5巡。'] },
  { id: 43, title: '早巡', lines: ['1-6巡叫做早巡。'] },
  { id: 44, title: '中巡', lines: ['7-12巡叫做中巡。'] },
  { id: 45, title: '晚巡', lines: ['13巡以后叫做晚巡。'] },
  { id: 46, title: '终巡', lines: ['最后一巡。'] },
  { id: 47, title: '搭子', lines: ['能够与第三张牌组成面子的两张牌，分为良型和愚型。'] },
  { id: 48, title: '浮牌', lines: ['独立的牌，没有和别的牌组成搭子。'] },
  { id: 49, title: '良型', lines: ['两面及三面以上且待牌数量超过8张的搭子或听牌型叫做良型，比如23听14，23456听147,7888听679等等。'] },
  { id: 50, title: '愚型', lines: ['坎张（又名嵌张，比如24听3），单骑（单钓雀头），边张（比如12听3），双碰（对碰）。（※双碰不是好的形状，但是总体和率略优于坎张）'] },
  { id: 51, title: '门断平', lines: ['门前清断幺平和，是常见的好牌。也会单独使用“门平”“门断”“断平”等词语。'] },
  { id: 52, title: '立平', lines: ['立直平和。参考上一条。'] },
  { id: 53, title: 'x枚现', lines: ['指场上能够见到x枚特定的牌（※包括手牌和牌河中的牌都算能见到）'] },
  { id: 54, title: 'NOMI', lines: ['“只有”的意思。比如“立直NOMI”，指和牌时役种只有立直。（※一发和里宝牌不算在NOMI里，因为是不可预知的）'] },
  { id: 55, title: 'DAMA', lines: ['默听。指门前状态下，保持听牌而不立直的行为。'] },
  { id: 56, title: 'DORA', lines: ['宝牌。DORAx指手牌中有x张宝牌。'] },
  { id: 57, title: '赤', lines: ['指赤DORA，红宝牌。赤5万，赤5索，赤5饼分别用0m，0p，0s表示。'] },
  { id: 58, title: '里', lines: ['指里DORA，里宝牌。'] },
  { id: 59, title: '先制立直', lines: ['先发制人地立直，指率先立直。'] },
  { id: 60, title: '追立直', lines: ['简称“追立”。已经有人立直之后，自己再去立直的对攻行为。'] },
  { id: 61, title: '和率', lines: ['和牌的概率。'] },
  { id: 62, title: '被自摸率', lines: ['别家自摸的概率。'] },
  { id: 63, title: '横移动率', lines: ['别家互相放铳的概率。'] },
  { id: 64, title: '待牌', lines: ['听的牌。x枚待指和的牌还剩x枚没有见到，可以自摸或被别人打出。'] },
  { id: 65, title: 'x向听', lines: ['还差x张牌就可以听牌。（※注意区别x向听和x面听，x面听指听牌种类有x种）'] },
  { id: 66, title: '偏听', lines: ['2面及多面听时，待牌中有部分牌满足和牌形但无役的听牌情况。'] },
  { id: 67, title: '高目、低目', lines: ['2面及多面听时，待牌中有部分和牌形式与其他的打点不同的情况。其中，打点高的和牌形式叫做高目，打点低的和牌形式叫做低目。'] },
  { id: 68, title: '后付', lines: ['在没有确定有役的时候就鸣牌，之后再和出有役的牌的行为。例如，手中存在23466s 57p 6789m 中中 的牌型的时候，先吃6p打9m，再和中的情况就叫做后付。'] },
  { id: 69, title: '打点', lines: ['和牌时获得的点数。又名和牌得点，和点。'] },
  { id: 70, title: '场均打点', lines: ['所有和牌平均的和牌获得点数（※并非终局时自己的总点数）'] },
  { id: 71, title: '靠张', lines: ['与某张数牌数字差距在2以内的牌叫做它的靠张。（例如4的靠张是2356）'] },
  { id: 72, title: '中张', lines: ['除了幺九牌之外的数牌叫做中张。即从2-8的m、s、p。（※并非只有456）'] },
  { id: 73, title: '外侧', lines: ['更接近幺九的一侧被叫做外侧。例如对于3来说，12是外侧。对于7来说，89是外侧。'] },
  { id: 74, title: '内侧', lines: ['更接近5的一侧被称为内侧。例如对于2来说，34就是内侧。'] },
  { id: 75, title: '壁', lines: ['当某张牌4枚现的时候，被称为壁。例如，如果2m可以见到四张，则1m不会被23m荣和，其安全度与字牌类似。如果3m可以见到四张，则12m的安全度均与字牌类似。'] },
  { id: 76, title: '完全壁', lines: ['简称“完壁”。4枚现的壁。'] },
  { id: 77, title: 'No Chance', lines: ['4枚壁的外侧牌不会被顺子的搭子荣和，这些牌叫做No Chance。'] },
  { id: 78, title: '3枚壁', lines: ['只见到3枚的牌叫做3枚壁。'] },
  { id: 79, title: 'One Chance', lines: ['3枚壁的外侧牌叫做One Chance。'] },
  { id: 80, title: '筋牌', lines: ['数目相差为3的牌。比如147,258,369。由于振听规则的存在，筋牌可以作为防守的依据。具体在此不做赘述。'] },
  { id: 81, title: '半筋', lines: ['当牌河中存在1时，4被称为半筋，以此类推。由于4可能被56和47，因此不能保证其安全性。'] },
  { id: 82, title: '远筋', lines: ['当牌河中存在1时，7被称为远筋，以此类推。由于7可能被56和47或89和7，因此不能保证其安全性。'] },
  { id: 83, title: '双筋', lines: ['当牌河中存在17时，4被称为双筋。'] },
  { id: 84, title: '有筋', lines: ['立直家的牌河中存在该张牌的筋牌。一般而言，半筋和远筋不能认为有筋，双筋则可以。'] },
  { id: 85, title: '无筋', lines: ['立直家的牌河中没有该张牌的筋牌。'] },
  { id: 86, title: '里筋', lines: ['与某张牌的相邻的牌及相邻牌的筋牌。（例如，5的里筋是14和69。）'] },
  { id: 87, title: '引挂', lines: ['骗筋。指你的牌河中有待牌的筋牌。'] },
  { id: 88, title: '前引挂', lines: ['立直之前打出待牌的筋。'] },
  { id: 89, title: '后引挂', lines: ['立直之后摸到待牌的筋并舍出。'] },
  { id: 90, title: '宣言牌引挂', lines: ['打出的立直宣言牌是待牌的筋。'] },
  { id: 91, title: '壁引挂', lines: ['待牌是壁的外侧牌的听牌形式。'] },
  { id: 92, title: '弃和', lines: ['放弃和牌，拆搭子和面子打出安全牌从而达到防守目的的手段。'] },
  { id: 93, title: '完全弃和', lines: ['以安全度为最优先打牌，完全不考虑和牌的弃和防守。'] },
  { id: 94, title: '兜牌', lines: ['一边打出比较安全的牌，一边朝着和牌前进，争取做到和牌的手段。'] },
  { id: 95, title: '生牌', lines: ['在牌河中从未出现过的牌，很有可能是危险牌。'] },
  { id: 96, title: '听靠张', lines: ['待牌是听牌时切出的牌的靠张。'] },
  { id: 97, title: '双靠张一向听', lines: ['手中有3副面子，1对雀头和2张浮牌的情况。例如，123 789m 55p 北北北 3 7s的情况。'] },
  { id: 98, title: '见逃', lines: ['指可以和牌时不选择和牌，原指对局中的失误，但从战术层面，可以是根据点棒、分数、顺位等情况做出的特殊战术选择。'] },
  { id: 99, title: '形听', lines: ['形式听牌，指已经进入听牌状态，但是没有役的情况。此种情况若想和牌，只能依靠海底、河底、岭上开花、门前清自摸、枪杠等方式。可利用形听避免流局罚符。'] },
  { id: 100, title: '电报', lines: ['指故意放铳，已达到某种目的，例如al自己4位，手上的牌肯定不足以支持逆转时，可以考虑电报庄家，以求在一本场获得翻盘的机会。'] },
  { id: 101, title: 'top', lines: ['顺位是一位的玩家。'] },
  { id: 102, title: '大top', lines: ['领先二位很多点数的top。'] },
  { id: 103, title: 'top率', lines: ['以top获胜的概率。'] },
  { id: 104, title: 'last', lines: ['顺位是四位的玩家。'] },
  { id: 105, title: 'last率', lines: ['以四位结束游戏的概率。'] },
  { id: 106, title: '吃四', lines: ['以last结束游戏的俗称。'] },
  { id: 107, title: '马点', lines: ['又名顺位马，终局时根据顺位计入总成绩的点数。一般而言，在四人麻将中，一位至四位的顺位马分别为+15,+5,-5,-15。顺位马的存在是为了强化日麻对于顺位的重视。'] },
  { id: 108, title: '现物', lines: ['防守术语，指危险家（通常是立直家）牌河前面所打出的牌，因为振听规则，这些牌被打出不会被荣和。因此防守时打出现物是绝对安全的。'] },
  { id: 109, title: '完全一向听', lines: ['两个好型带对碰的一向听。例如123456s 556p 56m 西西 的一向听，摸进47p、47m或是5p和西的对碰均可以听牌，这种一向听称为完全一向听。'] }
])

const filteredTerms = computed(() => {
  if (!keyword.value) return terms
  const kw = keyword.value.toLowerCase()
  return terms.filter(term => {
    if (term.title.toLowerCase().includes(kw)) return true
    return term.lines.some(line => line.toLowerCase().includes(kw))
  })
})
</script>
