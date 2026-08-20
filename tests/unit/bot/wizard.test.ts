import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requestScopeGrantLink, runRegistrationWizard } from '../../../src/bot/wizard';
import { setLang } from '../../../src/i18n';

const sdk = vi.hoisted(() => ({
  registerApp: vi.fn(),
}));

vi.mock('@larksuite/channel', () => ({
  registerApp: sdk.registerApp,
}));

vi.mock('qrcode-terminal', () => ({
  default: { generate: vi.fn() },
}));

/** The host `registerApp` was asked to mint the QR / link on. */
const domainOf = (call: number): string | undefined =>
  sdk.registerApp.mock.calls[call]?.[0]?.domain;

/** Stand-in for a completed scan. */
const scanResult = (tenantBrand?: 'feishu' | 'lark') => ({
  client_id: 'cli_wizard',
  client_secret: 'wizard-secret',
  ...(tenantBrand ? { user_info: { tenant_brand: tenantBrand, open_id: 'ou_1' } } : {}),
});

describe('registration wizard tenant host', () => {
  beforeEach(() => {
    sdk.registerApp.mockReset();
    setLang('en');
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('mints the QR on Lark international by default', async () => {
    // Upstream defaults to the Feishu host and only switches after the scan,
    // which is too late: an international user is looking at a console they
    // cannot sign in to.
    sdk.registerApp.mockResolvedValue(scanResult('lark'));

    const cfg = await runRegistrationWizard();

    expect(domainOf(0)).toBe('accounts.larksuite.com');
    expect(cfg.accounts.app.tenant).toBe('lark');
  });

  it('uses the Feishu host when the China tenant is requested', async () => {
    sdk.registerApp.mockResolvedValue(scanResult('feishu'));

    const cfg = await runRegistrationWizard('feishu');

    expect(domainOf(0)).toBe('accounts.feishu.cn');
    expect(cfg.accounts.app.tenant).toBe('feishu');
  });

  it('keeps the requested brand when the scan reports no tenant', async () => {
    // A missing `user_info` used to fall back to `feishu`, writing the wrong
    // API host into the config of an app that was just created on Lark.
    sdk.registerApp.mockResolvedValue(scanResult());

    const cfg = await runRegistrationWizard();

    expect(cfg.accounts.app.tenant).toBe('lark');
  });

  it('lets the scan result override the requested brand', async () => {
    sdk.registerApp.mockResolvedValue(scanResult('feishu'));

    const cfg = await runRegistrationWizard('lark');

    expect(cfg.accounts.app.tenant).toBe('feishu');
  });

  it('tells the operator which console the QR leads to, and how to switch', async () => {
    sdk.registerApp.mockResolvedValue(scanResult('lark'));
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    await runRegistrationWizard();

    const printed = log.mock.calls.map((c) => String(c[0])).join('\n');
    expect(printed).toContain('larksuite.com');
    expect(printed).toContain('--tenant feishu');
  });

  it('does not offer the Feishu switch when Feishu is already in use', async () => {
    sdk.registerApp.mockResolvedValue(scanResult('feishu'));
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    await runRegistrationWizard('feishu');

    const printed = log.mock.calls.map((c) => String(c[0])).join('\n');
    expect(printed).not.toContain('--tenant feishu');
  });

  it('suppresses the switch hint when the caller already asked the brand question', async () => {
    // The interactive brand picker (src/cli/app-setup.ts) and an explicit
    // --tenant flag both already answer this; printing "wrong one? switch to
    // Feishu" one line later second-guesses an answer just given.
    sdk.registerApp.mockResolvedValue(scanResult('lark'));
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    await runRegistrationWizard('lark', { showSwitchHint: false });

    const printed = log.mock.calls.map((c) => String(c[0])).join('\n');
    expect(printed).not.toContain('--tenant feishu');
  });

  it('shows the switch hint by default, for callers that never asked', async () => {
    sdk.registerApp.mockResolvedValue(scanResult('lark'));
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    await runRegistrationWizard('lark');

    const printed = log.mock.calls.map((c) => String(c[0])).join('\n');
    expect(printed).toContain('--tenant feishu');
  });
});

describe('incremental scope grant link', () => {
  beforeEach(() => {
    sdk.registerApp.mockReset();
  });

  it('mints the link on the brand the app lives on', async () => {
    sdk.registerApp.mockImplementation(async (opts: { onQRCodeReady: (i: unknown) => void }) => {
      // Deferred on purpose: the real SDK fires this callback after
      // `registerApp` has returned, which is what lets the caller reference
      // the `completion` promise from inside it.
      await Promise.resolve();
      opts.onQRCodeReady({ url: 'https://example.test/grant', expireIn: 600 });
      return scanResult('feishu');
    });

    await requestScopeGrantLink({
      appId: 'cli_existing',
      tenantScopes: ['im:message.group_msg'],
      tenant: 'feishu',
    });

    expect(domainOf(0)).toBe('accounts.feishu.cn');
  });

  it('defaults to the Lark host like the wizard does', async () => {
    sdk.registerApp.mockImplementation(async (opts: { onQRCodeReady: (i: unknown) => void }) => {
      // Deferred on purpose: the real SDK fires this callback after
      // `registerApp` has returned, which is what lets the caller reference
      // the `completion` promise from inside it.
      await Promise.resolve();
      opts.onQRCodeReady({ url: 'https://example.test/grant', expireIn: 600 });
      return scanResult('lark');
    });

    await requestScopeGrantLink({
      appId: 'cli_existing',
      tenantScopes: ['im:message.group_msg'],
    });

    expect(domainOf(0)).toBe('accounts.larksuite.com');
  });
});
