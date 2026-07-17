import { afterEach, describe, expect, it } from 'vitest';
import { AgentPreflightError, formatAgentPreflightError } from '../../../src/agent/preflight.js';
import { detectLang, getLang, setLang, t } from '../../../src/i18n/index.js';

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
