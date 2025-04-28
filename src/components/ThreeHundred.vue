// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// See the LICENSE file in the project root for full license information.

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-full px-2 sm:px-8">

    <li class="p-2 sm:p-4 pb-2 text-lg sm:text-xl md:text-2xl opacity-100 tracking-wide font-semibold">
      No. {{ currentArticle.id }}
    </li>

    <br>

    <li class="p-2 sm:p-4 pb-2 text-lg sm:text-xl md:text-2xl opacity-100 tracking-wide">
      <div class="flex flex-col items-start">
        <a class="mb-2">[ {{ currentArticle.round }} ]</a>
        <div class="flex flex-row space-x-0">
          <img
            v-for="img in currentArticle.images1"
            :src="img"
            alt=""
            class="flex-shrink-0 object-contain"
            :style="{
              width: `calc(100% / (${currentArticle.images2.length} + 1/3))`,
              height: `calc((100% / (${currentArticle.images2.length} + 1/3)) * 1.5)`
            }"
          >
        </div>
      </div>
    </li>

    <br>

    <li class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide">
      <div class="flex flex-nowrap justify-start" style="gap: 0;">
        <template v-for="(img, index) in currentArticle.images2">
          <img
            :src="img"
            alt=""
            class="flex-shrink-0 object-contain"
            :style="{
              width: `calc(100% / (${currentArticle.images2.length} + 1/3))`,
              height: `calc((100% / (${currentArticle.images2.length} + 1/3)) * 1.5)`,
              marginRight: index === currentArticle.images2.length - 2 ? `calc((100% / (${currentArticle.images2.length} + 1/3)) / 3)` : '0'
            }"
          >
        </template>
      </div>
    </li>

    <br><br>

    <li class="p-2 sm:p-4 pb-2 text-sm sm:text-base md:text-lg opacity-100 tracking-wide">
      <div class="flex items-center gap-2 pb-4">
        <div class="collapse collapse-arrow bg-base-100 border-base-300 border">
          <input type="checkbox" v-model="isAnswerCollapsed" />
          <div class="collapse-title text-lg sm:text-xl md:text-2xl font-semibold">参考答案及解析</div>
          <div class="collapse-content text-sm sm:text-base md:text-lg mb-0">
            <img
              :src="currentArticle.answerImg"
              alt=""
              class="flex-shrink-0 object-contain"
              :style="{
                width: `calc(200% / (${currentArticle.images2.length} + 1/3))`,
                height: `calc((200% / (${currentArticle.images2.length} + 1/3)) * 1.5)`
              }"
            >
            <br>
            <a class="opacity-100">解析:</a>
            <br>
            <!-- <div class="inline-flex flex-wrap items-center gap-1 text-justify" style="text-wrap: balance; word-break: keep-all;">
              <template v-for="part in currentArticle.number">
                <span v-if="!part.endsWith('.png')" class="opacity-100">{{ part }}</span>
                <img
                  v-else
                  :src="part"
                  alt=""
                  class="inline-block object-contain"
                  :style="{
                    width: `calc(1em * (${currentArticle.images2.length} / 10))`,
                    height: `calc(1.5em * (${currentArticle.images2.length} / 10))`
                  }"
                >
              </template>
            </div> -->
            <div class="inline-flex flex-wrap items-center gap-1 text-justify" style="text-wrap: balance; word-break: keep-all;">
              <template v-for="part in currentArticle.explanation">
                <span v-if="!part.endsWith('.png')" class="opacity-100">{{ part }}</span>
                <img
                  v-else
                  :src="part"
                  alt=""
                  class="inline-block object-contain"
                  :style="{
                    width: `calc(1em * (${currentArticle.images2.length} / 10))`,
                    height: `calc(1.5em * (${currentArticle.images2.length} / 10))`
                  }"
                >
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="list-row flex flex-col gap-2">
        <button class="btn text-sm sm:text-base bg-base-100" @click="handleSubmit">进张数分析</button>
      </div>
      <div class="overflow-x-auto" v-if="showResult">
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
    </li>

    <br>

    <li class="list-row flex flex-row justify-between items-center gap-2 w-full">
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        :disabled="currentIndex === 0"
        @click="prevArticle"
      >
        上一题
      </button>
      <div class="flex items-center gap-2">
        <input
          type="number"
          v-model="jumpToId"
          min="1"
          :max="articles.length"
          class="input input-bordered input-sm w-16 text-sm sm:text-base"
          placeholder="编号"
          @keyup.enter="jumpToArticle"
        >
        <button
          class="btn btn-sm text-sm sm:text-base px-4"
          @click="jumpToArticle"
        >
          跳转
        </button>
      </div>
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        :disabled="currentIndex === articles.length - 1"
        @click="nextArticle"
      >
        下一题
      </button>
    </li>
  </ul>
</template>

<script setup>
import { ref, computed } from 'vue'

// 引入图片简写
import m0 from '/mahjongfiles/0m.png'
import m1 from '/mahjongfiles/1m.png'
import m2 from '/mahjongfiles/2m.png'
import m3 from '/mahjongfiles/3m.png'
import m4 from '/mahjongfiles/4m.png'
import m5 from '/mahjongfiles/5m.png'
import m6 from '/mahjongfiles/6m.png'
import m7 from '/mahjongfiles/7m.png'
import m8 from '/mahjongfiles/8m.png'
import m9 from '/mahjongfiles/9m.png'

import p0 from '/mahjongfiles/0p.png'
import p1 from '/mahjongfiles/1p.png'
import p2 from '/mahjongfiles/2p.png'
import p3 from '/mahjongfiles/3p.png'
import p4 from '/mahjongfiles/4p.png'
import p5 from '/mahjongfiles/5p.png'
import p6 from '/mahjongfiles/6p.png'
import p7 from '/mahjongfiles/7p.png'
import p8 from '/mahjongfiles/8p.png'
import p9 from '/mahjongfiles/9p.png'

import s0 from '/mahjongfiles/0s.png'
import s1 from '/mahjongfiles/1s.png'
import s2 from '/mahjongfiles/2s.png'
import s3 from '/mahjongfiles/3s.png'
import s4 from '/mahjongfiles/4s.png'
import s5 from '/mahjongfiles/5s.png'
import s6 from '/mahjongfiles/6s.png'
import s7 from '/mahjongfiles/7s.png'
import s8 from '/mahjongfiles/8s.png'
import s9 from '/mahjongfiles/9s.png'

import z1 from '/mahjongfiles/1z.png'
import z2 from '/mahjongfiles/2z.png'
import z3 from '/mahjongfiles/3z.png'
import z4 from '/mahjongfiles/4z.png'
import z5 from '/mahjongfiles/5z.png'
import z6 from '/mahjongfiles/6z.png'
import z7 from '/mahjongfiles/7z.png'

import z0 from '/mahjongfiles/-1.png'

// 定义文章数据数组
const articles = ref([
  {
    id: 1,
    round: '东 1 局  西家   7 巡目',
    images1: [z0, z0, z2, z0, z0, z0, z0],
    images2: [p6, p7, p7, p8, s1, s1, s2, s2, s3, s4, s5, z7, z7, p0],
    answerImg: s2,
    explanation: [
      '这', '里', '要', '考', '虑', z7, z7, '对', '碰', '听', '牌', '的', '形', '状', '。',
      '虽', '然', '切', s1, '和', s2, '的', '进', '张', '枚', '数', '相', '同', '，',
      '但', '是', '在', '对', '碰', '听', '牌', '时', s1, s1, '、', z7, z7, '的', '对', '碰',
      '优', '于', s2, s2, '、', z7, z7, '的', '对', '碰', '，',
      '所', '以', '这', '里', '优', '先', '切', s2, '。'
    ]
  },
  {
    id: 2,
    round: '东 1 局  西家   7 巡目',
    images1: [z0, z0, z2, z0, z0, z0, z0],
    images2: [p6, p7, p7, p8, s1, s1, s2, s2, s3, s4, s5, z7, z7, p6],
    answerImg: s5,
    explanation: [
      '从', '进', '张', '数', '考', '虑', '，',
      '切', s5, '比', '切', s2, '少', '一', '枚', '进', '张', '，',
      '但', '这', '里', '七', '对', '一', '向', '听', '，',
      '且', '有', '两', '杯', '口', '的', '可', '能', '，',
      '要', '切', s5, '保', '留', '七', '对', '的', '听', '牌', '机', '会', '。'
    ]
  },
  {
    id: 3,
    round: '东 1 局  西家   7 巡目',
    images1: [z0, z0, z2, z0, z0, z0, z0],
    images2: [p6, p7, p7, p8, s1, s1, s2, s2, s3, s4, s5, z7, z7, p7],
    answerImg: p8,
    explanation: [
      '对', '子', '数', '量', '过', '多', '，', p6, p7, p7, p7, p8, '只', '需', '形', '成', '一', '搭', '牌', '即', '可', '。',
      '保', '留', p7, p7, p7, '则', '可', '以', '狙', '击', '三', '暗', '刻', '，',
      '同', '时', '切', p8, '来', '保', '留', p0, '的', '进', '张', '可', '能', '，',
      '重', '视', '手', '牌', '的', '防', '御', '性', '时', '则', '先', '切', p6, '。'
    ]
  },
  {
    id: 4,
    round: '东 1 局  东家   6 巡目',
    images1: [z0, z0, z2, z0, z0, z0, z0],
    images2: [m2, m3, m8, m8, p4, p5, p5, p6, p7, p9, s5, s5, s6, m1],
    answerImg: s5,
    explanation: [
      '饼', '子', '侧', '是', '有', p3, '、', p6, '、', p8, '三', '种', '进', '张', '的', 'DNA', '型', '，',
      '切', s5, '可', '以', '确', '定', '索', '子', '侧', '的', '两', '面', '好', '型', '，',
      '同', '时', '还', '能', '在', '听', '牌', '时', '确', '定', '平', '和', '。'
    ]
  },
  {
    id: 5,
    round: '东 1 局  东家   6 巡目',
    images1: [z0, z0, z2, z0, z0, z0, z0],
    images2: [m2, m3, m8, m8, p4, p5, p5, p6, p7, p9, s5, s5, s6, m4],
    answerImg: p9,
    explanation: [
      '虽', '然', '饼', '子', '侧', '是', '有', p3, '、', p6, '、', p8, '三', '种', '进', '张', '的', 'DNA', '型', '，',
      '但', '是', '比', '起', '平', '和', '，', '断', '幺', '可', '以', '副', '露', '，', '更', '加', '灵', '活', '。',
      '所', '以', '不', '应', '该', '确', '定', '平', '和', '，', '而', '是', '应', '该', '断', '幺', '。',
      '并', '且', '留', '下', s5, s5, '还', '可', '以', '狙', '击', s0, '。'
    ]
  },
  {
    id: 6,
    round: '东 1 局  东家   8 巡目',
    images1: [z0, z0, p2, z0, z0, z0, z0],
    images2: [m3, m3, m4, m5, m5, p6, p6, p8, s3, s4, s6, s6, s7, s5],
    answerImg: p8,
    explanation: [
      '切', p8, '则', '放', '弃', '了', p7, '的', '进', '张', '，',
      '切', s6, '确', '定', p6, '为', '雀', '头', '也', '放', '弃', '了', p7, '进', '张', '，',
      '并', '且', '损', '失', '了', p6, '、', s6, '的', '进', '张', '，',
      '所', '以', '切', p8, '的', '进', '张', '数', '大', '于', s6, '。',
      '切', s6, '的', '好', '处', '在', '于', '摸', '进', p7, '之', '后', '切', p6, '会', '变', '成', '无', '雀', '头', '型', '，',
      '一', '向', '听', '的', '枚', '数', '很', '高', '，',
      '但', '是', '自', '亲', '8', '巡', '的', '巡', '目', '下', '还', '是', '期', '望', '更', '快', '听', '牌', '，',
      '而', '不', '是', '一', '向', '听', '的', '改', '良', '（', '只', '有', p7, '）', '，',
      '所', '以', '这', '里', '切', p8, '。'
    ]
  },
  {
    id: 7,
    round: '东 1 局  东家   6 巡目',
    images1: [z0, z0, z2, z0, z0, z0, z0],
    images2: [m4, m4, m0, p1, p3, p4, p5, p5, p6, s3, s4, s7, s8, m6],
    answerImg: p1,
    explanation: [
      '好', '型', '两', '向', '没', '有', '雀', '头', '。',
      '切', p1, '损', '失', '摸', p1, '形', '成', p1, p1, '雀', '头', '的', '进', '张', '。',
      '切', m4, '损', '失', '摸', m4, '、', m7, '形', '成', m4, m4, '雀', '头', '的', '进', '张', '。',
      '切', p5, '损', '失', '摸', p4, '、', p7, '形', '成', '顺', '子', '和', '摸', p5, '形', '成', p5, p5, '雀', '头', '的', '进', '张', '。',
      '所', '以', '切', p1, '进', '张', '面', '最', '广', '（', '不', '损', p2, '的', '原', '因', '在', '于', '摸', '进', p2, '可', '以', '切', p6, '从', '而', '确', '定', p5, p5, '雀', '头', '）。'
    ]
  },
  {
    id: 8,
    round: '东 1 局  东家   6 巡目',
    images1: [z0, z0, s9, z0, z0, z0, z0],
    images2: [m1, m3, m5, p1, p1, p2, p4, p0, p6, p6, p7, s7, s8, s9],
    answerImg: p2,
    explanation: [
      '考', '虑', '最', '终', '听', '牌', '型', '，',
      '听', '在', '饼', '子', '侧', '（', '切', p2, '）', '为', '两', '面', '好', '型', '听', '牌', '，', '且', '有', '平', '和', '。',
      '听', '在', '万', '子', '侧', '（', '切', m5, '）', '为', '骗', m2, '的', '坎', '张', '听', '牌', '。',
      '保', '留', m1, m3, m5, '两', '坎', '型', '，', '能', '最', '大', '程', '度', '听', '牌', '到', '饼', '子', '侧', '。',
      '所', '以', '切', p2, '。'
    ]
  },
  {
    id: 9,
    round: '东 1 局  南家   6 巡目',
    images1: [z0, z0, z2, z0, z0, z0, z0],
    images2: [m1, m3, m5, p1, p2, p3, p9, p9, s1, s2, s3, s6, s6, s7],
    answerImg: m5,
    explanation: [
      '切', m5, '可', '以', '确', '定', m1, m2, m3, '的', '三', '色', '，',
      '切', s6, '的', '平', '和', '可', '能', '性', '更', '高', '，',
      '但', '是', '这', '里', '推', '荐', '切', m5, '来', '固', '定', '更', '高', '打', '点', '的', '三', '色', '。',
      '并', '且', '切', m5, '还', '可', '以', '骗', '筋', '，', '可', '以', '副', '露', '，', '相', '对', '来', '说', '更', '加', '灵', '活', '。'
    ]
  },
  {
    id: 10,
    round: '东 1 局  东家   7 巡目',
    images1: [z0, z0, m1, z0, z0, z0, z0],
    images2: [m4, m6, m9, m9, p1, p1, p3, p3, s3, s4, s5, s6, s7, m0],
    answerImg: p3,
    explanation: [
      '考', '虑', '最', '终', '听', '牌', '型', '，', '听', '到', '索', '子', '侧', '是', '最', '优', '的', '。',
      '但', '是', '如', '果', '索', '子', '侧', '先', '进', '张', '，', m9, m9, '，', p1, p1, '的', '对', '碰', '听', '牌', '强', '于', m9, m9, '，', p3, p3, '的', '对', '碰', '听', '牌', '，',
      '虽', '然', '保', '留', p3, p3, '有', '机', '会', '进', p4, '形', '成', '完', '全', '一', '向', '听', '，',
      '但', '是', '索', '子', '先', '成', '为', '面', '子', '的', '可', '能', '性', '更', '大', '，',
      '重', '视', '最', '终', '听', '牌', '型', '所', '以', '切', p3, '。'
    ]
  },
  {
    id: 11,
    round: '东 1 局  西家   7 巡目',
    images1: [z0, z0, s8, z0, z0, z0, z0],
    images2: [m1, m2, m3, m4, p5, p6, p7, p8, s1, s2, s2, s2, s3, s3],
    answerImg: m1,
    explanation: [
      '考', '虑', '最', '终', '听', '牌', '型', '和', '打', '点', '，',
      '切', s1, '时', '为', '立', '直', 'nomi', '或', '者', '立', '直', '断', '幺', '，',
      '切', s3, '时', '为', '立', '直', 'nomi', '或', '者', '立', '直', '平', '和', '，',
      '切', m1, '时', '为', '立', '直', '断', '幺', '或', '者', '立', '直', '平', '和', '并', '且', '有', '机', '会', '一', '杯', '口', '，',
      '切', p8, '时', '为', '立', '直', 'nomi', '或', '者', '立', '直', '平', '和', '。',
      '所', '以', '这', '里', '切', m1, '。'
    ]
  },
  {
    id: 12,
    round: '东 1 局  东家   5 巡目',
    images1: [z0, z0, p6, z0, z0, z0, z0],
    images2: [m5, m5, m7, m8, p3, p4, p6, p7, s2, s4, s6, s6, s8, m6],
    answerImg: s2,
    explanation: [
      '六', '个', '搭', '子', '，', '所', '以', '考', '虑', '拆', '一', '搭', '。',
      '有', '678', '三', '色', '，', '所', '以', '不', '切', s8, '。',
      '考', '虑', '万', '子', '侧', '的', '延', '伸', '，', s6, s6, '是', '候', '补', '雀', '头', '，', '所', '以', '不', '切', s6, '。',
      '饼', '子', '侧', p5, '虽', '然', '是', '二', '度', '受', '，', '但', '容', '易', '形', '成', '好', '型', '听', '牌', '，',
      '应', '该', '拆', '掉', '更', '差', '的', '坎', '张', '。',
      '所', '以', '这', '里', '综', '合', '考', '虑', '应', '该', '切', s2, '。'
    ]
  },
  {
    id: 13,
    round: '东 1 局  西家   4 巡目',
    images1: [z0, z0, z2, z0, z0, z0, z0],
    images2: [m6, m7, m8, p1, p2, p3, p3, p0, s1, s2, s3, s7, s8, p6],
    answerImg: p2,
    explanation: [
      '切', p3, '固', '定', '面', '子', '进', '张', '面', '最', '广', '，', '并', '且', '摸', '进', p6, '会', '舍', '弃', p0, '。',
      '切', p6, '不', '一', '定', '能', '留', '住', p0, '。',
      '而', '固', '定', p3, p3, '雀', '头', '可', '以', '确', '定', '好', '型', '听', '牌', '，', '并', '且', '能', '保', '留', p0, '。',
      'p1', '、', 'p2', '全', '舍', '的', '情', '况', '，', '先', '切', '相', '对', '更', '危', '险', '的', p2, '。'
    ]
  },
  {
    id: 14,
    round: '东 1 局  东家   7 巡目',
    images1: [z0, z0, m8, z0, z0, z0, z0],
    images2: [m2, m4, m8, m9, p6, p6, p6, p7, s3, s4, s7, s8, s9, m3],
    answerImg: m8,
    explanation: [
      '无', '雀', '头', '，', '要', '保', '留', p6, p6, p6, p7, '，', '拆', '掉', '最', '弱', '的', m8, m9, '搭', '子', '。',
      '宝', '牌', '是', m9, '，', '所', '以', '先', '切', m8, '，', '狙', '击', '宝', '牌', '雀', '头', '。'
    ]
  },
  {
    id: 15,
    round: '东 1 局  东家   6 巡目',
    images1: [z0, z0, m6, z0, z0, z0, z0],
    images2: [m2, m2, m0, p3, p4, p6, p6, s2, s2, s5, s6, s7, s8, m7],
    answerImg: s8,
    explanation: [
      '面', '子', '对', '子', '都', '超', '载', '，', '索', '子', '侧', '有', '延', '申', '，', '一', '般', '来', '说', '可', '以', '保', '留', '4', '连', '型', '等', '改', '良', '。',
      '但', '是', '由', '于', m0, '的', '存', '在', '，', '不', '太', '考', '虑', '放', '弃', m0, m7, '，',
      '并', '且', '索', '子', '侧', '的', '延', '申', '可', '能', '会', '失', '去', '断', '幺', '。',
      '所', '以', '不', '如', '直', '接', '切', s5, '或', s8, '确', '定', '断', '幺', '，',
      '而', '保', '留', s5, '有', '机', '会', '形', '成', s5, s6, s7, '的', '三', '色', '，', '所', '以', '切', s8, '。'
    ]
  },
  {
    id: 16,
    round: '东 1 局  东家   7 巡目',
    images1: [z0, z0, p2, z0, z0, z0, z0],
    images2: [m1, m3, m4, m5, m5, m6, p6, p7, s3, s0, s7, s8, s8, s9],
    answerImg: m1,
    explanation: [
      '切', m1, '或', s8, '由', '于', '没', '有', '固', '定', '雀', '头', '，', '进', '张', '枚', '数', '较', '多', '。',
      '这', '里', '切', m1, '之', '后', '摸', '进', m2, '完', '成', m5, m5, '雀', '头', '，', '向', '听', '数', '前', '进', '，', '所', '以', '不', '损', m2, '进', '张', '。',
      '切', s9, '固', '定', '雀', '头', '损', '失', '的', '进', '张', '过', '多', '，',
      '所', '以', '这', '里', '切', m1, '。'
    ]
  },
  {
    id: 17,
    round: '东 1 局  西家   7 巡目',
    images1: [z0, z0, p9, z0, z0, z0, z0],
    images2: [m1, m3, m5, m7, m8, m8, m9, p0, p6, p7, s5, s5, s6, m2],
    answerImg: m8,
    explanation: [
      '可', '以', '看', '成', m5, '，', m8, '，', s6, '的', '搭', '张', '一', '向', '听', '，',
      '其', '中', m8, '的', '搭', '张', '能', '力', '最', '弱', '，', '所', '以', '切', m8, '。',
      '摸', '进', m4, '，', m6, '还', '有', '一', '气', '的', '机', '会', '。'
    ]
  },
  {
    id: 18,
    round: '东 1 局  东家   5 巡目',
    images1: [z0, z0, m3, z0, z0, z0, z0],
    images2: [p2, p2, p3, p3, p5, p5, p6, p6, p8, s5, s6, s6, s7, p7],
    answerImg: p8,
    explanation: [
      '5', '个', '对', '子', '，', '七', '对', '一', '向', '听', '，',
      '切', p8, '可', '以', '保', '留', '面', '子', '手', '的', '一', '向', '听', '和', '七', '对', '的', '一', '向', '听', '，',
      '而', '且', '保', '留', '了', s5, s6, s6, s7, '形', '成', '两', '个', '面', '子', '的', '可', '能', '。'
    ]
  },
  {
    id: 19,
    round: '东 1 局  东家   8 巡目',
    images1: [z0, z0, m3, z0, z0, z0, z0],
    images2: [m4, m5, m5, m6, m6, m6, p3, p4, p4, p5, p6, p7, p7, p4],
    answerImg: p7,
    explanation: [
      '万', '子', '侧', '摸', '进', m3, m4, m5, m6, m7, '都', '可', '以', '完', '成', '两', '个', '面', '子', '，',
      '而', '饼', '子', '侧', p4, p7, '的', '筋', '张', '重', '复', '，', '所', '以', '切', p7, '。',
      '仔', '细', '分', '析', '进', '张', '，', '切', p7, '如', '果', '摸', '进', m2, '或', p1, '只', '能', '坎', '张', '听', '牌', '，',
      '如', '果', '注', '重', '听', '牌', '形', '状', '的', '话', '，', '切', m6, '也', '是', '一', '个', '好', '选', '择', '，',
      '还', '有', '一', '杯', '口', '的', '机', '会', '。'
    ]
  },
  {
    id: 20,
    round: '东 1 局  西家   7 巡目',
    images1: [z0, z0, s3, z0, z0, z0, z0],
    images2: [m4, m5, p6, p8, p9, p9, s1, s1, s2, s3, s4, s6, s7, p7],
    answerImg: p9,
    explanation: [
      '切', '掉', '一', '个', '对', '子', '可', '以', '确', '定', '平', '和', '，',
      '这', '里', '要', '保', '留', s1, s1, '的', '雀', '头', '，',
      '在', '摸', '进', '宝', '牌', '时', '再', '切', '出', '，', '从', '而', '形', '成', '宝', '牌', '雀', '头', '，',
      '所', '以', '这', '里', '切', p9, '。'
    ]
  },
  {
    id: 21,
    round: '东 1 局  东家   9 巡目',
    images1: [z0, z0, z4, z0, z0, z0, z0],
    images2: [m3, m4, m4, p3, p3, p4, p5, p6, p7, s5, s5, z1, z1, p4],
    answerImg: p7,
    explanation: [
      '面', '子', '手', '两', '向', '听', '，', '七', '对', '一', '向', '听', '。',
      '但', '考', '虑', '面', '子', '手', '，', '切', m3, '损', '失', m2, m5, '进', '张', '，',
      '切', p7, '只', '损', '失', p8, '进', '张', '，',
      '所', '以', '面', '子', '手', '方', '向', '切', p7, '损', '失', '进', '张', '最', '少', '，', '优', '于', m3, '。'
    ]
  },
  {
  id: 22,
    round: '东 1 局  东家   3 巡目',
    images1: [z0, z0, m1, z0, z0, z0, z0],
    images2: [m1, m2, m3, m7, p2, p2, p8, s3, s3, s4, s5, s7, s9, s9],
    answerImg: p8,
    explanation: [
      '面', '子', '候', '补', '不', '足', '，', '浮', '牌', '有', m7, '和', p8, '。',
      '考', '虑', '浮', '牌', '生', '成', '面', '子', '的', '能', '力', '，', '其', '中', p8, '弱', '于', m7, '，',
      '所', '以', p8, '是', '正', '解', '。'
    ]
  },
  {
  id: 23,
    round: '东 1 局  东家   7 巡目',
    images1: [z0, z0, s1, z0, z0, z0, z0],
    images2: [m3, m4, m0, m7, m7, p3, p4, p5, p6, s5, s5, s5, s7, m6],
    answerImg: s7,
    explanation: [
      '自', '亲', '宝', '牌', '一', '枚', '，', '三', '色', '不', '确', '，', '考', '虑', '进', '张', '数', '最', '大', '化', '切', s7, '。',
      '切', m7, '损', '失', '摸', m2, p2, p7, '的', '三', '面', '听', '，', '和', '摸', m7, '的', '五', '面', '听', '。',
      '切', s7, '只', '损', '失', '摸', s6, s7, '的', '三', '面', '听', '，',
      '切', s7, '多', '面', '听', '的', '概', '率', '也', '是', '最', '高', '的', '。'
    ]
  },
  {
  id: 24,
    round: '东 1 局  东家   7 巡目',
    images1: [z0, z0, s3, z0, z0, z0, z0],
    images2: [m3, m4, m6, m6, p4, p4, p5, p8, p9, s1, s3, z7, z7, m0],
    answerImg: p8,
    explanation: [
      '六', '搭', '拆', '一', '搭', '，', '没', '有', '浮', '牌', '。',
      '拆', '掉', '最', '弱', '的', '搭', '子', p8, p9, '，',
      '考', '虑', '到', '危', '险', '度', '，', '所', '以', '从', '内', '侧', '的', p8, '打', '起', '。'
    ]
  },
  {
  id: 25,
    round: '东 1 局  北家   7 巡目',
    images1: [z0, z0, p2, z0, z0, z0, z0],
    images2: [m2, m3, m4, p1, p1, p3, p3, p3, p4, p4, p5, s7, s7, s8],
    answerImg: s7,
    explanation: [
      '饼', '子', p3, p3, p3, p4, p4, p5, '复', '合', '型', '有', p2, p3, p4, p5, p6, '的', '进', '张', '，',
      '切', s7, '固', '定', '索', '子', '的', '两', '面', '，', '保', '留', '饼', '子', '侧', '的', '复', '合', '型', '进', '张', '，',
      '进', '张', '数', '是', '最', '多', '的', '，',
      '虽', '然', '摸', '到', p2, p5, '要', '切', '掉', '宝', '牌', p3, '，', '但', '是', '打', '点', '已', '经', '足', '够', '了', '。'
    ]
  },
  {
  id: 26,
    round: '东 1 局  东家   6 巡目',
    images1: [z0, z0, s2, z0, z0, z0, z0],
    images2: [m5, m5, m6, p6, p7, s3, s4, s5, s5, s6, s6, z2, z2, p8],
    answerImg: m5,
    explanation: [
      '想', '着', '摸', '红', m5, '听', '牌', '而', '打', s6, '的', '话', '，', '摸', '进', s3, '很', '难', '处', '理', '。',
      '打', m5, '之', '后', '摸', '到', '宝', '牌', '就', '可', '以', '拆', '掉', '南', '的', '对', '子', '，',
      '顺', '畅', '地', '转', '为', '断', '幺', '。'
    ]
  },
  {
  id: 27,
    round: '东 1 局  东家   7 巡目',
    images1: [z0, z0, z2, z0, z0, z0, z0],
    images2: [m3, m0, m5, m6, m7, m7, m7, p3, p4, p5, s5, s6, s6, m8],
    answerImg: s6,
    explanation: [
      '万', '子', '形', '状', '很', '复', '杂', '。',
      '摸', m6, '有', '一', '杯', '口', '，', '摸', m4, '有', '断', '幺', '，', '但', '两', '者', '都', '是', '坎', '张', '。',
      '这', '种', '时', '候', '的', '小', '窍', '门', '是', '留', '着', '杂', '乱', '的', '部', '分', '不', '动', '，',
      '把', '较', '强', '的', '部', '分', '弄', '清', '爽', '，',
    ]
  },
  {
  id: 28,
    round: '东 1 局  东家   7 巡目',
    images1: [z0, z0, p1, z0, z0, z0, z0],
    images2: [m9, m9, p2, p3, p4, p6, p8, s3, s0, s7, s7, z4, z4, z4],
    answerImg: s7,
    explanation: [
      '“', '门', '清', '为', '前', '提', '”', '的', '手', '牌', '。',
      '优', '先', '打', s7, '固', '定', '赤', p5, '。',
      '亲', '家', '一', '枚', '赤', '宝', '牌', '，', '愚', '型', '即', '立', '也', '可', '以', '。'
    ]
  },
  {
  id: 29,
    round: '东 1 局  西家  6 巡目',
    images1: [z0, z0, m1, z0, z0, z0, z0],
    images2: [m6, m6, m6, m7, m8, p3, p4, s3, s0, s7, s7, z7, z7, m9],
    answerImg: s3,
    explanation: [
      '比', '起', '打', s7, '固', '定', s0, '，', '更', '优', '先', '碰', '中', '或', '者', '成', '暗', '刻', '。',
      '在', '有', '祝', '仪', '的', '规', '则', '可', '能', '会', '比', '较', '抵', '触', '打', '掉', '赤', '牌', '，',
      '但', '同', '样', '是', '一', '番', '，', '速', '度', '完', '全', '不', '一', '样', '。',
      '饼', '子', '进', '张', '听', '牌', '的', '时', '候', '，', '基', '本', '都', '是', '打', '掉', s0, '听', '对', '碰', '。'
    ]
  },
  {
  id: 30,
    round: '东 1 局  东家  7 巡目',
    images1: [z0, z0, p1, z0, z0, z0, z0],
    images2: [p2, p3, p4, p6, p8, s1, s3, s7, s7, s7, z4, z4, z4, s0],
    answerImg: p8,
    explanation: [
      '单', '纯', '从', '进', '张', '面', '看', '，', '打', s1, '更', '广', '，',
      '但', '是', '打', s1, '摸', s3, '要', '打', '掉', s0, '。',
      '这', '样', '考', '虑', '的', '话', '，', '有', '效', '牌', '数', '量', '没', '差', '别', '。',
      '有', '效', '枚', '数', '一', '样', '的', '话', '，', '可', '以', '根', '据', '摸', s5, s6, '完', '成', '面', '子', '时', '的', '最', '终', '型', '来', '选', '择', '。',
      '比', '起', '坎', p7, '，', '坎', s2, '的', '最', '终', '型', '更', '加', '优', '秀', '，',
      '因', '此', '正', '解', '是', '打', p8, '。'
    ]
  },
  {
  id: 31,
    round: '东 1 局  西家  5 巡目',
    images1: [z0, z0, m2, z0, z0, z0, z0],
    images2: [m2, m3, m5, m5, p3, p3, p4, s3, s4, s5, s6, s8, s9, s4],
    answerImg: s9,
    explanation: [
      '索', '子', '可', '以', '看', '成', s2, s5, s7, '进', '张', '的', '两', '面', '坎', '张', '形', '，',
      '没', '有', s9, '也', '能', '用', '上', s7, '。',
      '这', '里', '瞄', '准', '三', '色', '。'
    ]
  },
  {
  id: 32,
    round: '东 1 局  东家  7 巡目',
    images1: [z0, z0, p8, z0, z0, z0, z0],
    images2: [m3, m4, m4, m4, p5, p6, p7, p8, p9, s6, s7, s9, s9, s9],
    answerImg: m3,
    explanation: [
      '亲', '家', '宝', '牌', '1', '。',
      '目', '标', '先', '制', '立', '直', '，', '选', '择', '进', '张', '最', '多', '的', '形', '状', '。',
      '虽', '然', '摸', '进', p8, '的', '时', '候', '要', '打', '掉', '宝', '牌', '，', '但', '是', '几', '率', '不', '高', '。'
    ]
  },
  {
  id: 33,
    round: '东 1 局  东家  7 巡目',
    images1: [z0, z0, p7, z0, z0, z0, z0],
    images2: [m3, m3, m5, p2, p3, p4, p7, p8, s5, s6, s7, s7, s7, m6],
    answerImg: m3,
    explanation: [
      '平', '和', '一', '向', '听', '，', '因', '此', '是', '拆', m3, '还', '是', s7, '对', '子', '的', '问', '题', '。',
      m5, m6, '或', p7, p8, '这', '两', '个', '未', '完', '成', '搭', '子', '摸', '成', '对', '的', '完', '全', '一', '向', '听', '时', '就', '有', '差', '别', '了', '。',
      '例', '如', '摸', '进', p8, '，', '打', s7, '的', '话', '增', '加', '了', m3, p8, '四', '枚', '有', '效', '牌', '，',
      '相', '对', '的', '，', '打', m3, '的', '话', '则', '增', '加', '了', s4, s7, p8, '共', '七', '枚', '有', '效', '牌', '。',
      '而', '且', '索', '子', '上', '也', '有', '了', '一', '杯', '口', '的', '变', '化', '。',
      '留', '下', '连', '续', '的', '牌', '型', '是', '常', '理', '。'
    ]
  },
  {
  id: 34,
    round: '东 1 局  东家  7 巡目',
    images1: [z0, z0, m1, z0, z0, z0, z0],
    images2: [m6, m6, m6, m7, m9, m9, p1, p2, p3, p5, p6, s7, s7, m6],
    answerImg: m9,
    explanation: [
      '有', '红', m5, '的', '进', '张', '，', '因', '此', '不', '能', '开', '杠', '。',
      '先', '打', '掉', '一', '张', m9, '。',
      '摸', m8, '就', '杠', m6, '立', '直', '。',
      '亲', '家', '的', '暗', '杠', '立', '直', '是', '谁', '也', '无', '法', '违', '抗', '的', '“', '永', '远', '是', '我', '的', '回', '合', '”', '。'
    ]
  },
  {
  id: 35,
    round: '东 1 局  西家  7 巡目',
    images1: [z0, z0, s1, z0, z0, z0, z0],
    images2: [m4, m5, m6, m7, p2, p2, p3, p5, s6, s7, s7, s8, s8, p1],
    answerImg: p2,
    explanation: [
      '需', '要', '雀', '头', '。',
      '比', '起', '对', '万', '子', '的', '四', '连', '型', '下', '手', '，', '先', '整', '理', p2, p5, '。',
      '这', '样', '万', '子', '或', '者', '索', '子', '延', '伸', '的', '时', '候', '，', '手', '牌', '也', '更', '加', '整', '齐', '。',
      '类', '似', p1, p2, p2, p3, p5, '的', '形', '状', '，', '多', '半', '优', '先', '固', '定', '面', '子', '比', '较', '好', '。'
    ]
  },
  {
  id: 36,
    round: '东 1 局  东家  4 巡目',
    images1: [z0, z0, p1, z0, z0, z0, z0],
    images2: [m4, m5, m6, m7, p4, p0, p6, p6, p7, s3, s4, s5, s5, p3],
    answerImg: s5,
    explanation: [
      '因', '为', '宝', '牌', '是', p2, '，', '所', '以', '很', '想', '固', '定', '饼', '子', '的', '三', '面', '张', '，',
      '但', '是', '打', p6, '的', '进', '张', '比', '其', '他', '打', '法', '少', '很', '多', '，', '没', '有', '必', '要', '急', '着', '固', '定', '。',
      '打', s5, '不', '单', '进', '张', '数', '占', '优', '，', '形', '成', '好', '形', '听', '牌', '的', '枚', '数', '也', '更', '有', '利', '。'
    ]
  },
  {
  id: 37,
    round: '东 1 局  西家  4 巡目',
    images1: [z0, z0, m1, z0, z0, z0, z0],
    images2: [m3, m4, m5, m6, p1, p3, p7, p9, p9, s4, s5, s6, s7, p8],
    answerImg: p1,
    explanation: [
      '能', '看', '到', '平', '和', '的', '两', '向', '听', '。',
      '单', '看', '进', '张', '面', '，', '应', '该', '打', m3, '或', '者', p9, '，',
      '但', '是', '要', '留', '下', '容', '易', '做', '出', '雀', '头', '的', '万', '子', '四', '连', '型', '和', p7, p8, p9, p9, '。',
      '根', '据', '拆', '解', '，', '面', '子', '超', '载', '了', '，', '打', p1, '拆', '掉', '坎', '张', '。'
    ]
  },
  {
  id: 38,
    round: '东 1 局  西家  7 巡目',
    images1: [z0, z0, s7, z0, z0, z0, z0],
    images2: [m3, m3, p2, p3, p4, p5, p8, p9, s3, s3, s4, s7, s8, s9],
    answerImg: s3,
    explanation: [
      '打', p2, '或', p5, '进', '张', '面', '最', '广', '，', '但', '是', '容', '易', '最', '终', '听', '到', '边', p7, '上', '。',
      '这', '里', '柔', '软', '地', '打', s3, '，', '既', '能', '保', '留', '摸', p7, '直', '接', '听', '牌', '，',
      '同', '时', '也', '能', '期', '待', p2, p3, p4, p5, '四', '连', '型', '的', '延', '伸', '。',
      '取', '得', '制', '造', '两', '面', '和', '速', '度', '的', '妥', '协', '是', '一', '项', '重', '要', '的', '技', '术', '。'
    ]
  },
  {
  id: 39,
    round: '东 1 局  东家  5 巡目',
    images1: [z0, z0, s1, z0, z0, z0, z0],
    images2: [m3, m4, p3, p4, p4, p4, s1, s2, s2, s3, s4, s5, s5, s6],
    answerImg: p3,
    explanation: [
      '能', '看', '到', '断', '平', '三', '色', '，', '但', '这', '里', '打', p3, '才', '是', '正', '解', '。',
      '恐', '怕', '大', '多', '数', '人', '都', '会', '打', '掉', s1, '，',
      '可', '是', '摸', '进', '进', '入', '听', '牌', '的', '有', '效', '牌', m2, m5, s4, s7, '中', '任', '意', '一', '张', '时', '，',
      '要', '听', '牌', '还', '是', '只', '能', '打', '掉', p3, '。',
      '而', '留', '下', s1, '，', '摸', '进', '宝', '牌', s2, s3, s0, '都', '可', '以', '听', '牌', '。',
      '打', p3, '看', '上', '去', '很', '可', '惜', '，', '其', '实', '是', '非', '常', '优', '秀', '的', '一', '打', '。'
    ]
  },
  {
  id: 40,
    round: '东 1 局  西家  7 巡目',
    images1: [z0, z0, s2, z0, z0, z0, z0],
    images2: [m2, m3, m4, m6, m7, m8, p4, p0, s1, s2, s3, s4, s5, m5],
    answerImg: s1,
    explanation: [
      '这', '里', '选', '择', '能', '确', '实', '用', '上', p0, '的', '形', '状', '。',
      '基', '本', '确', '定', '有', '断', '幺', '，', '先', '完', '成', '饼', '子', '的', '面', '子', '的', '话', '有', '三', '面', '听', '。',
      '摸', '进', '宝', '牌', '也', '可', '以', '打', s2, '来', '应', '对', '。'
    ]
  },
  {
  id: 41,
    round: '东 1 局  西家  9 巡目',
    images1: [z0, z0, p5, z0, z0, z0, z0],
    images2: [m1, m2, m3, p2, p3, p3, p5, p6, p7, p8, s5, s6, s7, s8],
    answerImg: p2,
    explanation: [
      '固', '定', '雀', '头', '，', '活', '用', '两', '个', '四', '连', '型', '。',
      '巡', '目', '早', '的', '时', '候', '，', '摸', '进', p5, p8, '或', s5, s8, '的', '对', '碰', '听', '牌', '也', '可', '以', '摸', '切', '拒', '听', '。'
    ]
  }, 
])

// 当前文章索引
const currentIndex = ref(0)

// 是否展开答案和解析
const isAnswerCollapsed = ref(false)

// 计算属性，返回当前文章
const currentArticle = computed(() => articles.value[currentIndex.value])

// 重置分析结果
const resetAnalysis = () => {
  handInput.value = ''
  showResult.value = false
  shantenNum.value = null
  improvementResults.value = {}
  errorMessage.value = null
}

// 切换到上一篇文章
const prevArticle = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    isAnswerCollapsed.value = false // 重置折叠状态
    resetAnalysis() // 清除分析结果
  }
}

// 切换到下一篇文章
const nextArticle = () => {
  if (currentIndex.value < articles.value.length - 1) {
    currentIndex.value++
    isAnswerCollapsed.value = false // 重置折叠状态
    resetAnalysis() // 清除分析结果
  }
}

const jumpToId = ref('') // 用户输入的编号

// 跳转到指定编号的文章
const jumpToArticle = () => {
  const id = parseInt(jumpToId.value)
  if (id >= 1 && id <= articles.value.length) {
    currentIndex.value = id - 1
    isAnswerCollapsed.value = false // 重置折叠状态
    resetAnalysis() // 清除分析结果
  } else {
    alert('请输入有效的编号')
  }
  jumpToId.value = '' // 清空输入框
}

defineProps(['changeComponent'])

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

// 将 images2 转换为 123m123p123s1234z 格式
const convertImages2ToHandString = (images2) => {
  const tileMap = {
    [m0]: '0m', [m1]: '1m', [m2]: '2m', [m3]: '3m', [m4]: '4m',
    [m5]: '5m', [m6]: '6m', [m7]: '7m', [m8]: '8m', [m9]: '9m',
    [p0]: '0p', [p1]: '1p', [p2]: '2p', [p3]: '3p', [p4]: '4p',
    [p5]: '5p', [p6]: '6p', [p7]: '7p', [p8]: '8p', [p9]: '9p',
    [s0]: '0s', [s1]: '1s', [s2]: '2s', [s3]: '3s', [s4]: '4s',
    [s5]: '5s', [s6]: '6s', [s7]: '7s', [s8]: '8s', [s9]: '9s',
    [z1]: '1z', [z2]: '2z', [z3]: '3z', [z4]: '4z',
    [z5]: '5z', [z6]: '6z', [z7]: '7z'
  }

  // 按类型分组：m、p、s、z
  const groupedTiles = { m: [], p: [], s: [], z: [] }
  images2.forEach(img => {
    const tile = tileMap[img]
    if (tile) {
      const type = tile.slice(-1)
      const num = tile.slice(0, -1)
      groupedTiles[type].push(num)
    }
  })

  // 按类型顺序拼接字符串
  let handString = ''
  ;['m', 'p', 's', 'z'].forEach(type => {
    if (groupedTiles[type].length > 0) {
      // 按数字排序
      groupedTiles[type].sort((a, b) => parseInt(a) - parseInt(b))
      handString += groupedTiles[type].join('') + type
    }
  })

  return handString
}

// 处理提交事件
const handleSubmit = () => {
  // 将当前问题的 images2 转换为手牌字符串
  const handString = convertImages2ToHandString(currentArticle.value.images2)
  
  // 设置 handInput 的值
  handInput.value = handString

  // 解析手牌
  const handTiles = parseHandTiles(handString)
  if (!handTiles) {
    errorMessage.value = '手牌格式不正确或某牌数量过多'
    showResult.value = true
    return
  }

  // 计算向听数和进张分析
  const tiles34Arr = convertToTiles34Arr(handTiles)
  const shanten = calculateShanten(tiles34Arr)
  shantenNum.value = shanten
  const results = analyzeImprovement(handTiles, tiles34Arr)
  improvementResults.value = results
  showResult.value = true
  errorMessage.value = null
}
</script>