# Legacy plugin migration and audit

The three original codebases remain untouched. Of 560 discovered plugin source files, 558 are mirrored byte-for-byte under `source-archive/` (with source-specific folders); two adult-content downloader sources are not duplicated. The catalog records the full discovery and archive status. This archive is inert: it is not registered, imported, or executed by the unified runtime.

## Implemented in the unified runtime

The current folder contains 69 independently implemented plugins:
- Core and information: menu/help, ping, owner, runtime, stats, profile, quote, joke, fact, report, persistent mode/prefix/name/language controls.
- Group management: group info/link, add/remove, kick, promote/demote, rename/description, open/close, revoke link, anti-link, welcome and custom welcome text.
- Utilities and media: calculator, reverse, Base64 encode/decode, UUID, dictionary, translation, QR image, green text (`brat`) sticker, image sticker and PNG conversion.
- Games: dice, coin flip, 8-ball, rock-paper-scissors, choose, trivia, arithmetic challenge, word scramble, daily rewards, work cooldown, balance and leaderboard.
- Group extras: group ID, admin list, admin-only member mentions/hidetag, and persistent group rules.
- Knowledge and utility extras: short supplications/remembrance, Asma ul Husna, inspirational quotes, short URL, server diagnostics and Cairo-local date/time.
- Public reference tools: weather, Wikipedia summary.\n- Developer search: public GitHub repository search and npm package search (no API key; subject to public rate limits).

## Archived source files and migration status

The 558 archived source files are now present in `source-archive/` for later inspection. Their presence does not mean they have been ported or are ready to run. Only the 69 plugins in `plugins/core/` are currently loaded by the runtime.

## Why the other source plugins are not imported automatically

The sources use incompatible Baileys forks and different message wrappers, global state, permission checks, database layouts, and helper APIs. Loading an old plugin without adapting those dependencies can make a command fail silently or grant incorrect privileges.

Every additional port must be reviewed for:
1. Dependency and Node.js compatibility.
2. Command metadata, aliases and event parsing.
3. Owner/admin authorization, including WhatsApp LID/phone-number mapping.
4. External network requests, API keys, data collection and rate limits.
5. Media size limits and temporary-file cleanup.
6. Duplicate commands and persistent-data compatibility.
7. A test against the unified plugin contract.

## Deliberate exclusions

Do not add adult-content commands, stalking or personal-data enumeration, credential harvesting, arbitrary shell/eval execution, extraction of private/once-viewed content, unsolicited bulk messaging, deceptive impersonation, or gambling/real-money betting. The current unified build has no such commands.

## Plugin contract

A plugin is an ESM default export with `id`, `command`, optional `aliases`, `category`, `description`, optional `ownerOnly`/`adminOnly`, and `execute({ message, args, reply, config, permissions, context })`.

Place only reviewed executable plugins inside `plugins/`. The loader currently imports JavaScript files from `plugins/core/` only. Never move the raw archive into the active plugin directory without reviewing and adapting each plugin.
