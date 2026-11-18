# Amin Unified WhatsApp Bot

A multi-instance WhatsApp bot that consolidates reviewed ideas from HIROBOT, NOX-BOT and PatrickMD into one consistent command/plugin system. The original archives and extracted source trees are preserved unchanged.

## Requirements
- Node.js 22 or newer
- npm
- A WhatsApp account you are authorized to link as a companion device

## Quick start
1. Copy `settings.example.js` to `settings.js`.
2. Open `settings.js` and set your own `ownerNumber` as international digits only (8–15 digits, no plus sign).
3. Change `botName`, `ownerName`, `prefix`, `language`, `mode`, and the instance-specific `sessionDir` and `dataDir`.
4. In this folder run:
   ```sh
   npm install
   npm run check
   npm test
   npm start
   ```
5. Scan the terminal QR code using WhatsApp > Linked devices.

The example owner number is intentionally blank. Startup will stop until you configure it locally. No WhatsApp session is included. Never share `settings.js`, `sessions/`, `data/`, or private credentials.

## Current command set (74 plugins)

- General: `menu`, `help`, `ping`, `quote`, `joke`, `fact`, `choose`, `report`
- Group: `groupinfo`, `grouplink`, `add`, `kick`, `promote`, `demote`, `groupname`, `groupdesc`, `groupclose`, `groupopen`, `revokelink`, `antilink`, `welcome`, `setwelcome`, `warn`, `unwarn`, `warnings`
- Tools: `calc`, `reverse`, `brat`, `base64`, `base64decode`, `uuid`, `define`, `translate`, `qr`, `sticker`, `toimg`
- Games and virtual rewards: `8ball`, `coin`, `dice`, `rps`, `daily`, `work`, `balance`, `top`
- Owner controls: `mode`, `setprefix`, `setbotname`, `setlang` (owner-only; changes persist)
- Group extras: `idgc`, `listadmin`, `tagall`, `hidetag`, `setrules`, `rules`
- Games and knowledge: `trivia`, `mathquiz`, `wordmix`, `animequote`, `asmaulhusna`, `doa`, `tasbih`
- Utilities and diagnostics: `idme`, `shorturl`, `server`, `date`
- Search: `github` / `gh`, `npm` / `npmsearch`, `animesearch` / `mal`, `lyrics` / `songinfo`

Use `.menu` for category navigation, `.menu all` for all commands, or `.menu Group` for one category. Prefix follows your settings.

## Group command permissions
- Moderation commands require the sender to be a group admin or the configured owner.
- Actions that change group state also require the bot itself to be a group admin.
- `antilink` and `welcome` settings are stored separately per group.
- `kick`, `promote` and `demote` accept a reply, a mention, or a validated international number.
- The virtual coin commands are for in-bot points only; there is no real-money betting or gambling.

## Architecture
- `core/config.js`: validated per-instance settings.
- `core/plugin-registry.js`: recursive ESM loader with duplicate-command checks.
- `core/permissions.js`: explicit owner/group-admin checks; `fromMe` is not proof of ownership.
- `core/dispatcher.js`: prefix parsing and permission-aware execution.
- `core/storage/json-store.js`: per-instance atomic JSON persistence.
- `core/group-actions.js`: shared group permission and target validation.
- `core/media.js`: bounded image/sticker conversion.
- `adapters/baileys/provider.js`: Baileys connection, QR events, message normalization and group participant events.
- `runtime.js`: plugin dispatch, anti-link moderation, welcome events and usage counters.
- `plugins/core/`: the 74 implemented unified commands.

## Multi-instance use
Create a separate copy of this folder for each bot instance. Each copy needs its own `settings.js`, `sessionDir`, and `dataDir`. Do not point two running instances at the same session directory. Keep private settings and auth files out of version control.

## Source compatibility and exclusions
The originals use three different Baileys forks, handler APIs, global variables and data models. Their 560 original plugin files are inventoried in `docs/source-plugin-catalog.json`; they are not safe to copy wholesale. The 74 commands in this folder are implemented against the new plugin contract and do not import legacy globals.

Features involving adult content, stalking or personal-data lookup, credential or file extraction, arbitrary shell/eval execution, unsolicited bulk messaging, deceptive impersonation, and gambling are deliberately not enabled. External APIs used by `weather`, `wiki`, `define`, `translate`, `github`, `npm`, `animesearch` and `lyrics` are public third-party services and may change or apply their own limits.

## Validation
GitHub Actions runs a recursive syntax check over all JavaScript files, the automated test suite, and packages a ZIP artifact (without your settings or WhatsApp session) on changes to this folder. The tests use a fake WhatsApp provider; they do not log in to a real WhatsApp account. Real-device pairing must be completed by the operator.
