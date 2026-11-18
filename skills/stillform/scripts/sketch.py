"""Find named artboards and symbol masters in a locally supplied Sketch document."""
import argparse
import json
import sys
import zipfile
from collections import defaultdict
from pathlib import Path


def search(archive, terms, limit, measure):
    with archive.open("meta.json") as metadata:
        pages = json.load(metadata)["pagesAndArtboards"]
    matches = []
    for page_id, page in pages.items():
        for layer_id, artboard in page.get("artboards", {}).items():
            name = artboard.get("name", "")
            label = (page.get("name", "") + " " + name).casefold()
            if all(term in label for term in terms):
                matches.append({"page": page.get("name", ""), "name": name,
                                "pageId": page_id, "layerId": layer_id})
    matches.sort(key=lambda row: (row["name"].casefold(), row["page"], row["layerId"]))
    selected = matches[:limit]
    if measure:
        by_page = defaultdict(dict)
        for row in selected:
            by_page[row["pageId"]][row["layerId"]] = row
        for page_id, targets in by_page.items():
            with archive.open("pages/" + page_id + ".json") as page:
                layers = list(json.load(page).get("layers", []))
            while layers:
                layer = layers.pop()
                row = targets.get(layer.get("do_objectID"))
                if row is not None:
                    frame = layer.get("frame", {})
                    row["layerClass"] = layer.get("_class")
                    row["bounds"] = {key: frame[key] for key in ("width", "height") if key in frame}
                    row["children"] = [child.get("name", "") for child in layer.get("layers", [])]
                layers.extend(layer.get("layers", []))
    return {"total": len(matches), "matches": selected}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("document", type=Path)
    parser.add_argument("terms", nargs="*", help="Require each word in the page or layer name")
    parser.add_argument("--limit", type=int, default=8)
    parser.add_argument("--measure", action="store_true", help="Include layer bounds and immediate child names")
    args = parser.parse_args()
    if args.limit < 1:
        parser.error("--limit must be positive")
    try:
        with zipfile.ZipFile(args.document) as archive:
            result = search(archive, [t.casefold() for t in args.terms], args.limit, args.measure)
    except (OSError, zipfile.BadZipFile, ValueError, KeyError) as error:
        parser.exit(2, f"Could not read this Sketch document: {error}\n")
    print(json.dumps(result, indent=2, ensure_ascii=True))
    return 0 if result["matches"] else 1


if __name__ == "__main__":
    sys.exit(main())
