#!/usr/bin/env python3
"""Return relevant Stillform acceptance contracts and concrete example paths."""
import argparse
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("terms", nargs="+", help="Task words, e.g. editor form cancellation")
parser.add_argument("--limit", type=int, default=5)
parser.add_argument("--json", action="store_true")
args=parser.parse_args()
if args.limit<1: parser.error("--limit must be positive")
terms=set(" ".join(args.terms).lower().split())
rows=json.loads((root/"references/contracts.json").read_text(encoding="utf-8"))
ranked=[]
for row in rows:
    tags=set(row["tags"])
    words=set(row["rule"].lower().split())
    score=3*len(terms & tags)+len(terms & words)
    if score: ranked.append((score,row))
result=[row for _,row in sorted(ranked,key=lambda x:-x[0])[:args.limit]]
if args.json:
    print(json.dumps(result,ensure_ascii=True,indent=2))
else:
    for row in result:
        print(f"{row['rule']}\n  When: {row['when']}\n  Do: {row['action']}\n  Verify: {row['verify']}\n  Example: {row['example']}\n  Source: {row['source']}\n")
if not result:
    if not args.json: print("No matching contract. Browse references/components.md or search Apple's source titles using lookup.py.")
    raise SystemExit(1)
