// Node 20+: verify ownership, collect same-host public URLs, then submit once.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'site.json'), 'utf8'));
const args = process.argv.slice(2);
const commit = args.includes('--submit');
const explicit = args.filter(x => !x.startsWith('--'));
const report = { domain: cfg.domain, host: cfg.host, checkedAt: new Date().toISOString(), submitted: false, batches: [], filtered: [], sitemaps: [] };
const decode = x => x.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
async function read(url, max = 12_000_000) {
  const r = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'Site-owner IndexNow maintenance' } });
  let text = '', size = 0;
  const decoder = new TextDecoder();
  for await (const chunk of r.body) {
    size += chunk.length;
    if (size > max) throw new Error(`Response too large: ${url}`);
    text += decoder.decode(chunk, { stream: true });
  }
  text += decoder.decode();
  return { status: r.status, url: r.url, type: r.headers.get('content-type') || '', robots: r.headers.get('x-robots-tag') || '', text };
}
const privatePath = /\/(?:api|admin|dashboard|account|settings|billing|checkout|auth|login|logout|sign-in|sign-up|register|reset-password)(?:\/|$)/i;
function valid(raw) {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== 'https:' || u.host !== cfg.host || u.username || u.password || privatePath.test(u.pathname)) throw new Error('non-public or wrong host');
    u.hash = '';
    return u.href;
  } catch (e) { report.filtered.push({ url: raw, reason: e.message }); return null; }
}
async function sitemap(url, seen = new Set()) {
  if (seen.has(url)) return [];
  if (seen.size >= 30) throw new Error('Too many sitemap files');
  seen.add(url);
  const r = await read(url);
  if (r.status !== 200 || new URL(r.url).host !== cfg.host || !/\b(xml|text\/plain)\b/i.test(r.type) || !/<(?:urlset|sitemapindex)\b/.test(r.text) || /<html\b/i.test(r.text)) throw new Error(`Invalid sitemap: ${url} (${r.status}, ${r.type})`);
  const locs = [...r.text.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/g)].map(x => decode(x[1].trim()));
  report.sitemaps.push({ url: r.url, entries: locs.length, index: /<sitemapindex\b/.test(r.text) });
  if (/<sitemapindex\b/.test(r.text)) {
    const all = [];
    for (const child of locs) {
      if (new URL(child).host !== cfg.host || !child.startsWith('https://')) throw new Error('Cross-host sitemap refused');
      all.push(...await sitemap(child, seen));
    }
    return all;
  }
  return locs;
}
try {
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(cfg.key) || new URL(cfg.keyLocation).host !== cfg.host) throw new Error('Invalid key configuration');
  const key = await read(cfg.keyLocation, 1024);
  report.keyVerification = { url: key.url, status: key.status, type: key.type, exact: key.text.trim() === cfg.key };
  if (key.status !== 200 || new URL(key.url).host !== cfg.host || !/^text\/plain\b/.test(key.type) || !report.keyVerification.exact) throw new Error('Ownership file failed verification');
  let raw = explicit.length ? explicit : cfg.sitemap ? await sitemap(cfg.sitemap) : cfg.seedUrls;
  const robots = await read(`https://${cfg.host}/robots.txt`, 200000);
  report.robots = { status: robots.status, type: robots.type };
  const rules = [];
  if (robots.status === 200 && /^text\/plain\b/.test(robots.type)) {
    let agents = [], hasRules = false;
    for (const line of robots.text.split(/\r?\n/)) {
      const m = line.replace(/#.*/, '').trim().match(/^(user-agent|allow|disallow)\s*:\s*(.*)$/i);
      if (!m) continue;
      const name = m[1].toLowerCase(), value = m[2].trim();
      if (name === 'user-agent') { if (hasRules) { agents = []; hasRules = false; } agents.push(value.toLowerCase()); }
      else { hasRules = true; if (agents.includes('*') && value) rules.push({ allow: name === 'allow', value, re: new RegExp('^' + value.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$')) }); }
    }
  }
  const urls = [...new Set(raw.map(valid).filter(Boolean))].filter(url => {
    const u = new URL(url), hit = rules.filter(r => r.re.test(u.pathname + u.search)).sort((a,b) => b.value.length - a.value.length || Number(b.allow) - Number(a.allow))[0];
    if (hit && !hit.allow) { report.filtered.push({ url, reason: 'robots.txt disallow' }); return false; }
    return true;
  });
  if (!urls.length) throw new Error('No public URLs');
  // A sample from each portion also detects redirects, HTML soft 404s and noindex.
  const samples = [...new Set([urls[0], urls[Math.floor(urls.length / 2)], urls.at(-1)])];
  report.samples = [];
  for (const url of samples) {
    const page = await read(url);
    const noindex = /\bnoindex\b/i.test(page.robots) || /<meta\b[^>]*(?:name=["'](?:robots|bingbot)["'][^>]*content=["'][^"']*noindex|content=["'][^"']*noindex[^>]*name=["'](?:robots|bingbot)["'])/i.test(page.text);
    report.samples.push({ url, finalUrl: page.url, status: page.status, noindex });
    if (page.status !== 200 || new URL(page.url).host !== cfg.host || noindex || /<title>\s*404|<title>[^<]*not found/i.test(page.text)) throw new Error(`Non-indexable sample: ${url}`);
  }
  report.urlCount = urls.length;
  fs.writeFileSync(path.join(dir, 'last-urls.json'), JSON.stringify(urls, null, 2));
  if (commit) {
    for (let i = 0; i < urls.length; i += 10000) {
      const chunk = urls.slice(i, i + 10000);
      const r = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', signal: AbortSignal.timeout(45000), headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ host: cfg.host, key: cfg.key, keyLocation: cfg.keyLocation, urlList: chunk }) });
      const body = (await r.text()).slice(0,2000);
      report.batches.push({ at: new Date().toISOString(), endpoint: 'https://api.indexnow.org/indexnow', urlCount: chunk.length, status: r.status, body, received: r.status === 200, pendingKey: r.status === 202 });
      if (![200,202].includes(r.status)) throw new Error(`IndexNow rejected batch: HTTP ${r.status}`);
    }
    report.submitted = true;
  }
} catch (e) { report.error = e.message; process.exitCode = 1; }
fs.writeFileSync(path.join(dir, commit ? 'last-submission.json' : 'last-check.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
