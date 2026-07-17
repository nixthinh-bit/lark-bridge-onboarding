import { en, vi, zh, type Messages } from './messages';

export type { Messages } from './messages';

/** Languages the terminal output is available in. */
export type Lang = 'zh' | 'en' | 'vi';

const PACKS: Record<Lang, Messages> = { zh, en, vi };

/**
 * Chinese is the default so that importing this module changes nothing for
 * existing users (and for the test suite, which asserts on the original
 * strings). A language is only selected when a CLI entry point explicitly
 * calls {@link setLang} — detection never happens as an import side effect,
 * which would make output depend on the ambient locale of whoever runs the
 * tests.
 */
let current: Lang = 'zh';

/** The active language. */
export function getLang(): Lang {
  return current;
}

/** Select the active language. Call once, from a CLI entry point. */
export function setLang(lang: Lang): void {
  current = lang;
}

/** The message pack for the active language. */
export function t(): Messages {
  return PACKS[current];
}

/** Parse a language tag (`vi`, `vi_VN.UTF-8`, `en-GB`, …), if supported. */
function parseLang(value: string | undefined): Lang | undefined {
  if (!value) return undefined;
  const tag = value.trim().toLowerCase();
  if (tag.startsWith('vi')) return 'vi';
  if (tag.startsWith('en')) return 'en';
  if (tag.startsWith('zh')) return 'zh';
  return undefined;
}

/**
 * Resolve the language to use, in precedence order:
 *
 *   1. `LARK_CHANNEL_LANG` — explicit override, also the escape hatch when the
 *      OS locale is wrong or unset (common under launchd / systemd / Docker).
 *   2. The POSIX locale environment (`LC_ALL` > `LC_MESSAGES` > `LANG`).
 *   3. Chinese — upstream's original behaviour.
 *
 * Unrecognised values fall through rather than throw: a stray locale should
 * never stop the bridge from starting.
 */
export function detectLang(env: NodeJS.ProcessEnv = process.env): Lang {
  return (
    parseLang(env.LARK_CHANNEL_LANG) ??
    parseLang(env.LC_ALL) ??
    parseLang(env.LC_MESSAGES) ??
    parseLang(env.LANG) ??
    'zh'
  );
}
