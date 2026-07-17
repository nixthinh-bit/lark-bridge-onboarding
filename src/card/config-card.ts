import { modelLabel, supportedModels } from '../agent/models';
import { t, type Lang } from '../i18n';
import type { KnownChat } from '../bot/lark-info';
import type { AgentKind, LarkCliIdentityPreset, ProfileMode } from '../config/profile-schema';
import type { CotMessagesMode, MessageReplyMode } from '../config/schema';

/** Endonyms — each language names itself, so the picker is readable from any. */
const LANG_LABEL: Record<Lang, string> = {
  zh: '中文',
  en: 'English',
  vi: 'Tiếng Việt',
};

export interface ConfigFormOpts {
  /** Language the bridge writes in. Also the language of this card. */
  lang: Lang;
  /** Profile's agent kind — decides which model catalog the picker shows. */
  agentKind: AgentKind;
  /** Deployment mode: 'personal' (default) or 'team'. */
  mode: ProfileMode;
  /** Current model selection (a value from {@link supportedModels}). */
  model: string;
  messageReply: MessageReplyMode;
  showToolCalls: boolean;
  cotMessages: CotMessagesMode;
  maxConcurrentRuns: number;
  /** 0 means "disabled". */
  runIdleTimeoutMinutes: number;
  requireMentionInGroup: boolean;
  larkCliIdentity: LarkCliIdentityPreset;
  allowedUsers: string[];
  allowedChats: string[];
  admins: string[];
  knownChats: KnownChat[];
}

function collapsedAccessPanel(title: string, elements: object[]): object {
  return {
    tag: 'collapsible_panel',
    expanded: false,
    header: {
      title: { tag: 'markdown', content: title },
      vertical_align: 'center',
      icon: {
        tag: 'standard_icon',
        token: 'down-small-ccm_outlined',
        size: '16px 16px',
      },
      icon_position: 'follow_text',
      icon_expanded_angle: -180,
    },
    border: { color: 'blue', corner_radius: '5px' },
    vertical_spacing: '8px',
    padding: '8px 8px 8px 8px',
    elements,
  };
}

function atMentionLine(openIds: string[]): string {
  if (openIds.length === 0) return t().cards.config.none;
  return openIds.map((id) => `<at id="${id}"></at>`).join('  ');
}

function chatList(chatIds: string[], knownChats: KnownChat[]): string {
  if (chatIds.length === 0) return t().cards.config.none;
  const nameMap = new Map(knownChats.map((chat) => [chat.id, chat.name]));
  return chatIds
    .map((id) => `- **${nameMap.get(id) ?? t().cards.config.unknownChat}**（...${id.slice(-6)}）`)
    .join('\n');
}

/** Form card for `/config`. */
export function configFormCard(opts: ConfigFormOpts): object {
  const teamMode = opts.mode === 'team';
  const m = t().cards.config;
  const teamOverrideNote = m.teamOverrideNote;
  const accessElements: object[] = [
    ...(teamMode
      ? [
          {
            tag: 'markdown',
            content:
              m.accessTeamNote,
          },
          { tag: 'hr' },
        ]
      : []),
    {
      tag: 'markdown',
      content: m.accessNote,
    },
    { tag: 'hr' },
    {
      tag: 'markdown',
      content:
        `${m.accessUsersHeading(opts.allowedUsers.length)}\n` +
        `${atMentionLine(opts.allowedUsers)}\n\n` +
        m.accessUsersHint,
    },
    { tag: 'hr' },
    {
      tag: 'markdown',
      content:
        `${m.accessChatsHeading(opts.allowedChats.length)}\n` +
        `${chatList(opts.allowedChats, opts.knownChats)}\n\n` +
        `${m.accessChatsAllHint}\n` +
        m.accessChatsHint,
    },
    { tag: 'hr' },
    {
      tag: 'markdown',
      content:
        `${m.accessAdminsHeading(opts.admins.length)}\n` +
        `${atMentionLine(opts.admins)}\n\n` +
        `${m.accessAdminsNote}\n\n` +
        m.accessAdminsHint,
    },
  ];

  return {
    schema: '2.0',
    config: { summary: { content: m.summary } },
    body: {
      elements: [
        {
          tag: 'markdown',
          content:
            `${m.title}\n\n${m.intro}`,
        },
        { tag: 'hr' },
        {
          tag: 'form',
          name: 'config_form',
          elements: [
            // Deliberately first, and deliberately labelled in all three
            // languages: someone who cannot read the current one has to be
            // able to find this control, and it is the only way out.
            {
              tag: 'markdown',
              content:
                m.langHeading +
                '\n_Bot 回复和卡片使用的语言。守护进程没有系统语言环境，所以这里选定后会记住。_' +
                '\n_The language of cards and replies. Stored here because the daemon has no OS locale._' +
                '\n_Ngôn ngữ của thẻ và tin nhắn. Lưu ở đây vì tiến trình nền không có ngôn ngữ hệ thống._',
            },
            {
              tag: 'select_static',
              name: 'lang',
              initial_option: opts.lang,
              options: [
                { text: { tag: 'plain_text', content: '中文' }, value: 'zh' },
                { text: { tag: 'plain_text', content: 'English' }, value: 'en' },
                { text: { tag: 'plain_text', content: 'Tiếng Việt' }, value: 'vi' },
              ],
            },
            { tag: 'hr' },
            {
              tag: 'markdown',
              content:
                `${m.modeHeading}\n${m.modePersonalNote}\n${m.modeTeamNote}`,
            },
            {
              tag: 'select_static',
              name: 'deploy_mode',
              initial_option: opts.mode,
              options: [
                { text: { tag: 'plain_text', content: m.modePersonal }, value: 'personal' },
                { text: { tag: 'plain_text', content: m.modeTeam }, value: 'team' },
              ],
            },
            { tag: 'hr' },
            {
              tag: 'markdown',
              content:
                `${m.modelHeading}\n${m.modelNote}\n${m.modelDefaultNote}`,
            },
            {
              tag: 'select_static',
              name: 'model',
              initial_option: opts.model,
              options: supportedModels(opts.agentKind).map((model) => ({
                text: { tag: 'plain_text', content: model.label },
                value: model.value,
              })),
            },
            { tag: 'hr' },
            {
              tag: 'markdown',
              content:
                `${m.replyHeading}\n${m.replyTextNote}\n${m.replyMarkdownNote}`,
            },
            {
              tag: 'select_static',
              name: 'message_reply',
              // 'card' (交互卡片) is hidden from the picker for now; existing
              // configs with `messageReply: 'card'` still work — showConfigForm
              // displays them as 'markdown' in the form, but submitting only
              // overwrites if the user actually picks something.
              initial_option: opts.messageReply === 'card' ? 'markdown' : opts.messageReply,
              options: [
                { text: { tag: 'plain_text', content: m.replyText }, value: 'text' },
                { text: { tag: 'plain_text', content: m.replyMarkdown }, value: 'markdown' },
              ],
            },
            {
              tag: 'markdown',
              content:
                `${m.toolsHeading}\n${m.toolsShowNote}\n${m.toolsHideNote}`,
            },
            {
              tag: 'select_static',
              name: 'show_tool_calls',
              initial_option: opts.showToolCalls ? 'show' : 'hide',
              options: [
                { text: { tag: 'plain_text', content: m.toolsShow }, value: 'show' },
                { text: { tag: 'plain_text', content: m.toolsHide }, value: 'hide' },
              ],
            },
            {
              tag: 'markdown',
              content:
                `${m.cotHeading}\n${m.cotOffNote}\n${m.cotBriefNote}\n${m.cotDetailedNote}`,
            },
            {
              tag: 'select_static',
              name: 'cot_messages',
              initial_option: opts.cotMessages,
              options: [
                { text: { tag: 'plain_text', content: m.cotOff }, value: 'off' },
                { text: { tag: 'plain_text', content: m.cotBrief }, value: 'brief' },
                { text: { tag: 'plain_text', content: m.cotDetailed }, value: 'detailed' },
              ],
            },
            {
              tag: 'markdown',
              content:
                `${m.concurrencyHeading}\n${m.concurrencyNote}\n${m.concurrencyRange}`,
            },
            {
              tag: 'input',
              name: 'max_concurrent_runs',
              default_value: String(opts.maxConcurrentRuns),
              placeholder: { tag: 'plain_text', content: '10' },
              input_type: 'text',
            },
            {
              tag: 'markdown',
              content:
                `${m.idleHeading}\n${m.idleNote}\n${m.idleRange}`,
            },
            {
              tag: 'input',
              name: 'run_idle_timeout_minutes',
              default_value: String(opts.runIdleTimeoutMinutes),
              placeholder: { tag: 'plain_text', content: '0' },
              input_type: 'text',
            },
            {
              tag: 'markdown',
              content:
                `${m.mentionHeading}\n${m.mentionYesNote}\n${m.mentionNoNote}\n${m.mentionAlwaysNote}`,
            },
            {
              tag: 'select_static',
              name: 'require_mention_in_group',
              initial_option: opts.requireMentionInGroup ? 'yes' : 'no',
              options: [
                { text: { tag: 'plain_text', content: m.mentionYes }, value: 'yes' },
                { text: { tag: 'plain_text', content: m.mentionNo }, value: 'no' },
              ],
            },
            {
              tag: 'markdown',
              content:
                `${m.identityHeading}\n${m.identityBotOnlyNote}\n${m.identityUserNote}` +
                (teamMode ? teamOverrideNote : ''),
            },
            {
              tag: 'select_static',
              name: 'lark_cli_identity',
              initial_option: opts.larkCliIdentity,
              options: [
                { text: { tag: 'plain_text', content: m.identityBotOnly }, value: 'bot-only' },
                { text: { tag: 'plain_text', content: m.identityUser }, value: 'user-default' },
              ],
            },
            { tag: 'hr' },
            collapsedAccessPanel(m.accessPanelTitle, accessElements),
            {
              tag: 'column_set',
              flex_mode: 'flow',
              horizontal_spacing: 'small',
              columns: [
                {
                  tag: 'column',
                  width: 'auto',
                  elements: [
                    {
                      tag: 'button',
                      name: 'submit_btn',
                      text: { tag: 'plain_text', content: m.submit },
                      type: 'primary',
                      form_action_type: 'submit',
                      behaviors: [{ type: 'callback', value: { cmd: 'config.submit' } }],
                    },
                  ],
                },
                {
                  tag: 'column',
                  width: 'auto',
                  elements: [
                    {
                      tag: 'button',
                      name: 'cancel_btn',
                      text: { tag: 'plain_text', content: m.cancel },
                      behaviors: [{ type: 'callback', value: { cmd: 'config.cancel' } }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

export function configSavedCard(opts: ConfigFormOpts): object {
  const m = t().cards.config;
  const replyLabel =
    opts.messageReply === 'card'
      ? m.replyCard
      : opts.messageReply === 'markdown'
        ? m.replyMarkdown
        : m.replyText;
  const summarize = (list: string[]): string =>
    list.length === 0 ? m.empty : m.count(list.length);
  const cotLabel = cotMessagesLabel(opts.cotMessages);
  return {
    schema: '2.0',
    config: { summary: { content: m.savedSummary } },
    body: {
      elements: [
        {
          tag: 'markdown',
          content:
            `${m.savedTitle}\n\n` +
            `${m.savedLang}:\`${LANG_LABEL[opts.lang]}\`\n` +
            `${m.savedMode}:\`${opts.mode === 'team' ? m.modeTeam : m.modePersonal}\`\n` +
            `${m.savedModel}:\`${modelLabel(opts.agentKind, opts.model)}\`\n` +
            `${m.savedReply}:${replyLabel}\n` +
            `${m.savedTools}:\`${opts.showToolCalls ? 'show' : 'hide'}\`\n` +
            `${m.savedCot}:\`${cotLabel}\`\n` +
            `${m.savedConcurrency}:\`${opts.maxConcurrentRuns}\`\n` +
            `${m.savedIdle}:\`${opts.runIdleTimeoutMinutes > 0 ? m.minutes(opts.runIdleTimeoutMinutes) : m.off}\`\n` +
            `${m.savedMention}:\`${opts.requireMentionInGroup ? m.yes : m.no}\`\n\n` +
            `${m.savedIdentity}:\`${opts.mode === 'team' ? m.savedIdentityTeamForced : opts.larkCliIdentity === 'user-default' ? m.identityUser : m.identityBotOnly}\`\n\n` +
            m.savedAccess +
            (opts.mode === 'team' ? m.savedAccessTeamNote : '') +
            '\n' +
            `${m.accessUsersHeading(opts.allowedUsers.length)}:${summarize(opts.allowedUsers)}\n` +
            `${m.accessChatsHeading(opts.allowedChats.length)}:${summarize(opts.allowedChats)}\n` +
            `${m.accessAdminsHeading(opts.admins.length)}:${summarize(opts.admins)}\n\n` +
            m.savedEffective,
        },
      ],
    },
  };
}

function cotMessagesLabel(value: CotMessagesMode): string {
  if (value === 'brief') return t().cards.config.cotBrief;
  if (value === 'detailed') return t().cards.config.cotDetailed;
  return t().cards.config.cotOff;
}

/**
 * Shown after `/config` saves "群里不需要 @ bot" but the app is missing the
 * `im:message.group_msg` scope. Guides the user through one-click incremental
 * authorization via the link from `requestScopeGrantLink`.
 */
export function groupMsgScopeGrantCard(url: string, expireMins: number): object {
  const m = t().cards.config;
  return {
    schema: '2.0',
    config: { summary: { content: m.grantSummary } },
    body: {
      elements: [
        {
          tag: 'markdown',
          content:
            `${m.grantTitle}\n\n` +
            `${m.grantWhy}\n\n` +
            `${m.grantLink(expireMins)}\n` +
            `[${m.grantButton}](${url})\n\n` +
            `${m.grantHow}\n` +
            `${m.grantFallback}\n\`${url}\`\n\n` +
            m.grantReconnect,
        },
      ],
    },
  };
}

/** Replaces {@link groupMsgScopeGrantCard} in place once authorization completes. */
export function groupMsgScopeGrantedCard(): object {
  const m = t().cards.config;
  return {
    schema: '2.0',
    config: { summary: { content: m.grantedSummary } },
    body: {
      elements: [
        {
          tag: 'markdown',
          content:
            `${m.grantedTitle}\n\n` +
            `${m.grantedBody}\n\n` +
            m.grantedReconnect,
        },
      ],
    },
  };
}

export function configCancelledCard(): object {
  const m = t().cards.config;
  return {
    schema: '2.0',
    config: { summary: { content: m.cancelledSummary } },
    body: {
      elements: [{ tag: 'markdown', content: m.cancelledBody }],
    },
  };
}

export function configFailedCard(reason: string): object {
  const m = t().cards.config;
  return {
    schema: '2.0',
    config: { summary: { content: m.failedSummary } },
    body: {
      elements: [{ tag: 'markdown', content: m.failedBody(reason) }],
    },
  };
}
