# Block Out! - Color Sort Puzzle Walkthrough

## CRITICAL INSTRUCTION FOR CLAUDE CODE

**You MUST use your marketplace frontend-design skill to guide all UI decisions.**
- Before writing any component, load your frontend-design skill
- Apply its principles for layout, color, typography, and interaction
- Avoid AI design tropes: no glassmorphism, rainbow gradients, or unnecessary SVG illustrations

## ON-PAGE SEO REQUIREMENTS (MANDATORY)

**The following skills are installed in .claude/skills/ — USE THEM:**
- `meta-tags-optimizer` — for title tags, meta descriptions, OG tags on every page
- `schema-markup-generator` — for JSON-LD structured data (HowTo, VideoObject, BreadcrumbList, Article)
- `seo-content-writer` — for SEO-optimized level descriptions and blog content
- `geo-content-optimizer` — for AI search optimization (ChatGPT, Perplexity)
- `on-page-seo-auditor` — to audit pages before declaring done
- `internal-linking-optimizer` — for related level links
- `technical-seo-checker` — for technical SEO verification
- `keyword-research` — for keyword targeting
- `entity-optimizer` — for E-E-A-T signals
- `serp-analysis` — for understanding search intent

Every page MUST have:
1. **Unique Title Tag** (50-60 chars) — `Block Out! Level N 攻略 | 颜色方块解谜`
2. **Meta Description** (150-160 chars) — compelling, keyword-rich
3. **H1 Tag** — one per page, descriptive
4. **Canonical URL** — prevent duplicates
5. **hreflang** — for multi-language (`/en/`, `/zh/`, `/ja/`, etc.)
6. **Open Graph + Twitter Card** — social sharing tags
7. **Schema.org structured data:**
   - Level pages: `HowTo` + `VideoObject` + `BreadcrumbList`
   - Blog: `Article`
   - Home: `WebSite` + `SearchAction`
8. **Image alt text** — every `<img>` needs descriptive alt
9. **Breadcrumb navigation** — on every page
10. **Internal links** — related levels, cross-linking
11. **Content depth** — each level page: video + screenshot + difficulty + description + 3-5 tips + detailed steps + related levels (min 300 words)
12. **YouTube iframe** — lazy load, not immediate render
13. **Read SEO-GUIDE.md** in project root for full spec

## Project Info
- Domain: blockout.cc
- Site URL: https://blockout.cc
- Game: Block Out! - Color Sort Puzzle by Grand Games
- Platform: iOS + Android
- Deployment: Cloudflare Pages (static export, `output: 'export'`)
- Local test: Docker + nginx (Dockerfile + docker-compose.yml)
- Package manager: pnpm (from reference project)

## Technical Constraints
- `next.config.js` must use `output: 'export'`
- NO API routes, NO middleware, NO getServerSideProps
- All dynamic features = client-side rendering (CSR)
- i18n via static routes + pre-built JSON dictionaries
- Images in public/ with relative paths
- YouTube embeds must be 16:9 aspect ratio, responsive
- Video must not stretch or crop on any screen size

## Key Improvements Over Reference (ColorBlockJam)
1. Level pages must be content-rich: video + difficulty + description + tips(3-5) + related levels
2. Mobile-first responsive design with touch-friendly targets (44px minimum)
3. Dark/light theme support
4. Proper 16:9 YouTube embedding (no distortion)
5. AdSense ad containers preserved but non-intrusive

## Design Style — MUST MATCH THE GAME'S VISUAL IDENTITY

Block Out! is a colorful, modern puzzle game with these visual characteristics:
- **Bright saturated blocks**: red (#FF3B30), blue (#007AFF), green (#34C759), yellow (#FF9500), orange (#FF6444), purple (#AF52DE)
- **Clean minimal UI**: rounded corners, subtle shadows, no glassmorphism
- **Dark mode friendly**: game has dark backgrounds that make colors pop
- **Particle effects**: subtle sparkles/particles when blocks clear (use CSS animations)
- **Weighted fonts**: bold numbers on blocks, clean sans-serif for UI
- **Relaxed, satisfying feel**: smooth transitions, spring animations

### Design Rules
1. **Color = Game Colors**: Primary palette comes from the 6 block colors. Use them for headings, buttons, accents
2. **Background**: Light mode = white/gray-50, Dark mode = gray-900 (like game's dark bg)
3. **Cards**: Rounded-2xl, subtle shadow, 1px border (gray-100/800)
4. **Typography**: Inter or Outfit font family. Block-level numbers use font-bold/black
5. **Animations**: Spring-based transitions on hover, entrance animations on scroll
6. **No AI-slop**: No rainbow gradients, no glassmorphism, no unnecessary SVG illustrations
7. **Level frames**: Display in a device mockup frame (rounded corners, subtle shadow) to show them as game screenshots
8. **Hero section**: Show the 6 colored blocks arranged playfully, animated entrance
9. **YouTube embeds**: Dark-themed player controls, rounded corners
10. **Trust badges**: App Store rating 4.74 ⭐ (41K reviews), no ads badge, 1M+ downloads badge
