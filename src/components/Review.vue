// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

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
                        <option v-for="m in options4p" :key="m.id" :value="m.id">{{ m.name || m.id }}</option>
                    </select>
                </fieldset>
                <!-- 三麻分析引擎 -->
                <fieldset class="fieldset ml-0 mt-4 flex-1 sm:mt-4">
                    <legend class="text-base">{{ $t("review.options.engine3pLegend") }}</legend>
                    <select class="select ml-0 w-full sm:w-auto" :aria-label="$t('review.aria.selectModel')" v-model="model3p">
                        <option v-for="m in options3p" :key="m.id" :value="m.id">{{ m.name || m.id }}</option>
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
            <button class="btn" type="button" :disabled="submitting" @click="onSubmit">{{ $t("review.submit") }}</button>
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
    const playerId = ref(-1);
    // 动态模型选项
    const options4p = ref([]); // [{ id, name, isOnline }]
    const options3p = ref([]); // [{ id, name, isOnline }]
    // 选中的模型（值为 id）
    const model4p = ref('Zeus');
    const model3p = ref('Default');
    const ui = ref('new');
    const analysisMode = ref('standard');
    const lang = ref('zh');
    const submitting = ref(false);

    // 打开页面时同步 Review 语言；站点语言变更时同步
    onMounted(async () => {
        lang.value = mapSiteLocaleToReviewLang(locale.value);
        await fetchConfig(); // 拉取动态模型
    });
    watch(() => locale.value, (newL) => {
        lang.value = mapSiteLocaleToReviewLang(newL);
    });

    const PARTNER_TOKEN = 'e30ddb9dfce9a8c00eaef647096514dd8209f4bc9326d4cc0c23a08df7b5eaa7';

    // 拉取配置，填充模型选项
    async function fetchConfig() {
        try {
            const res = await fetch('https://review.bigcoach.work/api/v2/config', { method: 'GET' });
            const json = await res.json();
            if (json?.success && json?.data) {
                const d = json.data;
                options4p.value = Array.isArray(d.models4p) ? d.models4p : [];
                options3p.value = Array.isArray(d.models3p) ? d.models3p : [];
                // 若当前选中不在返回列表中，则回退为第一个可用项
                if (options4p.value.length && !options4p.value.some(m => m.id === model4p.value)) {
                    model4p.value = options4p.value[0].id;
                }
                if (options3p.value.length && !options3p.value.some(m => m.id === model3p.value)) {
                    model3p.value = options3p.value[0].id;
                }
            }
        } catch (e) {
            console.error('fetchConfig failed', e);
        }
    }

    // 使用 v2 接口创建任务，随后跳转 loading/{taskId}
    async function onSubmit() {
        if (!paipuUrl.value || paipuUrl.value.trim() === '') {
            alert(t('review.input.toastEmpty'));
            return;
        }
        if (submitting.value) return;
        submitting.value = true;

        try {
            const fd = new FormData();
            fd.append('paipuId', paipuUrl.value.trim());
            fd.append('playerId', String(playerId.value));
            fd.append('ui', ui.value);
            fd.append('model3p', model3p.value);
            fd.append('model4p', model4p.value);
            fd.append('analysisMode', analysisMode.value);
            fd.append('language', lang.value);
            fd.append('partnerToken', PARTNER_TOKEN);

            const res = await fetch('https://review.bigcoach.work/api/v2/review', {
                method: 'POST',
                body: fd
            });
            const json = await res.json();
            if (!res.ok || !json?.success) {
                alert(json?.message || '提交失败，请稍后重试');
                return;
            }
            const taskId = json?.data?.taskId;
            if (!taskId) {
                alert('提交失败：未获得任务ID');
                return;
            }
            window.location.href = `https://review.bigcoach.work/loading/${taskId}`;
        } catch (e) {
            console.error(e);
            alert('网络错误，请稍后重试');
        } finally {
            submitting.value = false;
        }
    }
</script>