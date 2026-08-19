import * as p from '@clack/prompts';
import { DEFAULT_TENANT, runRegistrationWizard } from '../bot/wizard';
import type { AppConfig, TenantBrand } from '../config/schema';
import { getLang, t } from '../i18n';
import { validateAppCredentialsAnyTenant } from '../utils/feishu-auth';
import { promptLine, promptPassword } from './prompt';

/** How many times we re-ask for credentials before giving up on the run. */
const MAX_CREDENTIAL_ATTEMPTS = 3;

/** Bounded on its own so a fat-fingered paste never eats a whole attempt. */
const MAX_APP_ID_ATTEMPTS = 3;

/**
 * Both brands mint custom-app identifiers in this shape. Checking it locally
 * turns "your credentials were rejected" — which reads as a wrong secret —
 * into a specific complaint about the field that is actually wrong, before we
 * ask for the secret at all.
 */
const APP_ID_PATTERN = /^cli_[A-Za-z0-9_-]+$/;

export type SetupPath = 'qr-lark' | 'qr-feishu' | 'manual';

/** Cancellation is a choice, not a crash — callers exit quietly on this. */
export class SetupCancelledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SetupCancelledError';
  }
}

/** How a brand is named to the operator, reusing the picker's own labels. */
export function brandLabel(tenant: TenantBrand): string {
  return tenant === 'feishu' ? t().setup.pathFeishu : t().setup.pathLark;
}

/**
 * First-run app setup: ask what the operator has, then take them there.
 *
 * Before this, the brand was a flag with a default. A Feishu user who ran the
 * documented command got a larksuite.com QR code, and the only way to learn
 * that was to scan it and land on a console that would not let them sign in —
 * the fix being a sentence of prose above the code telling them to Ctrl-C and
 * retype the command with `--tenant feishu`. Making it the first question
 * costs one keypress on the happy path and removes that failure entirely.
 *
 * The third option exists for the other way this stalls: organizations that
 * forbid creating apps by scanning. Those operators have to use the developer
 * console, and used to be left assembling `--app-id` on a command line. Now
 * the terminal asks for the two values and checks them on the spot.
 *
 * An explicit `--tenant` is already an answer, so it skips the question.
 */
export async function runFirstRunAppSetup(opts: {
  /** Brand from `--tenant`, if the operator named one. */
  tenant?: TenantBrand;
  /** False in tests and non-TTY callers: no questions, just the QR flow. */
  interactive?: boolean;
}): Promise<AppConfig> {
  const interactive = opts.interactive ?? true;
  if (opts.tenant) return runQrSetup(opts.tenant, interactive);
  if (!interactive) return runQrSetup(DEFAULT_TENANT, false);

  const path = await askSetupPath();
  if (path === 'manual') return promptExistingAppCredentials(defaultTenantForLocale());
  return runQrSetup(path === 'qr-feishu' ? 'feishu' : 'lark', true);
}

/**
 * Run the QR wizard, and offer the paste flow if it fails.
 *
 * The most common failure here is an organization that blocks self-serve app
 * creation, which is not something the operator did wrong and not something
 * retrying the QR will fix. Offering the console route at the moment of
 * failure keeps them in the same terminal session instead of sending them to
 * the README to find a flag.
 */
async function runQrSetup(tenant: TenantBrand, interactive: boolean): Promise<AppConfig> {
  try {
    return await runRegistrationWizard(tenant);
  } catch (err) {
    if (!interactive) throw err;
    const m = t().setup;
    console.log(`\n${m.qrFailed(err instanceof Error ? err.message : String(err))}`);
    console.log(`${m.offerManualAfterQrFailure}\n`);
    const proceed = await p.confirm({ message: m.pathManual, initialValue: false });
    if (p.isCancel(proceed) || !proceed) throw err;
    return promptExistingAppCredentials(tenant);
  }
}

async function askSetupPath(): Promise<SetupPath> {
  const m = t().setup;
  const options = [
    { value: 'qr-lark' as const, label: m.pathLark, hint: m.pathLarkHint },
    { value: 'qr-feishu' as const, label: m.pathFeishu, hint: m.pathFeishuHint },
    { value: 'manual' as const, label: m.pathManual, hint: m.pathManualHint },
  ];
  p.intro(m.intro);
  const choice = await p.select<SetupPath>({
    message: m.pathQuestion,
    options,
    initialValue: defaultTenantForLocale() === 'feishu' ? 'qr-feishu' : 'qr-lark',
  });
  if (p.isCancel(choice)) {
    p.cancel(m.cancelled);
    throw new SetupCancelledError(m.cancelled);
  }
  // Close the prompt block before the QR code takes over the terminal, and
  // leave the choice on screen: the QR itself gives no clue which site it
  // belongs to, and that is exactly what people get wrong.
  p.outro(options.find((option) => option.value === choice)?.label ?? '');
  return choice;
}

/**
 * Take an App ID and Secret by hand, for an app that already exists.
 *
 * Everything here is aimed at the paste going wrong rather than the operator
 * being wrong: values are cleaned of the label and quotes that come along when
 * you copy a row out of a console, the muted secret prompt says up front that
 * it will show nothing, and a rejection re-asks in place instead of ending the
 * process with a stack trace. The brand is not asked for at all — the
 * credentials know which one they belong to.
 */
export async function promptExistingAppCredentials(
  preferred: TenantBrand = DEFAULT_TENANT,
): Promise<AppConfig> {
  const m = t().setup;
  console.log(`\n${m.manualIntro}`);
  console.log(`${m.manualWhereToFind}\n`);

  for (let attempt = 1; attempt <= MAX_CREDENTIAL_ATTEMPTS; attempt += 1) {
    const appId = await promptAppId();
    console.log(m.secretHidden);
    const appSecret = normalizePastedValue(await promptPassword(m.secretPrompt));
    if (!appSecret) {
      console.log(`${m.secretEmpty}\n`);
      continue;
    }

    console.log(m.validating);
    const result = await validateAppCredentialsAnyTenant(appId, appSecret, preferred);
    if (result.ok) {
      if (result.tenant !== preferred) console.log(m.tenantCorrected(brandLabel(result.tenant)));
      console.log(
        result.botName
          ? t().bootstrap.credentialsOkNamed(result.botName)
          : t().bootstrap.credentialsOk,
      );
      return {
        accounts: { app: { id: appId, secret: appSecret, tenant: result.tenant } },
      };
    }
    console.log(`${m.validationFailed(result.reason ?? '?')}\n`);
  }

  throw new Error(m.exhausted);
}

async function promptAppId(): Promise<string> {
  const m = t().setup;
  let last = '';
  for (let attempt = 1; attempt <= MAX_APP_ID_ATTEMPTS; attempt += 1) {
    last = normalizePastedValue(await promptLine(m.appIdPrompt));
    if (APP_ID_PATTERN.test(last)) return last;
    console.log(m.appIdInvalid);
  }
  // Out of retries: hand the last value to the server anyway rather than
  // failing on our own guess at the format. If it really is an App ID in a
  // shape we don't know, the token exchange is the honest place to find out.
  return last;
}

/**
 * Clean a value pasted out of a browser.
 *
 * People copy the whole row — label, colon and all — and browsers throw in
 * zero-width characters that survive a trim and quietly break an exact-match
 * credential.
 */
export function normalizePastedValue(raw: string): string {
  return raw
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .replace(/^(?:app\s*id|app_id|app\s*secret|app_secret|应用\s*id)\s*[:：=]\s*/i, '')
    .replace(/^["'`]+|["'`]+$/g, '')
    .trim();
}

/**
 * Brand to lead with when nobody has said. A Chinese-locale terminal is a
 * strong hint of a feishu.cn tenant; everyone else gets Lark, which is what
 * this fork exists for.
 */
function defaultTenantForLocale(): TenantBrand {
  return getLang() === 'zh' ? 'feishu' : DEFAULT_TENANT;
}
