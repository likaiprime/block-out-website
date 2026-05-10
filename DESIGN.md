# Block Out! — Design System (DESIGN.md)

> Source of truth for visual language, tokens, and component patterns on **blockout.cc**.
> Format follows the [refero.design](https://styles.refero.design) DESIGN.md convention so any agent
> (Cursor / Claude Code / Windsurf) can read this file and produce on-brand UI.

---

## 1. Brand essence

**Block Out!** is a tactile, color-sort puzzle by Grand Games (iOS + Android, 4.74★, 41K+ ratings).

| Trait        | Translation in UI                                                 |
| ------------ | ----------------------------------------------------------------- |
| Saturated    | Six pure block hues are the *only* legitimate accent colors.      |
| Tactile      | Tiles have inner highlight + soft drop shadow. They lift on hover. |
| Satisfying   | Spring easing `cubic-bezier(0.34, 1.56, 0.64, 1)`, never linear.  |
| Calm         | Whites/near-blacks for surfaces. Color is for *signal*, not chrome. |
| Playful      | Asymmetric layouts, slight rotation on tiles, oversized numerals. |

**Anti-patterns (do not introduce):**

- Glassmorphism on body content (only thin, deliberate use on overlays — e.g. level thumbnail caption pills).
- Rainbow / multi-stop gradients used as fills.
- Decorative SVG illustrations of abstract shapes.
- Drop-shadow stacks > 2 layers.
- Linear `transition: all` — always specify properties + spring/standard easing.

---

## 2. Color

### 2.1 Block palette (BRAND — the only saturated colors allowed)

These six hues mirror the in-game tiles. **Use them for accents, badges, eyebrows, difficulty signals, and `block-tile` surfaces.** Never for body copy or large surface fills.

| Token                | HSL                  | Approx hex | Role                                   |
| -------------------- | -------------------- | ---------- | -------------------------------------- |
| `--color-block-red`    | `4 100% 59%`       | `#FF3B30`  | Expert difficulty, destructive states  |
| `--color-block-orange` | `11 100% 63%`      | `#FF6444`  | Hard difficulty, "Features" eyebrow    |
| `--color-block-yellow` | `35 100% 50%`      | `#FF9500`  | Medium difficulty, ratings/stars       |
| `--color-block-green`  | `147 57% 49%`      | `#34C759`  | Easy difficulty, success/no-ads        |
| `--color-block-blue`   | `211 100% 50%`      | `#007AFF`  | **Primary** (CTAs, links, focus ring)  |
| `--color-block-purple` | `277 67% 60%`       | `#AF52DE`  | Super-hard difficulty, "Highlights"    |

Tailwind utility shape: `bg-block-blue`, `text-block-orange`, `border-block-purple/25`, `bg-block-yellow/10`.

### 2.2 Semantic surfaces (theme-aware)

Defined as HSL strings on `:root` / `.dark` and surfaced via `@theme` as `--color-*`.

| Token              | Light            | Dark              | Use                                   |
| ------------------ | ---------------- | ----------------- | ------------------------------------- |
| `background`       | `0 0% 100%`      | `222 28% 6%`      | Page background                       |
| `foreground`       | `222 28% 10%`    | `0 0% 98%`        | Default text                          |
| `card`             | `0 0% 100%`      | `222 24% 10%`     | Cards, popovers                       |
| `muted`            | `220 14% 96%`    | `222 18% 13%`     | Subdued surfaces (search, filters)    |
| `muted-foreground` | `220 9% 46%`     | `220 9% 64%`      | Helper / metadata text                |
| `secondary`        | `220 14% 96%`    | `222 18% 14%`     | Soft fills (`how-to-play` band)       |
| `border`           | `220 13% 91%`    | `222 16% 18%`     | 1px hairlines                         |
| `primary`          | `211 100% 50%`   | `211 100% 60%`    | Same hue as `--color-block-blue`      |
| `accent`           | `11 100% 63%`    | `11 100% 65%`     | Same hue as `--color-block-orange`    |
| `destructive`      | `4 100% 59%`     | `4 100% 62%`      | Errors, destructive intent            |
| `ring`             | `211 100% 50%`   | `211 100% 60%`    | `:focus-visible` outline              |

**Rule:** Never reach into `--color-block-*` for default text or surfaces — those tokens are always *signal*. Use semantic tokens (`text-foreground`, `bg-card`, `border-border`) for chrome.

### 2.3 Difficulty mapping

The five difficulty levels map 1:1 to the block palette:

| Difficulty   | Accent       |
| ------------ | ------------ |
| `easy`       | block-green  |
| `medium`     | block-yellow |
| `hard`       | block-orange |
| `expert`     | block-red    |
| `super-hard` | block-purple |

> Centralized in `lib/design-tokens/difficulty.ts`. **Do not redeclare these maps in components** — import from the token module.

---

## 3. Typography

| Token            | Value                                                       |
| ---------------- | ----------------------------------------------------------- |
| Font family      | `Inter` (variable `--font-sans`) → fallback system stack    |
| Body             | `text-base sm:text-lg leading-relaxed text-muted-foreground` |
| H1 (page hero)   | `text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]` |
| H2 (section)     | `text-3xl sm:text-4xl font-black tracking-tight`            |
| H3 (card title)  | `text-lg font-bold tracking-tight`                          |
| Eyebrow chip     | `text-xs font-semibold` (inside `<Badge>`)                  |
| Stat numeral     | `text-2xl sm:text-3xl font-black tabular-nums`              |
| Big tile numeral | `text-3xl sm:text-5xl font-black tabular-nums`              |
| Microcopy        | `text-[11px] uppercase tracking-wider font-semibold`        |

**Rules:**

- Body copy ≥ `text-base`. Microcopy never below `11px`.
- Numbers always use `tabular-nums` (never let level/stat digits jitter on hover).
- Headings use `font-black` (900). Sub-headings use `font-bold` (700). Never `font-extrabold` (800) — too in-between.
- `font-feature-settings: "ss01", "cv11"` is set on `body` and stays on.

---

## 4. Spacing, radius, container

### Spacing scale
Tailwind defaults (4px base) — no overrides. Section vertical rhythm:

- Hero: `pt-24 pb-16 md:pt-28 md:pb-24`
- Section: `py-20 sm:py-24`
- Card padding: `p-6` (large) or `p-5` (compact)
- Eyebrow → H2 gap: `mt-4`
- H2 → subtitle gap: `mt-3`
- Subtitle → grid gap: `mt-12` (sections), `mt-10` (highlights)

### Container
`@utility container { max-width: 1200px; padding-inline: 1.25rem md:2rem; margin-inline: auto; }`

### Radius

| Token          | Value                       | Use                                  |
| -------------- | --------------------------- | ------------------------------------ |
| `--radius`     | `0.625rem` (10px)           | Base                                 |
| `rounded-lg`   | `var(--radius)`             | Inputs, small surfaces               |
| `rounded-xl`   | `var(--radius) + 2`         | Buttons, search, level pills (sm)    |
| `rounded-2xl`  | `var(--radius) + 6`         | **Cards**, level tiles, trust badges |
| `rounded-3xl`  | tw default                  | Hero backplate inner                 |
| `rounded-full` | —                           | Eyebrow chips, level group tabs      |
| `rounded-[2rem]` | `2rem` (32px)             | Hero outer backplate only            |

**Rule:** Cards are always `rounded-2xl`. Never mix radii inside the same card.

---

## 5. Elevation

Two-layer system — color shadows for branded surfaces, neutral shadows for chrome.

| Token / pattern                                     | Use                                  |
| --------------------------------------------------- | ------------------------------------ |
| `shadow-sm shadow-foreground/5`                     | Resting card, sticky tab bar         |
| `shadow-lg shadow-foreground/5` (hover)             | Card hover                           |
| `shadow-lg shadow-foreground/15`                    | Level tile resting                   |
| `shadow-2xl shadow-foreground/35` (hover)           | Level tile hover                     |
| `shadow-md shadow-primary/40` (hover) on Button     | Default button hover lift            |
| `shadow-[0_30px_80px_-30px_hsl(var(--foreground)/0.25)]` | Hero backplate                  |
| `glow-primary` (CSS class)                          | Soft blue glow under primary CTA hover |

**Block-tile shadow** (special — `.block-tile` class):
```
inset 0  1px 0 hsl(0 0% 100% / 0.35),    /* highlight    */
inset 0 -2px 0 hsl(0 0% 0% / 0.12),      /* base bevel   */
0     8px 20px -8px hsl(var(--shadow-color) / 0.25)
```
Keep this exact stack — it's what gives tiles their tactile feel.

---

## 6. Motion

| Curve                                  | Token                  | Use                                  |
| -------------------------------------- | ---------------------- | ------------------------------------ |
| `cubic-bezier(0.22, 1, 0.36, 1)`       | `--ease-standard`      | Default — fade, rise, hover          |
| `cubic-bezier(0.34, 1.56, 0.64, 1)`    | `--ease-spring`        | `pop`, springy entrances             |
| `ease-out` (browser default)           | —                      | Color/ring transitions only          |

| Animation         | Duration | Use                                  |
| ----------------- | -------- | ------------------------------------ |
| `accordion-down/up` | 200ms  | Radix accordion                      |
| `fade-in`         | 500ms    | Tab panels, scroll-in chrome         |
| `rise`            | 600ms    | Highlight tiles entrance             |
| `pop`             | 450ms    | Block tower tiles, badges            |
| `float`           | 6s loop  | Floating accent tiles                |
| `subtle-pulse`    | 2.4s loop | Live signals (rare)                 |
| `spring-hover`    | 350ms    | Card / chip / tile hover lift        |

**Reduced motion:** all of the above are disabled inside `@media (prefers-reduced-motion: reduce)`. Honor this — never re-enable conditionally.

---

## 7. Components

> All UI primitives live in `components/ui/`. Use them — do not re-roll classes per section.

### 7.1 `<Button>` (`components/ui/button.tsx`)

Already implemented with `cva`. Variants:

| Variant       | Visual                                   |
| ------------- | ---------------------------------------- |
| `default`     | Primary blue, glow on hover              |
| `outline`     | 1px border, hover: blue text + lift      |
| `secondary`   | Soft gray fill                           |
| `ghost`       | No fill, hover: secondary fill           |
| `destructive` | Red                                      |
| `link`        | Underline-on-hover                       |

Sizes: `sm | default | lg | icon`. **All use `rounded-xl`.**

`asChild` via Radix `Slot` — required for `<Link>` wrapping.

### 7.2 `<Badge>` (eyebrow chip)

Round-pill chip used as section eyebrow. Eight `accent` variants — one per block color + `neutral`. Composition:

```tsx
<Badge accent="blue" icon={<Sparkles />}>How it works</Badge>
```

Renders: `inline-flex items-center gap-1.5 rounded-full border border-block-{c}/25 bg-block-{c}/10 px-3 py-1 text-xs font-semibold text-block-{c}`.

### 7.3 `<Section>`

Wraps a section with a max-width container and (optionally) eyebrow + heading + subtitle slots.

Variants:
- `tone`: `default` | `muted` (muted = `bg-secondary/40 border-b`)
- `density`: `default` (`py-20 sm:py-24`) | `hero` (`pt-24 pb-16 md:pt-28 md:pb-24`)

```tsx
<Section
  id="features"
  eyebrow={<Badge accent="blue" icon={<Sparkles />}>Features</Badge>}
  title={t("title")}
  subtitle={t("subtitle")}
>
  ...
</Section>
```

### 7.4 `<Card>`

`rounded-2xl border bg-card p-6`. Variants:

- `accent`: `none | red | orange | yellow | green | blue | purple` — adds 1px top accent bar
- `interactive`: `false | true` — adds `spring-hover` + hover shadow + border lift

### 7.5 `<AccentTile>` (the `.block-tile` surface)

Saturated colored square with inner highlight. Used in feature cards, hero composition, difficulty legend.

```tsx
<AccentTile color="blue" size="md" rotate>
  <Layers className="h-5 w-5 text-white" strokeWidth={2.5} />
</AccentTile>
```

Sizes: `sm` (h-9 w-9) | `md` (h-12 w-12) | `lg` (variable, set via className).

---

## 8. Patterns

### 8.1 Section header
```
[ <Badge> ]
[ H2 ]                       gap mt-4
[ subtitle muted-foreground ] gap mt-3
                              gap mt-10..12 to body
```

### 8.2 Accent-bar card
Card with a 1px top bar in its accent color, plus a faded oversized numeral in the corner. See `Features` and `HowToPlay`.

### 8.3 Block-color signature line
Six 8-wide pills bottom of `app-download` section. Visual brand sign-off.

### 8.4 Hero backdrop
Three blurred radial circles (blue / orange / purple at 10% alpha) plus a 24px dot grid at 4% foreground. **Never substitute with a gradient.**

### 8.5 Level tile
Square `aspect-square rounded-2xl`. Either:
- AVIF thumbnail + dark gradient overlay + level number pill bottom-center; or
- Solid difficulty-color tile + centered numeral.

Hover: scale 1.05, image scales 1.10, shadow doubles.

---

## 9. Accessibility

- Focus ring: `2px solid hsl(var(--ring))` with `2px` offset on every interactive element. Honored by `:focus-visible` global rule.
- Touch targets: minimum 44 × 44 (level tiles include `min-h-[44px]` hard floor).
- `aria-label` required on icon-only buttons and on level-tile links.
- `tabular-nums` on every numeric display (level numbers, ratings, stats).
- Reduced motion: disables `block-tile`, `block-grid`, `spring-hover` animations.
- Color is **never** the sole signal — difficulty pills always pair color with text label.

---

## 10. Layout breakpoints

Tailwind defaults:

| Bp     | Min   | Use                                      |
| ------ | ----- | ---------------------------------------- |
| `sm`   | 640   | Stop stacking minor stats, wider type    |
| `md`   | 768   | Container padding bumps to `2rem`        |
| `lg`   | 1024  | Hero shifts to two-column                |
| `xl`   | 1280  | Container caps at `1200px`               |

Mobile is the design target: every page is laid out *first* for `sm` and below, then enhanced.

---

## 11. Token files

| File                              | Exports                                          |
| --------------------------------- | ------------------------------------------------ |
| `app/globals.css`                 | `@theme` Tailwind v4 tokens (canonical)          |
| `lib/design-tokens/index.ts`      | Re-exports `accents`, `difficulty`, types        |
| `lib/design-tokens/accents.ts`    | `ACCENT_NAMES`, `ACCENT_CLASSES`, `AccentName`   |
| `lib/design-tokens/difficulty.ts` | `DIFFICULTY_TO_ACCENT`, `DIFFICULTIES`           |

**Workflow when adding a new accent surface:**
1. Pick an existing accent from `ACCENT_NAMES` (do not invent a new color).
2. Reference `ACCENT_CLASSES[name]` for the className strings — never type out `bg-block-blue/10` ad-hoc.

---

## 12. Quick reference (cheat sheet)

```
H2 section heading       text-3xl sm:text-4xl font-black tracking-tight
Eyebrow                  <Badge accent="blue" icon={<Sparkles />}>…</Badge>
Card                     <Card accent="blue" interactive>…</Card>
Block tile               <AccentTile color="blue" size="md">…</AccentTile>
Spring hover             className="spring-hover"
Primary CTA              <Button size="lg" className="glow-primary gap-2">…</Button>
Link with arrow          group icon ArrowUpRight w/ translate-x on hover
Difficulty colors        DIFFICULTY_TO_ACCENT[difficulty] → AccentName
Container width          max-w-6xl on hero, default container for the rest
```
