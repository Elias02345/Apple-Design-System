# Stillform repository

The portable skill lives in `skills/stillform`. Use its [entry point](skills/stillform/SKILL.md) when changing an interaction or adding a field study. Keep all runtime files needed by the installed skill inside that directory.

Public code and documentation use English. Put development on `dev`, preserve release history, and sign release commits and annotated version tags. The gallery is static and can be opened locally.

Use the existing component and source indexes to check whether a pattern already exists. A new rule needs a context, an observable acceptance check and a working code or source reference. Attribute Apple guidance to the specific Apple topic. Identify original implementation defaults as project decisions.

Run the smallest relevant regression first. The repository has `python tests/test_skill.py`, the Playwright flow suite and the native Swift package tests. For a visible change, inspect the rendered result and update the relevant showcase capture and changelog. Release checks are in [.github/workflows/validate.yml](.github/workflows/validate.yml).
