import { afterEach, describe, expect, it } from 'vitest';
import { supportedModels } from '../../../src/agent/models.js';
import { AgentPreflightError, formatAgentPreflightError } from '../../../src/agent/preflight.js';
import { helpCard, workspacesCard } from '../../../src/card/templates.js';
import {
  applyProfileLang,
  detectLang,
  getLang,
  initLangFromEnv,
  isLang,
  setLang,
  t,
} from '../../../src/i18n/index.js';

const notFound = (agentName: string): AgentPreflightError =>
  new AgentPreflightError({
    code: 'agent-binary-not-found',
    agentId: 'claude',
    agentName,
    command: 'claude',
    binaryPath: 'claude',
  });

describe('detectLang', () => {
  it('defaults to Chinese so upstream behaviour is unchanged when nothing is set', () => {
    expect(detectLang({})).toBe('zh');
  });

  it('reads the POSIX locale environment', () => {
    expect(detectLang({ LANG: 'vi_VN.UTF-8' })).toBe('vi');
    expect(detectLang({ LANG: 'en_GB.UTF-8' })).toBe('en');
    expect(detectLang({ LANG: 'zh_CN.UTF-8' })).toBe('zh');
  });

  it('prefers LARK_CHANNEL_LANG over the OS locale', () => {
    expect(detectLang({ LARK_CHANNEL_LANG: 'vi', LANG: 'en_US.UTF-8' })).toBe('vi');
  });

  it('honours LC_ALL over LC_MESSAGES over LANG', () => {
    expect(detectLang({ LC_ALL: 'vi_VN', LC_MESSAGES: 'en_US', LANG: 'zh_CN' })).toBe('vi');
    expect(detectLang({ LC_MESSAGES: 'en_US', LANG: 'zh_CN' })).toBe('en');
  });

  it('falls through unrecognised values instead of throwing', () => {
    // A stray or unsupported locale must never stop the bridge from starting.
    expect(detectLang({ LANG: 'fr_FR.UTF-8' })).toBe('zh');
    expect(detectLang({ LARK_CHANNEL_LANG: 'klingon', LANG: 'vi_VN' })).toBe('vi');
  });

  it('ignores empty values rather than treating them as a selection', () => {
    expect(detectLang({ LARK_CHANNEL_LANG: '', LANG: 'vi_VN' })).toBe('vi');
  });
});

describe('isLang', () => {
  it('accepts only languages this build can render', () => {
    expect(isLang('vi')).toBe(true);
    expect(isLang('en')).toBe(true);
    expect(isLang('zh')).toBe(true);
    expect(isLang('fr')).toBe(false);
    expect(isLang('')).toBe(false);
    expect(isLang(undefined)).toBe(false);
  });
});

describe('profile language', () => {
  afterEach(() => {
    initLangFromEnv({});
  });

  it('applies the stored preference — the only way the daemon learns it', () => {
    // launchd/systemd start the daemon with no locale at all, so without this
    // every card would render in the default language regardless of /config.
    initLangFromEnv({});
    expect(getLang()).toBe('zh');

    applyProfileLang('vi');
    expect(getLang()).toBe('vi');
  });

  it('lets an ambient OS locale lose to the stored preference', () => {
    // The operator picked a language inside Lark; the terminal's locale is an
    // inference and must not override that choice.
    initLangFromEnv({ LANG: 'en_US.UTF-8' });
    expect(getLang()).toBe('en');

    applyProfileLang('vi');
    expect(getLang()).toBe('vi');
  });

  it('keeps a deliberate LARK_CHANNEL_LANG over the stored preference', () => {
    initLangFromEnv({ LARK_CHANNEL_LANG: 'en', LANG: 'zh_CN.UTF-8' });
    expect(getLang()).toBe('en');

    applyProfileLang('vi');
    expect(getLang()).toBe('en');
  });

  it('keeps a deliberate --lang (setLang) over the stored preference', () => {
    initLangFromEnv({});
    setLang('en');

    applyProfileLang('vi');
    expect(getLang()).toBe('en');
  });

  it('ignores an unset preference rather than resetting the language', () => {
    initLangFromEnv({ LANG: 'vi_VN.UTF-8' });
    applyProfileLang(undefined);
    expect(getLang()).toBe('vi');
  });
});

describe('model picker', () => {
  afterEach(() => {
    setLang('zh');
  });

  it('reproduces upstream wording verbatim on the default pack', () => {
    // This fork adds languages; it does not reword the original.
    const labels = new Map(supportedModels('claude').map((m) => [m.value, m.label]));
    expect(labels.get('claude-opus-4-8')).toBe('Opus 4.8（最新）');
    expect(labels.get('default')).toBe('跟随默认（不指定）');
  });

  it('warns about quota cost in the picker itself, where the choice is made', () => {
    setLang('vi');
    const vi = new Map(supportedModels('claude').map((m) => [m.value, m.label]));
    expect(vi.get('claude-opus-4-8')).toContain('token 5h');
    expect(vi.get('claude-haiku-4-5')).toContain('tốn ít token nhất');

    setLang('en');
    const en = new Map(supportedModels('claude').map((m) => [m.value, m.label]));
    expect(en.get('claude-opus-4-8')).toContain('burns your quota fastest');
  });

  it('keeps model names untranslated — they are proper nouns', () => {
    for (const lang of ['zh', 'en', 'vi'] as const) {
      setLang(lang);
      for (const model of supportedModels('claude')) {
        if (model.value === 'default') continue;
        expect(model.label).toMatch(/Opus|Sonnet|Haiku/);
      }
    }
  });

  it('offers the same values in every language, so a stored choice stays valid', () => {
    const values = (lang: 'zh' | 'en' | 'vi'): string[] => {
      setLang(lang);
      return supportedModels('claude').map((m) => m.value);
    };
    expect(values('vi')).toEqual(values('zh'));
    expect(values('en')).toEqual(values('zh'));
  });
});

describe('cards follow the active language', () => {
  afterEach(() => {
    setLang('zh');
  });

  const render = (lang: 'zh' | 'en' | 'vi'): string => {
    setLang(lang);
    return JSON.stringify(helpCard('Claude Code'));
  };

  it('renders /help in the active language, buttons included', () => {
    expect(render('zh')).toContain('💡 使用帮助');
    expect(render('en')).toContain('💡 Help');
    expect(render('vi')).toContain('💡 Trợ giúp');

    setLang('vi');
    const vi = JSON.stringify(helpCard('Claude Code'));
    expect(vi).toContain('Thư mục làm việc');
    expect(vi).not.toMatch(/[一-鿿]/);
  });

  it('reproduces upstream wording verbatim on the default pack', () => {
    const zh = render('zh');
    expect(zh).toContain('清空当前 chat 的会话');
    expect(zh).toContain('📊 状态');
  });

  it('keeps slash commands and the agent name untranslated', () => {
    // The command text is what the user types — translating it would make the
    // help card lie. The agent name is a proper noun.
    for (const lang of ['zh', 'en', 'vi'] as const) {
      const card = render(lang);
      expect(card).toContain('/reset');
      expect(card).toContain('/doctor');
      expect(card).toContain('Claude Code');
    }
  });

  it('localises the workspaces card, including the empty state', () => {
    setLang('vi');
    const vi = JSON.stringify(workspacesCard(undefined, {}));
    expect(vi).toContain('Chưa lưu thư mục nào');
    expect(vi).not.toMatch(/[一-鿿]/);

    setLang('zh');
    expect(JSON.stringify(workspacesCard(undefined, {}))).toContain('暂无命名工作目录。');
  });

  it('marks the current workspace in the active language', () => {
    setLang('vi');
    const card = JSON.stringify(workspacesCard('/tmp/a', { a: '/tmp/a', b: '/tmp/b' }));
    expect(card).toContain('đang dùng');
    expect(card).toContain('Chuyển sang đây');
    expect(card).not.toMatch(/[一-鿿]/);
  });
});

describe('message packs', () => {
  afterEach(() => {
    setLang('zh');
  });

  it('starts on Chinese without an explicit selection', () => {
    expect(getLang()).toBe('zh');
    expect(t().wizard.appCreated).toBe('✓ 应用创建成功');
  });

  it('switches the pack returned by t()', () => {
    setLang('vi');
    expect(t().wizard.scanPrompt).toContain('quét mã QR');
    setLang('en');
    expect(t().wizard.scanPrompt).toContain('Scan this QR code');
  });

  it('interpolates parameters in every language', () => {
    setLang('vi');
    expect(t().wizard.qrExpiry(5)).toContain('5');
    setLang('en');
    expect(t().wizard.qrExpiry(5)).toContain('5');
    setLang('zh');
    expect(t().wizard.qrExpiry(5)).toBe('二维码有效期：约 5 分钟');
  });
});

describe('preflight diagnostics follow the active language', () => {
  afterEach(() => {
    setLang('zh');
  });

  it('reports a missing agent in Vietnamese', () => {
    setLang('vi');
    const message = formatAgentPreflightError(notFound('Claude Code'));

    expect(message).toContain('Không tìm thấy Claude Code trên máy này');
    expect(message).toContain('Hãy cài Claude Code trước');
    expect(message).toContain('Mã lỗi: agent-binary-not-found');
    expect(message).not.toMatch(/[一-鿿]/);
  });

  it('reports a missing agent in English', () => {
    setLang('en');
    const message = formatAgentPreflightError(notFound('Claude Code'));

    expect(message).toContain('Claude Code was not found on this machine');
    expect(message).toContain('Error code: agent-binary-not-found');
    expect(message).not.toMatch(/[一-鿿]/);
  });

  it('keeps the original Chinese wording on the default pack', () => {
    const message = formatAgentPreflightError(notFound('Claude Code'));

    expect(message).toContain('✗ 未找到本地 Claude Code。');
    expect(message).toContain('错误码：agent-binary-not-found');
  });

  it('keeps the shared report shape across languages', () => {
    // title, blank line, what-to-do, error code — the second line is the
    // separator that makes the terminal output scannable.
    for (const lang of ['zh', 'en', 'vi'] as const) {
      setLang(lang);
      const lines = formatAgentPreflightError(notFound('Codex CLI')).split('\n');
      expect(lines[1]).toBe('');
      expect(lines).toHaveLength(4);
      expect(lines[0]?.startsWith('✗')).toBe(true);
    }
  });
});
