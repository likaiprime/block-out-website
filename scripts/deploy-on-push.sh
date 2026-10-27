#!/usr/bin/env bash
# Builds and deploys one commit to Cloudflare Workers from a throwaway worktree,
# so a push deploys exactly what was pushed whatever state the checkout is in.
#
# Runs in the background from .git/hooks/pre-push (install it with
# `scripts/deploy-on-push.sh --install`). Uses this Mac's default wrangler login
# (chn.likai@gmail.com), the account that holds the blockout.cc zone.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$HOME/Library/Logs/blockout-deploy.log"

if [[ "${1:-}" == "--install" ]]; then
  hook="$REPO/.git/hooks/pre-push"
  cat > "$hook" <<'HOOK'
#!/usr/bin/env bash
# Deploys master after the push goes through; see scripts/deploy-on-push.sh.
repo="$(git rev-parse --show-toplevel)"
while read -r _ local_sha remote_ref _; do
  if [[ "$remote_ref" == "refs/heads/master" && "$local_sha" != 0000000* ]]; then
    nohup "$repo/scripts/deploy-on-push.sh" "$local_sha" >/dev/null 2>&1 &
    echo "Deploying ${local_sha:0:7} to Cloudflare in the background (log: ~/Library/Logs/blockout-deploy.log)"
  fi
done
exit 0
HOOK
  chmod +x "$hook"
  echo "Installed $hook"
  exit 0
fi

sha="$1"
exec >>"$LOG" 2>&1
echo "=== $(date '+%F %T') deploying ${sha:0:7}"

# One deploy at a time; a later push waits for the earlier one to finish.
lock="$REPO/.git/deploy-on-push.lock"
until mkdir "$lock" 2>/dev/null; do sleep 5; done
work="$(mktemp -d)"
cleanup() { git -C "$REPO" worktree remove --force "$work" 2>/dev/null || rm -rf "$work"; rmdir "$lock"; }
trap cleanup EXIT

# The pre-push hook fires before the push lands; give it a moment so a rejected
# push (non-fast-forward, auth failure) doesn't deploy.
sleep 20
if ! git -C "$REPO" ls-remote origin refs/heads/master | grep -q "^$sha"; then
  git -C "$REPO" fetch -q origin master
  git -C "$REPO" merge-base --is-ancestor "$sha" origin/master || { echo "push did not land, skipping"; exit 0; }
fi

export PATH="/opt/homebrew/bin:$PATH"
export CLOUDFLARE_ACCOUNT_ID=6d858ec997f8d5a9083da67f763d1cd9
export NEXT_TELEMETRY_DISABLED=1

git -C "$REPO" worktree add --detach "$work" "$sha"
cp "$REPO/.env" "$work/.env"
cd "$work"
status=ok
# Asset uploads resume where they stopped, so a timed-out upload is retried.
deploy() { for _ in 1 2 3 4 5; do npx wrangler deploy && return 0; done; return 1; }
npm ci --no-audit --no-fund && npm run build && deploy || status=failed
echo "=== $(date '+%F %T') ${sha:0:7} $status"
osascript -e "display notification \"${sha:0:7} $status\" with title \"blockout.cc deploy\"" || true
[[ "$status" == ok ]]
