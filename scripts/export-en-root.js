/**
 * Copy English static export from /en/* to site root and remove /en.
 * Static export always emits [lang] segments; with localePrefix "as-needed"
 * English should be served at /level/N/ not /en/level/N/.
 */
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "dist-export");
const EN_DIR = path.join(OUT_DIR, "en");

function copyRecursive(src, dest) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(EN_DIR)) {
  console.error(`export-en-root: missing ${EN_DIR}`);
  process.exit(1);
}

copyRecursive(EN_DIR, OUT_DIR);

// Ensure English homepage wins over any stale root index.html
const enHome = path.join(EN_DIR, "index.html");
const rootHome = path.join(OUT_DIR, "index.html");
if (fs.existsSync(enHome)) {
  fs.copyFileSync(enHome, rootHome);
}

fs.rmSync(EN_DIR, { recursive: true, force: true });

if (!fs.existsSync(path.join(OUT_DIR, "level", "1", "index.html"))) {
  console.error("export-en-root: /level/1 not found after export");
  process.exit(1);
}

console.log("export-en-root: English pages now at / (removed /en directory)");
