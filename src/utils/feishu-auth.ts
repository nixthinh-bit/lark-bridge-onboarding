import type { TenantBrand } from '../config/schema';
import { t } from '../i18n';

const ENDPOINTS: Record<TenantBrand, string> = {
  feishu: 'https://open.feishu.cn',
  lark: 'https://open.larksuite.com',
};

/**
 * Neither call below had a timeout: a blackholed host (a proxy, a firewalled
 * corporate network) left "Checking the credentials…" hanging forever, and
 * {@link validateAppCredentialsAnyTenant} can stack up to four such requests
 * behind it. Bounding each one turns a silent hang into a reportable
 * `networkError`.
 */
const FETCH_TIMEOUT_MS = 15_000;

export interface ValidationResult {
  ok: boolean;
  reason?: string;
  botName?: string;
  botOpenId?: string;
}

/** A {@link ValidationResult} that also says which brand answered. */
export interface TenantValidationResult extends ValidationResult {
  tenant: TenantBrand;
}

interface TokenResp {
  code?: number;
  msg?: string;
  tenant_access_token?: string;
}

interface BotInfoResp {
  code?: number;
  bot?: {
    activate_status?: number;
    app_name?: string;
    open_id?: string;
  };
}

/**
 * Validate app credentials by exchanging them for a tenant_access_token. If
 * that succeeds, also try to fetch the bot's display name (best-effort).
 */
export async function validateAppCredentials(
  appId: string,
  appSecret: string,
  tenant: TenantBrand,
): Promise<ValidationResult> {
  const base = ENDPOINTS[tenant];
  const m = t().auth;
  let resp: Response;
  try {
    resp = await fetch(`${base}/open-apis/auth/v3/tenant_access_token/internal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    return { ok: false, reason: m.networkError(err instanceof Error ? err.message : String(err)) };
  }
  if (!resp.ok) return { ok: false, reason: m.httpStatus(resp.status) };

  let data: TokenResp;
  try {
    data = (await resp.json()) as TokenResp;
  } catch {
    return { ok: false, reason: m.badJson };
  }
  if (data.code !== 0 || !data.tenant_access_token) {
    return { ok: false, reason: m.rejected(String(data.code ?? '?'), data.msg ?? '<no msg>') };
  }

  const info = await fetchBotInfo(base, data.tenant_access_token).catch(() => undefined);
  return { ok: true, botName: info?.bot?.app_name, botOpenId: info?.bot?.open_id };
}

/**
 * Validate against `preferred`, and — only if that brand says no — against the
 * other one.
 *
 * Which brand a set of credentials belongs to is not something a no-code
 * operator can be expected to know: Feishu and Lark share a console layout, a
 * credential format, and (in Vietnamese and English alike) a product name. An
 * app created on feishu.cn simply does not exist on open.larksuite.com, so
 * checking the wrong host returns a flat rejection that reads as "your App
 * Secret is wrong" — which sends people back to re-copy a secret that was
 * right all along. Asking both hosts turns that dead end into a fact we can
 * report, and the answer is authoritative: the tenant that minted a token for
 * these credentials is the tenant the app lives on.
 *
 * The second call costs one round-trip on a path that is already failing, and
 * is skipped entirely on the happy path.
 */
export async function validateAppCredentialsAnyTenant(
  appId: string,
  appSecret: string,
  preferred: TenantBrand,
): Promise<TenantValidationResult> {
  const other: TenantBrand = preferred === 'feishu' ? 'lark' : 'feishu';

  const preferredResult = await validateAppCredentials(appId, appSecret, preferred);
  if (preferredResult.ok) return { ...preferredResult, tenant: preferred };

  const otherResult = await validateAppCredentials(appId, appSecret, other);
  if (otherResult.ok) return { ...otherResult, tenant: other };

  // Both refused. Report the brand the caller asked about — its rejection is
  // the one that answers the question they actually posed.
  return { ...preferredResult, tenant: preferred };
}

async function fetchBotInfo(base: string, token: string): Promise<BotInfoResp | undefined> {
  const resp = await fetch(`${base}/open-apis/bot/v3/info`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!resp.ok) return undefined;
  return (await resp.json()) as BotInfoResp;
}
