// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

<template>
    <ul class="list bg-base-100 sm:rounded-box sm:shadow-md w-[100%] px-2 sm:px-8">
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
        <li class="p-4 pb-2 text-lg opacity-100 tracking-wide font-semibold">
            {{ $t("review.title") }}
        </li>

        <li class="p-4 pb-0 text-base opacity-100 tracking-wide">
            <div class="mb-2">{{ $t("review.thanks") }}</div>
            <div class="text-xs font-semibold opacity-60 mb-2 ml-3">
                {{ $t("review.thanksDesc") }}
                <a href="https://review.bigcoach.work/" target="_blank" rel="noopener">
                    <button class="btn-sm btn-link">{{ $t("review.link") }}</button>
                </a>
            </div>
        </li>

        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="mb-2">{{ $t("review.hint") }}</div>
            <div class="text-xs font-semibold opacity-60 mb-2 ml-3">{{ $t("review.hint1") }}</div>
            <div class="text-xs font-semibold opacity-60 mb-2 ml-3">{{ $t("review.hint2") }}</div>
        </li>

        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <fieldset class="fieldset ml-0">
                <legend class=" text-base">{{ $t("review.input.legend") }}</legend>
                <input
                  type="text"
                  class="input w-full sm:w-auto"
                  v-model="paipuUrl"
                />
                <p class="label ml-3 block max-w-full whitespace-normal break-words">
                    {{ $t("review.input.help") }}
                </p>
            </fieldset>
        </li>
        
        <li class="p-4 pb-2 text-base opacity-100 tracking-wide">
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-8">
                <!-- 分析视角 -->
                <fieldset class="fieldset ml-0 mt-0 flex-1 sm:mt-0">
                    <legend class="text-base">{{ $t("review.options.viewpointLegend") }}</legend>
                    <select class="select ml-0 w-full sm:w-auto" :aria-label="$t('review.aria.selectModel')" v-model.number="playerId">
                        <option :value="-1">{{ $t("review.options.auto") }}</option>
                        <option :value="0">{{ $t("review.options.east") }}</option>
                        <option :value="1">{{ $t("review.options.south") }}</option>
                        <option :value="2">{{ $t("review.options.west") }}</option>
                        <option :value="3">{{ $t("review.options.north") }}</option>
                    </select>
                </fieldset>
                <!-- 语言 -->
                <fieldset class="fieldset ml-0 mt-4 flex-1 sm:mt-0">
                    <legend class="text-base">{{ $t("review.options.langLegend") }}</legend>
                    <select class="select ml-0 w-full sm:w-auto" :aria-label="$t('review.aria.selectLang')" v-model="lang">
                        <option value="zh">{{ $t("review.options.langZh") }}</option>
                        <option value="en">{{ $t("review.options.langEn") }}</option>
                        <option value="ja">{{ $t("review.options.langJa") }}</option>
                        <option value="ko">{{ $t("review.options.langKo") }}</option>
                    </select>
                </fieldset>
            </div>      

            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-8">
                <!-- 四麻分析引擎 -->
                <fieldset class="fieldset ml-0 mt-4 flex-1">
                    <legend class="text-base">{{ $t("review.options.engine4pLegend") }}</legend>
                    <select class="select ml-0 w-full sm:w-auto" :aria-label="$t('review.aria.selectModel')" v-model="model4p">
                        <option value="Zeus">Zeus</option>
                        <option value="Balance">Balance</option>
                        <option value="Aggressive">Aggressive</option>
                        <option value="Defensive">Defensive</option>
                    </select>
                </fieldset>
                <!-- 三麻分析引擎 -->
                <fieldset class="fieldset ml-0 mt-4 flex-1 sm:mt-4">
                    <legend class="text-base">{{ $t("review.options.engine3pLegend") }}</legend>
                    <select class="select ml-0 w-full sm:w-auto" :aria-label="$t('review.aria.selectModel')" v-model="model3p">
                        <option value="Default">{{ $t("review.options.engine3pDefault") }}</option>
                    </select>
                </fieldset>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-8">
                <!-- 界面风格 -->
                <fieldset class="fieldset ml-0 mt-4 flex-1">
                    <legend class="text-base">{{ $t("review.options.uiLegend") }}</legend>
                    <select class="select ml-0 w-full sm:w-auto" :aria-label="$t('review.aria.selectModel')" v-model="ui">
                        <option value="classic">{{ $t("review.options.uiClassic") }}</option>
                        <option value="new">{{ $t("review.options.uiNew") }}</option>
                    </select>
                </fieldset>
                <!-- 分析模式 -->
                <fieldset class="fieldset ml-0 mt-4 flex-1 sm:mt-4">
                    <legend class="text-base">{{ $t("review.options.modeLegend") }}</legend>
                    <select class="select ml-0 w-full sm:w-auto" :aria-label="$t('review.aria.selectLang')" v-model="analysisMode">
                        <option value="standard">{{ $t("review.options.modeStandard") }}</option>
                        <option value="advanced">{{ $t("review.options.modeAdvanced") }}</option>
                    </select>
                </fieldset>
            </div>
        </li>

        <li class="list-row flex flex-col gap-2">
            <div></div>
            <button class="btn" type="button" @click="onSubmit">{{ $t("review.submit") }}</button>
        </li>
        <li aria-hidden="true" role="presentation" class="p-0 m-0 sm:h-4"></li>
    </ul>
</template>

<script setup>
    defineProps(["changeComponent"]);
    import { ref, onMounted, watch } from 'vue';
    import { useI18n } from 'vue-i18n';
    
    const { t, locale } = useI18n();

    // 将站点语言映射为 Review 支持的语言：zh/en/ja/ko
    const mapSiteLocaleToReviewLang = (l) => {
        switch (l) {
            case 'zhCN':
            case 'zhTW': return 'zh';    // 繁体也归并为简体
            case 'ja':   return 'ja';
            case 'ko':   return 'ko';
            case 'fr':
            case 'es':
            case 'en':
            default:     return 'en';    // 法语/西语回退为英语
        }
    };

    // 收集表单字段
    const paipuUrl = ref('');
    const playerId = ref(-1);           // -1 自动，0 东，1 南，2 西，3 北
    const model4p = ref('Zeus');        // "Zeus" | "Balance" | "Aggressive" | "Defensive"
    const model3p = ref('Default');     // 三麻模型固定 "Default"（UI 显示为“三叉戟”）
    const ui = ref('new');              // "new" | "classic"
    const analysisMode = ref('standard'); // "standard" | "advanced"
    const lang = ref('zh');             // "zh" | "en" | "ja" | "ko"（将于挂载时根据站点语言重置）

    // 打开页面时同步 Review 语言；站点语言变更时同步
    onMounted(() => {
        lang.value = mapSiteLocaleToReviewLang(locale.value);
    });
    watch(() => locale.value, (newL) => {
        lang.value = mapSiteLocaleToReviewLang(newL);
    });

    const PARTNER_TOKEN = 'e30ddb9dfce9a8c00eaef647096514dd8209f4bc9326d4cc0c23a08df7b5eaa7';

    // 使用原生表单 POST，浏览器自动跟随 302 跳转到结果页
    function postToReview() {
        const form = document.createElement('form');
        form.action = 'https://review.bigcoach.work/review';
        form.method = 'POST';
        form.style.display = 'none';

        const append = (name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = String(value);
            form.appendChild(input);
        };

        append('id', paipuUrl.value.trim());
        append('actor', playerId.value);
        append('model4p', model4p.value);
        append('model3p', model3p.value);
        append('ui', ui.value);
        append('analysis_mode', analysisMode.value);
        append('lang', lang.value);
        append('partner_token', PARTNER_TOKEN);

        document.body.appendChild(form);
        form.submit();
    }

    function onSubmit() {
        if (!paipuUrl.value || paipuUrl.value.trim() === '') {
            alert(t('review.input.toastEmpty'));
            return;
        }
        postToReview();
    }
</script>