import { createI18n } from 'vue-i18n'

import en from "./lang/en.json";
import es from "./lang/es.json";
import fr from "./lang/fr.json";
import ja from "./lang/ja.json";
import ko from "./lang/ko.json";
import zhCN from "./lang/zh-CN.json";
import zhTW from "./lang/zh-TW.json";

// Normalize browser language -> our i18n locale keys
function normalizeBrowserLang(l) {
  if (!l) return null;
  const s = String(l).toLowerCase();
  if (s.startsWith('zh')) {
    if (s.includes('tw') || s.includes('hk') || s.includes('mo')) return 'zhTW';
    return 'zhCN';
  }
  if (s.startsWith('en')) return 'en';
  if (s.startsWith('ja')) return 'ja';
  if (s.startsWith('ko')) return 'ko';
  if (s.startsWith('fr')) return 'fr';
  if (s.startsWith('es')) return 'es';
  return null;
}

const supported = ['en', 'es', 'fr', 'ja', 'ko', 'zhCN', 'zhTW'];

function detectInitialLocale() {
  // 1) saved preference
  try {
    const saved = localStorage.getItem('xpilot-lang');
    if (saved && supported.includes(saved)) return saved;
  } catch {}

  // 2) browser language
  let navLang = null;
  if (typeof navigator !== 'undefined') {
    const langs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || navigator.userLanguage];
    if (langs && langs.length) {
      navLang = normalizeBrowserLang(langs[0]);
    }
  }

  // Rules:
  // - If detected but unsupported -> 'en'
  // - If not detected -> 'zhCN'
  if (!navLang) return 'zhCN';
  return supported.includes(navLang) ? navLang : 'en';
}

const initialLocale = detectInitialLocale();

// Persist and set <html lang> early
try { localStorage.setItem('xpilot-lang', initialLocale) } catch {}
try {
  const mapHtmlLang = (l) => {
    switch (l) {
      case 'zhCN': return 'zh-CN';
      case 'zhTW': return 'zh-TW';
      case 'ja': return 'ja';
      case 'ko': return 'ko';
      case 'fr': return 'fr';
      case 'es': return 'es';
      case 'en':
      default: return 'en';
    }
  };
  document?.documentElement?.setAttribute('lang', mapHtmlLang(initialLocale));
} catch {}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale, // auto-detected
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
