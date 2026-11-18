# Unified WhatsApp Bot — Integration Workspace

This directory is a clean integration workspace. The three extracted source trees remain untouched.

## Current engineering decision

Do **not** combine the three Baileys forks by copying their socket helpers into one runtime. The source projects use different protocol implementations and different connection wrappers:

- HIROBOT: `baileys` aliased to `@hiroosy/baileys-lite@^0.3.7`
- NOX-BOT: `@whiskeysockets/baileys` aliased to `@prototypevip/baileys@latest`
- PatrickMD: `@rexxhayanasi/elaina-baileys@^1.4.7`

The initial unified runtime will therefore use a **provider adapter boundary**. The chosen provider will only be finalized after API/event compatibility tests. Source-specific plugins will be wrapped through compatibility adapters rather than loaded blindly.

## Findings from source inspection

### Plugin systems
- HIROBOT: recursive file discovery, dynamic imports, plugin normalization, platform metadata and reload support in `lib/utils/plugins.js`.
- NOX-BOT: command handling is tied to its global socket/runtime and per-sub-bot prefix cache; its loader and connection lifecycle are coupled to `index.js`.
- PatrickMD: recursive ESM loading into a `Map`, command-name indexing, separate special-plugin imports and a global reload function.

### Message dispatch
- HIROBOT dispatch includes custom prefixes, command-name validation, platform-aware plugin metadata, and pre-handler event processing.
- NOX-BOT derives prefix behavior from global configuration and sub-bot session folders; its handler also relies on global database state.
- PatrickMD resolves group admin state and owner status before command dispatch; passive listeners run separately from prefixed commands.

### Persistence
- HIROBOT routes through its own database module and SQL abstraction.
- NOX-BOT initializes LowDB JSON storage and also includes MongoDB/SQLite dependencies.
- PatrickMD currently stores a small JSON database using a temporary file followed by rename.

### Risks to resolve before migration
1. Baileys forks may differ in event names, message structures, auth state and media helpers.
2. Plugin modules may depend on globals and helper methods that do not exist in another source runtime.
3. Some plugins execute side effects at import time; loading them in a shared process without isolation is unsafe.
4. Owner identity, prefixes, session directories, channel URLs and API settings must be instance-scoped—not global shared state.
5. A plugin must not gain owner privileges merely because a source handler used `fromMe` or a global owner list.
6. Third-party API credentials must remain outside source control; placeholders are not runtime credentials.

## Target structure

```text
UNIFIED-BOT/
  settings.js                 # The only per-instance customization file
  core/
    config.js                 # Config validation and immutable runtime config
    dispatcher.js             # Message routing (planned)
    plugin-registry.js        # Plugin discovery/registration (planned)
    permissions.js            # Owner/admin/premium checks (planned)
    menu/
      renderer.js             # Unified menu renderer (planned)
  adapters/
    baileys/
      contract.js             # Provider interface (planned)
      provider.js             # Selected Baileys provider (after compatibility tests)
  plugins/
    core/                     # First-party core commands
    imported/                 # Reviewed and adapted source plugins
  data/
  sessions/
  tests/
```

## Menu decision

The unified menu will use:
- NOX-BOT's category-first interactive navigation as the visual direction.
- HIROBOT's configurable templates and placeholders as the rendering model.
- PatrickMD's concise runtime/system/user metadata as optional information cards.

The menu must always have a plain-text fallback if interactive message support or media upload fails. Remote video is optional, never required for the menu to work.

## Non-negotiable instance identity

- Developer label: `Amin Saad` (fixed in code).
- Contact label: `@System.Fail` (fixed in code).
- Bot name, owner details, prefix, language, mode, sticker metadata and channel details are instance settings.

## Next implementation gates

1. Finish command inventory and dependency mapping.
2. Select and pin one Baileys provider after API compatibility checks.
3. Implement config validation and runtime isolation.
4. Implement the plugin contract and dispatcher.
5. Adapt plugins in small batches with tests; never bulk-copy source plugins.
6. Add persistence migration and session lifecycle tests.
7. Run smoke tests before preparing any release.

No original extracted source file is modified by this workspace.
