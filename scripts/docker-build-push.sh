#!/usr/bin/env bash
# Build static site with .env, package into nginx image, push to GHCR.
#
# macOS (Apple Silicon) notes:
# - Use Docker Desktop or Colima; no sudo needed.
# - Dokploy servers are usually linux/amd64 — default PLATFORM below.
# - Login with a GitHub PAT (write:packages), not a fine-grained app token:
#     export GITHUB_TOKEN=ghp_xxxx
#     echo "$GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USER --password-stdin
# - Do NOT `source .env` in bash (values with spaces break). Next.js reads .env itself.
#
# Usage:
#   npm run docker:publish
#   PLATFORM=linux/arm64 npm run docker:publish   # native arm64 server only
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

IMAGE="${IMAGE:-ghcr.io/likaiprime/block-out-website}"
TAG="${TAG:-latest}"
SHORT_SHA="$(git rev-parse --short HEAD 2>/dev/null || echo local)"

# Dokploy / most VPS hosts are amd64. On M1/M2/M3 Mac, cross-build is required.
if [[ "$(uname -s)" == "Darwin" ]]; then
  PLATFORM="${PLATFORM:-linux/amd64}"
else
  PLATFORM="${PLATFORM:-linux/amd64}"
fi

DOCKER="${DOCKER:-docker}"
if ! $DOCKER info >/dev/null 2>&1; then
  if [[ "$(uname -s)" != "Darwin" ]] && sudo $DOCKER info >/dev/null 2>&1; then
    DOCKER="sudo docker"
  else
    echo "ERROR: Docker is not running. On Mac, start Docker Desktop or Colima."
    exit 1
  fi
fi

if [[ ! -f .env ]]; then
  echo "ERROR: .env not found. Copy .env.example and fill in values before building."
  exit 1
fi

echo "==> Installing dependencies"
if command -v npm >/dev/null 2>&1; then
  npm ci
else
  echo "ERROR: npm not found. Install Node.js 20+ (nvm/fnm/brew on Mac)."
  exit 1
fi

echo "==> Building static export (.env loaded by Next.js; NEXT_PUBLIC_* baked in)"
npm run build

FILE_COUNT="$(find dist-export -type f | wc -l | tr -d ' ')"
echo "==> dist-export: ${FILE_COUNT} files"

echo "==> Ensuring buildx builder exists"
if ! $DOCKER buildx inspect block-out-builder >/dev/null 2>&1; then
  $DOCKER buildx create --name block-out-builder --use
else
  $DOCKER buildx use block-out-builder
fi

echo "==> Building & pushing ${IMAGE}:${TAG} (platform=${PLATFORM})"
$DOCKER buildx build \
  --platform "${PLATFORM}" \
  -f Dockerfile \
  -t "${IMAGE}:${TAG}" \
  -t "${IMAGE}:${SHORT_SHA}" \
  --push \
  .

echo ""
echo "Done."
echo "  Image: ${IMAGE}:${TAG}"
echo "  Also:  ${IMAGE}:${SHORT_SHA}"
echo ""
echo "Dokploy: Application → Docker → Image ${IMAGE}:${TAG} → Port 80"
echo "Note: NEXT_PUBLIC_* vars are fixed at build time. Rebuild image after .env changes."
