# Site-owned Plausible analytics

`app/(default)/[lang]/layout.tsx` includes `https://p.070122.xyz/js/script.js` once with `data-domain="blockout.cc"`, covering every locale and the exported English root. The existing GoogleAnalytics and AdSense components and build-time `.env` values remain unchanged. No build/runtime toggle is needed for Plausible.

The supplied script posts to `https://p.070122.xyz/api/event`. It already observes History API pushState/popstate and deduplicates unchanged pathnames. Do not add manual pageview hooks or another copy. The existing nginx/source configuration has no script-src/connect-src restriction requiring modification.

Production is the existing Dokploy app `AJ9VCc_NcBinl2UMhKhog` at h2.070122.xyz, serving apex and www.blockout.cc on port 80 from `ghcr.io/likaiprime/block-out-website:latest`. Cloudflare proxies the existing A records to 193.46.198.248. The older Cloudflare Pages project is not the production domain target; do not deploy to it or change DNS.

Use the existing master branch and `.github/workflows/docker-ghcr.yml`: npm ci and npm run build create dist-export, then the existing Dockerfile packages nginx and publishes latest plus a commit tag to GHCR. Check successful CI and the pushed image revision before deploying the existing Dokploy application. Runtime NEXT_PUBLIC_* changes cannot affect a static image; preserve the production source's build-time settings.

After deployment, verify in a browser that the script loads once and a real POST returns success for the initial page and each internal path change, with no duplicate on unchanged paths. Check back/forward and the Plausible dashboard when authenticated. The legacy script ignores webdriver unless `window.__plausible` is enabled for a documented automated test. Source markup alone does not prove collection.
