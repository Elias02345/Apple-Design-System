"""Exercise the installed skill's routing, provenance and portable references."""
import json
import re
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

repo=Path(__file__).resolve().parents[1]
skill=repo/"skills/stillform"

class SkillDistribution(unittest.TestCase):
    def test_snippet_sources_and_dependencies_travel_with_the_release(self):
        script = str(skill / "scripts/snippet.py")
        patterns = json.loads((skill / "references/snippets.json").read_bytes())
        self.assertEqual(len({(r["stack"], r["id"]) for r in patterns}), len(patterns))
        for row in patterns:
            for name in [row["file"], *row["dependencies"]]:
                self.assertTrue((skill / name).resolve().is_relative_to(skill))
                self.assertTrue((skill / name).is_file(), name)
            if row["symbol"]:
                self.assertIn(row["symbol"], (skill / row["file"]).read_text(encoding="utf-8"))
        for stack in ("web", "flutter", "dioxus", "swiftui"):
            row = next(r for r in patterns if r["stack"] == stack and r["id"] == "precision")
            actual = subprocess.check_output([sys.executable, script, stack, "precision", "--code"])
            self.assertEqual(actual, (skill / row["file"]).read_bytes())
        self.assertEqual(subprocess.run([sys.executable, script, "dioxus", "missing"], capture_output=True).returncode, 1)

    def test_sketch_search_reads_nested_bounds_and_limits_results(self):
        with tempfile.TemporaryDirectory() as directory:
            document = Path(directory) / "Study.sketch"
            first = {"do_objectID": "one", "_class": "symbolMaster", "frame": {"width": 76, "height": 30},
                     "layers": [{"name": "Label"}]}
            with zipfile.ZipFile(document, "w") as archive:
                archive.writestr("meta.json", json.dumps({"pagesAndArtboards": {"p": {
                    "name": "Light", "artboards": {"one": {"name": "Button/A"}, "two": {"name": "Button/B"}}}}}))
                archive.writestr("pages/p.json", json.dumps({"layers": [{"layers": [first]}]}))
            cmd = [sys.executable, str(skill / "scripts/sketch.py"), str(document)]
            result = subprocess.run([*cmd, "LIGHT", "button", "--limit", "1", "--measure"], capture_output=True, check=True)
            data = json.loads(result.stdout)
            self.assertEqual(data["total"], 2)
            self.assertEqual(len(data["matches"]), 1)
            self.assertEqual(data["matches"][0]["bounds"], {"width": 76, "height": 30})
            self.assertEqual(data["matches"][0]["children"], ["Label"])
            self.assertEqual(subprocess.run([*cmd, "missing"], capture_output=True).returncode, 1)

    def test_relative_reference_links_travel_with_skill(self):
        for page in [skill/"SKILL.md",*(skill/"references").glob("*.md")]:
            for dest in re.findall(r"\[[^\]]*\]\(([^)]+)\)", page.read_text(encoding="utf-8")):
                if "://" in dest or dest.startswith("#"): continue
                target=(page.parent/dest.partition("#")[0]).resolve()
                self.assertTrue(target.is_relative_to(skill) and target.is_file(),f"{page.name} -> {dest}")

    def test_contracts_reference_real_examples_and_primary_topics(self):
        contracts=json.loads((skill/"references/contracts.json").read_text(encoding="utf-8"))
        catalog=json.loads((skill/"references/catalog.json").read_text(encoding="utf-8"))
        topics={r["url"] for r in catalog if r["kind"]=="guideline"}
        for contract in contracts:
            self.assertIn(contract["source"],topics,contract["rule"])
            self.assertTrue((skill/contract["example"]).is_file(),contract["example"])
        run=subprocess.run([sys.executable,str(skill/"scripts/route.py"),"editor","form","cancellation","--json"],capture_output=True,check=True)
        self.assertIn("Stage explicit edits",[r["rule"] for r in json.loads(run.stdout)])

    def test_source_lookup_prefers_exact_topic_and_reports_misses(self):
        script=str(skill/"scripts/lookup.py")
        run=subprocess.run([sys.executable,script,"buttons","--kind","guideline","--limit","1","--media"],capture_output=True,check=True)
        self.assertIn(b"/human-interface-guidelines/buttons",run.stdout)
        self.assertIn(b"/tutorials/images/",run.stdout)
        miss=subprocess.run([sys.executable,script,"a-topic-that-does-not-exist"],capture_output=True)
        self.assertEqual(miss.returncode,1)

if __name__=="__main__": unittest.main()
