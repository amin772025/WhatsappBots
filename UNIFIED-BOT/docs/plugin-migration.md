# Legacy plugin migration and audit

The three original codebases remain untouched. Of 560 discovered plugin source files, 558 are mirrored byte-for-byte under `source-archive/` (with source-specific folders); two adult-content downloader sources are not duplicated. The catalog records the full discovery and archive status. This archive is inert: it is not registered, imported, or executed by the unified runtime.

## Implemented in the unified runtime

The unified runtime currently registers 347 plugin entries: 335 pre-existing entries plus twelve source-derived ports from PatrickMD, NOX-BOT and HIROBOT.
- Core and information: menu/help, ping, owner, runtime, stats, profile, quote, joke, fact, report, persistent mode/prefix/name/language controls.
- Group management: group info/link, add/remove, kick, promote/demote, rename/description, open/close, revoke link, anti-link, welcome and custom welcome text.
- Utilities and media: calculator, reverse, Base64 encode/decode, UUID, dictionary, translation, QR image, green text (`brat`) sticker, image sticker and PNG conversion.
- Games: dice, coin flip, 8-ball, rock-paper-scissors, choose, trivia, arithmetic challenge and word scramble.
- AI: general assistant, GPT-style, DeepSeek-style, Bing-style, explain, summarize and translate commands through a public OpenAI-compatible inference endpoint.
- Admin: group warning, warning lookup and warning removal, restricted to group admins or the configured owner for changes.
- Virtual economy: daily rewards, work cooldown, wallet/bank balances, deposits, withdrawals and member-to-member transfers; points have no real-world value.
- Group extras: group ID, admin list, admin-only member mentions/hidetag, persistent group rules, and per-group warning records with warn/unwarn/list commands.
- Knowledge and utility extras: short supplications/remembrance, Asma ul Husna, inspirational quotes, short URL, server diagnostics and Cairo-local date/time.

## Archived source files and migration status

Of the 560 discovered source plugin files, 558 are retained in the repository: 518 were copied into `source-archive/`, while 40 remain in the unchanged extracted source trees and are listed separately in the catalog. Two adult-content downloader files are deliberately not duplicated into the archive. None of these archived or extracted legacy files is loaded by the unified runtime. The runtime loads JavaScript modules from `plugins/core/`; generic commands that were not present in the original sources are not counted as migrated. the loader registers exported plugin objects (including arrays of source-derived plugins). The current registry contains 347 entries. The unrelated generic 200-command pack was removed because it was not ported from the three original bots.

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
