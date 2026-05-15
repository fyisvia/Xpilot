// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

<template>
  <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-full px-2 sm:px-8">
    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    <li class="p-4 pb-2 text-lg font-semibold opacity-100 tracking-wide">
      {{ t('discardTest.title') }}
    </li>

    <!-- 1. 选择题量并开始 -->
    <li v-if="step === 'setup'" class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="flex items-center gap-2 mb-4">
        <span class="badge badge-primary">1</span>
        <span class="font-semibold">{{ t('discardTest.sections.setup') }}</span>
      </div>
      <div class="flex flex-col items-center gap-4">
        <fieldset class="fieldset ml-0 w-full sm:w-auto">
          <legend class="text-base text-center">{{ t('discardTest.settings.count') }}</legend>
          <select class="select w-full sm:w-64" v-model.number="questionCount">
            <option v-for="n in countOptions" :key="n" :value="n">
              {{ t('discardTest.settings.countOption', { count: n }) }}
            </option>
          </select>
        </fieldset>
        <div>
          <button class="btn btn-sm sm:btn-md btn-primary" @click="startTest">
            {{ t('discardTest.settings.start') }}
          </button>
        </div>
      </div>
    </li>

    <!-- 2. 作答阶段 -->
    <li v-if="step === 'quiz' && currentQuestion" class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="flex items-center gap-2 mb-3">
        <span class="badge badge-primary">2</span>
        <span class="font-semibold">{{ t('discardTest.sections.quiz') }}</span>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div class="font-medium">
          {{ t('discardTest.progress', { current: currentIndex + 1, total: questions.length }) }}
        </div>
        <div class="opacity-70">{{ t('discardTest.hint') }}</div>
      </div>
      <progress
        class="progress progress-primary mt-3"
        :value="currentIndex + 1"
        :max="questions.length"
      ></progress>
    </li>

    <li v-if="step === 'quiz' && currentQuestion" class="p-4 sm:p-4 pb-2 text-lg sm:text-xl opacity-100 tracking-wide" :style="contentWidthStyle">
      <div class="flex flex-col items-start">
        <a class="mb-2">[ {{ currentQuestion.article.round }} ]</a>
        <div class="flex flex-row space-x-0">
          <img
            v-for="img in currentQuestion.article.images1"
            :key="img"
            :src="img"
            alt=""
            class="flex-shrink-0 object-contain"
            :style="{
              width: 'calc(100% / 14.333)',
              height: 'calc((100% / 14.333) * 1.5)'
            }"
          >
        </div>
      </div>
    </li>

    <li v-if="step === 'quiz' && currentQuestion" class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide" :style="contentWidthStyle">
      <div class="flex flex-nowrap justify-start" style="gap: 0;">
        <template v-for="(img, index) in currentQuestion.article.images2" :key="img + '-' + index">
          <div class="relative group" style="width: calc(100% / 14);">
            <img
              :src="img"
              alt=""
              class="flex-shrink-0 object-contain transition-transform duration-150 group-hover:scale-110"
              :style="{
                width: '100%',
                height: 'calc(1.5 * 100%)',
                filter: answers[currentIndex] === img ? 'grayscale(100%) brightness(0.9)' : undefined,
                opacity: answers[currentIndex] === img ? '0.8' : undefined
              }"
            />
            <button
              class="absolute inset-0 w-full h-full opacity-0 hover:opacity-50 transition-opacity duration-300"
              @click="handleImageClick(img)"
              tabindex="-1"
              :aria-label="t('discardTest.aria.selectAnswer')"
              style="pointer-events: auto;"
            ></button>
          </div>
        </template>
      </div>
    </li>

    <li v-if="step === 'quiz' && currentQuestion" class="p-2 sm:p-4 pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide" :style="contentWidthStyle">
      <div class="flex flex-nowrap justify-end" style="gap: 0;">
        <template v-for="(img, index) in currentQuestion.article.images3" :key="img + '-' + index">
          <img
            :src="img"
            alt=""
            class="flex-shrink-0 object-contain"
            :class="{ 'first-image': index === 0 }"
            :style="{
              width: `calc(100% / (${currentQuestion.article.images2.length} + 1/3))`,
              height: 'calc((100% / 14.333) * 1.5)',
              marginRight: index === currentQuestion.article.images2.length - 2 ? `calc((100% / (${currentQuestion.article.images2.length} + 1/3)) / 3)` : '0'
            }"
          >
        </template>
      </div>
    </li>

    <li v-if="step === 'quiz' && currentQuestion" class="p-0 sm:p-4 pb-0 sm:pb-2 text-xs sm:text-sm md:text-base opacity-100 tracking-wide" :style="contentWidthStyle">
      <div class="flex flex-nowrap justify-end" style="gap: 0;">
        <template v-for="(img, index) in currentQuestion.article.images4" :key="img + '-' + index">
          <img
            :src="img"
            alt=""
            class="flex-shrink-0 object-contain"
            :class="{ 'first-image': index === 0 }"
            :style="{
              width: `calc(100% / (${currentQuestion.article.images2.length} + 1/3))`,
              height: 'calc((100% / 14.333) * 1.5)',
              marginRight: index === currentQuestion.article.images2.length - 2 ? `calc((100% / (${currentQuestion.article.images2.length} + 1/3)) / 3)` : '0'
            }"
          >
        </template>
      </div>
    </li>

    <!-- 滑块与提示（与 DiscardTrain 一致） -->
    <li
      v-if="step === 'quiz' && currentQuestion && !isSmallScreen"
      class="p-4 pb-2 text-xs md:text-base opacity-80 tracking-wide flex items-center gap-4 mx-2"
    >
      <div class="flex items-center gap-3">
        <input
          type="range"
          min="40"
          max="100"
          step="5"
          v-model.number="contentWidth"
          class="range range-xs w-36 sm:w-40"
          :aria-label="t('threeHundred.ui.clickHint')"
        />
        <span class="opacity-80">{{ contentWidth }}%</span>
      </div>
      <div class="ml-auto">{{ t('threeHundred.ui.clickHint') }}</div>
    </li>

    <li v-if="step === 'quiz' && currentQuestion" class="list-row flex flex-row justify-between items-center gap-2 w-full">
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        :disabled="currentIndex === 0"
        @click="prevQuestion"
      >
        {{ t('discardTest.actions.prev') }}
      </button>
      <button
        class="btn btn-sm text-sm sm:text-base px-4 btn-primary"
        :disabled="!canFinish"
        @click="finishTest"
      >
        {{ t('discardTest.actions.finish') }}
      </button>
      <button
        class="btn btn-sm text-sm sm:text-base px-4"
        :disabled="currentIndex === questions.length - 1"
        @click="nextQuestion"
      >
        {{ t('discardTest.actions.next') }}
      </button>
    </li>

    <!-- 3. 结果阶段 -->
    <li v-if="step === 'result'" class="p-4 pb-2 text-base opacity-100 tracking-wide">
      <div class="bg-base-200/60 border border-base-300 rounded-box p-5 sm:p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <span class="badge badge-primary">3</span>
          <span class="font-semibold">{{ t('discardTest.sections.result') }}</span>
        </div>
        <!-- <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="text-lg font-semibold">{{ t('discardTest.result.title') }}</div>
        </div> -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div class="bg-base-100 rounded-box border border-base-300 p-4 flex items-center justify-center">
            <div class="text-center">
              <div
                class="radial-progress text-success"
                :style="{ '--value': accuracyPercent }"
                :aria-label="t('discardTest.result.score')"
              >
                {{ accuracyPercent }}%
              </div>
              <div class="mt-2 text-sm opacity-70">{{ t('discardTest.result.score') }}</div>
            </div>
          </div>
          <div class="bg-base-100 rounded-box border border-base-300 p-4 flex items-center justify-center">
            <div class="text-center">
              <div class="text-sm opacity-70">{{ t('discardTest.result.certTitle') }}</div>
              <div class="text-4xl font-bold" :class="gradeClass">{{ gradeLabel }}</div>
              <div class="text-xs opacity-60">{{ t('discardTest.result.level') }}</div>
            </div>
          </div>
          <div class="bg-base-100 rounded-box border border-base-300 p-4 flex items-center justify-center">
            <div class="text-center">
              <div class="text-sm opacity-70">{{ t('discardTest.result.correctCountLabel') }}</div>
              <div class="text-2xl font-semibold">
                {{ t('discardTest.result.correctCount', { correct: correctCount, total: questions.length }) }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-6">
          <button class="btn btn-base" @click="goToSetup">
            {{ t('discardTest.actions.restart') }}
          </button>
        </div>
      </div>
    </li>

    <li v-if="step === 'result'" class="p-2 sm:p-4 pb-2 text-sm sm:text-base md:text-lg opacity-100 tracking-wide">
      <div class="overflow-x-auto">
        <table class="table table-sm w-full bg-base-100 rounded-lg">
          <thead>
            <tr>
              <th class="text-center">{{ t('discardTest.result.columns.order') }}</th>
              <th class="text-center">{{ t('discardTest.result.columns.id') }}</th>
              <th class="text-center">{{ t('discardTest.result.columns.correct') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in results"
              :key="'result-' + row.order"
              :class="row.order % 2 === 0 ? 'hover:bg-base-300' : ''"
            >
              <td class="text-center font-bold">{{ row.order }}</td>
              <td class="text-center">
                <button
                  class="btn btn-link btn-sm"
                  @click="goToQuestion(row.id)"
                >
                  #{{ row.id }}
                </button>
              </td>
              <td class="text-center">
                <span
                  :class="row.correct ? 'text-success' : 'text-error'"
                >
                  {{ row.correct ? t('discardTest.result.correct') : t('discardTest.result.wrong') }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </li>

    <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
  </ul>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { articles as articlesRaw } from '../data/articles'

const { t } = useI18n()
const router = useRouter()

const countOptions = [10, 20]
const questionCount = ref(10)

const questions = ref([])
const currentIndex = ref(0)
const answers = ref({})
const step = ref('setup')
const isSmallScreen = ref(false)
const RESULT_STORAGE_KEY = 'discard-train-test-result'

const WIDTH_STORAGE_KEY = 'threehundred-content-width'
const clampWidth = (value) => Math.min(100, Math.max(40, Number.isFinite(value) ? value : 100))
const getSavedContentWidth = () => {
  try {
    const v = parseInt(localStorage.getItem(WIDTH_STORAGE_KEY))
    return clampWidth(Number.isFinite(v) ? v : 100)
  } catch (e) {
    console.warn('无法读取 contentWidth:', e)
    return 100
  }
}
const contentWidth = ref(getSavedContentWidth())
const contentWidthStyle = computed(() => ({
  width: `${isSmallScreen.value ? 100 : contentWidth.value}%`,
  marginLeft: 'auto',
  marginRight: 'auto'
}))

const currentQuestion = computed(() => questions.value[currentIndex.value])

const canFinish = computed(() => {
  return questions.value.length > 0 && questions.value.every((_, idx) => answers.value[idx])
})

const results = computed(() =>
  questions.value.map((q, idx) => {
    const selected = answers.value[idx]
    return {
      order: idx + 1,
      id: q.id,
      correct: !!selected && selected === q.article.answerImg
    }
  })
)

const correctCount = computed(() => results.value.filter(r => r.correct).length)
const accuracyPercent = computed(() => {
  if (!questions.value.length) return 0
  return Math.round((correctCount.value / questions.value.length) * 100)
})
const gradeLabel = computed(() => {
  const p = accuracyPercent.value
  if (p >= 85) return 'S'
  if (p >= 65) return 'A'
  if (p >= 45) return 'B'
  if (p >= 25) return 'C'
  return 'D'
})
const gradeClass = computed(() => {
  const p = accuracyPercent.value
  if (p >= 85) return 'text-success'
  if (p >= 65) return 'text-primary'
  if (p >= 45) return 'text-info'
  if (p >= 25) return 'text-warning'
  return 'text-error'
})

const shuffle = (arr) => {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const startTest = () => {
  const total = articlesRaw.length
  const count = Math.min(questionCount.value, total)
  const indices = shuffle(Array.from({ length: total }, (_, i) => i)).slice(0, count)
  questions.value = indices.map((idx) => {
    const article = articlesRaw[idx]
    return { id: article.id ?? idx + 1, article }
  })
  currentIndex.value = 0
  answers.value = {}
  step.value = 'quiz'
  try { localStorage.removeItem(RESULT_STORAGE_KEY) } catch {}
}

const goToSetup = () => {
  questions.value = []
  currentIndex.value = 0
  answers.value = {}
  step.value = 'setup'
  try { localStorage.removeItem(RESULT_STORAGE_KEY) } catch {}
}

const updateScreenSize = () => {
  isSmallScreen.value = window.innerWidth < 640
}

const handleImageClick = (img) => {
  answers.value = { ...answers.value, [currentIndex.value]: img }
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--
}

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) currentIndex.value++
}

const finishTest = () => {
  if (!canFinish.value) return
  step.value = 'result'
  saveResultCache()
}

const saveResultCache = () => {
  try {
    const payload = {
      questionCount: questionCount.value,
      questionIds: questions.value.map(q => q.id),
      answers: answers.value,
      currentIndex: currentIndex.value,
      step: 'result'
    }
    localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(payload))
  } catch (e) {
    console.warn('无法保存测试结果:', e)
  }
}

const restoreResultCache = () => {
  try {
    const raw = localStorage.getItem(RESULT_STORAGE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    if (!data || !Array.isArray(data.questionIds)) return false
    const rebuilt = data.questionIds
      .map((id) => articlesRaw.find(a => a.id === id))
      .filter(Boolean)
      .map((article) => ({ id: article.id, article }))
    if (!rebuilt.length) return false
    questions.value = rebuilt
    answers.value = data.answers || {}
    questionCount.value = data.questionCount || rebuilt.length
    currentIndex.value = Math.min(data.currentIndex || 0, rebuilt.length - 1)
    step.value = 'result'
    return true
  } catch (e) {
    console.warn('无法恢复测试结果:', e)
    return false
  }
}

const goToQuestion = (id) => {
  router.push({ name: 'DiscardTrain', params: { id } })
}

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
  restoreResultCache()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})

watch(contentWidth, (val) => {
  const clamped = clampWidth(val)
  if (clamped !== val) {
    contentWidth.value = clamped
    return
  }
  try {
    localStorage.setItem(WIDTH_STORAGE_KEY, String(clamped))
  } catch (e) {
    console.warn('无法保存 contentWidth:', e)
  }
})
</script>

<style>
.first-image {
  transform: rotate(-90deg) translateY(-16.67%) translateX(-20%);
  transform-origin: center;
}
</style>
