#!/usr/bin/env bash
# Build static site with .env, package into nginx image, push to GHCR.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export PATH="/home/ubuntu/.nvm/versions/node/v22.22.2/bin:${PATH}"

DOCKER="${DOCKER:-docker}"
if ! $DOCKER info >/dev/null 2>&1; then
  DOCKER="sudo docker"
fi

IMAGE="${IMAGE:-ghcr.io/likaiprime/block-out-website}"
TAG="${TAG:-latest}"
SHORT_SHA="$(git rev-parse --short HEAD 2>/dev/null || echo local)"

if [[ ! -f .env ]]; then
  echo "ERROR: .env not found. Copy .env.example and fill in values before building."
  exit 1
fi

echo "==> Installing dependencies"
npm ci

echo "==> Building static export (Next.js loads .env automatically; NEXT_PUBLIC_* baked in)"
npm run build

FILE_COUNT="$(find dist-export -type f | wc -l | tr -d ' ')"
echo "==> dist-export: ${FILE_COUNT} files"
if (( FILE_COUNT > 20000 )); then
  echo "WARNING: file count exceeds 20k (fine for Docker, not for Cloudflare Pages)"
fi

echo "==> Building Docker image ${IMAGE}:${TAG}"
$DOCKER build \
  -f Dockerfile \
  -t "${IMAGE}:${TAG}" \
  -t "${IMAGE}:${SHORT_SHA}" \
  .

echo "==> Pushing ${IMAGE}:${TAG} and ${IMAGE}:${SHORT_SHA}"
$DOCKER push "${IMAGE}:${TAG}"
$DOCKER push "${IMAGE}:${SHORT_SHA}"

echo "Done. Pull in Dokploy: ${IMAGE}:${TAG}"
