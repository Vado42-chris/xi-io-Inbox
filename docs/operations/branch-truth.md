# Branch Truth for Agents

## Purpose

Prevent cloud, Cursor, and local Zed agents from auditing or editing the wrong branch.

## Current branch map

| Branch | Meaning | Use for |
| --- | --- | --- |
| `main` | Bootstrap planning, operation packets, and shared JSON schemas. | Schema validation, docs hygiene, issue cleanup, cross-branch instructions. |
| `ui-002/framework-derived-static-preview` | Active static preview product line. | UI/product work, static preview, local Gmail adapter, route smoke, CI, receipts, owner proof. |

Rule:

```text
main is not the product snapshot.
ui-002/framework-derived-static-preview is the product snapshot.
```

Any finding made from `main` must be labeled as a `main` finding unless the agent explicitly
checked out `ui-002/framework-derived-static-preview`.

## How to start a task

1. Identify the task surface.
2. Choose the branch from the table above.
3. Fetch the branch explicitly before auditing:

   ```text
   git fetch origin <branch>
   git checkout <branch-or-feature-branch>
   ```

4. Read `AGENTS.md` after checkout because branch-specific instructions may differ.
5. Run the branch-appropriate checks before reporting freshness or creating a PR.

## Cloud-agent PR reconciliation

| PR | Base | Treatment |
| --- | --- | --- |
| PR #15 | `main` | Do not merge as the sole repo truth unless it prominently states that `main` is docs/schemas only and product work lives on `ui-002`. |
| PR #16 | `main` | Treat as a `main` freshness audit. Re-check all product claims against `ui-002` before preserving them. |
| PR #17 | `ui-002/framework-derived-static-preview` | Useful strategic layer for multi-agent orchestration and UI convergence. Merge or adapt into `ui-002`, preserving local Cursor/Zed rules. |

## Product-branch operating model

On `ui-002`, the strategic direction from PR #17 is:

```text
Draft-centered spine:
  ingress -> draft -> approval -> send boundary -> receipt

Capabilities:
  calendar, tasks, automations, files, projects, extensions

Ibal:
  concierge and command entry, not a top-level lane
```

Owner ratification is still required before irreversible UI deletion or large information
architecture changes. Until ratified, agents may work on model-agnostic shell, design-system,
adapter, test, and documentation improvements.

## Required validation by branch

### `main`

- Validate schemas when schema files changed:
  `python3 -m check_jsonschema --check-metaschema schemas/*.json`
- Check whitespace and patch hygiene:
  `git diff --check`

### `ui-002/framework-derived-static-preview`

- Run the product smoke suite:
  `npm run check`
- For UI changes, serve and inspect the preview:
  `npm run dev`
- Capture browser evidence for visible UI changes.
- Preserve draft-only egress gates and receipt generation.

## Decision value

`MAIN_IS_DOCS_AND_SCHEMAS_UI_002_IS_PRODUCT_AGENTS_MUST_CHECKOUT_THE_RIGHT_BRANCH`

