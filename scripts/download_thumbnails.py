#!/usr/bin/env python3
"""
Download YouTube thumbnails → convert to AVIF → upload to R2.
All thumbnails served from cdn.blockout.cc/thumbnails/{youtubeid}.avif
"""
import json, os, sys, time
import urllib.request, urllib.error
import concurrent.futures
from io import BytesIO
from PIL import Image

# ── Config ──────────────────────────────────────────────────────────
ACCOUNT_ID = "6d858ec997f8d5a9083da67f763d1cd9"
TOKEN = "cfut_gxAVs7VYDA2nNifdX22moHWigaIXPPwNKCPnjHBXa0dd16af"
BUCKET = "blockout-thumbnails"
R2_API = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects"
CDN_BASE = "https://cdn.blockout.cc/thumbnails"
# ────────────────────────────────────────────────────────────────────

LEVEL_JSON = os.path.join(os.path.dirname(__file__), "..", "level", "level.json")

def download_jpg(youtubeid: str) -> bytes | None:
    url = f"https://i.ytimg.com/vi/{youtubeid}/hqdefault.jpg"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=30)
        data = resp.read()
        return data if len(data) > 1000 else None
    except Exception as e:
        print(f"  ⚠ Download failed: {e}")
        return None

def convert_to_avif(jpeg_data: bytes, quality: int = 65) -> bytes | None:
    """Convert JPEG bytes to AVIF bytes."""
    try:
        img = Image.open(BytesIO(jpeg_data)).convert("RGB")
        buf = BytesIO()
        img.save(buf, format="AVIF", quality=quality)
        return buf.getvalue()
    except Exception as e:
        print(f"  ⚠ AVIF conversion failed: {e}")
        return None

def upload_to_r2(key: str, data: bytes, content_type: str) -> bool:
    url = f"{R2_API}/{key}"
    req = urllib.request.Request(url, data=data, method="PUT")
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Content-Type", content_type)
    try:
        resp = urllib.request.urlopen(req, timeout=60)
        return resp.status == 200
    except urllib.error.HTTPError as e:
        print(f"  ⚠ Upload failed (HTTP {e.code})")
        return False
    except Exception as e:
        print(f"  ⚠ Upload failed: {e}")
        return False

def delete_from_r2(key: str):
    """Delete old JPEG if exists."""
    url = f"{R2_API}/{key}"
    req = urllib.request.Request(url, method="DELETE")
    req.add_header("Authorization", f"Bearer {TOKEN}")
    try:
        urllib.request.urlopen(req, timeout=30)
    except:
        pass  # ignore if not found

def process_one(youtubeid: str, index: int, total: int) -> tuple[str, bool]:
    print(f"[{index}/{total}] {youtubeid}...", end=" ", flush=True)
    
    # 1. Download JPEG from YouTube
    jpeg = download_jpg(youtubeid)
    if not jpeg:
        print("❌ download failed")
        return (youtubeid, False)
    
    # 2. Convert to AVIF
    avif = convert_to_avif(jpeg)
    if not avif:
        print("❌ AVIF conversion failed")
        return (youtubeid, False)
    
    jpg_kb = len(jpeg) // 1024
    avif_kb = len(avif) // 1024
    
    # 3. Upload AVIF
    ok = upload_to_r2(f"thumbnails/{youtubeid}.avif", avif, "image/avif")
    if not ok:
        print("❌ upload failed")
        return (youtubeid, False)
    
    # 4. Delete old JPEG
    delete_from_r2(f"thumbnails/{youtubeid}.jpg")
    
    savings = 100 * (1 - avif_kb / jpg_kb) if jpg_kb > 0 else 0
    print(f"✅ ({jpg_kb}KB→{avif_kb}KB, -{savings:.0f}%)")
    return (youtubeid, True)

def verify_one(youtubeid: str, index: int, total: int) -> tuple[str, bool]:
    """Check if thumbnail is accessible via CDN."""
    url = f"{CDN_BASE}/{youtubeid}.avif"
    try:
        resp = urllib.request.urlopen(urllib.request.Request(url), timeout=10)
        ok = resp.status == 200
        size = len(resp.read()) // 1024
        print(f"[{index}/{total}] {youtubeid} {'✅' if ok else '❌'} ({size}KB)")
        return (youtubeid, ok)
    except Exception as e:
        print(f"[{index}/{total}] {youtubeid} ❌ {e}")
        return (youtubeid, False)

def main():
    with open(LEVEL_JSON, encoding="utf-8") as f:
        levels = json.load(f)
    
    youtubeids = list(dict.fromkeys(
        l["youtubeid"] for l in levels 
        if l.get("youtubeid") and l.get("has_video")
    ))
    
    print(f"Found {len(youtubeids)} unique YouTube IDs")
    
    # ═══ STEP 1: Upload AVIF ═══
    print(f"\n{'='*60}")
    print("STEP 1: Download → Convert → Upload AVIF")
    print(f"{'='*60}")
    
    success = fail = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        futures = [pool.submit(process_one, yt, i, len(youtubeids))
                   for i, yt in enumerate(youtubeids, 1)]
        for f in concurrent.futures.as_completed(futures):
            yt, ok = f.result()
            if ok: success += 1
            else: fail += 1
    
    print(f"\nUploaded: {success}  Failed: {fail}")
    
    # ═══ STEP 2: Verify ═══
    if success > 0:
        print(f"\n{'='*60}")
        print("STEP 2: Verify CDN accessibility")
        print(f"{'='*60}")
        
        verified = failed_v = 0
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as pool:
            futures = [pool.submit(verify_one, yt, i, success)
                       for i, yt in enumerate(youtubeids, 1)]
            for f in concurrent.futures.as_completed(futures):
                yt, ok = f.result()
                if ok: verified += 1
                else: failed_v += 1
        
        print(f"\nVerified: {verified}  Failed: {failed_v}")
    
    return 0 if fail == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
