# Amin Unified WhatsApp Bot

A clean, instance-based WhatsApp bot foundation built from a review of the three supplied codebases. Original bot folders and archives are not modified.

## Requirements

- Node.js 22+
- npm
- A WhatsApp account that you are authorized to link as a companion device

## First run

1. Copy `settings.example.js` to `settings.js`.
2. Set `ownerNumber` to the owner's international digits only (8–15 digits, no plus sign).
3. Set bot name, owner name, prefix, language, mode and separate session/data directories.
4. From this directory run `npm install`, then `npm test`, then `npm start`.
5. Scan the QR code from WhatsApp > Linked devices.

Never share or commit `sessions/`, `data/`, `.env`, or a real settings file containing private credentials. `settings.js` is intentionally ignored by Git and is not included in the repository. The example owner number is blank; startup refuses to connect until you configure it.

## Architecture

- `core/config.js`: validated per-instance configuration.
- `core/plugin-registry.js`: recursive ESM plugin discovery, command/alias collision checks.
- `core/permissions.js`: owner and group-admin checks; `fromMe` is not treated as proof of ownership.
- `core/dispatcher.js`: prefix parsing and permission-aware dispatch.
- `adapters/baileys/provider.js`: isolated Baileys connection, auth persistence, QR output and message normalization.
- `runtime.js`: composes provider, registry, permissions and dispatcher.
- `plugins/core/`: built-in commands.
- `tests/`: automated unit tests.

## Library decision

The runtime pins the upstream `@whiskeysockets/baileys@6.7.24` interface instead of inheriting a fork's behavior. The three original projects use different forks/versions, so their plugins are not assumed to be drop-in compatible. Provider replacement remains isolated behind `adapters/baileys/`.

## Migration policy

The source review found 97 HIROBOT plugin files, 158 NOX-BOT plugin files and 305 PatrickMD plugin files. Their handlers depend on different global variables, helper APIs, database layouts and message wrappers. They are catalogued for manual migration; copying them wholesale would create broken commands and unsafe privilege assumptions. Each migrated command must declare its metadata and use the unified `execute({ message, args, reply, config, permissions, context })` contract.

Do not migrate adult-content, privacy-invasive, credential-harvesting, bulk-messaging or shell-execution features. No such features are enabled in this starter.

## Menu

The menu uses a clean category-first text layout. It does not depend on remote videos, downloaded media or WhatsApp interactive-message support, so it has a plain-text fallback by design.

## Tests

`npm test` runs the local unit suite. GitHub Actions runs syntax checks and tests on changes to this folder.
