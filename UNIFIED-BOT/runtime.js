import { loadConfig } from "./core/config.js";
import { PluginRegistry } from "./core/plugin-registry.js";
import { createPermissionService } from "./core/permissions.js";
import { createDispatcher } from "./core/dispatcher.js";
import { renderMenu } from "./core/menu/renderer.js";
import { createBaileysProvider } from "./adapters/baileys/provider.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createJsonStore } from "./core/storage/json-store.js";
import { jidNormalizedUser } from "@whiskeysockets/baileys";

export async function createRuntime({ config = loadConfig(), provider = null } = {}) {
  const activeConfig = { ...config };
  const registry = new PluginRegistry();
  await registry.loadDirectory(fileURLToPath(new URL("./plugins/core/", import.meta.url)));
  const store = await createJsonStore({
    filePath: path.join(config.dataDir, "state.json"),
    initialValue: { users: {}, chats: {}, settings: {} }
  });
  const savedSettings = store.read().settings || {};
  if (typeof savedSettings.prefix === "string") activeConfig.prefix = savedSettings.prefix;
  if (["public", "private"].includes(savedSettings.mode)) activeConfig.mode = savedSettings.mode;
  if (typeof savedSettings.botName === "string" && savedSettings.botName.trim()) activeConfig.botName = savedSettings.botName;
  if (["ar", "en"].includes(savedSettings.language)) activeConfig.language = savedSettings.language;
  const permissions = createPermissionService(activeConfig);
  const wa = provider || createBaileysProvider({
    sessionDir: config.sessionDir,
    onQr: () => {},
    onConnection: () => {}
  });

  const dispatch = createDispatcher({
    config: activeConfig, permissions, registry,
    send: (chatId, text) => wa.sendText(chatId, text)
  });

  wa.onMessage(async message => {
    if (message.isGroup) {
      const metadata = await wa.socket?.groupMetadata(message.chatId).catch(() => null);
      const identities = [
        message.senderJid,
        message.raw?.key?.participantPn,
        message.raw?.key?.participant,
        message.raw?.key?.senderPn
      ].filter(Boolean);
      const participant = metadata?.participants?.find(item =>
        identities.includes(item.id) ||
        (message.senderNumber && String(item.phoneNumber || "").replace(/\D/g, "") === message.senderNumber)
      );
      message.senderIsAdmin = Boolean(participant?.admin);
      const botIds = [wa.socket?.user?.id, wa.socket?.user?.lid].filter(Boolean).map(jidNormalizedUser);
      const botParticipant = metadata?.participants?.find(item => botIds.includes(jidNormalizedUser(item.id)));
      message.botIsAdmin = Boolean(botParticipant?.admin);
    }
    if (message.isGroup && message.text && !permissions.isOwner(message) && !message.senderIsAdmin) {
      const chatSettings = store.read().chats?.[message.chatId] || {};
      const hasLink = /(?:https?:\/\/|www\.|chat\.whatsapp\.com\/)/i.test(message.text);
      if (chatSettings.antilink && hasLink && message.botIsAdmin && message.raw?.key) {
        try {
          await wa.socket.sendMessage(message.chatId, { delete: message.raw.key });
          const now = Date.now();
          if (now - Number(chatSettings.lastAntiLinkNoticeAt || 0) > 30000) {
            await wa.sendText(message.chatId, "Links are disabled in this group.");
            await store.transact(data => {
              data.chats[message.chatId].lastAntiLinkNoticeAt = now;
            });
          }
        } catch (error) { console.error("[anti-link]", error); }
        return;
      }
    }
    const result = await dispatch(message, { runtime });
    if (result.status === "executed" || result.status === "unknown-command") {
      const userKey = message.senderNumber || message.senderJid;
      await store.transact(data => {
        data.users ||= {};
        data.chats ||= {};
        const user = data.users[userKey] || (data.users[userKey] = {
          commands: 0,
          firstSeenAt: new Date().toISOString()
        });
        user.commands += 1;
        user.lastSeenAt = new Date().toISOString();
        const chat = data.chats[message.chatId] || (data.chats[message.chatId] = { commands: 0 });
        chat.commands += 1;
        chat.lastActivityAt = new Date().toISOString();
      });
    }
    if (result.status === "unknown-command") {
      await wa.sendText(message.chatId, `الأمر غير موجود. اكتب ${activeConfig.prefix}menu لعرض القائمة.`);
    }
  });

  const runtime = {
    config: activeConfig, registry, permissions, provider: wa, store,
    startedAt: Date.now(),
    menu(category = "", userName = "") {
      return renderMenu({
        config: activeConfig, plugins: registry.list(),
        userName, category, uptimeSeconds: (Date.now() - this.startedAt) / 1000
      });
    },
    async start() { await wa.connect(); },
    async stop() { await store.flush(); await wa.disconnect(); }
  };
  wa.onParticipants?.(async update => {
    if (update.action !== "add") return;
    const chatSettings = store.read().chats?.[update.id] || {};
    if (!chatSettings.welcomeEnabled) return;
    const metadata = await wa.socket?.groupMetadata(update.id).catch(() => null);
    const groupName = String(metadata?.subject || "this group").slice(0, 100);
    const template = String(chatSettings.welcomeTemplate || "Welcome {user} to {group}!");
    for (const participant of (update.participants || []).slice(0, 10)) {
      const user = "@" + String(participant).split("@")[0].split(":")[0];
      const text = template.replaceAll("{user}", user).replaceAll("{group}", groupName);
      await wa.sendMessage(update.id, { text, mentions: [participant] });
    }
  });

  return runtime;
}
