import { loadConfig } from "./core/config.js";
import { PluginRegistry } from "./core/plugin-registry.js";
import { createPermissionService } from "./core/permissions.js";
import { createDispatcher } from "./core/dispatcher.js";
import { renderMenu } from "./core/menu/renderer.js";
import { createBaileysProvider } from "./adapters/baileys/provider.js";
import { fileURLToPath } from "node:url";

export async function createRuntime({ config = loadConfig(), provider = null } = {}) {
  const registry = new PluginRegistry();
  await registry.loadDirectory(fileURLToPath(new URL("./plugins/core/", import.meta.url)));
  const permissions = createPermissionService(config);
  const wa = provider || createBaileysProvider({
    sessionDir: config.sessionDir,
    onQr: () => {},
    onConnection: () => {}
  });

  const dispatch = createDispatcher({
    config, permissions, registry,
    send: (chatId, text) => wa.sendText(chatId, text)
  });

  wa.onMessage(async message => {
    if (message.isGroup) {
      const metadata = await wa.socket?.groupMetadata(message.chatId).catch(() => null);
      const participant = metadata?.participants?.find(item =>
        [message.senderJid, message.raw?.key?.participantPn, message.raw?.key?.participant]
          .filter(Boolean).includes(item.id)
      );
      message.senderIsAdmin = Boolean(participant?.admin);
    }
    const result = await dispatch(message, { runtime });
    if (result.status === "unknown-command") {
      await wa.sendText(message.chatId, `الأمر غير موجود. اكتب ${config.prefix}menu لعرض القائمة.`);
    }
  });

  const runtime = {
    config, registry, permissions, provider: wa,
    startedAt: Date.now(),
    menu(userName = "") {
      return renderMenu({
        config, plugins: registry.list(),
        userName, uptimeSeconds: (Date.now() - this.startedAt) / 1000
      });
    },
    async start() { await wa.connect(); },
    async stop() { await wa.disconnect(); }
  };
  return runtime;
}
