# Plugin migration notes

The source inventory is stored in `source-plugin-catalog.json`. It records file paths and original counts without importing source code into the new runtime.

## What is migrated now

- `ping`: minimal connectivity response.
- `menu`: category-first navigation, category view and all-commands view.
- `stats`: per-instance aggregate counters.
- Registry, dispatch, permissions, persistence and Baileys connection are implemented independently of the legacy global state.

## Why legacy plugins are not copied wholesale

The three projects use different command metadata, event wrappers, global objects, database schemas, permission conventions and Baileys forks. A source plugin may appear to load while silently losing group checks, owner checks, quoted-message helpers or persistence behavior.

Each candidate must be reviewed for:
1. Dependencies and Node compatibility.
2. Message parsing, media handling and reply API assumptions.
3. Owner/admin authorization and LID/phone identity handling.
4. External network calls, API keys, file writes and child-process use.
5. Privacy, rate limits and user consent.
6. Duplicate command names and aliases.
7. A test using the unified plugin contract.

Only reviewed plugins should be placed in `plugins/`. The loader imports executable JavaScript; never place untrusted code there.

## Next migration sequence

1. Pure local utilities with no external credentials.
2. Read-only information commands.
3. Group administration commands after permission tests.
4. Media commands only after dependency and file-size validation.
5. External-service commands only when they have documented, optional API configuration.

Legacy plugins remain in their original folders. No original source file is modified.
