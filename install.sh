#!/usr/bin/env bash
#
# lark-bridge-onboarding installer
#
#   curl -fsSL https://raw.githubusercontent.com/nixthinh-bit/lark-bridge-onboarding/main/install.sh | bash
#
# Gets you from nothing to "ready to scan the QR code". It installs the bridge
# and, with your permission, Claude Code. It never installs Node.js (that needs
# a package manager and root, and is not ours to decide) and never installs
# lark-cli (that has its own onboarding) — it points you at both instead.
#
# Honest about what it can't do: the Lark app itself is created by the wizard
# after this script finishes, by scanning a QR code. No script can do that part
# for you, and no script needs to.
#
# Environment:
#   LARK_CHANNEL_LANG=vi|en        force the language (default: your OS locale)
#   LARK_BRIDGE_NPM_PREFIX=<dir>   install somewhere other than the npm global
#                                  root. Only the final install honours it; it
#                                  deliberately does not reach the temp build,
#                                  where an inherited npm prefix would send dev
#                                  dependencies to the wrong place and break the
#                                  build. Used by this project's own tests.

set -euo pipefail

REPO="nixthinh-bit/lark-bridge-onboarding"
PKG="github:${REPO}"
BIN="lark-channel-bridge"
CLAUDE_PKG="@anthropic-ai/claude-code"
LARK_CLI_ONBOARDING="https://github.com/nixthinh-bit/lark-cli-onboarding"
NODE_MIN_MAJOR=20
NODE_MIN_MINOR=12

# ---------------------------------------------------------------- presentation

if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
  B=$'\033[1m'; DIM=$'\033[2m'; R=$'\033[0m'
  RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'
else
  B=''; DIM=''; R=''; RED=''; GREEN=''; YELLOW=''
fi

step()  { printf '\n%s==>%s %s%s%s\n' "$B" "$R" "$B" "$1" "$R"; }
ok()    { printf '  %s✓%s %s\n' "$GREEN" "$R" "$1"; }
warn()  { printf '  %s⚠%s  %s\n' "$YELLOW" "$R" "$1"; }
info()  { printf '    %s%s%s\n' "$DIM" "$1" "$R"; }
die()   { printf '\n  %s✗%s %s\n\n' "$RED" "$R" "$1" >&2; exit 1; }

# ------------------------------------------------------------------------ i18n
# Mirrors src/i18n: LARK_CHANNEL_LANG wins, then the POSIX locale. Unlike the
# CLI (which defaults to Chinese, upstream's original behaviour), this script
# defaults to English — it is the fork's own entry point, not upstream's.

detect_lang() {
  local tag
  tag="$(printf '%s' "${LARK_CHANNEL_LANG:-${LC_ALL:-${LC_MESSAGES:-${LANG:-}}}}" | tr '[:upper:]' '[:lower:]')"
  case "$tag" in
    vi*) printf 'vi' ;;
    *)   printf 'en' ;;
  esac
}
LANG_SEL="$(detect_lang)"
vi() { [ "$LANG_SEL" = "vi" ]; }

# --------------------------------------------------------------------- helpers

have() { command -v "$1" >/dev/null 2>&1; }

# `curl … | bash` leaves stdin pointing at the script, so prompts must read the
# terminal directly. With no terminal (CI, a pipe), we can't ask — say what we
# would have asked and let the caller decide.
ask_yes() {
  local prompt="$1" reply
  if [ ! -t 0 ] && [ ! -r /dev/tty ]; then
    return 1
  fi
  printf '  %s [Y/n]: ' "$prompt" > /dev/tty
  read -r reply < /dev/tty || return 1
  case "$reply" in
    [nN]*) return 1 ;;
    *)     return 0 ;;
  esac
}

node_version_ok() {
  local v major minor rest
  v="$(node -v 2>/dev/null | sed 's/^v//')" || return 1
  [ -n "$v" ] || return 1
  major="${v%%.*}"; rest="${v#*.}"; minor="${rest%%.*}"
  case "$major$minor" in *[!0-9]*) return 1 ;; esac
  [ "$major" -gt "$NODE_MIN_MAJOR" ] && return 0
  [ "$major" -eq "$NODE_MIN_MAJOR" ] && [ "$minor" -ge "$NODE_MIN_MINOR" ] && return 0
  return 1
}

# ---------------------------------------------------------------------- banner

if vi; then
  printf '\n%slark-bridge-onboarding%s — nhắn tin cho Claude Code ngay trong Lark\n' "$B" "$R"
  printf '%sBản fork của zarazhangrui/lark-coding-agent-bridge (MIT)%s\n' "$DIM" "$R"
else
  printf '\n%slark-bridge-onboarding%s — message Claude Code from inside Lark\n' "$B" "$R"
  printf '%sA fork of zarazhangrui/lark-coding-agent-bridge (MIT)%s\n' "$DIM" "$R"
fi

# ------------------------------------------------------------------ 1. Node.js

step "$(vi && echo '1/4  Kiểm tra Node.js' || echo '1/4  Checking Node.js')"

if ! have node || ! have npm; then
  if vi; then
    die "$(cat <<EOF
Máy chưa có Node.js. Hãy cài Node.js 20.12 trở lên rồi chạy lại lệnh này.

    macOS:  brew install node
    Khác:   https://nodejs.org/en/download
EOF
)"
  else
    die "$(cat <<EOF
Node.js is not installed. Install Node.js 20.12 or newer, then run this again.

    macOS:  brew install node
    Other:  https://nodejs.org/en/download
EOF
)"
  fi
fi

if ! node_version_ok; then
  CURRENT="$(node -v 2>/dev/null || echo '?')"
  if vi; then
    die "Node.js quá cũ: $CURRENT (cần >= v${NODE_MIN_MAJOR}.${NODE_MIN_MINOR}). Hãy nâng cấp rồi chạy lại."
  else
    die "Node.js is too old: $CURRENT (need >= v${NODE_MIN_MAJOR}.${NODE_MIN_MINOR}). Upgrade, then run this again."
  fi
fi
ok "Node.js $(node -v)"

# -------------------------------------------------------------- 2. Claude Code

step "$(vi && echo '2/4  Kiểm tra Claude Code (bắt buộc)' || echo '2/4  Checking Claude Code (required)')"

if have claude; then
  ok "Claude Code $(claude --version 2>/dev/null | head -1 || echo '')"
else
  if vi; then
    warn 'Chưa có lệnh `claude` — đây là bộ não của bot, thiếu nó bot KHÔNG chạy được.'
    info 'Lưu ý: cài app Claude cho máy tính là CHƯA đủ — app đó không kèm lệnh `claude`.'
    if ask_yes "Cài Claude Code ngay bây giờ? (npm i -g ${CLAUDE_PKG})"; then
      npm i -g "$CLAUDE_PKG"
      have claude || die 'Cài xong nhưng vẫn không thấy lệnh `claude` trong PATH. Hãy mở terminal mới rồi chạy lại.'
      ok "Claude Code $(claude --version 2>/dev/null | head -1 || echo '')"
    else
      die "$(cat <<EOF
Cần Claude Code trước. Chạy hai lệnh này rồi quay lại:

    npm i -g ${CLAUDE_PKG}
    claude auth login
EOF
)"
    fi
  else
    warn 'The `claude` command is missing — it is the brain of the bot; without it the bot cannot run.'
    info 'Note: installing the Claude desktop app is NOT enough — it does not ship the `claude` command.'
    if ask_yes "Install Claude Code now? (npm i -g ${CLAUDE_PKG})"; then
      npm i -g "$CLAUDE_PKG"
      have claude || die 'Installed, but `claude` is still not on PATH. Open a new terminal and run this again.'
      ok "Claude Code $(claude --version 2>/dev/null | head -1 || echo '')"
    else
      die "$(cat <<EOF
Claude Code is required. Run these two commands, then come back:

    npm i -g ${CLAUDE_PKG}
    claude auth login
EOF
)"
    fi
  fi
fi

# ----------------------------------------------------------------- 3. lark-cli

step "$(vi && echo '3/4  Kiểm tra lark-cli (nên có)' || echo '3/4  Checking lark-cli (recommended)')"

if have lark-cli; then
  ok "lark-cli $(lark-cli --version 2>/dev/null | head -1 || echo '')"
else
  if vi; then
    warn 'Chưa có lark-cli. Bot vẫn chạy, nhưng sẽ KHÔNG đụng được vào Lark'
    info '(không gửi được thẻ, không đọc/sửa được Doc hay Base).'
    info 'Bridge có tự cài lark-cli, nhưng nó BỎ QUA khi chạy dạng dịch vụ nền —'
    info 'nên cài sẵn từ trước là chắc ăn nhất:'
    info "  ${LARK_CLI_ONBOARDING}"
  else
    warn 'lark-cli is missing. The bot still runs, but it will NOT be able to touch Lark'
    info '(no cards, no reading or editing Docs and Bases).'
    info 'The bridge can auto-install it, but it SKIPS that step when started as a'
    info 'background service — installing it up front is the reliable path:'
    info "  ${LARK_CLI_ONBOARDING}"
  fi
fi

# ------------------------------------------------------------------- 4. bridge

step "$(vi && echo '4/4  Cài bridge' || echo '4/4  Installing the bridge')"

if have "$BIN"; then
  EXISTING="$($BIN --version 2>/dev/null | head -1 || echo '?')"
  if vi; then
    warn "Đã có sẵn ${BIN} (phiên bản ${EXISTING}) — bản này sẽ ĐÈ lên."
    info 'Fork này dùng chung tên lệnh với bản gốc, nên nó là bản thay thế drop-in.'
    info 'Mọi lệnh cũ vẫn chạy y hệt. Quay về bản gốc: npm i -g lark-channel-bridge'
  else
    warn "${BIN} is already installed (version ${EXISTING}) — this will REPLACE it."
    info 'This fork shares the upstream command name, so it is a drop-in replacement.'
    info 'Every existing command still works. To go back: npm i -g lark-channel-bridge'
  fi
fi

# Why not `npm i -g github:…`? Because it does not work. Installing a git
# dependency makes npm clone the repo and run `prepare` (which builds with
# tsup) — but under `-g` the nested install never lands tsup, and the build
# dies with `sh: tsup: command not found`. The same source installs fine
# locally, so the fix is to do the three steps ourselves, in a temp clone:
# install dev deps, build, then install the built tree globally with scripts
# off (dist already exists; re-running `prepare` would just reintroduce the
# same failure).

have git || die "$(vi \
  && echo 'Cần git để tải mã nguồn. macOS: xcode-select --install' \
  || echo 'git is required to fetch the source. macOS: xcode-select --install')"

WORK="$(mktemp -d)"
# shellcheck disable=SC2064
trap "rm -rf '$WORK'" EXIT

info "$(vi && echo 'Đang tải mã nguồn…' || echo 'Fetching the source…')"
git clone -q --depth 1 "https://github.com/${REPO}.git" "$WORK/src"

info "$(vi && echo 'Đang cài thư viện…' || echo 'Installing dependencies…')"
(cd "$WORK/src" && npm install --silent --ignore-scripts >/dev/null)

info "$(vi && echo 'Đang biên dịch…' || echo 'Building…')"
(cd "$WORK/src" && npm run build >/dev/null 2>&1) \
  || die "$(vi && echo 'Biên dịch thất bại. Hãy mở issue kèm nội dung lỗi.' || echo 'Build failed. Please open an issue with the output.')"

info "$(vi && echo 'Đang đóng gói…' || echo 'Packing…')"
# Pack to a tarball first. `npm i -g <dir>` symlinks the directory rather than
# copying it, so the install would point into this temp clone and break the
# moment the trap below removes it — a dead symlink, with no error at install
# time. A tarball is copied, so the install stands on its own.
(cd "$WORK/src" && npm pack --silent --ignore-scripts --pack-destination "$WORK" >/dev/null)
TARBALL="$(find "$WORK" -maxdepth 1 -name '*.tgz' | head -1)"
[ -n "$TARBALL" ] || die "$(vi && echo 'Đóng gói thất bại.' || echo 'Packing failed.')"

info "$(vi && echo 'Đang cài đặt…' || echo 'Installing…')"
PREFIX_FLAG=()
[ -n "${LARK_BRIDGE_NPM_PREFIX:-}" ] && PREFIX_FLAG=(--prefix "$LARK_BRIDGE_NPM_PREFIX")
npm i -g "${PREFIX_FLAG[@]+"${PREFIX_FLAG[@]}"}" --ignore-scripts "$TARBALL" >/dev/null

have "$BIN" || die "$(vi && echo "Cài xong nhưng không thấy lệnh ${BIN} trong PATH. Hãy mở terminal mới." || echo "Installed, but ${BIN} is not on PATH. Open a new terminal.")"
ok "$BIN $($BIN --version 2>/dev/null | head -1 || echo '')"

# --------------------------------------------------------------- what's next

if vi; then
  cat <<EOF

${B}Xong. Bước tiếp theo — quét mã QR:${R}

    ${B}${BIN} run${R}

Terminal sẽ hiện mã QR. Mở app Lark trên điện thoại và quét.
Ứng dụng Lark được tạo tự động — bạn ${B}không${R} phải vào trang lập trình viên,
${B}không${R} phải tự tạo app, ${B}không${R} phải copy App ID hay App Secret.

${YELLOW}⚠  Bot chỉ trả lời khi máy tính này đang bật và không ngủ.${R}
   Bridge không phải dịch vụ đám mây — Claude chạy ngay trên máy bạn.

${DIM}Hướng dẫn đầy đủ:  https://github.com/${REPO}${R}
${DIM}Giao diện tiếng Việt: ${BIN} --lang vi run${R}

EOF
else
  cat <<EOF

${B}Done. Next step — scan the QR code:${R}

    ${B}${BIN} run${R}

A QR code appears in your terminal. Scan it with the Lark app on your phone.
The Lark app is created automatically — you do ${B}not${R} need a developer console,
you do ${B}not${R} create the app by hand, and you ${B}never${R} copy an App ID or Secret.

${YELLOW}⚠  The bot only answers while this computer is awake.${R}
   The bridge is not a cloud service — Claude runs on this machine.

${DIM}Full guide:  https://github.com/${REPO}${R}

EOF
fi
