"""Parse yt-dlp playlist output and build level.json for the Block Out! site.

The playlist is at:
  https://www.youtube.com/playlist?list=PLJ7aTNdGDxmvbd4cVbTiRtUyHB530LtSe

Each line in scripts/playlist.txt is `youtubeid|title|duration`.

Title formats we recognise:
  Block Out! - Color Sort Puzzle Level 11-12-...-20 Solution Walkthrough  (batch)
  Block Out! Level 51-52-...-58 Solution Walkthrough                     (batch)
  Block Out! Level 60-61-62-63 Solution Walkthrough                      (batch)
  Block Out! Level 100 Solution Walkthrough                              (single)
  Block Out! Hard Level 64 Solution Walkthrough                          (single, hard)
  Block Out! Super Hard Level 19 Solution Walkthrough                    (super-hard variant)

Output: level/level.json with one entry per level number 1..MAX_LEVEL.
For each level we prefer single-level videos over batch videos, and we keep
the super-hard variant in a separate `super_hard_youtubeid` field when present.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLAYLIST_FILE = ROOT / "scripts" / "playlist.txt"
OUTPUT_FILE = ROOT / "level" / "level.json"

DEFAULT_MAX_LEVEL = 946  # playlist titles go up to Level 946


def parse_levels_from_title(title: str) -> tuple[str, list[int]]:
    """Return (kind, [level, ...]).

    kind in {"normal", "hard", "super-hard"}.
    """
    t = title.strip()
    kind = "normal"
    if re.search(r"super\s*hard", t, re.IGNORECASE):
        kind = "super-hard"
    elif re.search(r"\bhard\b", t, re.IGNORECASE):
        kind = "hard"

    # Try a range like "Level 11-12-13-14-15-16-17-18-19-20" or "Level 60-61-62-63".
    m = re.search(r"Level\s+([\d\s\-]+?)(?=\s+Solution|\s+Walkthrough|$)", t)
    if not m:
        return kind, []
    raw = m.group(1)
    parts = re.split(r"\s*[-–—]\s*", raw)
    nums = [int(p) for p in parts if p.strip().isdigit()]
    if not nums:
        return kind, []
    # If two endpoints span a contiguous run (e.g. only "11-20"), expand.
    if len(nums) == 2 and nums[1] - nums[0] >= 2:
        return kind, list(range(nums[0], nums[1] + 1))
    return kind, nums


def main() -> None:
    if not PLAYLIST_FILE.exists():
        raise SystemExit(f"missing playlist file: {PLAYLIST_FILE}")

    # videos[level] = list of candidate {youtubeid, duration, kind, batch}
    candidates: dict[int, list[dict]] = {}
    super_hard: dict[int, dict] = {}

    for raw in PLAYLIST_FILE.read_text(encoding="utf-8").splitlines():
        if not raw.strip():
            continue
        try:
            yid, title, dur = raw.split("|", 2)
        except ValueError:
            continue
        if title.strip() in ("[Deleted video]", "[Private video]"):
            continue
        if re.search(r"\bRound\b", title, re.IGNORECASE):
            continue
        try:
            duration = int(float(dur)) if dur not in ("NA", "") else 0
        except ValueError:
            duration = 0

        kind, levels = parse_levels_from_title(title)
        if not levels:
            continue
        if len(levels) > 1:
            batch = f"{levels[0]}-{levels[-1]}"
        else:
            batch = ""
        # Per-level duration estimate: for batches, divide total; min 25s.
        per_level_dur = max(25, duration // max(1, len(levels)))
        for lvl in levels:
            entry = {
                "youtubeid": yid,
                "duration": per_level_dur,
                "kind": kind,
                "batch": batch,
                "is_batch": len(levels) > 1,
                "raw_duration": duration,
            }
            if kind == "super-hard":
                # store separately; keep first seen
                super_hard.setdefault(lvl, entry)
            else:
                candidates.setdefault(lvl, []).append(entry)

    # Difficulty bands by level number (used as a fallback / default).
    def difficulty_for(level: int, has_super_hard: bool, kind: str) -> str:
        if has_super_hard:
            return "super-hard"
        if kind == "hard":
            return "hard"
        if level <= 10:
            return "easy"
        if level <= 30:
            return "easy"
        if level <= 60:
            return "medium"
        if level <= 100:
            return "hard"
        return "expert"

    max_level = max(
        DEFAULT_MAX_LEVEL,
        max(candidates.keys(), default=0),
        max(super_hard.keys(), default=0),
    )

    # Pick best candidate per level: prefer single-level over batch.
    out: list[dict] = []
    for lvl in range(1, max_level + 1):
        cands = candidates.get(lvl, [])
        # Sort: single-level first, then by duration desc.
        cands.sort(key=lambda c: (c["is_batch"], -c["duration"]))
        chosen = cands[0] if cands else None
        sh = super_hard.get(lvl)

        if chosen:
            entry = {
                "Level": lvl,
                "youtubeid": chosen["youtubeid"],
                "Width": 1080,
                "Height": 1920,
                "Duration": chosen["duration"],
                "difficulty": difficulty_for(lvl, sh is not None, chosen["kind"]),
                "batch": chosen["batch"],
                "type": "normal",
                "has_video": True,
            }
        else:
            # No video for this level (e.g. levels 1-10 in this playlist).
            entry = {
                "Level": lvl,
                "youtubeid": "",
                "Width": 1080,
                "Height": 1920,
                "Duration": 30,
                "difficulty": difficulty_for(lvl, sh is not None, "normal"),
                "batch": "",
                "type": "normal",
                "has_video": False,
            }
        if sh:
            entry["super_hard_youtubeid"] = sh["youtubeid"]
            entry["super_hard_duration"] = sh["duration"]
        out.append(entry)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(
        json.dumps(out, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    with_video = sum(1 for e in out if e["has_video"])
    print(f"wrote {len(out)} levels to {OUTPUT_FILE} ({with_video} with video)")


if __name__ == "__main__":
    main()
