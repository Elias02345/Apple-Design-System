"""Exercise the installed skill's routing, provenance and portable references."""
import json
import re
import subprocess
import sys
import unittest
from pathlib import Path

repo=Path(__file__).resolve().parents[1]
skill=repo/"skills/stillform"

class SkillDistribution(unittest.TestCase):
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
