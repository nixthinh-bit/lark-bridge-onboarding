import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  normalizePastedValue,
  promptExistingAppCredentials,
  runFirstRunAppSetup,
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

const auth = vi.hoisted(() => ({ validateAppCredentialsAnyTenant: vi.fn() }));
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

describe('first-run setup path', () => {
  it('asks which brand the operator is on instead of assuming one', async () => {
    // The bug this closes: a Feishu operator running the documented command
    // was handed a larksuite.com QR code and found out only by scanning it.
    clack.select.mockResolvedValue('qr-feishu');
    wizard.runRegistrationWizard.mockResolvedValue(createdApp('feishu'));

    const cfg = await runFirstRunAppSetup({ interactive: true });

    expect(wizard.runRegistrationWizard).toHaveBeenCalledWith('feishu');
    expect(cfg.accounts.app.tenant).toBe('feishu');
  });

  it('treats --tenant as the answer and skips the question', async () => {
    wizard.runRegistrationWizard.mockResolvedValue(createdApp('feishu'));

    await runFirstRunAppSetup({ tenant: 'feishu', interactive: true });

    expect(clack.select).not.toHaveBeenCalled();
    expect(wizard.runRegistrationWizard).toHaveBeenCalledWith('feishu');
  });

  it('never prompts when there is no terminal to prompt on', async () => {
    wizard.runRegistrationWizard.mockResolvedValue(createdApp('lark'));

    await runFirstRunAppSetup({ interactive: false });

    expect(clack.select).not.toHaveBeenCalled();
    expect(wizard.runRegistrationWizard).toHaveBeenCalledWith('lark');
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

  it('offers the console route when the QR flow is refused', async () => {
    // Organizations that forbid self-serve app creation land here, and used
    // to land on a stack trace.
    clack.select.mockResolvedValue('qr-lark');
    wizard.runRegistrationWizard.mockRejectedValue(new Error('app creation forbidden'));
    clack.confirm.mockResolvedValue(true);
    prompts.promptLine.mockResolvedValue('cli_manual');
    prompts.promptPassword.mockResolvedValue('manual-secret');
    auth.validateAppCredentialsAnyTenant.mockResolvedValue({ ok: true, tenant: 'lark' });

    const cfg = await runFirstRunAppSetup({ interactive: true });

    expect(cfg.accounts.app.id).toBe('cli_manual');
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
