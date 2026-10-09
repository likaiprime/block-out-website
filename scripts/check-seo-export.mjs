import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('dist-export');
const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://blockout.cc';
const index = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
assert.match(index, /<sitemapindex\b/);
const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x => new URL(x[1]));
assert(maps.length > 0, 'Sitemap index must list files');
let urls = 0;
for (const map of maps) {
  assert.equal(map.origin, new URL(origin).origin);
  assert.match(map.pathname, /^\/sitemap-\d+\.xml$/);
  const body = fs.readFileSync(path.join(root, map.pathname.slice(1)), 'utf8');
  assert.match(body, /<urlset\b/);
  const count = [...body.matchAll(/<loc>/g)].length;
  assert(count > 0, 'Empty sitemap shard');
  urls += count;
}
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
const key = fs.readFileSync('public/indexnow.txt', 'utf8').trim();
assert.match(key, /^[a-zA-Z0-9-]{8,128}$/);
assert.equal(fs.readFileSync(path.join(root, 'indexnow.txt'), 'utf8').trim(), key);
assert.equal(fs.readFileSync(path.join(root, `${key}.txt`), 'utf8').trim(), key);
console.log(`SEO export verified: ${maps.length} shards, ${urls} public URLs, robots and IndexNow key files`);
