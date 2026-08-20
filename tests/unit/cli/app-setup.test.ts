import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  normalizePastedValue,
  promptExistingAppCredentials,
  runFirstRunAppSetup,
  SetupCancelledError,
} from '../../../src/cli/app-setup';
import { setLang } from '../../../src/i18n';

const clack = vi.hoisted(() => ({
  select: vi.fn(),
  confirm: vi.fn(),
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  isCancel: vi.fn((v: unknown) => v === CANCEL),
}));
const CANCEL = Symbol('cancel');

vi.mock('@clack/prompts', () => clack);

const wizard = vi.hoisted(() => ({ runRegistrationWizard: vi.fn() }));
vi.mock('../../../src/bot/wizard', () => ({
  runRegistrationWizard: wizard.runRegistrationWizard,
  DEFAULT_TENANT: 'lark',
}));

const prompts = vi.hoisted(() => ({ promptLine: vi.fn(), promptPassword: vi.fn() }));
vi.mock('../../../src/cli/prompt', () => prompts);

const auth = vi.hoisted(() => ({
  validateAppCredentials: vi.fn(),
  validateAppCredentialsAnyTenant: vi.fn(),
}));
vi.mock('../../../src/utils/feishu-auth', () => auth);

const createdApp = (tenant: 'feishu' | 'lark') => ({
  accounts: { app: { id: 'cli_qr', secret: 'qr-secret', tenant } },
});

beforeEach(() => {
  vi.clearAllMocks();
  clack.isCancel.mockImplementation((v: unknown) => v === CANCEL);
  setLang('en');
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('SetupCancelledError', () => {
  it('carries the name the top-level CLI catch already special-cases', () => {
    // src/cli/index.ts exits 0 (instead of printing an uncaught `Error:`)
    // only for err.name === 'UserCancelledError' — the same string the
    // sibling agent picker in profile-runtime.ts throws under.
    expect(new SetupCancelledError('nope').name).toBe('UserCancelledError');
  });
});

describe('first-run setup path', () => {
  it('asks which brand the operator is on instead of assuming one', async () => {
    // The bug this closes: a Feishu operator running the documented command
    // was handed a larksuite.com QR code and found out only by scanning it.
    clack.select.mockResolvedValue('qr-feishu');
    wizard.runRegistrationWizard.mockResolvedValue(createdApp('feishu'));

    const cfg = await runFirstRunAppSetup({ interactive: true });

    expect(wizard.runRegistrationWizard).toHaveBeenCalledWith('feishu', { showSwitchHint: false });
    expect(cfg.accounts.app.tenant).toBe('feishu');
  });

  it('treats --tenant as the answer and skips the question', async () => {
    wizard.runRegistrationWizard.mockResolvedValue(createdApp('feishu'));

    await runFirstRunAppSetup({ tenant: 'feishu', interactive: true });

    expect(clack.select).not.toHaveBeenCalled();
    expect(wizard.runRegistrationWizard).toHaveBeenCalledWith('feishu', { showSwitchHint: false });
  });

  it('never prompts when there is no terminal to prompt on, and lets the wizard hint stand', async () => {
    // Nobody was asked here — the brand is a silent default, not an answer —
    // so the wizard's own "wrong one?" hint is still the only guidance the
    // operator gets, and must stay on.
    wizard.runRegistrationWizard.mockResolvedValue(createdApp('lark'));

    await runFirstRunAppSetup({ interactive: false });

    expect(clack.select).not.toHaveBeenCalled();
    expect(wizard.runRegistrationWizard).toHaveBeenCalledWith('lark', { showSwitchHint: true });
  });

  it('leads with Feishu on a Chinese-locale terminal', async () => {
    setLang('zh');
    clack.select.mockResolvedValue('qr-feishu');
    wizard.runRegistrationWizard.mockResolvedValue(createdApp('feishu'));

    await runFirstRunAppSetup({ interactive: true });

    expect(clack.select.mock.calls[0]?.[0].initialValue).toBe('qr-feishu');
  });

  it('stops quietly when the operator cancels the picker', async () => {
    clack.select.mockResolvedValue(CANCEL);

    await expect(runFirstRunAppSetup({ interactive: true })).rejects.toThrow(/cancelled/i);
    expect(wizard.runRegistrationWizard).not.toHaveBeenCalled();
  });
});

describe('developer-console fallback', () => {
  it('takes App ID and Secret by hand, and detects which brand they belong to', async () => {
    // No brand question here: the credentials are the authority on that.
    clack.select.mockResolvedValue('manual');
    prompts.promptLine.mockResolvedValue('cli_manual');
    prompts.promptPassword.mockResolvedValue('manual-secret');
    auth.validateAppCredentialsAnyTenant.mockResolvedValue({
      ok: true,
      tenant: 'feishu',
      botName: 'Bridge Bot',
    });

    const cfg = await runFirstRunAppSetup({ interactive: true });

    expect(cfg.accounts.app).toEqual({
      id: 'cli_manual',
      secret: 'manual-secret',
      tenant: 'feishu',
    });
    expect(auth.validateAppCredentials).not.toHaveBeenCalled();
  });

  it('re-asks in place when the credentials are rejected', async () => {
    prompts.promptLine.mockResolvedValue('cli_manual');
    prompts.promptPassword
      .mockResolvedValueOnce('typo-secret')
      .mockResolvedValueOnce('right-secret');
    auth.validateAppCredentialsAnyTenant
      .mockResolvedValueOnce({ ok: false, tenant: 'lark', reason: 'code 10003' })
      .mockResolvedValueOnce({ ok: true, tenant: 'lark' });

    const cfg = await promptExistingAppCredentials('lark');

    expect(cfg.accounts.app.secret).toBe('right-secret');
    expect(auth.validateAppCredentialsAnyTenant).toHaveBeenCalledTimes(2);
  });

  it('gives up with an explanation rather than looping forever', async () => {
    prompts.promptLine.mockResolvedValue('cli_manual');
    prompts.promptPassword.mockResolvedValue('never-right');
    auth.validateAppCredentialsAnyTenant.mockResolvedValue({
      ok: false,
      tenant: 'lark',
      reason: 'code 10003',
    });

    await expect(promptExistingAppCredentials('lark')).rejects.toThrow(/Could not verify/);
  });

  it('rejects a value that is not an App ID before asking for the secret', async () => {
    prompts.promptLine.mockResolvedValueOnce('my app').mockResolvedValue('cli_manual');
    prompts.promptPassword.mockResolvedValue('manual-secret');
    auth.validateAppCredentialsAnyTenant.mockResolvedValue({ ok: true, tenant: 'lark' });

    const cfg = await promptExistingAppCredentials('lark');

    expect(cfg.accounts.app.id).toBe('cli_manual');
    expect(prompts.promptPassword).toHaveBeenCalledTimes(1);
  });

  it('fails clearly instead of sending a blank App ID to the server', async () => {
    // Three empty/invalid App ID submissions used to fall through to a live
    // token request with app_id: '', reported back as "wrong secret".
    prompts.promptLine.mockResolvedValue('');

    await expect(promptExistingAppCredentials('lark')).rejects.toThrow(
      /still doesn't look like an App ID/,
    );
    expect(prompts.promptPassword).not.toHaveBeenCalled();
    expect(auth.validateAppCredentialsAnyTenant).not.toHaveBeenCalled();
  });

  it('retries an empty secret paste without re-asking the App ID or spending a credential attempt', async () => {
    prompts.promptLine.mockResolvedValue('cli_manual');
    prompts.promptPassword
      .mockResolvedValueOnce('') // fat-fingered past the muted prompt
      .mockResolvedValueOnce('') // twice
      .mockResolvedValueOnce('right-secret');
    auth.validateAppCredentialsAnyTenant.mockResolvedValue({ ok: true, tenant: 'lark' });

    const cfg = await promptExistingAppCredentials('lark');

    expect(cfg.accounts.app.secret).toBe('right-secret');
    // Only one App ID prompt for all three secret attempts.
    expect(prompts.promptLine).toHaveBeenCalledTimes(1);
    // Only one real validation call — the two empty pastes never reached it.
    expect(auth.validateAppCredentialsAnyTenant).toHaveBeenCalledTimes(1);
  });

  it('gives up on a secret that never comes through', async () => {
    prompts.promptLine.mockResolvedValue('cli_manual');
    prompts.promptPassword.mockResolvedValue('');

    await expect(promptExistingAppCredentials('lark')).rejects.toThrow(
      /Still no App Secret came through/,
    );
    expect(auth.validateAppCredentialsAnyTenant).not.toHaveBeenCalled();
  });

  it('checks only the known brand, and never replays the secret to the other host', async () => {
    // tenantKnown=true: the operator already told us the brand (an explicit
    // --tenant, or the one they just picked), so a typo must not spill the
    // secret onto the other brand's host.
    prompts.promptLine.mockResolvedValue('cli_manual');
    prompts.promptPassword.mockResolvedValue('manual-secret');
    auth.validateAppCredentials.mockResolvedValue({ ok: true, botName: 'Bridge Bot' });

    const cfg = await promptExistingAppCredentials('lark', true);

    expect(cfg.accounts.app.tenant).toBe('lark');
    expect(auth.validateAppCredentials).toHaveBeenCalledWith('cli_manual', 'manual-secret', 'lark');
    expect(auth.validateAppCredentialsAnyTenant).not.toHaveBeenCalled();
  });

  it('offers the console route when the QR flow is refused, checking only the attempted brand', async () => {
    // Organizations that forbid self-serve app creation land here, and used
    // to land on a stack trace.
    clack.select.mockResolvedValue('qr-lark');
    wizard.runRegistrationWizard.mockRejectedValue(new Error('app creation forbidden'));
    clack.confirm.mockResolvedValue(true);
    prompts.promptLine.mockResolvedValue('cli_manual');
    prompts.promptPassword.mockResolvedValue('manual-secret');
    auth.validateAppCredentials.mockResolvedValue({ ok: true });

    const cfg = await runFirstRunAppSetup({ interactive: true });

    expect(cfg.accounts.app.id).toBe('cli_manual');
    expect(cfg.accounts.app.tenant).toBe('lark');
    expect(auth.validateAppCredentials).toHaveBeenCalledWith('cli_manual', 'manual-secret', 'lark');
    expect(auth.validateAppCredentialsAnyTenant).not.toHaveBeenCalled();
  });

  it('surfaces the original QR failure when the console route is declined', async () => {
    clack.select.mockResolvedValue('qr-lark');
    wizard.runRegistrationWizard.mockRejectedValue(new Error('app creation forbidden'));
    clack.confirm.mockResolvedValue(false);

    await expect(runFirstRunAppSetup({ interactive: true })).rejects.toThrow(
      /app creation forbidden/,
    );
  });
});

describe('normalizePastedValue', () => {
  it('keeps a clean value untouched', () => {
    expect(normalizePastedValue('cli_a1b2c3')).toBe('cli_a1b2c3');
  });

  it('drops the label people copy along with the value', () => {
    expect(normalizePastedValue('App ID: cli_a1b2c3')).toBe('cli_a1b2c3');
    expect(normalizePastedValue('App Secret：s3cr3t')).toBe('s3cr3t');
  });

  it('drops quotes and the zero-width characters browsers paste', () => {
    expect(normalizePastedValue('"cli_a1b2c3"')).toBe('cli_a1b2c3');
    expect(normalizePastedValue('​cli_a1b2c3﻿')).toBe('cli_a1b2c3');
  });
});
