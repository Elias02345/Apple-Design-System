"""Find a maintained source unit and its integration dependencies."""
import argparse
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
rows = json.loads((root / "references/snippets.json").read_text(encoding="utf-8"))
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("stack", choices=sorted({r["stack"] for r in rows}))
parser.add_argument("pattern", nargs="?", help="Omit to list the stack.")
output = parser.add_mutually_exclusive_group()
output.add_argument("--code", action="store_true", help="Write the source file with its imports.")
output.add_argument("--json", action="store_true")
args = parser.parse_args()
selected = [r for r in rows if r["stack"] == args.stack and (not args.pattern or r["id"] == args.pattern)]
if not selected:
    parser.exit(1, "No implementation for that pair. Omit the pattern to list this stack.\n")
if args.code:
    if not args.pattern:
        parser.error("Choose one pattern to print its source.")
    sys.stdout.buffer.write((root / selected[0]["file"]).read_bytes())
elif args.json:
    print(json.dumps(selected, indent=2, ensure_ascii=True))
else:
    for row in selected:
        print(row["id"] + "  " + row["file"] + ("  " + row["symbol"] if row["symbol"] else ""))
        print("  Verify: " + row["check"])
        if row["dependencies"]:
            print("  Also open: " + ", ".join(row["dependencies"]))
