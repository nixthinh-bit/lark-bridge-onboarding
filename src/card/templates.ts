import { t } from '../i18n';

interface ButtonSpec {
  text: string;
  value: Record<string, unknown>;
  style?: 'primary' | 'danger' | 'default';
}

function button(spec: ButtonSpec): object {
  return {
    tag: 'button',
    text: { tag: 'plain_text', content: spec.text },
    type: spec.style ?? 'default',
    value: spec.value,
  };
}

function divMd(content: string): object {
  return { tag: 'div', text: { tag: 'lark_md', content } };
}

function actions(buttons: ButtonSpec[]): object {
  return { tag: 'action', actions: buttons.map(button) };
}

const HR: object = { tag: 'hr' };

function shell(title: string, elements: object[]): object {
  return {
    config: { wide_screen_mode: true, update_multi: true },
    header: { title: { tag: 'plain_text', content: title } },
    elements,
  };
}

export function workspacesCard(current: string | undefined, named: Record<string, string>): object {
  const m = t().cards.workspaces;
  const btn = t().cards.buttons;
  const entries = Object.entries(named);
  const elements: object[] = [];

  elements.push(divMd(m.currentCwd(escapeCode(current ?? m.unset))));

  if (entries.length === 0) {
    elements.push(HR);
    elements.push(divMd(m.empty));
    elements.push(divMd(m.saveHint));
  } else {
    elements.push(HR);
    entries.forEach(([name, path], i) => {
      const marker = path === current ? m.currentMarker : '';
      elements.push(divMd(`**${escapeMd(name)}** → \`${escapeCode(path)}\`${marker}`));
      elements.push(
        actions([
          { text: btn.switchHere, value: { cmd: 'ws.use', name }, style: 'primary' },
          { text: btn.remove, value: { cmd: 'ws.remove', name }, style: 'danger' },
        ]),
      );
      if (i < entries.length - 1) elements.push(HR);
    });
  }

  return shell(m.title, elements);
}

export interface StatusInfo {
  profileName: string;
  cwd?: string;
  sessionId?: string;
  emptySessionText?: string;
  sessionStale: boolean;
  agentName: string;
  runtimeAccess: {
    label: string;
    value: string;
  };
  larkCliStatus?: 'app' | 'user-ready' | 'user-missing' | 'check-failed';
  activeRun: boolean;
  activeScopes?: string[];
  activeCommentScopes?: string[];
  queue?: { active: number; waiting: number; cap: number };
  ownerState: string;
  /** Session scope (= chatId or chatId:threadId in topic groups). */
  scope: string;
  /** Chat mode — used to label scope. */
  chatMode: 'p2p' | 'group' | 'topic';
}

export function statusCard(info: StatusInfo): object {
  const m = t().cards.status;
  const btn = t().cards.buttons;
  const sessionLine = info.sessionId
    ? `\`${info.sessionId.slice(0, 8)}…\`${info.sessionStale ? m.staleSession : ''}`
    : (info.emptySessionText ?? m.noSession);
  // For topic groups, surface that the scope is per-topic so the user
  // knows /cd / /new only affect this topic.
  const scopeLine =
    info.chatMode === 'topic'
      ? `\`${escapeCode(info.scope)}\` ${m.topicScopeNote}`
      : `\`${escapeCode(info.scope)}\``;
  const cwdLine = info.cwd ? `\`${escapeCode(info.cwd)}\`` : m.accessLabelFallback;
  const queueLine = info.queue
    ? `${info.queue.active}/${info.queue.cap} active, ${info.queue.waiting} waiting`
    : 'unknown';
  const lines = [
    `🧭 **scope**: ${scopeLine}`,
    `🧩 **profile**: ${escapeMd(info.profileName)}`,
    `📁 **cwd**: ${cwdLine}`,
    `🔗 **session**: ${sessionLine}`,
    `🤖 **agent**: ${escapeMd(info.agentName)}`,
    `🛡 **${escapeMd(info.runtimeAccess.label)}**: ${escapeMd(info.runtimeAccess.value)}`,
    ...(info.larkCliStatus ? [`🔐 **lark-cli**: ${info.larkCliStatus}`] : []),
    `🏃 **active run**: ${info.activeRun ? 'yes' : 'no'}`,
    ...(info.activeScopes && info.activeScopes.length > 0
      ? [
          `🏃 **active scopes**: ${info.activeScopes.map((scope) => `\`${escapeCode(scope)}\``).join(', ')}`,
        ]
      : []),
    ...(info.activeCommentScopes && info.activeCommentScopes.length > 0
      ? [
          `📝 **comment runs**: ${info.activeCommentScopes.map((scope) => `\`${escapeCode(scope)}\``).join(', ')}`,
        ]
      : []),
    `🚦 **queue**: ${queueLine}`,
    `👤 **owner API**: ${escapeMd(info.ownerState)}`,
  ];
  return shell(m.title, [
    divMd(lines.join('\n')),
    HR,
    actions([
      { text: btn.newSession, value: { cmd: 'new' }, style: 'primary' },
      { text: btn.resumeSession, value: { cmd: 'resume' } },
      { text: btn.workspaces, value: { cmd: 'ws.list' } },
      { text: btn.help, value: { cmd: 'help' } },
    ]),
  ]);
}

export interface ResumeEntry {
  sessionId: string;
  displayId?: string;
  preview: string;
  relTime: string;
  lineCount?: number;
  detail?: string;
  current?: boolean;
}

export function resumeCard(cwd: string, entries: ResumeEntry[]): object {
  const m = t().cards.resume;
  const elements: object[] = [];
  elements.push(divMd(m.currentCwd(escapeCode(cwd))));

  if (entries.length === 0) {
    elements.push(HR);
    elements.push(divMd(m.empty));
    return shell(m.title, elements);
  }

  elements.push(HR);
  entries.forEach((e, i) => {
    const marker = e.current ? m.currentMarker : '';
    const detail = e.detail ?? m.lineCount(e.lineCount ?? 0);
    const displayId = e.displayId ?? e.sessionId;
    elements.push(
      divMd(
        `**${i + 1}.** ${escapeMd(e.preview)}${marker}\n\`${displayId.slice(0, 8)}…\` · ${e.relTime} · ${escapeMd(detail)}`,
      ),
    );
    elements.push(
      actions([
        {
          text: e.current ? m.alreadyCurrent : m.restore,
          value: { cmd: 'resume.use', arg: e.sessionId },
          style: e.current ? 'default' : 'primary',
        },
      ]),
    );
    if (i < entries.length - 1) elements.push(HR);
  });

  return shell(m.title, elements);
}

export function helpCard(agentName = 'Agent'): object {
  const m = t().cards.help;
  const btn = t().cards.buttons;
  const escapedAgentName = escapeMd(agentName);
  return shell(m.title, [
    divMd(
      [
        m.commandsHeading,
        '',
        ...m.rows(escapedAgentName),
        '',
        m.fallthrough(escapedAgentName),
      ].join('\n'),
    ),
    HR,
    actions([
      { text: btn.status, value: { cmd: 'status' }, style: 'primary' },
      { text: btn.resumeSession, value: { cmd: 'resume' } },
      { text: btn.workspaces, value: { cmd: 'ws.list' } },
      { text: btn.newSession, value: { cmd: 'new' } },
    ]),
  ]);
}

function escapeMd(s: string): string {
  return s.replace(/([*_`\\])/g, '\\$1');
}

function escapeCode(s: string): string {
  return s.replace(/`/g, "'");
}
