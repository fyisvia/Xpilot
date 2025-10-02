import { createI18n } from 'vue-i18n'

import en from "./lang/en.json";
import es from "./lang/es.json";
import fr from "./lang/fr.json";
import ja from "./lang/ja.json";
import ko from "./lang/ko.json";
import zhCN from "./lang/zh-CN.json";
import zhTW from "./lang/zh-TW.json";


export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    en: en,
    es: es,
    fr: fr,
    ja: ja,
    ko: ko,
    zhCN: zhCN,
    zhTW: zhTW
  }
})
