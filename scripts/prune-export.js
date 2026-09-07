/**
 * Remove Next.js RSC payload files (index.txt) from static export.
 * Cloudflare Pages limits deployments to 20,000 files; ~13k index.txt
 * files are not needed for static HTML hosting and push us over the cap.
 */
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "dist-export");
const MAX_FILES = 20_000;

function countFiles(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) count += countFiles(full);
    else count += 1;
  }
  return count;
}

function removeIndexTxt(dir) {
  let removed = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      removed += removeIndexTxt(full);
    } else if (entry.name === "index.txt") {
      fs.unlinkSync(full);
      removed += 1;
    }
  }
  return removed;
}

if (!fs.existsSync(OUT_DIR)) {
  console.error(`Output directory not found: ${OUT_DIR}`);
  process.exit(1);
}

const before = countFiles(OUT_DIR);
const removed = removeIndexTxt(OUT_DIR);
const after = countFiles(OUT_DIR);

console.log(`prune-export: removed ${removed} index.txt files (${before} → ${after})`);

if (after > MAX_FILES) {
  console.error(
    `ERROR: ${after} files still exceeds Cloudflare Pages limit of ${MAX_FILES}.`,
  );
  process.exit(1);
}
