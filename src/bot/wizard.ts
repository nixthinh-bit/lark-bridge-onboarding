import { registerApp } from '@larksuite/channel';
import qrcode from 'qrcode-terminal';
import type { AppConfig, TenantBrand } from '../config/schema';
import { t } from '../i18n';

/**
 * Auth host the QR / authorization link is minted on, per tenant.
 *
 * The SDK defaults to the Feishu host and only switches to Lark *after* a
 * successful scan (the poll reports `tenant_brand: 'lark'`) — which is one
 * step too late for an international user: what they see first is a Chinese
 * Feishu console page they cannot sign in to. This fork therefore picks the
 * host up front, and defaults to Lark.
 */
const AUTH_DOMAIN: Record<TenantBrand, string> = {
  lark: 'accounts.larksuite.com',
  feishu: 'accounts.feishu.cn',
};

/**
 * Tenant assumed when nobody said otherwise. Upstream assumes `feishu`; this
 * fork exists for international Lark users, so it assumes `lark` and lets
 * `--tenant feishu` opt back in.
 */
export const DEFAULT_TENANT: TenantBrand = 'lark';

export interface ScopeGrantLink {
  /** Authorization URL — opening it lands on the confirm page with the new
   * scopes pre-filled as a diff against the existing app. */
  url: string;
  /** Seconds until the link expires. */
  expireIn: number;
  /** Resolves once the user finishes re-authorizing; rejects on
   * expiry/abort/error. Detached callers can await this to confirm success. */
  completion: Promise<void>;
}

/**
 * Build an incremental-scope authorization link for an EXISTING app via
 * `registerApp({ appId, addons })`. Unlike {@link runRegistrationWizard}
 * (terminal QR for first-time creation), this is for the in-chat `/config`
 * flow: we surface the URL the moment it's ready and push it to the user.
 *
 * The returned `completion` promise resolves only after the user authorizes,
 * so callers can `void`-await it to send a follow-up confirmation.
 *
 * The link is minted on the caller's own tenant host ({@link AUTH_DOMAIN}) —
 * the app already exists here, so its brand is known and there is nothing to
 * auto-detect. Sending a Lark tenant to the Feishu host would hand them a
 * console they cannot sign in to.
 */
export async function requestScopeGrantLink(opts: {
  appId: string;
  /** App-identity (tenant) scopes to request, e.g. `['im:message.group_msg']`. */
  tenantScopes: string[];
  /** Brand the app lives on. Defaults to {@link DEFAULT_TENANT}. */
  tenant?: TenantBrand;
  signal?: AbortSignal;
}): Promise<ScopeGrantLink> {
  return new Promise<ScopeGrantLink>((resolve, reject) => {
    let urlDelivered = false;
    // registerApp returns synchronously and fires onQRCodeReady later, so
    // `completion` is assigned before the callback can reference it.
    const completion = registerApp({
      source: 'lark-channel-bridge',
      domain: AUTH_DOMAIN[opts.tenant ?? DEFAULT_TENANT],
      appId: opts.appId,
      addons: { scopes: { tenant: opts.tenantScopes } },
      ...(opts.signal ? { signal: opts.signal } : {}),
      onQRCodeReady: (info) => {
        urlDelivered = true;
        resolve({ url: info.url, expireIn: info.expireIn, completion });
      },
    }).then(() => undefined);
    // If registerApp rejects before ever delivering a URL (e.g. the initial
    // `begin` request fails), surface that failure to the caller.
    completion.catch((err) => {
      if (!urlDelivered) reject(err);
    });
  });
}

/**
 * First-run QR flow: create the Lark app by scanning, no developer console.
 *
 * @param tenant Brand to create the app on. Defaults to {@link DEFAULT_TENANT}
 *   (Lark international); pass `feishu` for a China tenant.
 * @param opts.showSwitchHint Whether to print the "wrong one? switch to
 *   Feishu" hint. Only meaningful when `tenant` was *assumed* rather than
 *   answered — e.g. a non-interactive first run that silently defaults to
 *   Lark. When the operator was just asked (an interactive brand picker, or
 *   an explicit `--tenant` flag) the hint second-guesses an answer they gave
 *   one step ago, so callers that already asked pass `false`.
 */
export async function runRegistrationWizard(
  tenant: TenantBrand = DEFAULT_TENANT,
  opts: { showSwitchHint?: boolean } = {},
): Promise<AppConfig> {
  const showSwitchHint = opts.showSwitchHint ?? true;
  const m = t().wizard;
  console.log(`\n${m.noAppConfig}\n`);
  // Say which brand this QR belongs to before it renders. Scanning with the
  // wrong app is the single most common first-run failure, and the QR itself
  // gives no clue which console it leads to.
  console.log(tenant === 'feishu' ? m.tenantFeishu : m.tenantLark);
  if (tenant !== 'feishu' && showSwitchHint) console.log(`${m.switchToFeishuHint}\n`);

  const result = await registerApp({
    source: 'lark-channel-bridge',
    domain: AUTH_DOMAIN[tenant],
    onQRCodeReady: (info) => {
      console.log(`${m.scanPrompt}\n`);
      qrcode.generate(info.url, { small: true });
      const mins = Math.max(1, Math.round(info.expireIn / 60));
      console.log(`\n${m.qrExpiry(mins)}`);
      console.log(`${m.openInBrowser(info.url)}\n`);
    },
    onStatusChange: (info) => {
      if (info.status === 'domain_switched') {
        console.log(m.domainSwitched);
      } else if (info.status === 'slow_down') {
        console.log(m.slowedDown);
      }
    },
  });

  // What the scan reports wins — the SDK may have switched hosts mid-flow.
  // Falling back to the requested brand (not a hardcoded `feishu`) keeps a
  // missing `user_info` from writing the wrong host into the config.
  const resolvedTenant: TenantBrand = result.user_info?.tenant_brand ?? tenant;
  const operatorOpenId = result.user_info?.open_id;

  console.log(`\n${m.appCreated}`);
  console.log(`  App ID:  ${result.client_id}`);
  console.log(`  Tenant:  ${resolvedTenant}`);
  console.log(operatorOpenId ? m.creator(operatorOpenId) : m.creatorUnresolved);

  // No access fields are seeded here. The bot creator is resolved at
  // runtime from the Lark application API (`application/v6/applications`),
  // and the QR scanner is naturally the app's owner, so they'll get
  // unconditional bypass on the very first message — no config edit needed.
  // `allowedUsers` / `allowedChats` / `admins` stay empty (= nobody outside
  // the creator) until the operator tightens via `/config`.

  const cfg: AppConfig = {
    accounts: {
      app: {
        id: result.client_id,
        secret: result.client_secret,
        tenant: resolvedTenant,
      },
    },
  };

  console.log('');
  return cfg;
}
