# Run the same suite with development dependencies installed outside the repository.
import os
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
modules = Path(sys.argv[1]).resolve()
env = dict(os.environ, NODE_PATH=str(modules))
raise SystemExit(subprocess.call(["node", str(modules/"@playwright/test/cli.js"), "test", *sys.argv[2:]], cwd=root, env=env))
