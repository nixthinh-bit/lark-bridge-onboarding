import * as p from '@clack/prompts';
import { DEFAULT_TENANT, runRegistrationWizard } from '../bot/wizard';
import type { AppConfig, TenantBrand } from '../config/schema';
import { getLang, t } from '../i18n';
import { validateAppCredentials, validateAppCredentialsAnyTenant } from '../utils/feishu-auth';
import { promptLine, promptPassword } from './prompt';

/** How many times we re-ask for App ID + Secret before giving up on the run. */
const MAX_CREDENTIAL_ATTEMPTS = 3;

/** Bounded on its own so a malformed App ID never reaches the network. */
const MAX_APP_ID_ATTEMPTS = 3;

/**
 * Bounded separately from {@link MAX_CREDENTIAL_ATTEMPTS}: a muted prompt is
 * easy to paste past (common over SSH or a Windows terminal), and an empty
 * paste is not a wrong secret. Retrying it here costs nothing — no request
 * goes out, and the App ID already entered is not re-asked.
 */
const MAX_SECRET_ATTEMPTS = 3;

/**
 * Both brands mint custom-app identifiers in this shape. Checking it locally
 * turns "your credentials were rejected" — which reads as a wrong secret —
 * into a specific complaint about the field that is actually wrong, before we
 * ask for the secret at all.
 */
const APP_ID_PATTERN = /^cli_[A-Za-z0-9_-]+$/;

export type SetupPath = 'qr-lark' | 'qr-feishu' | 'manual';

/**
 * Cancellation is a choice, not a crash — callers exit quietly on this.
 *
 * The `name` is `UserCancelledError`, not `SetupCancelledError`: that is the
 * string `src/cli/index.ts`'s top-level catch already special-cases (it is
 * also what the sibling agent picker in `profile-runtime.ts` throws), so
 * Ctrl-C here prints the cancellation message once and exits 0, instead of
 * printing it via `p.cancel()` and then again as an uncaught `Error:`.
 */
export class SetupCancelledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserCancelledError';
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
  // `askedBrand` tracks whether *this call* already answered the brand
  // question — via an explicit `--tenant` or the picker below — so
  // `runQrSetup` knows whether the wizard's own "wrong one?" hint would be
  // useful (nobody was asked) or redundant (they were just asked).
  if (opts.tenant) return runQrSetup(opts.tenant, interactive, true);
  if (!interactive) return runQrSetup(DEFAULT_TENANT, false, false);

  const path = await askSetupPath();
  // The brand question was never asked for the manual path — the operator's
  // pasted credentials answer it instead, so `tenantKnown` stays false and
  // both hosts get checked.
  if (path === 'manual') return promptExistingAppCredentials(defaultTenantForLocale(), false);
  return runQrSetup(path === 'qr-feishu' ? 'feishu' : 'lark', true, true);
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
async function runQrSetup(
  tenant: TenantBrand,
  interactive: boolean,
  askedBrand: boolean,
): Promise<AppConfig> {
  try {
    return await runRegistrationWizard(tenant, { showSwitchHint: !askedBrand });
  } catch (err) {
    if (!interactive) throw err;
    const m = t().setup;
    console.log(`\n${m.qrFailed(err instanceof Error ? err.message : String(err))}`);
    console.log(`${m.offerManualAfterQrFailure}\n`);
    const proceed = await p.confirm({ message: m.confirmManualNow, initialValue: false });
    if (p.isCancel(proceed) || !proceed) throw err;
    // `tenant` here is what the operator already told us — an explicit
    // `--tenant`, or the brand they just picked — so only that host is
    // checked. Replaying a typo'd secret against the other brand's host
    // would send it somewhere it was never meant to go.
    return promptExistingAppCredentials(tenant, true);
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
    // A distinct message for the thrown error, not `m.cancelled` again: the
    // top-level catch in `cli/index.ts` prints whatever this error carries,
    // and printing the same "Setup cancelled." p.cancel() just showed would
    // read as the same line twice. `bootstrap.startCancelled` is the generic
    // "the run stopped here" message already used by the sibling agent
    // picker for the same reason.
    throw new SetupCancelledError(t().bootstrap.startCancelled);
  }
  // Close the prompt block before the QR code takes over the terminal. No
  // message: the picker already leaves the chosen label on screen, and the
  // wizard names the site again on the line above the QR code.
  p.outro();
  return choice;
}

/**
 * Take an App ID and Secret by hand, for an app that already exists.
 *
 * Everything here is aimed at the paste going wrong rather than the operator
 * being wrong: values are cleaned of the label and quotes that come along when
 * you copy a row out of a console, the muted secret prompt says up front that
 * it will show nothing, and a rejection re-asks in place instead of ending the
 * process with a stack trace.
 *
 * @param preferred Brand to validate against first — or, when `tenantKnown`,
 *   the *only* brand checked.
 * @param tenantKnown True when the operator already told us the brand (an
 *   explicit `--tenant`, or a QR attempt on `preferred` that failed for an
 *   unrelated reason): only `preferred` is checked, so a typo'd secret is
 *   never replayed against the other brand's host. False (the top-level
 *   "I already created an app" choice, where nothing about the brand is
 *   known) checks both hosts and keeps whichever accepts the credentials.
 */
export async function promptExistingAppCredentials(
  preferred: TenantBrand = DEFAULT_TENANT,
  tenantKnown = false,
): Promise<AppConfig> {
  const m = t().setup;
  console.log(`\n${m.manualIntro}`);
  console.log(`${m.manualWhereToFind}\n`);
  console.log(`${m.manualScopeNote}\n`);

  for (let attempt = 1; attempt <= MAX_CREDENTIAL_ATTEMPTS; attempt += 1) {
    const appId = await promptAppId();
    const appSecret = await promptSecret();

    console.log(m.validating);
    const result = tenantKnown
      ? { ...(await validateAppCredentials(appId, appSecret, preferred)), tenant: preferred }
      : await validateAppCredentialsAnyTenant(appId, appSecret, preferred);
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
  for (let attempt = 1; attempt <= MAX_APP_ID_ATTEMPTS; attempt += 1) {
    const value = normalizePastedValue(await promptLine(m.appIdPrompt));
    if (APP_ID_PATTERN.test(value)) return value;
    console.log(m.appIdInvalid);
  }
  // Out of retries: fail clearly rather than sending a value we already know
  // is not shaped like an App ID (possibly empty) into a live token request.
  throw new Error(m.appIdExhausted);
}

/**
 * Prompt for the App Secret, retrying on an empty paste without touching the
 * caller's credential-attempt budget or asking for the App ID again. A muted
 * prompt is easy to paste past — especially over SSH or a Windows terminal —
 * and a blank paste is not a wrong secret.
 */
async function promptSecret(): Promise<string> {
  const m = t().setup;
  console.log(m.secretHidden);
  for (let attempt = 1; attempt <= MAX_SECRET_ATTEMPTS; attempt += 1) {
    const secret = normalizePastedValue(await promptPassword(m.secretPrompt));
    if (secret) return secret;
    console.log(`${m.secretEmpty}\n`);
  }
  throw new Error(m.secretExhausted);
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
 *
 * Exported so the bare `--app-id` bootstrap path (no `--tenant`) leads with
 * the same locale-aware guess as the interactive picker, instead of always
 * trying Lark first regardless of locale.
 */
export function defaultTenantForLocale(): TenantBrand {
  return getLang() === 'zh' ? 'feishu' : DEFAULT_TENANT;
}
