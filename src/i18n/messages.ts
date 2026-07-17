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
