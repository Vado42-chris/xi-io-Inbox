# AGENTS.md

## Cursor Cloud specific instructions

### What this repository is

`xi-io Inbox` is in **planning/bootstrap mode** (see `README.md` and `TODO.md`). It contains
only Markdown documentation (`docs/`, `README.md`, `TODO.md`) and JSON Schema contracts
(`schemas/*.json`). There is **no application, package manifest, build system, automated test
suite, or CI** yet — `TODO.md` "Pass 4: runtime skeleton" (app skeleton, schema validation
tooling, tests, CI) is explicitly blocked on earlier passes. Do not invent a runtime; the only
machine-validatable artifacts are the JSON schemas.

### Schemas (the core artifact)

`schemas/` holds JSON Schema **draft 2020-12** contracts: `inbox-event`, `action-proposal`,
`provider-manifest`, `ai-provider-manifest`, `egress-permission`. These encode the product's
ingress/analysis/draft-only-egress invariants (e.g. `action-proposal.requires_user_confirmation`
is `const: true`, `ai-provider-manifest.egress_allowed` is `const: false`).

### Validate / "lint" / "test" the schemas

The update script installs `check-jsonschema` (Python, supports draft 2020-12). From the repo root:

- Parse-check JSON: `for f in schemas/*.json; do jq empty "$f"; done`
- Validate schemas against the meta-schema: `python3 -m check_jsonschema --check-metaschema schemas/*.json`
- Validate a document against a schema:
  `python3 -m check_jsonschema --schemafile schemas/inbox-event.schema.json <doc.json>`

`check-jsonschema` installs to `~/.local/bin` (which may not be on `PATH`); invoke it via
`python3 -m check_jsonschema` to avoid PATH issues. Format assertions (e.g. `date-time`) are
checked, so invalid timestamps are correctly rejected.
