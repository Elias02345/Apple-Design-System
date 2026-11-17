#!/usr/bin/env python3
"""Search the bundled source titles and return canonical Apple URLs."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit

def search(rows, query, kind):
    words = query.casefold().split()
    def score(row):
        title = row["title"].casefold()
        haystack = title + " " + row["url"].casefold().replace("-", " ")
        if not all(word in haystack for word in words): return None
        return (title != query.casefold(), not title.startswith(query.casefold()), row["kind"] != "guideline", len(title), title)
    matches = []
    for row in rows:
        if kind and row["kind"] != kind: continue
        rank = score(row)
        if rank is not None: matches.append((rank, row))
    return [row for _, row in sorted(matches, key=lambda pair: pair[0])]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("query", help="Title or topic words, for example 'sheets' or 'liquid glass'")
    parser.add_argument("--kind", choices=["guideline","video","resource","story","kit","sample"])
    parser.add_argument("--media", action="store_true", help="Include linked HIG illustration and clip variants")
    parser.add_argument("--media-type", choices=["image","video"], help="Show only matching linked media from the resulting topics")
    parser.add_argument("--limit", type=int, default=8)
    args=parser.parse_args()
    if args.limit < 1: parser.error("--limit must be positive")
    path=Path(__file__).resolve().parents[1]/"references"/"catalog.json"
    rows=search(json.loads(path.read_text(encoding="utf-8")),args.query,args.kind)
    for row in rows[:args.limit]:
        print(f"{row['title']} [{row['kind']}]\n  {row['url']}")
        for download in row.get("downloads",[]): print("  " + download)
        if args.media or args.media_type:
            for url in row.get("media",[]):
                is_video=urlsplit(url).path.lower().endswith((".mp4",".mov",".m4v",".webm"))
                if args.media_type is None or args.media_type==("video" if is_video else "image"): print("  " + url)
    if not rows: print("No matching source titles. Try a shorter topic or another platform term.")
    return 0 if rows else 1

if __name__ == "__main__":
    raise SystemExit(main())
