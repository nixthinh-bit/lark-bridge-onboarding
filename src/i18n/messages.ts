/**
 * Terminal-facing message catalog.
 *
 * Scope is deliberately narrow: the strings a user reads while *installing* and
 * *first running* the bridge (agent preflight + the QR registration wizard).
 * In-chat card strings are not covered yet.
 *
 * Parameterised strings are functions rather than placeholder templates so the
 * compiler checks every argument at every call site, and a missing translation
 * is a type error rather than a silent `{0}` leaking to the terminal.
 */
export interface Messages {
  wizard: {
    noAppConfig: string;
    scanPrompt: string;
    qrExpiry: (minutes: number) => string;
    openInBrowser: (url: string) => string;
    domainSwitched: string;
    slowedDown: string;
    appCreated: string;
    creator: (openId: string) => string;
    creatorUnresolved: string;
  };
  cards: {
    /** Buttons repeated across cards — one definition, one translation. */
    buttons: {
      newSession: string;
      resumeSession: string;
      workspaces: string;
      help: string;
      status: string;
      switchHere: string;
      remove: string;
    };
    workspaces: {
      title: string;
      currentCwd: (cwd: string) => string;
      unset: string;
      empty: string;
      saveHint: string;
      currentMarker: string;
    };
    status: {
      title: string;
      /** Appended to the session id when the session predates a `/cd`. */
      staleSession: string;
      noSession: string;
      /** Topic groups get their own session; say so or `/new` looks broken. */
      topicScopeNote: string;
      accessLabelFallback: string;
    };
    resume: {
      title: string;
      currentCwd: (cwd: string) => string;
      empty: string;
      currentMarker: string;
      alreadyCurrent: string;
      restore: string;
      lineCount: (n: number) => string;
    };
    help: {
      title: string;
      commandsHeading: string;
      /** `/command — description` rows, in display order. */
      rows: (agentName: string) => string[];
      fallthrough: (agentName: string) => string;
    };
    /**
     * The `/config` form. Each setting is a heading plus the prose that
     * explains what it actually does — that prose is the whole point of the
     * card for someone who doesn't read code, so it is translated in full
     * rather than reduced to a label.
     */
    config: {
      summary: string;
      title: string;
      intro: string;
      submit: string;
      cancel: string;
      langHeading: string;
      modeHeading: string;
      modePersonalNote: string;
      modeTeamNote: string;
      modePersonal: string;
      modeTeam: string;
      modelHeading: string;
      modelNote: string;
      modelDefaultNote: string;
      replyHeading: string;
      replyTextNote: string;
      replyMarkdownNote: string;
      replyText: string;
      replyMarkdown: string;
      replyCard: string;
      toolsHeading: string;
      toolsShowNote: string;
      toolsHideNote: string;
      toolsShow: string;
      toolsHide: string;
      cotHeading: string;
      cotOffNote: string;
      cotBriefNote: string;
      cotDetailedNote: string;
      cotOff: string;
      cotBrief: string;
      cotDetailed: string;
      concurrencyHeading: string;
      concurrencyNote: string;
      concurrencyRange: string;
      idleHeading: string;
      idleNote: string;
      idleRange: string;
      mentionHeading: string;
      mentionYesNote: string;
      mentionNoNote: string;
      mentionAlwaysNote: string;
      mentionYes: string;
      mentionNo: string;
      identityHeading: string;
      identityBotOnlyNote: string;
      identityUserNote: string;
      identityBotOnly: string;
      identityUser: string;
      teamOverrideNote: string;
      accessPanelTitle: string;
      accessTeamNote: string;
      accessNote: string;
      accessUsersHeading: (n: number) => string;
      accessUsersHint: string;
      accessChatsHeading: (n: number) => string;
      accessChatsAllHint: string;
      accessChatsHint: string;
      accessAdminsHeading: (n: number) => string;
      accessAdminsNote: string;
      accessAdminsHint: string;
      none: string;
      unknownChat: string;
      empty: string;
      count: (n: number) => string;
      savedSummary: string;
      savedTitle: string;
      savedLang: string;
      savedMode: string;
      savedModel: string;
      savedReply: string;
      savedTools: string;
      savedCot: string;
      savedConcurrency: string;
      savedIdle: string;
      savedMention: string;
      savedIdentity: string;
      savedIdentityTeamForced: string;
      savedAccess: string;
      savedAccessTeamNote: string;
      savedEffective: string;
      minutes: (n: number) => string;
      off: string;
      yes: string;
      no: string;
      cancelledSummary: string;
      cancelledBody: string;
      failedSummary: string;
      failedBody: (reason: string) => string;
      /** Shown when @-mention was disabled but the app lacks the scope. */
      grantSummary: string;
      grantTitle: string;
      grantWhy: string;
      grantLink: (expireMins: number) => string;
      grantButton: string;
      grantHow: string;
      grantFallback: string;
      grantReconnect: string;
      grantedSummary: string;
      grantedTitle: string;
      grantedBody: string;
      grantedReconnect: string;
    };
    /** The streaming card — what the operator watches on every single run. */
    run: {
      interrupted: string;
      idleTimeout: (minutes: number) => string;
      agentFailed: (message: string) => string;
      noContent: string;
      thinking: string;
      thinkingDone: string;
      noOutput: string;
      toolCalls: (count: number, finished: boolean) => string;
      stopButton: string;
      footerThinking: string;
      footerToolRunning: string;
      footerStreaming: string;
      summaryInterrupted: string;
      summaryIdleTimeout: string;
      summaryError: string;
      summaryDone: string;
      summaryToolRunning: string;
      summaryStreaming: string;
      summaryThinking: string;
      /**
       * Plain-text reply mode — same states, no card to hang them on.
       *
       * `textAgentFailed` exists only because upstream's two renderers differ
       * by one character: the card uses a fullwidth colon after 失败, the text
       * path an ASCII one. Almost certainly a typo, but this fork reproduces
       * upstream's Chinese exactly rather than quietly tidying it, so the two
       * stay separate. Other languages have no such split and repeat the same
       * wording.
       */
      textAgentFailed: (message: string) => string;
      textThinking: string;
      textToolRunning: string;
      textStreaming: string;
      toolRunning: string;
      bodyTruncated: string;
      /** COT progress messages. */
      cotUnderstanding: string;
      cotCallingTool: string;
      cotToolDone: string;
      cotWriting: string;
    };
    /** `/account` — including the form that takes an App Secret. */
    account: {
      currentSummary: string;
      currentTitle: string;
      botName: (name: string) => string;
      unknownBot: string;
      changeButton: string;
      validationFailed: (message: string) => string;
      secretPlaceholder: string;
      tenantFeishu: string;
      tenantLark: string;
      submit: string;
      cancel: string;
      changeSummary: string;
      validatingSummary: string;
      validatingBody: string;
      savedSummary: string;
      savedTitle: string;
      reconnecting: string;
      newBotWarning: string;
      failedSummary: string;
      failedBody: (reason: string) => string;
      cancelledSummary: string;
      cancelledBody: string;
    };
  };
  /**
   * Replies to slash commands. Command names, paths and ids are never
   * translated — they are what the user types or copies back.
   */
  commands: {
    adminOnly: string;
    adminOnlyStopScope: string;
    adminOnlyTimeoutScope: string;
    ackHandled: string;
    resumeApplied: string;
    newSession: string;
    newSessionInterrupted: string;
    chatCreateFailed: (msg: string) => string;
    chatCreatedWithCwd: (cwd: string) => string;
    chatCreated: string;
    chatCreatedNotice: (name: string) => string;
    cdUsage: string;
    cdAbsolute: string;
    cdDone: (cwd: string) => string;
    wsUsage: string;
    wsSaveUsage: string;
    wsSaveNoCwd: string;
    wsSaved: (name: string, cwd: string) => string;
    wsUseUsage: string;
    wsNotFound: (name: string) => string;
    wsSwitched: (name: string, cwd: string) => string;
    wsRemoveUsage: string;
    wsRemoved: (name: string) => string;
    docNoBinding: string;
    resumeNeedsCwd: string;
    resumeDmOnly: string;
    resumeCodexHint: (nonce: string) => string;
    resumeIncompatible: string;
    resumeReselect: string;
    resumeNoCodexThread: string;
    codexSessionUnset: string;
    stopRequested: (scope: string) => string;
    stopNotFound: (scope: string) => string;
    timeoutDisabled: string;
    timeoutUsage: string;
    timeoutSession: (scope: string, effective: string, global: string) => string;
    timeoutSessionFollowsGlobal: (scope: string, global: string) => string;
    timeoutCleared: (global: string) => string;
    timeoutNothingToClear: (global: string) => string;
    timeoutOff: string;
    timeoutOffLabel: string;
    timeoutBadValue: string;
    timeoutSet: (minutes: number) => string;
    minutes: (n: number) => string;
    psNone: string;
    psTableHeader: string;
    psCurrentMarker: string;
    psTitle: (n: number) => string;
    psHint: (processId: string) => string;
    exitUsage: (processId: string) => string;
    exitNotFound: (target: string) => string;
    exitSelf: (id: string) => string;
    exitFailed: (id: string, msg: string) => string;
    exitPending: (id: string) => string;
    exitDone: (id: string) => string;
    agoSeconds: (n: number) => string;
    agoMinutes: (n: number) => string;
    agoHours: (n: number) => string;
    agoDays: (n: number) => string;
    reconnectAfterRun: string;
    reconnectNow: string;
    reconnectFailed: (msg: string) => string;
    doctorRateLimited: string;
    doctorNoWorkspace: string;
    doctorWorkspaceCheck: (visible: string) => string;
    doctorInFlight: string;
    doctorAccepted: string;
    workspaceUnset: string;
    accountUsage: string;
    accountEmptyCreds: string;
    accountSaveFailed: (msg: string) => string;
    inviteNoGroups: string;
    inviteGroupsAdded: (added: number, total: number) => string;
    inviteUsage: string;
    inviteGroupDmError: string;
    inviteGroupAlready: string;
    inviteGroupAdded: (chatId: string) => string;
    inviteNoMention: (kind: string) => string;
    labelUsers: string;
    labelAdmins: string;
    inviteAdded: (names: string, label: string) => string;
    inviteAlready: (names: string, label: string) => string;
    removeUsage: string;
    removeGroupDmError: string;
    removeGroupNotThere: string;
    removeGroupDone: string;
    removeNoMention: (kind: string) => string;
    removeDone: (names: string, label: string) => string;
    removeNotThere: (names: string, label: string) => string;
    configUsage: string;
    saveFailedRollbackFailed: string;
    saveFailedRolledBack: string;
    identityNotApplied: string;
    configNotWritten: string;
  };
  models: {
    /**
     * Picker label per model value. Model names are proper nouns and stay in
     * Latin script everywhere; only the parenthetical hint is translated.
     *
     * The hints exist because the picker is where a no-code operator decides
     * how fast they burn their quota, and the model id alone doesn't say that.
     * Upstream's Chinese labels are reproduced verbatim — this fork adds
     * languages, it does not reword the original.
     */
    labels: Record<string, string>;
  };
  bootstrap: {
    configSaved: (path: string) => string;
    noConfigNonInteractive: string;
    missingSecretNonInteractive: (appId: string) => string;
    appSecretPrompt: (appId: string) => string;
    credentialsOk: string;
    credentialsOkNamed: (botName: string) => string;
    multipleAgentsNonInteractive: string;
    multipleAgentsDetected: string;
    agentPickerIntro: string;
    agentPickerQuestion: string;
    agentPickerCancelled: string;
    agentSelected: (agent: string) => string;
    startCancelled: string;
  };
  preflight: {
    errorCode: (code: string) => string;
    notFoundTitle: (agent: string) => string;
    notFoundHint: (agent: string) => string;
    notExecutableTitle: (agent: string) => string;
    notExecutableHint: (agent: string) => string;
    resolveFailedTitle: (agent: string) => string;
    resolveFailedHint: string;
    notReadableTitle: (agent: string) => string;
    notReadableHint: (agent: string) => string;
    spawnFailedTitle: (agent: string, command: string) => string;
    runCommandHint: string;
    timeoutTitle: (agent: string, command: string) => string;
    timeoutHint: string;
    signaledTitle: (agent: string, command: string, signal: string) => string;
    signaledConfirm: string;
    signaledHint: (agent: string) => string;
    nonzeroExitTitle: (agent: string, command: string, exitCode: string) => string;
    emptyOutputTitle: (agent: string, command: string) => string;
    emptyOutputHint: (agent: string) => string;
  };
}

/**
 * Chinese — the original upstream wording, kept verbatim. This is the default
 * pack, so behaviour is unchanged unless a language is explicitly selected.
 * Existing tests assert against these exact strings; do not reword them.
 */
export const zh: Messages = {
  wizard: {
    noAppConfig: '未检测到飞书应用配置，进入扫码创建向导。',
    scanPrompt: '请用飞书 App 扫描以下二维码完成应用创建：',
    qrExpiry: (minutes) => `二维码有效期：约 ${minutes} 分钟`,
    openInBrowser: (url) => `也可以直接在浏览器打开：${url}`,
    domainSwitched: '识别到国际版租户，已切换到 larksuite.com 域名。',
    slowedDown: '轮询速度过快，已自动降速。',
    appCreated: '✓ 应用创建成功',
    creator: (openId) => `  Creator: ${openId} (Lark 应用 owner，自动豁免访问控制)`,
    creatorUnresolved:
      '  ⚠️ 未拿到扫码用户的 open_id；启动后会通过应用 owner API 解析创建者。',
  },
  cards: {
    // Verbatim from upstream — do not reword.
    buttons: {
      newSession: '🆕 新会话',
      resumeSession: '🔁 恢复会话',
      workspaces: '📂 工作目录',
      help: '💡 帮助',
      status: '📊 状态',
      switchHere: '切换到此处',
      remove: '删除',
    },
    workspaces: {
      title: '📂 工作目录',
      currentCwd: (cwd) => `当前 cwd：\`${cwd}\``,
      unset: '(未设置)',
      empty: '暂无命名工作目录。',
      saveHint: '💡 发送 `/ws save <name>` 把当前 cwd 存为命名工作目录',
      currentMarker: '  ← 当前',
    },
    status: {
      title: '📊 当前状态',
      staleSession: ' ⚠️ 旧 cwd，下一条会新建',
      noSession: '(无)',
      topicScopeNote: '_（话题独立 session）_',
      accessLabelFallback: '(未设置)',
    },
    resume: {
      title: '🔁 恢复历史会话',
      currentCwd: (cwd) => `当前 cwd：\`${cwd}\``,
      empty: '此 cwd 下没有历史会话。',
      currentMarker: '  ← 当前',
      alreadyCurrent: '已是当前会话',
      restore: '▸ 恢复此会话',
      lineCount: (n) => `${n} 条`,
    },
    help: {
      title: '💡 使用帮助',
      commandsHeading: '**命令列表**',
      rows: (agent) => [
        '- `/new` `/reset` — 清空当前 chat 的会话',
        '- `/new chat [name]` — 新建群+新会话，自动拉你进群',
        '- `/resume [N]` — 列出并恢复历史会话（最多 N 条）',
        '- `/cd <path>` — 切换工作目录（会重置 session）',
        '- `/ws list|save <name>|use <name>|remove <name>` — 工作目录',
        '- `/account` — 查看当前应用；`/account change` 换 appId/secret 并重连',
        '- `/config` — 调整偏好、访问控制和 lark-cli 身份策略',
        '- `/status` — 当前状态',
        '- `/stop` — 结束当前正在跑的任务（也可点卡片底部 ⏹ 终止 按钮）',
        '- `/stop comment:<scopeHash>` — 管理员停止云文档评论任务',
        '- `/timeout [N|off|default]` — 当前 session 的探活分钟数,`/config` 改全局默认',
        '- `/timeout comment:<scopeHash> N` — 管理员设置云文档评论任务探活',
        '- `/ps` — 列出本机所有 bot,标识当前正在回复的那个',
        '- `/exit <id|#>` — 关掉指定 bot(用 `/ps` 看 id/序号)',
        '- `/reconnect` — 强制重连 WebSocket(网络抖动后 bot 没反应时用)',
        `- \`/doctor [描述]\` — 把日志和描述交给 ${agent} 自助诊断`,
        '- `/help` — 本帮助',
      ],
      fallthrough: (agent) => `其他内容直接交给 ${agent}。`,
    },
    config: {
      summary: '偏好设置',
      title: '⚙️ **偏好设置**',
      intro: '调整 bot 的行为偏好。改完点提交后写入当前 profile 配置；消息和访问控制设置立即生效。',
      submit: '提交',
      cancel: '取消',
      langHeading: '**语言 / Language / Ngôn ngữ**',
      modeHeading: '**运行模式**',
      modePersonalNote:
        '_个人版(默认):Bot 是你一个人的助手,只有你和白名单用户能用,可携带你的个人授权访问文档/日历等_',
      modeTeamNote:
        '_团队版:Bot 是团队共用的助手,任何人 @ 即可使用(不做白名单校验);为避免他人借 Bot 动用你的个人权限,此模式下 CLI 强制只用应用(bot)身份,不使用个人授权_',
      modePersonal: '个人版(默认)',
      modeTeam: '团队版',
      modelHeading: '**模型**',
      modelNote: '_底层 agent 运行使用的模型_',
      modelDefaultNote: '_「跟随默认」= 不指定,由 CLI/账号决定_',
      replyHeading: '**消息回复方式**',
      replyTextNote: '_纯文本:agent 跑完一次性发出,不流式,体感最轻_',
      replyMarkdownNote: '_消息卡片:轻量流式 markdown 卡片,飞书原生打字机动画_',
      replyText: '纯文本',
      replyMarkdown: '消息卡片(默认)',
      replyCard: '交互卡片',
      toolsHeading: '\n**工具调用显示**',
      toolsShowNote: '_显示:可以看到 bot 跑了什么命令、读了哪些文件等过程_',
      toolsHideNote: '_隐藏:只看 agent 最终的文字答复,跳过所有工具块_',
      toolsShow: '显示(默认)',
      toolsHide: '隐藏',
      cotHeading: '\n**COT 过程消息**',
      cotOffNote: '_关闭:只发送最终回复_',
      cotBriefNote: '_简略:展示 agent 过程文本和工具摘要_',
      cotDetailedNote: '_详细:额外展示工具参数和输出摘要_',
      cotOff: '关闭',
      cotBrief: '简略',
      cotDetailed: '详细',
      concurrencyHeading: '\n**并发上限**',
      concurrencyNote: '_全局同时运行的 agent 进程数(主要影响话题群多话题并行场景)_',
      concurrencyRange: '_默认 10,范围 1-50。超出的请求会 FIFO 排队_',
      idleHeading: '\n**run 探活(分钟)**',
      idleNote: '_agent 长时间没输出时自动 kill,防止假死_',
      idleRange: '_0 = 关闭(默认),范围 1-120。可被 `/timeout` 在单个 scope 覆盖_',
      mentionHeading: '\n**群里需要 @ bot**',
      mentionYesNote: '_是(默认):群和话题群里,不 @ bot 的消息不会触发回复,bot 不接群里聊天_',
      mentionNoNote: '_否:任何消息都会发给 agent(0.1.21 及更早版本的行为)_',
      mentionAlwaysNote: '_私聊永远不需要 @;`@全员` 永远不响应_',
      mentionYes: '是(默认)',
      mentionNo: '否',
      identityHeading: '\n**lark-cli 身份策略**',
      identityBotOnlyNote: '_只允许应用身份:使用 bot/app 能力,不访问个人资源_',
      identityUserNote:
        '_允许用户身份:保留应用身份,并允许已授权用户访问个人日历、邮箱、云盘等资源_',
      identityBotOnly: '只允许应用身份',
      identityUser: '允许用户身份',
      teamOverrideNote:
        '\n\n_⚠️ 团队版已开启：本项被覆盖 —— 身份强制为「只允许应用身份」、访问控制不生效。切回个人版后恢复。_',
      accessPanelTitle: '🔒 **访问控制**（点击展开）',
      accessTeamNote:
        '_⚠️ **团队版已开启**：访问控制暂不生效 —— 任何人 @ bot 都能使用（管理命令仍限 owner/管理员）。切回个人版后以下白名单恢复生效。_',
      accessNote:
        '_控制谁能通过私聊和群聊使用 bot。**留空 = 不响应聊天消息**。云文档评论按文档权限生效。_',
      accessUsersHeading: (n) => `**允许私聊的用户**（共 ${n} 人）`,
      accessUsersHint: '_加 / 删：_ `/invite user @某人`  `/remove user @某人`',
      accessChatsHeading: (n) => `**允许响应的群**（共 ${n} 个）`,
      accessChatsAllHint: '_一键加全部 bot 所在的群：_ `/invite all group`',
      accessChatsHint: '_加 / 删（在目标群里发）：_ `/invite group`  `/remove group`',
      accessAdminsHeading: (n) => `**管理员**（共 ${n} 人）`,
      accessAdminsNote:
        '_可以跑敏感命令：`/account` `/config` `/exit` `/reconnect` `/doctor` `/cd` `/ws` `/invite` `/remove`。管理员也自动获得私聊权限，并可在未白名单群里管理访问控制。_',
      accessAdminsHint: '_加 / 删：_ `/invite admin @某人`  `/remove admin @某人`',
      none: '_（暂无）_',
      unknownChat: '(未知群)',
      empty: '_(空)_',
      count: (n) => `${n} 项`,
      savedSummary: '偏好已保存',
      savedTitle: '✅ **偏好已保存**',
      savedLang: '**语言 / Language**',
      savedMode: '**运行模式**',
      savedModel: '**模型**',
      savedReply: '**消息回复方式**',
      savedTools: '**工具调用显示**',
      savedCot: '**COT 过程消息**',
      savedConcurrency: '**并发上限**',
      savedIdle: '**run 探活**',
      savedMention: '**群里需要 @ bot**',
      savedIdentity: '**lark-cli 身份策略**',
      savedIdentityTeamForced: '只允许应用身份(团队版强制)',
      savedAccess: '🔒 **访问控制**',
      savedAccessTeamNote: '（_团队版下不生效,任何人可用_）',
      savedEffective: '下条消息开始生效。',
      minutes: (n) => `${n} 分钟`,
      off: '关闭',
      yes: '是',
      no: '否',
      cancelledSummary: '已取消',
      cancelledBody: '已取消,未做任何修改。',
      failedSummary: '保存失败',
      failedBody: (reason) => `保存失败：${reason}`,
      grantSummary: '需要补授权',
      grantTitle: '⚠️ **「群里不需要 @ bot」还差一个权限**',
      grantWhy:
        '你已开启「不 @ bot 也回复」，但当前应用没有 **获取群组中所有消息**（`im:message.group_msg`）权限。没有它，飞书不会把群里非 @ 的消息推给 bot，所以这个设置暂时不生效。',
      grantLink: (mins) => `**点下面的链接补授权**（约 ${mins} 分钟内有效）：`,
      grantButton: '🔗 点此一键授权',
      grantHow:
        '_扫码/点击后会进入确认页，新权限已预填好，确认即可。授权成功后，群里新消息开始自动生效，无需重启。_',
      grantFallback: '_若链接打不开，可复制：_',
      grantReconnect: '_授权后若群里仍收不到非 @ 消息，发 `/reconnect` 重连一次即可。_',
      grantedSummary: '授权成功',
      grantedTitle: '✅ **授权成功**',
      grantedBody:
        '`im:message.group_msg` 权限已生效，群里非 @ bot 的消息从现在开始会触发回复。',
      grantedReconnect: '_若仍未生效，发 `/reconnect` 重连一次。_',
    },
    run: {
      interrupted: '_⏹ 已被中断_',
      idleTimeout: (mins) => `_⏱ ${mins} 分钟无响应,已自动终止_`,
      agentFailed: (msg) => `⚠️ agent 失败：${msg}`,
      noContent: '_（未返回内容）_',
      thinking: '🧠 **思考中**',
      thinkingDone: '🧠 **思考完成，点击查看**',
      noOutput: '_无输出_',
      toolCalls: (count, finished) => `☕ **${count} 个工具调用${finished ? '（已结束）' : ''}**`,
      stopButton: '⏹ 终止',
      footerThinking: '🧠 正在思考',
      footerToolRunning: '🧰 正在调用工具',
      footerStreaming: '✍️ 正在输出',
      summaryInterrupted: '已中断',
      summaryIdleTimeout: '已超时',
      summaryError: '出错',
      summaryDone: '已完成',
      summaryToolRunning: '正在调用工具',
      summaryStreaming: '正在输出',
      summaryThinking: '思考中',
      textAgentFailed: (msg) => `⚠️ agent 失败:${msg}`,
      textThinking: '_🧠 正在思考…_',
      textToolRunning: '_🧰 正在调用工具…_',
      textStreaming: '_✍️ 正在输出…_',
      toolRunning: '_运行中…_',
      bodyTruncated: '_（body 已截断,完整内容查 `/doctor` 或日志）_',
      cotUnderstanding: '理解用户问题',
      cotCallingTool: '正在调用工具',
      cotToolDone: '工具调用已完成',
      cotWriting: '输出过程',
    },
    account: {
      currentSummary: '当前应用',
      currentTitle: '📋 **当前应用**',
      botName: (name) => `**Bot 名**: ${name}`,
      unknownBot: '(未知)',
      changeButton: '更换凭据',
      validationFailed: (msg) => `❌ **校验失败**：${msg}`,
      secretPlaceholder: '32 位字符串',
      tenantFeishu: 'Feishu (国内)',
      tenantLark: 'Lark (海外)',
      submit: '提交',
      cancel: '取消',
      changeSummary: '更换凭据',
      validatingSummary: '正在校验...',
      validatingBody: '⏳ **正在校验凭据...**',
      savedSummary: '已保存',
      savedTitle: '✅ **凭据已保存**',
      reconnecting: '正在用新凭据重连 WebSocket...',
      newBotWarning: '⚠️ 如果新 bot 不在此群，后续消息将由新 bot 接管，老 bot 不会再回复。',
      failedSummary: '校验失败',
      failedBody: (reason) =>
        `❌ **校验失败**\n\n\`${reason}\`\n\n请检查 App ID 和 Secret 是否正确，重发 \`/account change\` 重试。`,
      cancelledSummary: '已取消',
      cancelledBody: '已取消，未做任何修改。',
    },
  },
  commands: {
    adminOnly: '❌ 此命令仅管理员可用。',
    adminOnlyStopScope: '❌ 指定 scope 停止任务仅管理员可用。',
    adminOnlyTimeoutScope: '❌ 指定 scope 设置 timeout 仅管理员可用。',
    ackHandled: '命令已处理。',
    resumeApplied: '已完成，请继续发送下一条消息。',
    newSession: '已开始新会话。',
    newSessionInterrupted: '已中断当前任务并开始新会话。',
    chatCreateFailed: (msg) => `❌ 创建群失败：${msg}\n\n确认 bot 已开启 \`im:chat\` 权限。`,
    chatCreatedWithCwd: (cwd) => `🎉 群已建好，cwd 继承自原群：\`${cwd}\`\n\n@我 + 任意消息开始对话。`,
    chatCreated: '🎉 群已建好。\n\n@我 + 任意消息开始对话。',
    chatCreatedNotice: (name) => `✓ 已创建群 **${name}**，去新群里继续。`,
    cdUsage: '用法：`/cd <绝对路径>` 或 `/cd ~/xxx`',
    cdAbsolute: '请使用绝对路径，或 `~/xxx` 表示 home 下的子路径。',
    cdDone: (cwd) => `✓ 已切换 cwd 到 \`${cwd}\`\n（session 已重置）`,
    wsUsage: '用法：`/ws [list|save <name>|use <name>|remove <name>]`',
    wsSaveUsage: '用法：`/ws save <name>`',
    wsSaveNoCwd: '当前 chat 未设置 cwd，先用 `/cd` 设置再保存。',
    wsSaved: (name, cwd) => `✓ 工作目录别名已保存：\`${name}\` → ${cwd}`,
    wsUseUsage: '用法：`/ws use <name>`',
    wsNotFound: (name) => `未找到工作目录别名：\`${name}\``,
    wsSwitched: (name, cwd) => `✓ 已切换到 \`${name}\` (${cwd})\n（session 已重置）`,
    wsRemoveUsage: '用法：`/ws remove <name>`',
    wsRemoved: (name) => `✓ 已删除工作目录别名：\`${name}\``,
    docNoBinding: '云文档评论现在不需要绑定工作区；在支持的文档评论里 @bot 即可触发回复。',
    resumeNeedsCwd: '请先使用 /cd <path> 选择工作目录，再查看或恢复会话。',
    resumeDmOnly: '群聊中不展示历史会话详情。请私聊 bot 使用 `/resume` 查看和选择历史会话。',
    resumeCodexHint: (nonce) =>
      `当前 Codex thread 可恢复。\n使用 \`/resume use ${nonce}\` 恢复（10 分钟内有效）。`,
    resumeIncompatible: '当前上下文不可恢复这个会话，请先用 `/resume` 重新生成恢复候选。',
    resumeReselect: '当前上下文不可恢复这个会话，请重新选择当前工作区和权限策略下的会话。',
    resumeNoCodexThread: '当前上下文没有可恢复的 Codex thread，请先在当前工作区完成一次运行。',
    codexSessionUnset: '(未建立)',
    stopRequested: (scope) => `已请求停止 \`${scope}\`。`,
    stopNotFound: (scope) => `未找到正在运行的任务：\`${scope}\`。`,
    timeoutDisabled: '未启用',
    timeoutUsage:
      '\n\n用法:\n- `/timeout 15` 当前 session 设 15 分钟\n- `/timeout off` 当前 session 关闭探活\n- `/timeout default` 清除 session 覆盖,回退全局\n- `/timeout comment:<scopeHash> 15` 管理员设置 comment scope\n\n_注:`/new` 会清掉当前 session 的覆盖,回到全局_',
    timeoutSession: (scope, effective, global) =>
      `⏱ 当前 session${scope} 探活:${effective}\n全局默认:${global}`,
    timeoutSessionFollowsGlobal: (scope, global) => `⏱ 当前 session${scope} 探活:跟随全局(${global})`,
    timeoutCleared: (global) => `✅ 已清除 session 覆盖,回退到全局(${global})。`,
    timeoutNothingToClear: (global) => `当前 session 本来就没设过覆盖,跟随全局(${global})。`,
    timeoutOff: '✅ 已关闭当前 session 的探活。',
    timeoutOffLabel: '已关闭（当前 session）',
    timeoutBadValue: '❌ 用法:`/timeout <1-120>` / `/timeout off` / `/timeout default`',
    timeoutSet: (n) => `✅ 当前 session 探活已设为 ${n} 分钟。`,
    minutes: (n) => `${n} 分钟`,
    psNone: '当前没有 bot 在运行(理论上不可能,你正在跟其中之一对话…)',
    psTableHeader: '| # | ID | Bot | 启动 |',
    psCurrentMarker: ' ← 当前正在回复',
    psTitle: (n) => `🧭 **当前有 ${n} 个 bot 在运行**`,
    psHint: (pid) => '用 `/exit <id|#>` 关掉某一个;`/exit ' + pid + '` 关掉正在回复你的这个 bot。',
    exitUsage: (pid) =>
      '用法:`/exit <id|#>` —— `id` 是 `/ps` 显示的短 id,`#` 是序号。\n' +
      `当前正在回复你的是 \`${pid}\`。`,
    exitNotFound: (target) => `❌ 没找到匹配的 bot:\`${target}\`。发 \`/ps\` 看可选目标。`,
    exitSelf: (id) => `👋 即将关闭当前 bot \`${id}\`,再见。`,
    exitFailed: (id, msg) => `❌ 关掉 bot \`${id}\` 失败:${msg}`,
    exitPending: (id) => `📨 已请求关闭 \`${id}\`,但还在收尾。再发 \`/ps\` 复查一下。`,
    exitDone: (id) => `✓ 已关闭 bot \`${id}\`。`,
    agoSeconds: (n) => `${n}s 前`,
    agoMinutes: (n) => `${n}m 前`,
    agoHours: (n) => `${n}h 前`,
    agoDays: (n) => `${n}d 前`,
    reconnectAfterRun: '⏳ 将在当前运行结束后重连…',
    reconnectNow: '⏳ 正在停止当前运行并重连…',
    reconnectFailed: (msg) => `❌ 重连失败:${msg}`,
    doctorRateLimited: 'doctor rate limited: 同一用户 30 秒内只能触发一次。',
    doctorNoWorkspace:
      '未设置工作目录。先用 `/cd <path>` 或 `/ws use <name>` 选择工作目录后再运行 agent echo check。',
    doctorWorkspaceCheck: (visible) => `${visible} 工作目录不可用时只执行 self-check，不启动 agent。`,
    doctorInFlight: 'doctor in-flight: 当前 profile 已有诊断运行中。',
    doctorAccepted: '🔍 已收到诊断请求，分析结果将私信发给你。',
    workspaceUnset: '(未设置)',
    accountUsage: '用法：`/account` 或 `/account change`',
    accountEmptyCreds: 'App ID 或 App Secret 为空',
    accountSaveFailed: (msg) => `保存凭据失败：${msg}`,
    inviteNoGroups: '当前 bot 还不在任何群里，没有可加入的群。',
    inviteGroupsAdded: (added, total) => `✅ 已把 bot 所在的 ${added} 个群加入响应群名单（共 ${total} 个）。`,
    inviteUsage:
      '用法：\n' +
      '• `/invite user @某人` — 加入允许私聊\n' +
      '• `/invite admin @某人` — 加入管理员\n' +
      '• `/invite group` — 把当前群加入响应群名单\n' +
      '• `/invite all group` — 把 bot 所在的所有群一键加入',
    inviteGroupDmError: '❌ `/invite group` 只能在群里发，在私聊里没有 chat_id 可以加。',
    inviteGroupAlready: '✅ 当前群已在白名单里，无需重复添加。',
    inviteGroupAdded: (chatId) => `✅ 已把当前群（\`${chatId}\`）加入响应群名单。`,
    inviteNoMention: (kind) =>
      `❌ 没检测到 @ 的用户。请像这样发：\`/invite ${kind} @某人\`（注意 @ 用户不是 @ bot）。`,
    labelUsers: '用户白名单',
    labelAdmins: '管理员',
    inviteAdded: (names, label) => `✅ 已把 ${names} 加入${label}。`,
    inviteAlready: (names, label) => `_${names} 已经在${label}里，跳过。_`,
    removeUsage:
      '用法：\n' +
      '• `/remove user @某人` — 移出用户白名单\n' +
      '• `/remove admin @某人` — 移出管理员\n' +
      '• `/remove group` — 把当前群移出响应群名单',
    removeGroupDmError: '`/remove group` 请在要移除的群里发，私聊里没有可移除的群。',
    removeGroupNotThere: '✅ 当前群本来就不在响应名单里，无需移除。',
    removeGroupDone: '✅ 已把当前群移出响应群名单。',
    removeNoMention: (kind) => `请 @ 上要移除的人，例如：\`/remove ${kind} @某人\`。`,
    removeDone: (names, label) => `✅ 已把 ${names} 移出${label}。`,
    removeNotThere: (names, label) => `${names} 本来就不在${label}里，无需移除。`,
    configUsage: '用法:`/config`',
    saveFailedRollbackFailed: '保存失败，且 lark-cli 身份策略回滚失败。请执行 /status 检查当前状态。',
    saveFailedRolledBack: '保存失败，lark-cli 身份策略已回滚。请重新打开 /config 确认当前状态。',
    identityNotApplied: 'lark-cli 身份策略未生效，未做任何修改。',
    configNotWritten: '配置未写入，未做任何修改。',
  },
  models: {
    // Verbatim from upstream — do not reword; tests assert these exactly.
    labels: {
      default: '跟随默认（不指定）',
      'claude-opus-4-8': 'Opus 4.8（最新）',
      'claude-opus-4-7': 'Opus 4.7',
      'claude-sonnet-5': 'Sonnet 5（最新）',
      'claude-sonnet-4-6': 'Sonnet 4.6',
      'claude-haiku-4-5': 'Haiku 4.5（最新）',
      opusplan: 'Opus Plan（规划用 Opus，执行用 Sonnet）',
      'gpt-5-codex': 'GPT-5 Codex',
      'gpt-5': 'GPT-5',
      o3: 'o3',
    },
  },
  bootstrap: {
    configSaved: (path) => `配置已保存到 ${path}`,
    noConfigNonInteractive:
      '当前没有配置，非交互模式无法完成扫码创建应用。' +
      '请先在终端运行 `lark-channel-bridge run` 完成首次初始化，' +
      '或传入 --app-id 和 --app-secret。',
    missingSecretNonInteractive: (appId) =>
      `非交互模式缺少 App Secret: ${appId}。` +
      '请传入 --app-secret <secret>，或在终端中重新运行命令后按提示输入。',
    appSecretPrompt: (appId) => `输入 ${appId} 的 App Secret: `,
    credentialsOk: '✓ 应用凭证校验通过',
    credentialsOkNamed: (botName) => `✓ 应用凭证校验通过: ${botName}`,
    multipleAgentsNonInteractive:
      '检测到多个本地 agent，请使用 --agent <claude|codex> 指定要初始化哪一个。',
    multipleAgentsDetected: '已检测到：',
    agentPickerIntro: '选择本地 agent',
    agentPickerQuestion: '检测到多个本地 agent，本次要初始化哪一个？',
    agentPickerCancelled: '已取消 agent 选择。',
    agentSelected: (agent) => `已选择 ${agent}`,
    startCancelled: '已取消启动。',
  },
  preflight: {
    errorCode: (code) => `错误码：${code}`,
    notFoundTitle: (agent) => `✗ 未找到本地 ${agent}。`,
    notFoundHint: (agent) => `请先安装 ${agent}，或配置正确的可执行文件路径。`,
    notExecutableTitle: (agent) => `✗ 本地 ${agent} 不可执行。`,
    notExecutableHint: (agent) => `请检查可执行权限，或重新安装 ${agent}。`,
    resolveFailedTitle: (agent) => `✗ 本地 ${agent} 路径解析失败。`,
    resolveFailedHint: '请确认当前配置的可执行文件路径有效后，再重新运行 bridge。',
    notReadableTitle: (agent) => `✗ 本地 ${agent} 二进制不可读取。`,
    notReadableHint: (agent) => `请检查文件权限，或重新安装 ${agent}。`,
    spawnFailedTitle: (agent, command) => `✗ 本地 ${agent} 不可用：无法执行 \`${command}\`。`,
    runCommandHint: '请先在终端运行同一命令并修复报错。',
    timeoutTitle: (agent, command) => `✗ 本地 ${agent} 不可用：\`${command}\` 超时未返回。`,
    timeoutHint: '请先确认该命令能正常结束。',
    signaledTitle: (agent, command, signal) =>
      `✗ 本地 ${agent} 不可用：执行 \`${command}\` 时被系统终止（${signal}）。`,
    signaledConfirm: '请先在终端确认：',
    signaledHint: (agent) => `修复本地 ${agent} 后，再重新运行 bridge。`,
    nonzeroExitTitle: (agent, command, exitCode) =>
      `✗ 本地 ${agent} 不可用：\`${command}\` 退出码为 ${exitCode}。`,
    emptyOutputTitle: (agent, command) =>
      `✗ 本地 ${agent} 不可用：\`${command}\` 没有返回版本信息。`,
    emptyOutputHint: (agent) => `请确认安装的是受支持的 ${agent}。`,
  },
};

/** English. */
export const en: Messages = {
  wizard: {
    noAppConfig: 'No Lark app is configured yet. Starting the QR setup wizard.',
    scanPrompt: 'Scan this QR code with the Lark app to create your app:',
    qrExpiry: (minutes) => `The QR code is valid for about ${minutes} minute(s).`,
    openInBrowser: (url) => `You can also open this link in a browser: ${url}`,
    domainSwitched: 'Detected an international tenant — switched to the larksuite.com domain.',
    slowedDown: 'Polling too quickly — automatically slowed down.',
    appCreated: '✓ App created',
    creator: (openId) => `  Creator: ${openId} (Lark app owner — always allowed to use the bot)`,
    creatorUnresolved:
      "  ⚠️ Could not read the scanning user's open_id; the bridge will resolve the app owner on first start.",
  },
  cards: {
    buttons: {
      newSession: '🆕 New session',
      resumeSession: '🔁 Resume',
      workspaces: '📂 Workspaces',
      help: '💡 Help',
      status: '📊 Status',
      switchHere: 'Switch here',
      remove: 'Delete',
    },
    workspaces: {
      title: '📂 Workspaces',
      currentCwd: (cwd) => `Current directory: \`${cwd}\``,
      unset: '(not set)',
      empty: 'No saved workspaces yet.',
      saveHint: '💡 Send `/ws save <name>` to save the current directory as a workspace',
      currentMarker: '  ← current',
    },
    status: {
      title: '📊 Status',
      staleSession: ' ⚠️ from an older directory — the next message starts a new session',
      noSession: '(none)',
      topicScopeNote: '_(this topic has its own session)_',
      accessLabelFallback: '(not set)',
    },
    resume: {
      title: '🔁 Resume a session',
      currentCwd: (cwd) => `Current directory: \`${cwd}\``,
      empty: 'No past sessions in this directory.',
      currentMarker: '  ← current',
      alreadyCurrent: 'Already current',
      restore: '▸ Resume this',
      lineCount: (n) => `${n} messages`,
    },
    help: {
      title: '💡 Help',
      commandsHeading: '**Commands**',
      rows: (agent) => [
        '- `/new` `/reset` — clear this chat’s session',
        '- `/new chat [name]` — new group + new session, and adds you to it',
        '- `/resume [N]` — list and resume past sessions (up to N)',
        '- `/cd <path>` — switch working directory (resets the session)',
        '- `/ws list|save <name>|use <name>|remove <name>` — workspaces',
        '- `/account` — show the current app; `/account change` swaps appId/secret and reconnects',
        '- `/config` — language, preferences, access control, lark-cli identity',
        '- `/status` — current status',
        '- `/stop` — stop the running task (or press ⏹ on the card)',
        '- `/stop comment:<scopeHash>` — admins: stop a cloud-doc comment task',
        '- `/timeout [N|off|default]` — idle watchdog for this session; `/config` sets the default',
        '- `/timeout comment:<scopeHash> N` — admins: idle watchdog for a comment task',
        '- `/ps` — list bots on this machine, marking the one replying here',
        '- `/exit <id|#>` — stop a bot (get the id from `/ps`)',
        '- `/reconnect` — force a WebSocket reconnect (use when the bot goes quiet after a network blip)',
        `- \`/doctor [description]\` — hand the logs and your description to ${agent} to diagnose`,
        '- `/help` — this help',
      ],
      fallthrough: (agent) => `Anything else goes straight to ${agent}.`,
    },
    config: {
      summary: 'Preferences',
      title: '⚙️ **Preferences**',
      intro:
        'Adjust how the bot behaves. Submitting writes to this profile’s config; message and access settings take effect immediately.',
      submit: 'Submit',
      cancel: 'Cancel',
      langHeading: '**语言 / Language / Ngôn ngữ**',
      modeHeading: '**Mode**',
      modePersonalNote:
        '_Personal (default): the bot is yours alone — only you and allowed users can use it, and it can carry your personal authorization to reach Docs, Calendar, and so on._',
      modeTeamNote:
        '_Team: the bot is shared — anyone can @ it, with no allowlist check. So nobody can borrow your personal access through it, the CLI is forced to app (bot) identity only in this mode._',
      modePersonal: 'Personal (default)',
      modeTeam: 'Team',
      modelHeading: '**Model**',
      modelNote: '_The model the underlying agent runs with._',
      modelDefaultNote: '_“Follow the default” = don’t pass one; the CLI / account decides._',
      replyHeading: '**Reply style**',
      replyTextNote: '_Plain text: sent once when the agent finishes. No streaming, lightest feel._',
      replyMarkdownNote:
        '_Message card: a lightweight streaming markdown card with Lark’s native typing animation._',
      replyText: 'Plain text',
      replyMarkdown: 'Message card (default)',
      replyCard: 'Interactive card',
      toolsHeading: '\n**Show tool calls**',
      toolsShowNote: '_Show: you can see what commands ran, which files were read, and so on._',
      toolsHideNote: '_Hide: only the agent’s final written answer; every tool block is skipped._',
      toolsShow: 'Show (default)',
      toolsHide: 'Hide',
      cotHeading: '\n**Progress messages (chain of thought)**',
      cotOffNote: '_Off: send only the final reply._',
      cotBriefNote: '_Brief: show the agent’s progress text and a tool summary._',
      cotDetailedNote: '_Detailed: also show tool arguments and output excerpts._',
      cotOff: 'Off',
      cotBrief: 'Brief',
      cotDetailed: 'Detailed',
      concurrencyHeading: '\n**Concurrent runs**',
      concurrencyNote:
        '_How many agent processes may run at once (mostly matters for parallel topics in a topic group)._',
      concurrencyRange: '_Default 10, range 1–50. Anything over the cap queues FIFO._',
      idleHeading: '\n**Idle watchdog (minutes)**',
      idleNote: '_Kills the agent when it produces no output for this long, so it can’t hang._',
      idleRange: '_0 = off (default), range 1–120. `/timeout` can override it per scope._',
      mentionHeading: '\n**Require @ in groups**',
      mentionYesNote:
        '_Yes (default): in groups and topic groups, messages that don’t @ the bot are ignored — the bot stays out of the conversation._',
      mentionNoNote: '_No: every message goes to the agent (the behaviour of 0.1.21 and earlier)._',
      mentionAlwaysNote: '_DMs never need an @; `@all` is never answered._',
      mentionYes: 'Yes (default)',
      mentionNo: 'No',
      identityHeading: '\n**lark-cli identity policy**',
      identityBotOnlyNote: '_App identity only: uses bot/app abilities, never personal resources._',
      identityUserNote:
        '_Allow user identity: keeps the app identity and additionally lets an authorized user reach their own Calendar, Mail, Drive, and so on._',
      identityBotOnly: 'App identity only',
      identityUser: 'Allow user identity',
      teamOverrideNote:
        '\n\n_⚠️ Team mode is on, so this is overridden — identity is forced to “app identity only” and access control does not apply. Switching back to Personal restores it._',
      accessPanelTitle: '🔒 **Access control** (click to expand)',
      accessTeamNote:
        '_⚠️ **Team mode is on**: access control does not apply — anyone who @s the bot can use it (admin commands stay limited to the owner/admins). Switching back to Personal restores the lists below._',
      accessNote:
        '_Who can use the bot in DMs and groups. **Empty = it answers no chat messages.** Cloud-doc comments follow the document’s own permissions._',
      accessUsersHeading: (n) => `**Users allowed in DMs** (${n})`,
      accessUsersHint: '_Add / remove:_ `/invite user @name`  `/remove user @name`',
      accessChatsHeading: (n) => `**Groups the bot answers in** (${n})`,
      accessChatsAllHint: '_Add every group the bot is in:_ `/invite all group`',
      accessChatsHint: '_Add / remove (send inside the group):_ `/invite group`  `/remove group`',
      accessAdminsHeading: (n) => `**Admins** (${n})`,
      accessAdminsNote:
        '_May run sensitive commands: `/account` `/config` `/exit` `/reconnect` `/doctor` `/cd` `/ws` `/invite` `/remove`. Admins also get DM access automatically, and can manage access control from groups that aren’t allowlisted._',
      accessAdminsHint: '_Add / remove:_ `/invite admin @name`  `/remove admin @name`',
      none: '_(none)_',
      unknownChat: '(unknown group)',
      empty: '_(empty)_',
      count: (n) => `${n}`,
      savedSummary: 'Preferences saved',
      savedTitle: '✅ **Preferences saved**',
      savedLang: '**Language**',
      savedMode: '**Mode**',
      savedModel: '**Model**',
      savedReply: '**Reply style**',
      savedTools: '**Show tool calls**',
      savedCot: '**Progress messages**',
      savedConcurrency: '**Concurrent runs**',
      savedIdle: '**Idle watchdog**',
      savedMention: '**Require @ in groups**',
      savedIdentity: '**lark-cli identity policy**',
      savedIdentityTeamForced: 'App identity only (forced by Team mode)',
      savedAccess: '🔒 **Access control**',
      savedAccessTeamNote: '(_no effect in Team mode — anyone can use it_)',
      savedEffective: 'Takes effect from your next message.',
      minutes: (n) => `${n} min`,
      off: 'off',
      yes: 'yes',
      no: 'no',
      cancelledSummary: 'Cancelled',
      cancelledBody: 'Cancelled — nothing was changed.',
      failedSummary: 'Save failed',
      failedBody: (reason) => `Save failed: ${reason}`,
      grantSummary: 'One permission missing',
      grantTitle: '⚠️ **“No @ needed in groups” is one permission short**',
      grantWhy:
        'You turned on replying without an @, but this app is missing **Read all group messages** (`im:message.group_msg`). Without it Lark never delivers un-@ed group messages to the bot, so the setting has no effect yet.',
      grantLink: (mins) => `**Use the link below to grant it** (valid for about ${mins} minutes):`,
      grantButton: '🔗 Grant it here',
      grantHow:
        '_The link opens a confirmation page with the new permission pre-filled — just confirm. It applies to new group messages right away; no restart needed._',
      grantFallback: '_If the link won’t open, copy this:_',
      grantReconnect:
        '_If un-@ed group messages still don’t arrive afterwards, send `/reconnect` once._',
      grantedSummary: 'Permission granted',
      grantedTitle: '✅ **Permission granted**',
      grantedBody:
        '`im:message.group_msg` is now active — group messages that don’t @ the bot will trigger a reply from here on.',
      grantedReconnect: '_If it still doesn’t work, send `/reconnect` once._',
    },
    run: {
      interrupted: '_⏹ Stopped_',
      idleTimeout: (mins) => `_⏱ No response for ${mins} min — stopped automatically_`,
      agentFailed: (msg) => `⚠️ The agent failed: ${msg}`,
      noContent: '_(nothing returned)_',
      thinking: '🧠 **Thinking**',
      thinkingDone: '🧠 **Finished thinking — tap to read**',
      noOutput: '_no output_',
      toolCalls: (count, finished) =>
        `☕ **${count} tool call${count === 1 ? '' : 's'}${finished ? ' (done)' : ''}**`,
      stopButton: '⏹ Stop',
      footerThinking: '🧠 Thinking',
      footerToolRunning: '🧰 Running a tool',
      footerStreaming: '✍️ Writing',
      summaryInterrupted: 'stopped',
      summaryIdleTimeout: 'timed out',
      summaryError: 'failed',
      summaryDone: 'done',
      summaryToolRunning: 'running a tool',
      summaryStreaming: 'writing',
      summaryThinking: 'thinking',
      textAgentFailed: (msg) => `⚠️ The agent failed: ${msg}`,
      textThinking: '_🧠 Thinking…_',
      textToolRunning: '_🧰 Running a tool…_',
      textStreaming: '_✍️ Writing…_',
      toolRunning: '_running…_',
      bodyTruncated: '_(output truncated — see `/doctor` or the logs for the rest)_',
      cotUnderstanding: 'Understanding the request',
      cotCallingTool: 'Running a tool',
      cotToolDone: 'Tool finished',
      cotWriting: 'Writing',
    },
    account: {
      currentSummary: 'Current app',
      currentTitle: '📋 **Current app**',
      botName: (name) => `**Bot name**: ${name}`,
      unknownBot: '(unknown)',
      changeButton: 'Change credentials',
      validationFailed: (msg) => `❌ **Validation failed**: ${msg}`,
      secretPlaceholder: '32-character string',
      tenantFeishu: 'Feishu (mainland China)',
      tenantLark: 'Lark (international)',
      submit: 'Submit',
      cancel: 'Cancel',
      changeSummary: 'Change credentials',
      validatingSummary: 'Validating…',
      validatingBody: '⏳ **Validating the credentials…**',
      savedSummary: 'Saved',
      savedTitle: '✅ **Credentials saved**',
      reconnecting: 'Reconnecting with the new credentials…',
      newBotWarning:
        '⚠️ If the new bot isn’t in this group, later messages go to it instead and the old bot will stop replying.',
      failedSummary: 'Validation failed',
      failedBody: (reason) =>
        `❌ **Validation failed**\n\n\`${reason}\`\n\nCheck the App ID and Secret, then send \`/account change\` to try again.`,
      cancelledSummary: 'Cancelled',
      cancelledBody: 'Cancelled — nothing was changed.',
    },
  },
  commands: {
    adminOnly: '❌ Admins only.',
    adminOnlyStopScope: '❌ Stopping a task by scope is admins only.',
    adminOnlyTimeoutScope: '❌ Setting a timeout by scope is admins only.',
    ackHandled: 'Done.',
    resumeApplied: 'Ready — send your next message.',
    newSession: 'Started a new session.',
    newSessionInterrupted: 'Stopped the running task and started a new session.',
    chatCreateFailed: (msg) =>
      `❌ Couldn’t create the group: ${msg}\n\nCheck that the bot has the \`im:chat\` permission.`,
    chatCreatedWithCwd: (cwd) =>
      `🎉 Group created, working directory carried over: \`${cwd}\`\n\n@ me with anything to start.`,
    chatCreated: '🎉 Group created.\n\n@ me with anything to start.',
    chatCreatedNotice: (name) => `✓ Created **${name}** — continue over there.`,
    cdUsage: 'Usage: `/cd <absolute path>` or `/cd ~/something`',
    cdAbsolute: 'Use an absolute path, or `~/something` for a path under your home directory.',
    cdDone: (cwd) => `✓ Working directory is now \`${cwd}\`\n(the session was reset)`,
    wsUsage: 'Usage: `/ws [list|save <name>|use <name>|remove <name>]`',
    wsSaveUsage: 'Usage: `/ws save <name>`',
    wsSaveNoCwd: 'This chat has no working directory yet — set one with `/cd` first.',
    wsSaved: (name, cwd) => `✓ Workspace saved: \`${name}\` → ${cwd}`,
    wsUseUsage: 'Usage: `/ws use <name>`',
    wsNotFound: (name) => `No workspace named \`${name}\``,
    wsSwitched: (name, cwd) => `✓ Switched to \`${name}\` (${cwd})\n(the session was reset)`,
    wsRemoveUsage: 'Usage: `/ws remove <name>`',
    wsRemoved: (name) => `✓ Deleted workspace \`${name}\``,
    docNoBinding:
      'Cloud-doc comments no longer need a workspace binding — just @ the bot in a supported document’s comments.',
    resumeNeedsCwd: 'Pick a working directory with /cd <path> first, then view or resume sessions.',
    resumeDmOnly:
      'Past sessions aren’t listed in groups. DM the bot and use `/resume` to browse and pick one.',
    resumeCodexHint: (nonce) =>
      `The current Codex thread can be resumed.\nUse \`/resume use ${nonce}\` (valid for 10 minutes).`,
    resumeIncompatible:
      'This session can’t be resumed in the current context — run `/resume` again to get fresh candidates.',
    resumeReselect:
      'This session can’t be resumed in the current context — pick one from the current workspace and permission mode.',
    resumeNoCodexThread:
      'No resumable Codex thread in this context — complete a run in this workspace first.',
    codexSessionUnset: '(not started)',
    stopRequested: (scope) => `Stop requested for \`${scope}\`.`,
    stopNotFound: (scope) => `No running task found: \`${scope}\`.`,
    timeoutDisabled: 'off',
    timeoutUsage:
      '\n\nUsage:\n- `/timeout 15` — 15 minutes for this session\n- `/timeout off` — no watchdog for this session\n- `/timeout default` — drop the override and follow the global default\n- `/timeout comment:<scopeHash> 15` — admins: set a comment scope\n\n_Note: `/new` clears this session’s override and returns to the global default._',
    timeoutSession: (scope, effective, global) =>
      `⏱ Watchdog for this session${scope}: ${effective}\nGlobal default: ${global}`,
    timeoutSessionFollowsGlobal: (scope, global) =>
      `⏱ Watchdog for this session${scope}: follows the global default (${global})`,
    timeoutCleared: (global) => `✅ Override cleared — back to the global default (${global}).`,
    timeoutNothingToClear: (global) =>
      `This session had no override anyway — it follows the global default (${global}).`,
    timeoutOff: '✅ Watchdog disabled for this session.',
    timeoutOffLabel: 'off (this session)',
    timeoutBadValue: '❌ Usage: `/timeout <1-120>` / `/timeout off` / `/timeout default`',
    timeoutSet: (n) => `✅ Watchdog for this session set to ${n} minutes.`,
    minutes: (n) => `${n} min`,
    psNone: 'No bots running (which shouldn’t be possible — you’re talking to one…)',
    psTableHeader: '| # | ID | Bot | Started |',
    psCurrentMarker: ' ← replying to you now',
    psTitle: (n) => `🧭 **${n} bot${n === 1 ? '' : 's'} running**`,
    psHint: (pid) =>
      'Use `/exit <id|#>` to stop one; `/exit ' + pid + '` stops the bot replying to you.',
    exitUsage: (pid) =>
      'Usage: `/exit <id|#>` — `id` is the short id from `/ps`, `#` is the row number.\n' +
      `The one replying to you is \`${pid}\`.`,
    exitNotFound: (target) => `❌ No bot matches \`${target}\`. Send \`/ps\` to see the options.`,
    exitSelf: (id) => `👋 Stopping this bot \`${id}\` — bye.`,
    exitFailed: (id, msg) => `❌ Couldn’t stop bot \`${id}\`: ${msg}`,
    exitPending: (id) => `📨 Stop requested for \`${id}\`, but it’s still winding down. Send \`/ps\` to check.`,
    exitDone: (id) => `✓ Stopped bot \`${id}\`.`,
    agoSeconds: (n) => `${n}s ago`,
    agoMinutes: (n) => `${n}m ago`,
    agoHours: (n) => `${n}h ago`,
    agoDays: (n) => `${n}d ago`,
    reconnectAfterRun: '⏳ Will reconnect once the current run finishes…',
    reconnectNow: '⏳ Stopping the current run and reconnecting…',
    reconnectFailed: (msg) => `❌ Reconnect failed: ${msg}`,
    doctorRateLimited: 'doctor rate limited: once every 30 seconds per user.',
    doctorNoWorkspace:
      'No working directory set. Pick one with `/cd <path>` or `/ws use <name>` before running the agent echo check.',
    doctorWorkspaceCheck: (visible) =>
      `${visible} When the working directory is unavailable, only the self-check runs — the agent is not started.`,
    doctorInFlight: 'doctor in-flight: this profile already has a diagnostic running.',
    doctorAccepted: '🔍 Diagnostic started — the results will arrive in a DM.',
    workspaceUnset: '(not set)',
    accountUsage: 'Usage: `/account` or `/account change`',
    accountEmptyCreds: 'App ID or App Secret is empty',
    accountSaveFailed: (msg) => `Couldn’t save the credentials: ${msg}`,
    inviteNoGroups: 'The bot isn’t in any group yet, so there’s nothing to add.',
    inviteGroupsAdded: (added, total) =>
      `✅ Added the ${added} group(s) the bot is in to the allowed list (${total} total).`,
    inviteUsage:
      'Usage:\n' +
      '• `/invite user @name` — allow them to DM the bot\n' +
      '• `/invite admin @name` — make them an admin\n' +
      '• `/invite group` — allow the current group\n' +
      '• `/invite all group` — allow every group the bot is in',
    inviteGroupDmError: '❌ `/invite group` only works inside a group — a DM has no chat_id to add.',
    inviteGroupAlready: '✅ This group is already allowed.',
    inviteGroupAdded: (chatId) => `✅ Added this group (\`${chatId}\`) to the allowed list.`,
    inviteNoMention: (kind) =>
      `❌ No @ mention found. Send it like this: \`/invite ${kind} @name\` (@ the person, not the bot).`,
    labelUsers: 'the allowed users',
    labelAdmins: 'the admins',
    inviteAdded: (names, label) => `✅ Added ${names} to ${label}.`,
    inviteAlready: (names, label) => `_${names} already in ${label} — skipped._`,
    removeUsage:
      'Usage:\n' +
      '• `/remove user @name` — remove from the allowed users\n' +
      '• `/remove admin @name` — remove from the admins\n' +
      '• `/remove group` — remove the current group from the allowed list',
    removeGroupDmError:
      'Send `/remove group` inside the group you want to remove — a DM has no group to remove.',
    removeGroupNotThere: '✅ This group wasn’t on the allowed list anyway.',
    removeGroupDone: '✅ Removed this group from the allowed list.',
    removeNoMention: (kind) => `@ the person you want to remove, e.g. \`/remove ${kind} @name\`.`,
    removeDone: (names, label) => `✅ Removed ${names} from ${label}.`,
    removeNotThere: (names, label) => `${names} wasn’t in ${label} anyway.`,
    configUsage: 'Usage: `/config`',
    saveFailedRollbackFailed:
      'Save failed, and rolling back the lark-cli identity policy also failed. Run /status to check the current state.',
    saveFailedRolledBack:
      'Save failed; the lark-cli identity policy was rolled back. Reopen /config to confirm the current state.',
    identityNotApplied: 'The lark-cli identity policy did not apply — nothing was changed.',
    configNotWritten: 'Config was not written — nothing was changed.',
  },
  models: {
    labels: {
      default: 'Follow the default (unspecified)',
      'claude-opus-4-8': 'Opus 4.8 (newest · deepest — burns your quota fastest)',
      'claude-opus-4-7': 'Opus 4.7 (deep — burns your quota fast)',
      'claude-sonnet-5': 'Sonnet 5 (newest · balanced)',
      'claude-sonnet-4-6': 'Sonnet 4.6 (balanced)',
      'claude-haiku-4-5': 'Haiku 4.5 (newest · fastest, easiest on your quota)',
      opusplan: 'Opus Plan (Opus to plan, Sonnet to execute)',
      'gpt-5-codex': 'GPT-5 Codex',
      'gpt-5': 'GPT-5',
      o3: 'o3',
    },
  },
  bootstrap: {
    configSaved: (path) => `Config saved to ${path}`,
    noConfigNonInteractive:
      'No configuration yet, and the QR app-creation wizard cannot run in non-interactive mode. ' +
      'Run `lark-channel-bridge run` in a terminal to finish first-time setup, ' +
      'or pass --app-id and --app-secret.',
    missingSecretNonInteractive: (appId) =>
      `Missing App Secret for ${appId} in non-interactive mode. ` +
      'Pass --app-secret <secret>, or rerun the command in a terminal and enter it when prompted.',
    appSecretPrompt: (appId) => `Enter the App Secret for ${appId}: `,
    credentialsOk: '✓ App credentials verified',
    credentialsOkNamed: (botName) => `✓ App credentials verified: ${botName}`,
    multipleAgentsNonInteractive:
      'Multiple local agents detected. Use --agent <claude|codex> to choose which one to initialize.',
    multipleAgentsDetected: 'Detected:',
    agentPickerIntro: 'Choose a local agent',
    agentPickerQuestion: 'Multiple local agents detected. Which one should be initialized?',
    agentPickerCancelled: 'Agent selection cancelled.',
    agentSelected: (agent) => `Selected ${agent}`,
    startCancelled: 'Startup cancelled.',
  },
  preflight: {
    errorCode: (code) => `Error code: ${code}`,
    notFoundTitle: (agent) => `✗ ${agent} was not found on this machine.`,
    notFoundHint: (agent) => `Install ${agent} first, or point the bridge at the correct executable path.`,
    notExecutableTitle: (agent) => `✗ The local ${agent} is not executable.`,
    notExecutableHint: (agent) => `Check the file's execute permission, or reinstall ${agent}.`,
    resolveFailedTitle: (agent) => `✗ Could not resolve the path to the local ${agent}.`,
    resolveFailedHint: 'Make sure the configured executable path is valid, then run the bridge again.',
    notReadableTitle: (agent) => `✗ The local ${agent} binary is not readable.`,
    notReadableHint: (agent) => `Check the file permissions, or reinstall ${agent}.`,
    spawnFailedTitle: (agent, command) =>
      `✗ The local ${agent} is unusable: \`${command}\` could not be run.`,
    runCommandHint: 'Run the same command in your terminal and fix the error it reports.',
    timeoutTitle: (agent, command) =>
      `✗ The local ${agent} is unusable: \`${command}\` timed out.`,
    timeoutHint: 'Make sure that command finishes on its own first.',
    signaledTitle: (agent, command, signal) =>
      `✗ The local ${agent} is unusable: \`${command}\` was killed by the system (${signal}).`,
    signaledConfirm: 'Check this in your terminal first:',
    signaledHint: (agent) => `Fix the local ${agent}, then run the bridge again.`,
    nonzeroExitTitle: (agent, command, exitCode) =>
      `✗ The local ${agent} is unusable: \`${command}\` exited with code ${exitCode}.`,
    emptyOutputTitle: (agent, command) =>
      `✗ The local ${agent} is unusable: \`${command}\` returned no version information.`,
    emptyOutputHint: (agent) => `Make sure the installed ${agent} is a supported build.`,
  },
};

/**
 * Vietnamese. Written for readers who are not developers: it says what to do
 * next in plain language, and avoids transliterating jargon that is clearer
 * left in English (`open_id`, `bridge`, command names).
 */
export const vi: Messages = {
  wizard: {
    noAppConfig: 'Chưa có ứng dụng Lark nào được cấu hình. Bắt đầu trình tạo ứng dụng bằng mã QR.',
    scanPrompt: 'Mở app Lark trên điện thoại và quét mã QR dưới đây để tạo ứng dụng:',
    qrExpiry: (minutes) => `Mã QR có hiệu lực khoảng ${minutes} phút.`,
    openInBrowser: (url) => `Hoặc mở link này bằng trình duyệt: ${url}`,
    domainSwitched: 'Phát hiện tài khoản Lark bản quốc tế — đã tự chuyển sang tên miền larksuite.com.',
    slowedDown: 'Đang hỏi máy chủ hơi nhanh — đã tự động giảm tốc.',
    appCreated: '✓ Đã tạo ứng dụng thành công',
    creator: (openId) => `  Người tạo: ${openId} (chủ ứng dụng Lark — luôn được phép dùng bot)`,
    creatorUnresolved:
      '  ⚠️ Chưa lấy được open_id của người quét mã; bridge sẽ tự xác định chủ ứng dụng khi khởi động lần đầu.',
  },
  cards: {
    buttons: {
      newSession: '🆕 Bắt đầu lại',
      resumeSession: '🔁 Mở lại phiên cũ',
      workspaces: '📂 Thư mục làm việc',
      help: '💡 Trợ giúp',
      status: '📊 Trạng thái',
      switchHere: 'Chuyển sang đây',
      remove: 'Xoá',
    },
    workspaces: {
      title: '📂 Thư mục làm việc',
      currentCwd: (cwd) => `Thư mục hiện tại: \`${cwd}\``,
      unset: '(chưa đặt)',
      empty: 'Chưa lưu thư mục nào.',
      saveHint: '💡 Gõ `/ws save <tên>` để lưu thư mục hiện tại lại, lần sau gọi bằng tên cho nhanh',
      currentMarker: '  ← đang dùng',
    },
    status: {
      title: '📊 Trạng thái',
      staleSession: ' ⚠️ thuộc thư mục cũ — tin nhắn tới sẽ mở phiên mới',
      noSession: '(chưa có)',
      topicScopeNote: '_(chủ đề này có phiên riêng)_',
      accessLabelFallback: '(chưa đặt)',
    },
    resume: {
      title: '🔁 Mở lại phiên cũ',
      currentCwd: (cwd) => `Thư mục hiện tại: \`${cwd}\``,
      empty: 'Thư mục này chưa có phiên nào cũ.',
      currentMarker: '  ← đang dùng',
      alreadyCurrent: 'Đang ở phiên này',
      restore: '▸ Mở lại phiên này',
      lineCount: (n) => `${n} tin nhắn`,
    },
    help: {
      title: '💡 Trợ giúp',
      commandsHeading: '**Các lệnh**',
      rows: (agent) => [
        '- `/new` `/reset` — xoá phiên hiện tại, bắt đầu lại từ đầu',
        '- `/new chat [tên]` — tạo nhóm mới + phiên mới, tự kéo bạn vào nhóm',
        '- `/resume [N]` — xem và mở lại các phiên cũ (tối đa N phiên)',
        '- `/cd <đường-dẫn>` — đổi thư mục làm việc (sẽ bắt đầu phiên mới)',
        '- `/ws list|save <tên>|use <tên>|remove <tên>` — quản lý thư mục làm việc',
        '- `/account` — xem ứng dụng đang dùng; `/account change` để đổi appId/secret và kết nối lại',
        '- `/config` — đổi ngôn ngữ, model, quyền truy cập và danh tính lark-cli',
        '- `/status` — xem trạng thái hiện tại',
        '- `/stop` — dừng việc đang chạy (hoặc bấm nút ⏹ trên thẻ)',
        '- `/stop comment:<scopeHash>` — quản trị viên: dừng tác vụ bình luận tài liệu',
        '- `/timeout [N|off|default]` — số phút chờ trước khi tự dừng phiên này; `/config` đổi mặc định chung',
        '- `/timeout comment:<scopeHash> N` — quản trị viên: đặt thời gian chờ cho tác vụ bình luận',
        '- `/ps` — liệt kê các bot trên máy này, đánh dấu cái đang trả lời',
        '- `/exit <id|#>` — tắt một bot (xem id bằng `/ps`)',
        '- `/reconnect` — kết nối lại (dùng khi mạng chập chờn xong bot im lặng)',
        `- \`/doctor [mô tả]\` — đưa log kèm mô tả cho ${agent} tự chẩn đoán`,
        '- `/help` — bảng trợ giúp này',
      ],
      fallthrough: (agent) => `Mọi nội dung khác sẽ được chuyển thẳng cho ${agent}.`,
    },
    config: {
      summary: 'Cài đặt',
      title: '⚙️ **Cài đặt**',
      intro:
        'Chỉnh cách bot hoạt động. Bấm Lưu là ghi vào cấu hình; phần tin nhắn và phân quyền có hiệu lực ngay.',
      submit: 'Lưu',
      cancel: 'Huỷ',
      langHeading: '**语言 / Language / Ngôn ngữ**',
      modeHeading: '**Chế độ dùng**',
      modePersonalNote:
        '_Cá nhân (mặc định): bot là trợ lý riêng của bạn — chỉ bạn và những người bạn cho phép mới dùng được, và bot có thể dùng quyền cá nhân của bạn để đọc Doc, Lịch…_',
      modeTeamNote:
        '_Nhóm: bot dùng chung — ai @ cũng được, không kiểm tra danh sách. Để người khác không mượn được quyền cá nhân của bạn, chế độ này bắt buộc bot chỉ dùng danh tính ứng dụng._',
      modePersonal: 'Cá nhân (mặc định)',
      modeTeam: 'Nhóm',
      modelHeading: '**Model**',
      modelNote: '_Model mà Claude/Codex sẽ chạy._',
      modelDefaultNote: '_“Theo mặc định” = không chỉ định, để CLI/tài khoản tự quyết._',
      replyHeading: '**Kiểu trả lời**',
      replyTextNote: '_Văn bản thuần: chạy xong mới gửi một lần, không chạy chữ, nhẹ nhất._',
      replyMarkdownNote: '_Thẻ tin nhắn: thẻ markdown chạy chữ theo thời gian thực, kiểu Lark._',
      replyText: 'Văn bản thuần',
      replyMarkdown: 'Thẻ tin nhắn (mặc định)',
      replyCard: 'Thẻ tương tác',
      toolsHeading: '\n**Hiện các bước bot làm**',
      toolsShowNote: '_Hiện: bạn thấy bot chạy lệnh gì, đọc file nào…_',
      toolsHideNote: '_Ẩn: chỉ xem câu trả lời cuối cùng, bỏ qua toàn bộ phần thao tác._',
      toolsShow: 'Hiện (mặc định)',
      toolsHide: 'Ẩn',
      cotHeading: '\n**Tin nhắn tiến trình (dòng suy nghĩ)**',
      cotOffNote: '_Tắt: chỉ gửi câu trả lời cuối._',
      cotBriefNote: '_Ngắn gọn: hiện tiến trình và tóm tắt thao tác._',
      cotDetailedNote: '_Chi tiết: hiện thêm tham số và trích đoạn kết quả._',
      cotOff: 'Tắt',
      cotBrief: 'Ngắn gọn',
      cotDetailed: 'Chi tiết',
      concurrencyHeading: '\n**Số việc chạy cùng lúc**',
      concurrencyNote:
        '_Cho phép bao nhiêu tiến trình chạy song song (chủ yếu ảnh hưởng nhóm nhiều chủ đề)._',
      concurrencyRange: '_Mặc định 10, từ 1–50. Quá số này thì xếp hàng chờ._',
      idleHeading: '\n**Tự dừng khi treo (phút)**',
      idleNote: '_Tự tắt khi bot im lặng quá lâu, tránh treo vô hạn._',
      idleRange: '_0 = tắt (mặc định), từ 1–120. Lệnh `/timeout` đè được cho từng phiên._',
      mentionHeading: '\n**Bắt buộc @ bot trong nhóm**',
      mentionYesNote:
        '_Có (mặc định): trong nhóm, tin nhắn không @ bot thì bot bỏ qua — bot không xen vào cuộc trò chuyện._',
      mentionNoNote: '_Không: mọi tin nhắn đều được gửi cho bot (giống bản 0.1.21 trở về trước)._',
      mentionAlwaysNote: '_Nhắn riêng thì không bao giờ cần @; `@tất cả` thì bot không bao giờ trả lời._',
      mentionYes: 'Có (mặc định)',
      mentionNo: 'Không',
      identityHeading: '\n**Danh tính lark-cli**',
      identityBotOnlyNote:
        '_Chỉ danh tính ứng dụng: dùng quyền của bot, không đụng tài nguyên cá nhân._',
      identityUserNote:
        '_Cho phép danh tính người dùng: giữ quyền ứng dụng, đồng thời cho phép truy cập Lịch, Mail, Drive… của người đã cấp quyền._',
      identityBotOnly: 'Chỉ danh tính ứng dụng',
      identityUser: 'Cho phép danh tính người dùng',
      teamOverrideNote:
        '\n\n_⚠️ Đang bật chế độ Nhóm nên mục này bị ghi đè — danh tính bị ép về “chỉ ứng dụng” và phân quyền không có tác dụng. Chuyển lại Cá nhân thì khôi phục._',
      accessPanelTitle: '🔒 **Phân quyền** (bấm để mở)',
      accessTeamNote:
        '_⚠️ **Đang bật chế độ Nhóm**: phân quyền tạm thời không có tác dụng — ai @ bot cũng dùng được (lệnh quản trị vẫn chỉ dành cho chủ/quản trị viên). Chuyển lại Cá nhân thì danh sách dưới đây có hiệu lực trở lại._',
      accessNote:
        '_Ai được dùng bot khi nhắn riêng và trong nhóm. **Để trống = bot không trả lời tin nhắn nào.** Bình luận trong tài liệu thì theo quyền của tài liệu đó._',
      accessUsersHeading: (n) => `**Người được nhắn riêng** (${n})`,
      accessUsersHint: '_Thêm / bớt:_ `/invite user @tên`  `/remove user @tên`',
      accessChatsHeading: (n) => `**Nhóm bot được trả lời** (${n})`,
      accessChatsAllHint: '_Thêm tất cả nhóm bot đang ở trong:_ `/invite all group`',
      accessChatsHint: '_Thêm / bớt (gõ ngay trong nhóm đó):_ `/invite group`  `/remove group`',
      accessAdminsHeading: (n) => `**Quản trị viên** (${n})`,
      accessAdminsNote:
        '_Được chạy các lệnh nhạy cảm: `/account` `/config` `/exit` `/reconnect` `/doctor` `/cd` `/ws` `/invite` `/remove`. Quản trị viên cũng tự động được nhắn riêng, và quản lý phân quyền từ nhóm chưa được cho phép._',
      accessAdminsHint: '_Thêm / bớt:_ `/invite admin @tên`  `/remove admin @tên`',
      none: '_(chưa có)_',
      unknownChat: '(nhóm lạ)',
      empty: '_(trống)_',
      count: (n) => `${n}`,
      savedSummary: 'Đã lưu cài đặt',
      savedTitle: '✅ **Đã lưu cài đặt**',
      savedLang: '**Ngôn ngữ**',
      savedMode: '**Chế độ dùng**',
      savedModel: '**Model**',
      savedReply: '**Kiểu trả lời**',
      savedTools: '**Hiện các bước bot làm**',
      savedCot: '**Tin nhắn tiến trình**',
      savedConcurrency: '**Số việc chạy cùng lúc**',
      savedIdle: '**Tự dừng khi treo**',
      savedMention: '**Bắt buộc @ bot trong nhóm**',
      savedIdentity: '**Danh tính lark-cli**',
      savedIdentityTeamForced: 'Chỉ danh tính ứng dụng (chế độ Nhóm ép buộc)',
      savedAccess: '🔒 **Phân quyền**',
      savedAccessTeamNote: '(_không tác dụng ở chế độ Nhóm — ai cũng dùng được_)',
      savedEffective: 'Có hiệu lực từ tin nhắn tiếp theo.',
      minutes: (n) => `${n} phút`,
      off: 'tắt',
      yes: 'có',
      no: 'không',
      cancelledSummary: 'Đã huỷ',
      cancelledBody: 'Đã huỷ — không thay đổi gì.',
      failedSummary: 'Lưu thất bại',
      failedBody: (reason) => `Lưu thất bại: ${reason}`,
      grantSummary: 'Còn thiếu một quyền',
      grantTitle: '⚠️ **“Không cần @ bot trong nhóm” còn thiếu một quyền**',
      grantWhy:
        'Bạn đã bật trả lời không cần @, nhưng ứng dụng này chưa có quyền **Đọc mọi tin nhắn trong nhóm** (`im:message.group_msg`). Thiếu nó thì Lark không đẩy tin nhắn không-@ cho bot, nên cài đặt này chưa có tác dụng.',
      grantLink: (mins) => `**Bấm link dưới đây để cấp quyền** (có hiệu lực khoảng ${mins} phút):`,
      grantButton: '🔗 Cấp quyền ngay',
      grantHow:
        '_Link mở ra trang xác nhận, quyền mới đã được điền sẵn — bạn chỉ cần bấm xác nhận. Có hiệu lực ngay với tin nhắn mới, không cần khởi động lại._',
      grantFallback: '_Nếu link không mở được, copy dòng này:_',
      grantReconnect: '_Cấp quyền xong mà nhóm vẫn chưa nhận tin không-@, gõ `/reconnect` một lần._',
      grantedSummary: 'Đã cấp quyền',
      grantedTitle: '✅ **Đã cấp quyền**',
      grantedBody:
        'Quyền `im:message.group_msg` đã hoạt động — từ giờ tin nhắn trong nhóm không @ bot cũng được trả lời.',
      grantedReconnect: '_Nếu vẫn chưa chạy, gõ `/reconnect` một lần._',
    },
    run: {
      interrupted: '_⏹ Đã dừng_',
      idleTimeout: (mins) => `_⏱ Không phản hồi ${mins} phút — đã tự dừng_`,
      agentFailed: (msg) => `⚠️ Bot gặp lỗi: ${msg}`,
      noContent: '_(không có nội dung trả về)_',
      thinking: '🧠 **Đang suy nghĩ**',
      thinkingDone: '🧠 **Đã nghĩ xong — bấm để xem**',
      noOutput: '_không có kết quả_',
      toolCalls: (count, finished) => `☕ **${count} thao tác${finished ? ' (xong)' : ''}**`,
      stopButton: '⏹ Dừng',
      footerThinking: '🧠 Đang suy nghĩ',
      footerToolRunning: '🧰 Đang chạy thao tác',
      footerStreaming: '✍️ Đang viết',
      summaryInterrupted: 'đã dừng',
      summaryIdleTimeout: 'quá thời gian',
      summaryError: 'lỗi',
      summaryDone: 'xong',
      summaryToolRunning: 'đang chạy thao tác',
      summaryStreaming: 'đang viết',
      summaryThinking: 'đang suy nghĩ',
      textAgentFailed: (msg) => `⚠️ Bot gặp lỗi: ${msg}`,
      textThinking: '_🧠 Đang suy nghĩ…_',
      textToolRunning: '_🧰 Đang chạy thao tác…_',
      textStreaming: '_✍️ Đang viết…_',
      toolRunning: '_đang chạy…_',
      bodyTruncated: '_(kết quả bị cắt bớt — xem đầy đủ bằng `/doctor` hoặc trong log)_',
      cotUnderstanding: 'Đang hiểu yêu cầu',
      cotCallingTool: 'Đang chạy thao tác',
      cotToolDone: 'Thao tác xong',
      cotWriting: 'Đang viết',
    },
    account: {
      currentSummary: 'Ứng dụng hiện tại',
      currentTitle: '📋 **Ứng dụng hiện tại**',
      botName: (name) => `**Tên bot**: ${name}`,
      unknownBot: '(chưa rõ)',
      changeButton: 'Đổi thông tin đăng nhập',
      validationFailed: (msg) => `❌ **Xác thực thất bại**: ${msg}`,
      secretPlaceholder: 'chuỗi 32 ký tự',
      tenantFeishu: 'Feishu (Trung Quốc)',
      tenantLark: 'Lark (quốc tế)',
      submit: 'Lưu',
      cancel: 'Huỷ',
      changeSummary: 'Đổi thông tin đăng nhập',
      validatingSummary: 'Đang xác thực…',
      validatingBody: '⏳ **Đang xác thực thông tin…**',
      savedSummary: 'Đã lưu',
      savedTitle: '✅ **Đã lưu thông tin đăng nhập**',
      reconnecting: 'Đang kết nối lại bằng thông tin mới…',
      newBotWarning:
        '⚠️ Nếu bot mới chưa ở trong nhóm này, các tin nhắn sau sẽ do bot mới nhận và bot cũ sẽ không trả lời nữa.',
      failedSummary: 'Xác thực thất bại',
      failedBody: (reason) =>
        `❌ **Xác thực thất bại**\n\n\`${reason}\`\n\nHãy kiểm tra lại App ID và Secret, rồi gõ \`/account change\` để thử lại.`,
      cancelledSummary: 'Đã huỷ',
      cancelledBody: 'Đã huỷ — không thay đổi gì.',
    },
  },
  commands: {
    adminOnly: '❌ Lệnh này chỉ quản trị viên dùng được.',
    adminOnlyStopScope: '❌ Dừng tác vụ theo scope chỉ quản trị viên dùng được.',
    adminOnlyTimeoutScope: '❌ Đặt thời gian chờ theo scope chỉ quản trị viên dùng được.',
    ackHandled: 'Đã xử lý.',
    resumeApplied: 'Xong — bạn gửi tin nhắn tiếp theo được rồi.',
    newSession: 'Đã bắt đầu phiên mới.',
    newSessionInterrupted: 'Đã dừng việc đang chạy và bắt đầu phiên mới.',
    chatCreateFailed: (msg) =>
      `❌ Không tạo được nhóm: ${msg}\n\nKiểm tra xem bot đã có quyền \`im:chat\` chưa.`,
    chatCreatedWithCwd: (cwd) =>
      `🎉 Đã tạo nhóm, giữ nguyên thư mục làm việc: \`${cwd}\`\n\n@ tôi kèm nội dung bất kỳ để bắt đầu.`,
    chatCreated: '🎉 Đã tạo nhóm.\n\n@ tôi kèm nội dung bất kỳ để bắt đầu.',
    chatCreatedNotice: (name) => `✓ Đã tạo nhóm **${name}** — mời bạn sang đó tiếp tục.`,
    cdUsage: 'Cách dùng: `/cd <đường-dẫn-tuyệt-đối>` hoặc `/cd ~/thư-mục`',
    cdAbsolute: 'Hãy dùng đường dẫn tuyệt đối, hoặc `~/thư-mục` cho thư mục trong home của bạn.',
    cdDone: (cwd) => `✓ Đã chuyển thư mục làm việc sang \`${cwd}\`\n(phiên đã được đặt lại)`,
    wsUsage: 'Cách dùng: `/ws [list|save <tên>|use <tên>|remove <tên>]`',
    wsSaveUsage: 'Cách dùng: `/ws save <tên>`',
    wsSaveNoCwd: 'Cuộc trò chuyện này chưa đặt thư mục làm việc — dùng `/cd` để đặt trước đã.',
    wsSaved: (name, cwd) => `✓ Đã lưu thư mục: \`${name}\` → ${cwd}`,
    wsUseUsage: 'Cách dùng: `/ws use <tên>`',
    wsNotFound: (name) => `Không tìm thấy thư mục tên \`${name}\``,
    wsSwitched: (name, cwd) => `✓ Đã chuyển sang \`${name}\` (${cwd})\n(phiên đã được đặt lại)`,
    wsRemoveUsage: 'Cách dùng: `/ws remove <tên>`',
    wsRemoved: (name) => `✓ Đã xoá thư mục đã lưu: \`${name}\``,
    docNoBinding:
      'Bình luận tài liệu giờ không cần gắn thư mục nữa — cứ @ bot trong phần bình luận là bot trả lời.',
    resumeNeedsCwd: 'Hãy chọn thư mục làm việc bằng /cd <đường-dẫn> trước, rồi mới xem hay mở lại phiên.',
    resumeDmOnly:
      'Không hiện danh sách phiên cũ trong nhóm. Hãy nhắn riêng cho bot rồi gõ `/resume` để xem và chọn.',
    resumeCodexHint: (nonce) =>
      `Có thể mở lại thread Codex hiện tại.\nGõ \`/resume use ${nonce}\` để mở (có hiệu lực 10 phút).`,
    resumeIncompatible:
      'Không mở lại được phiên này trong ngữ cảnh hiện tại — gõ `/resume` để lấy danh sách mới.',
    resumeReselect:
      'Không mở lại được phiên này trong ngữ cảnh hiện tại — hãy chọn phiên thuộc thư mục và mức quyền đang dùng.',
    resumeNoCodexThread:
      'Ngữ cảnh này chưa có thread Codex nào để mở lại — hãy chạy thử một lần trong thư mục này trước.',
    codexSessionUnset: '(chưa tạo)',
    stopRequested: (scope) => `Đã yêu cầu dừng \`${scope}\`.`,
    stopNotFound: (scope) => `Không thấy tác vụ nào đang chạy: \`${scope}\`.`,
    timeoutDisabled: 'tắt',
    timeoutUsage:
      '\n\nCách dùng:\n- `/timeout 15` — đặt 15 phút cho phiên này\n- `/timeout off` — tắt tự dừng cho phiên này\n- `/timeout default` — bỏ tuỳ chỉnh, quay về mặc định chung\n- `/timeout comment:<scopeHash> 15` — quản trị viên: đặt cho tác vụ bình luận\n\n_Lưu ý: `/new` sẽ xoá tuỳ chỉnh của phiên này và quay về mặc định chung._',
    timeoutSession: (scope, effective, global) =>
      `⏱ Tự dừng cho phiên này${scope}: ${effective}\nMặc định chung: ${global}`,
    timeoutSessionFollowsGlobal: (scope, global) =>
      `⏱ Tự dừng cho phiên này${scope}: theo mặc định chung (${global})`,
    timeoutCleared: (global) => `✅ Đã bỏ tuỳ chỉnh — quay về mặc định chung (${global}).`,
    timeoutNothingToClear: (global) =>
      `Phiên này vốn chưa tuỳ chỉnh gì — vẫn theo mặc định chung (${global}).`,
    timeoutOff: '✅ Đã tắt tự dừng cho phiên này.',
    timeoutOffLabel: 'tắt (phiên này)',
    timeoutBadValue: '❌ Cách dùng: `/timeout <1-120>` / `/timeout off` / `/timeout default`',
    timeoutSet: (n) => `✅ Đã đặt tự dừng cho phiên này là ${n} phút.`,
    minutes: (n) => `${n} phút`,
    psNone: 'Không có bot nào đang chạy (về lý thì không thể — bạn đang nói chuyện với một cái mà…)',
    psTableHeader: '| # | ID | Bot | Khởi động |',
    psCurrentMarker: ' ← đang trả lời bạn',
    psTitle: (n) => `🧭 **Đang có ${n} bot chạy**`,
    psHint: (pid) =>
      'Gõ `/exit <id|#>` để tắt một cái; `/exit ' + pid + '` tắt đúng con đang trả lời bạn.',
    exitUsage: (pid) =>
      'Cách dùng: `/exit <id|#>` — `id` là mã ngắn trong `/ps`, `#` là số thứ tự.\n' +
      `Con đang trả lời bạn là \`${pid}\`.`,
    exitNotFound: (target) => `❌ Không thấy bot nào khớp \`${target}\`. Gõ \`/ps\` để xem danh sách.`,
    exitSelf: (id) => `👋 Sắp tắt bot \`${id}\` — tạm biệt.`,
    exitFailed: (id, msg) => `❌ Không tắt được bot \`${id}\`: ${msg}`,
    exitPending: (id) => `📨 Đã yêu cầu tắt \`${id}\`, nhưng nó còn đang dọn dẹp. Gõ \`/ps\` để kiểm tra lại.`,
    exitDone: (id) => `✓ Đã tắt bot \`${id}\`.`,
    agoSeconds: (n) => `${n}s trước`,
    agoMinutes: (n) => `${n}m trước`,
    agoHours: (n) => `${n}h trước`,
    agoDays: (n) => `${n}d trước`,
    reconnectAfterRun: '⏳ Sẽ kết nối lại sau khi việc đang chạy xong…',
    reconnectNow: '⏳ Đang dừng việc hiện tại và kết nối lại…',
    reconnectFailed: (msg) => `❌ Kết nối lại thất bại: ${msg}`,
    doctorRateLimited: 'doctor bị giới hạn: mỗi người 30 giây một lần.',
    doctorNoWorkspace:
      'Chưa đặt thư mục làm việc. Hãy chọn bằng `/cd <đường-dẫn>` hoặc `/ws use <tên>` rồi mới chạy kiểm tra.',
    doctorWorkspaceCheck: (visible) =>
      `${visible} Khi thư mục làm việc không dùng được thì chỉ tự kiểm tra, không khởi động bot.`,
    doctorInFlight: 'doctor đang chạy: hồ sơ này đã có một lượt chẩn đoán rồi.',
    doctorAccepted: '🔍 Đã nhận yêu cầu chẩn đoán — kết quả sẽ được nhắn riêng cho bạn.',
    workspaceUnset: '(chưa đặt)',
    accountUsage: 'Cách dùng: `/account` hoặc `/account change`',
    accountEmptyCreds: 'App ID hoặc App Secret đang để trống',
    accountSaveFailed: (msg) => `Lưu thông tin đăng nhập thất bại: ${msg}`,
    inviteNoGroups: 'Bot chưa ở trong nhóm nào nên không có gì để thêm.',
    inviteGroupsAdded: (added, total) =>
      `✅ Đã thêm ${added} nhóm mà bot đang ở vào danh sách được trả lời (tổng ${total}).`,
    inviteUsage:
      'Cách dùng:\n' +
      '• `/invite user @tên` — cho phép người đó nhắn riêng cho bot\n' +
      '• `/invite admin @tên` — cho người đó làm quản trị viên\n' +
      '• `/invite group` — cho phép nhóm hiện tại\n' +
      '• `/invite all group` — cho phép tất cả nhóm bot đang ở',
    inviteGroupDmError: '❌ `/invite group` chỉ gõ được trong nhóm — nhắn riêng thì không có nhóm nào để thêm.',
    inviteGroupAlready: '✅ Nhóm này đã được phép rồi.',
    inviteGroupAdded: (chatId) => `✅ Đã thêm nhóm này (\`${chatId}\`) vào danh sách được trả lời.`,
    inviteNoMention: (kind) =>
      `❌ Không thấy bạn @ ai cả. Hãy gõ như này: \`/invite ${kind} @tên\` (@ người đó, không phải @ bot).`,
    labelUsers: 'danh sách được nhắn riêng',
    labelAdmins: 'danh sách quản trị viên',
    inviteAdded: (names, label) => `✅ Đã thêm ${names} vào ${label}.`,
    inviteAlready: (names, label) => `_${names} đã có trong ${label} rồi — bỏ qua._`,
    removeUsage:
      'Cách dùng:\n' +
      '• `/remove user @tên` — bỏ khỏi danh sách được nhắn riêng\n' +
      '• `/remove admin @tên` — bỏ khỏi danh sách quản trị viên\n' +
      '• `/remove group` — bỏ nhóm hiện tại khỏi danh sách được trả lời',
    removeGroupDmError:
      'Hãy gõ `/remove group` ngay trong nhóm muốn bỏ — nhắn riêng thì không có nhóm nào để bỏ.',
    removeGroupNotThere: '✅ Nhóm này vốn không có trong danh sách, khỏi cần bỏ.',
    removeGroupDone: '✅ Đã bỏ nhóm này khỏi danh sách được trả lời.',
    removeNoMention: (kind) => `Hãy @ người muốn bỏ, ví dụ: \`/remove ${kind} @tên\`.`,
    removeDone: (names, label) => `✅ Đã bỏ ${names} khỏi ${label}.`,
    removeNotThere: (names, label) => `${names} vốn không có trong ${label}.`,
    configUsage: 'Cách dùng: `/config`',
    saveFailedRollbackFailed:
      'Lưu thất bại, và việc khôi phục danh tính lark-cli cũng thất bại. Gõ /status để kiểm tra tình trạng.',
    saveFailedRolledBack:
      'Lưu thất bại; danh tính lark-cli đã được khôi phục. Mở lại /config để kiểm tra tình trạng.',
    identityNotApplied: 'Danh tính lark-cli chưa được áp dụng — không thay đổi gì.',
    configNotWritten: 'Chưa ghi được cấu hình — không thay đổi gì.',
  },
  models: {
    labels: {
      default: 'Theo mặc định (không chỉ định)',
      'claude-opus-4-8': 'Opus 4.8 (mới nhất · sâu nhất — đốt token 5h nhanh nhất)',
      'claude-opus-4-7': 'Opus 4.7 (suy nghĩ sâu — đốt token 5h nhanh)',
      'claude-sonnet-5': 'Sonnet 5 (mới nhất · cân bằng)',
      'claude-sonnet-4-6': 'Sonnet 4.6 (cân bằng)',
      'claude-haiku-4-5': 'Haiku 4.5 (mới nhất · nhanh nhất, tốn ít token nhất)',
      opusplan: 'Opus Plan (Opus lên kế hoạch, Sonnet thực thi)',
      'gpt-5-codex': 'GPT-5 Codex',
      'gpt-5': 'GPT-5',
      o3: 'o3',
    },
  },
  bootstrap: {
    configSaved: (path) => `Đã lưu cấu hình vào ${path}`,
    noConfigNonInteractive:
      'Chưa có cấu hình, và trình tạo ứng dụng bằng mã QR không chạy được ở chế độ không tương tác. ' +
      'Hãy mở terminal và chạy `lark-channel-bridge run` để cài lần đầu, ' +
      'hoặc truyền vào --app-id và --app-secret.',
    missingSecretNonInteractive: (appId) =>
      `Thiếu App Secret của ${appId} ở chế độ không tương tác. ` +
      'Hãy truyền --app-secret <secret>, hoặc chạy lại lệnh trong terminal rồi nhập khi được hỏi.',
    appSecretPrompt: (appId) => `Nhập App Secret của ${appId}: `,
    credentialsOk: '✓ Ứng dụng đã xác thực thành công',
    credentialsOkNamed: (botName) => `✓ Ứng dụng đã xác thực thành công: ${botName}`,
    multipleAgentsNonInteractive:
      'Máy này có nhiều agent. Dùng --agent <claude|codex> để chọn cài cái nào.',
    multipleAgentsDetected: 'Đã tìm thấy:',
    agentPickerIntro: 'Chọn agent trên máy',
    agentPickerQuestion: 'Máy này có nhiều agent. Lần này bạn muốn dùng cái nào?',
    agentPickerCancelled: 'Đã huỷ chọn agent.',
    agentSelected: (agent) => `Đã chọn ${agent}`,
    startCancelled: 'Đã huỷ khởi động.',
  },
  preflight: {
    errorCode: (code) => `Mã lỗi: ${code}`,
    notFoundTitle: (agent) => `✗ Không tìm thấy ${agent} trên máy này.`,
    notFoundHint: (agent) => `Hãy cài ${agent} trước, hoặc chỉ cho bridge đường dẫn đúng tới file chạy.`,
    notExecutableTitle: (agent) => `✗ File ${agent} trên máy không chạy được.`,
    notExecutableHint: (agent) => `Kiểm tra quyền thực thi của file, hoặc cài lại ${agent}.`,
    resolveFailedTitle: (agent) => `✗ Không tìm được đường dẫn tới ${agent} trên máy.`,
    resolveFailedHint: 'Hãy kiểm tra lại đường dẫn file chạy đã cấu hình, rồi chạy bridge lại.',
    notReadableTitle: (agent) => `✗ Không đọc được file ${agent} trên máy.`,
    notReadableHint: (agent) => `Kiểm tra quyền của file, hoặc cài lại ${agent}.`,
    spawnFailedTitle: (agent, command) =>
      `✗ Không dùng được ${agent} trên máy: không chạy được \`${command}\`.`,
    runCommandHint: 'Hãy chạy đúng lệnh đó trong terminal và sửa lỗi mà nó báo.',
    timeoutTitle: (agent, command) =>
      `✗ Không dùng được ${agent} trên máy: \`${command}\` chạy quá lâu không phản hồi.`,
    timeoutHint: 'Hãy kiểm tra xem lệnh đó có tự chạy xong được không.',
    signaledTitle: (agent, command, signal) =>
      `✗ Không dùng được ${agent} trên máy: \`${command}\` bị hệ thống dừng giữa chừng (${signal}).`,
    signaledConfirm: 'Hãy thử chạy lệnh này trong terminal trước:',
    signaledHint: (agent) => `Sửa xong ${agent} trên máy thì chạy bridge lại.`,
    nonzeroExitTitle: (agent, command, exitCode) =>
      `✗ Không dùng được ${agent} trên máy: \`${command}\` kết thúc với mã lỗi ${exitCode}.`,
    emptyOutputTitle: (agent, command) =>
      `✗ Không dùng được ${agent} trên máy: \`${command}\` không trả về thông tin phiên bản.`,
    emptyOutputHint: (agent) => `Hãy kiểm tra xem bản ${agent} đã cài có được hỗ trợ không.`,
  },
};
