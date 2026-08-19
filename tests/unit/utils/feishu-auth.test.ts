import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { validateAppCredentialsAnyTenant } from '../../../src/utils/feishu-auth';
import { setLang } from '../../../src/i18n';

/** Minimal stand-in for the token endpoint, answering per host. */
const respond = (bodyByHost: Record<string, unknown>) =>
  vi.fn(async (url: string | URL) => {
    const href = String(url);
    const host = href.includes('open.feishu.cn') ? 'feishu' : 'lark';
    // The bot-info follow-up is best-effort; 404 it so the name stays absent.
    if (href.includes('/bot/v3/info')) return new Response('', { status: 404 });
    return new Response(JSON.stringify(bodyByHost[host] ?? { code: 10003, msg: 'no such app' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });

const granted = { code: 0, tenant_access_token: 't-token' };
const refused = { code: 10003, msg: 'invalid app_id' };

describe('validateAppCredentialsAnyTenant', () => {
  beforeEach(() => setLang('en'));
  afterEach(() => vi.unstubAllGlobals());

  it('stops at the preferred brand when it accepts the credentials', async () => {
    const fetchMock = respond({ lark: granted, feishu: granted });
    vi.stubGlobal('fetch', fetchMock);

    const result = await validateAppCredentialsAnyTenant('cli_x', 's', 'lark');

    expect(result).toMatchObject({ ok: true, tenant: 'lark' });
    // The other host is never asked on the happy path.
    expect(fetchMock.mock.calls.every(([url]) => String(url).includes('larksuite.com'))).toBe(true);
  });

  it('finds the app on the other brand when the preferred one refuses', async () => {
    // The failure this exists for: a Feishu operator whose credentials are
    // perfectly good, checked against the international host by default.
    vi.stubGlobal('fetch', respond({ lark: refused, feishu: granted }));

    const result = await validateAppCredentialsAnyTenant('cli_x', 's', 'lark');

    expect(result).toMatchObject({ ok: true, tenant: 'feishu' });
  });

  it("reports the requested brand's rejection when neither accepts", async () => {
    vi.stubGlobal('fetch', respond({ lark: refused, feishu: refused }));

    const result = await validateAppCredentialsAnyTenant('cli_x', 's', 'feishu');

    expect(result.ok).toBe(false);
    expect(result.tenant).toBe('feishu');
    expect(result.reason).toContain('10003');
  });

  it("speaks the operator's language in failure reasons", async () => {
    setLang('vi');
    vi.stubGlobal('fetch', respond({ lark: refused, feishu: refused }));

    const result = await validateAppCredentialsAnyTenant('cli_x', 's', 'lark');

    expect(result.reason).toContain('máy chủ từ chối');
  });
});
