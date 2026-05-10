// Generate messages/{lang}/common.json + messages/{lang}/levels/{n}.json
// Reads existing dictionaries/{lang}/*.ts and level/level-guides.ts.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const LOCALES = [
  "en",
  "zh",
  "tw",
  "ja",
  "ko",
  "es",
  "ar",
  "de",
  "fr",
  "ru",
  "tr",
  "fa",
  "it",
  "lo",
];

// Files to merge into common.json (in order of definition)
const FILES = [
  "header",
  "hero",
  "footer",
  "faq",
  "features",
  "how-to-use",
  "home",
  "app-download",
  "download",
  "level",
  "about",
  "company-info",
];

// Map: source filename -> target key path
const KEY_MAP = {
  header: ["header"],
  hero: ["hero"],
  footer: ["footer"],
  faq: ["faq"],
  features: ["features"],
  "how-to-use": ["howToUse"],
  home: ["home"],
  "app-download": ["appDownload"],
  download: ["download"],
  level: ["level"],
  about: ["about"], // also exports privacy
  "company-info": ["companyInfo"],
};

// Evaluate a TS dict file by stripping TS-specific syntax
function loadDict(file) {
  if (!fs.existsSync(file)) return {};
  let src = fs.readFileSync(file, "utf8");
  // Remove `as const` annotations (handle multiple variants)
  src = src.replace(/\)\s+as\s+const/g, ")");
  src = src.replace(/\}\s+as\s+const/g, "}");
  src = src.replace(/\]\s+as\s+const/g, "]");
  src = src.replace(/"\s+as\s+const/g, '"');
  // Remove TypeScript-style imports/exports
  src = src.replace(/^export\s+default\s+/gm, "module.exports.default = ");
  src = src.replace(/^export\s+const\s+(\w+)\s*=/gm, "module.exports.$1 =");
  // Run in a sandbox
  const sandbox = { module: { exports: {} }, exports: {} };
  sandbox.module.exports = sandbox.exports;
  vm.createContext(sandbox);
  try {
    vm.runInContext(src, sandbox, { filename: file });
  } catch (e) {
    console.error(`Failed to evaluate ${file}:`, e.message);
    return {};
  }
  return sandbox.module.exports;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function buildCommon(lang) {
  const dictDir = path.join(ROOT, "dictionaries", lang);
  const fallbackDir = path.join(ROOT, "dictionaries", "en");
  const common = {};

  for (const name of FILES) {
    const tryPath = path.join(dictDir, `${name}.ts`);
    const file = fs.existsSync(tryPath)
      ? tryPath
      : path.join(fallbackDir, `${name}.ts`);
    const exported = loadDict(file);

    if (name === "about") {
      // about.ts exports both `about` and `privacy`
      if (exported.about) common.about = exported.about;
      if (exported.privacy) common.privacy = exported.privacy;
    } else {
      const targetKey = KEY_MAP[name][0];
      // Find the exported key — it can be camelCase variant e.g. howToUse
      const possible = Object.keys(exported).filter(
        (k) => k !== "default"
      );
      // Pick the one matching the target or the first one
      const exportKey =
        possible.find((k) => k === targetKey) || possible[0];
      if (exportKey && exported[exportKey] !== undefined) {
        common[targetKey] = exported[exportKey];
      }
    }
  }

  return common;
}

// --- Level guides extraction (from level/level-guides.ts) ---
function loadLevelGuides() {
  const guidesPath = path.join(ROOT, "level", "level-guides.ts");
  let src = fs.readFileSync(guidesPath, "utf8");
  // Strip imports and TS-specific syntax
  src = src.replace(/^import[\s\S]*?;$/gm, "");
  src = src.replace(/^export\s+type[\s\S]*?;$/gm, "");
  src = src.replace(/^export\s+interface\s+\w+\s*\{[\s\S]*?\n\}/gm, "");
  // Remove generic / type annotations on declarations
  src = src.replace(
    /const\s+(DIFFICULTY_DESCRIPTIONS|TIPS_BANK|FAQ_BANK)\s*:\s*[^=]+=/g,
    "const $1 ="
  );
  src = src.replace(/^export\s+/gm, "");
  // Keep only the bank declarations — drop function definitions
  // Just expose the three banks
  const tail = `
module.exports.DIFFICULTY_DESCRIPTIONS = DIFFICULTY_DESCRIPTIONS;
module.exports.TIPS_BANK = TIPS_BANK;
module.exports.FAQ_BANK = FAQ_BANK;
`;
  // Strip out the function bodies that follow the banks (they reference levelData)
  // Drop everything from `function pickLocale` onward
  const cutIdx = src.indexOf("function pickLocale");
  if (cutIdx >= 0) src = src.slice(0, cutIdx);

  const sandbox = { module: { exports: {} }, exports: {} };
  sandbox.module.exports = sandbox.exports;
  vm.createContext(sandbox);
  vm.runInContext(src + tail, sandbox, { filename: guidesPath });
  return sandbox.module.exports;
}

// Map our locale codes to keys in the level-guides banks
// banks have: en, cn (Chinese), ja
function pickGuideLocale(lang, banks) {
  if (banks[lang]) return lang;
  if (lang === "zh" && banks.cn) return "cn";
  if (lang === "tw" && banks.cn) return "cn";
  return "en";
}

function buildLevelFiles(lang) {
  const banks = loadLevelGuides();
  const levelData = JSON.parse(
    fs.readFileSync(path.join(ROOT, "level", "level.json"), "utf8")
  );
  const key = pickGuideLocale(lang, banks.DIFFICULTY_DESCRIPTIONS);
  const descriptions = banks.DIFFICULTY_DESCRIPTIONS[key];
  const tipsBank = banks.TIPS_BANK[key];
  const faqBank = banks.FAQ_BANK[key];

  const outDir = path.join(ROOT, "messages", lang, "levels");
  ensureDir(outDir);

  for (const lvl of levelData) {
    const difficulty = lvl.difficulty || "easy";
    const out = {
      description: descriptions[difficulty] || descriptions.easy,
      tips: tipsBank[difficulty] || tipsBank.easy,
      faq: faqBank,
    };
    fs.writeFileSync(
      path.join(outDir, `${lvl.Level}.json`),
      JSON.stringify(out, null, 2),
      "utf8"
    );
  }
}

function main() {
  for (const lang of LOCALES) {
    const common = buildCommon(lang);
    const outDir = path.join(ROOT, "messages", lang);
    ensureDir(outDir);
    fs.writeFileSync(
      path.join(outDir, "common.json"),
      JSON.stringify(common, null, 2),
      "utf8"
    );
    buildLevelFiles(lang);
    console.log(`✓ ${lang}: common.json + ${200} level files`);
  }
}

main();
