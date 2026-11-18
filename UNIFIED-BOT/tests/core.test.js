import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../core/config.js";
import { createPermissionService } from "../core/permissions.js";
import { PluginRegistry } from "../core/plugin-registry.js";
import { createDispatcher } from "../core/dispatcher.js";
import { renderMenu } from "../core/menu/renderer.js";
import { assertWhatsAppProvider } from "../adapters/baileys/contract.js";
import { normalizeIncomingMessage, extractMessageText } from "../adapters/baileys/provider.js";
import { createRuntime } from "../runtime.js";
import { targetJid, protectGroupTarget } from "../core/group-actions.js";
import addPlugin from "../plugins/core/add.js";
import bratPlugin from "../plugins/core/brat.js";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const config = loadConfig({
  botName: "Test Bot", ownerName: "Owner", ownerNumber: "201000000000",
  prefix: ".", language: "ar", mode: "public", packname: "Test",
  author: "Amin Saad", channelName: "", channelLink: "", ownerLink: "",
  sessionDir: "./sessions/test", dataDir: "./data/test"
});

test("config validates and freezes instance settings", () => {
  assert.equal(config.developer, "Amin Saad");
  assert.equal(config.contactUsername, "@System.Fail");
  assert.ok(Object.isFrozen(config));
  assert.throws(() => loadConfig({ ...config, ownerNumber: "1" }), /ownerNumber/);
  assert.throws(() => loadConfig({ ...config, ownerLink: "javascript:alert(1)" }), /HTTPS/);
});

test("registry resolves commands and aliases, rejects collisions", () => {
  const registry = new PluginRegistry();
  registry.register({ id: "ping", command: "ping", aliases: ["p"], execute() {} });
  assert.equal(registry.resolve("p").id, "ping");
  assert.throws(() => registry.register({ command: "p", execute() {} }), /Duplicate command/);
});

test("dispatcher enforces private mode and plugin permissions", async () => {
  const privateConfig = loadConfig({ ...config, mode: "private" });
  const permissions = createPermissionService(privateConfig);
  const registry = new PluginRegistry();
  let called = false;
  registry.register({ command: "secret", ownerOnly: true, execute: async () => { called = true; } });
  const dispatch = createDispatcher({ config: privateConfig, permissions, registry, send: async () => {} });
  assert.equal((await dispatch({ text: ".secret", senderNumber: "201111111111", chatId: "x" })).status, "private-mode");
  assert.equal((await dispatch({ text: ".secret", senderNumber: "201000000000", chatId: "x" })).status, "executed");
  assert.equal(called, true);
});

test("menu has text fallback and groups commands", () => {
  const registry = new PluginRegistry();
  registry.register({ command: "ping", category: "General", description: "Check status", execute() {} });
  const menu = renderMenu({ config, plugins: registry.list(), userName: "A", uptimeSeconds: 10 });
  assert.match(menu, /General/);
  assert.match(menu, /menu General/);
  const categoryMenu = renderMenu({ config, plugins: registry.list(), category: "general" });
  assert.match(categoryMenu, /\.ping/);
  const allMenu = renderMenu({ config, plugins: registry.list(), category: "all" });
  assert.match(allMenu, /Check status/);
  assert.match(menu, /@System\.Fail/);
});

test("provider contract rejects incomplete implementations", () => {
  assert.throws(() => assertWhatsAppProvider({ connect() {} }), /disconnect/);
  assert.equal(assertWhatsAppProvider({
    connect() {}, disconnect() {}, sendText() {}, onMessage() {}
  }).connect instanceof Function, true);
});

test("owner identity is based on configured phone number, not fromMe", () => {
  const permissions = createPermissionService(config);
  assert.equal(permissions.isOwner({ senderNumber: "201000000000", fromMe: false }), true);
  assert.equal(permissions.isOwner({ senderNumber: "201111111111", fromMe: true }), false);
});

test("Baileys message normalization handles text and refuses to treat LID as a phone number", () => {
  const raw = {
    key: { remoteJid: "123@g.us", participant: "998877@lid", participantPn: "201222333444@s.whatsapp.net" },
    message: { extendedTextMessage: { text: ".ping" } }
  };
  const normalized = normalizeIncomingMessage(raw, null);
  assert.equal(normalized.chatId, "123@g.us");
  assert.equal(normalized.senderNumber, "201222333444");
  assert.equal(normalized.text, ".ping");
  assert.equal(normalized.isGroup, true);
  assert.equal(extractMessageText({ message: { conversation: "hello" } }), "hello");
});

test("runtime loads built-in plugins and dispatches menu and ping through an injected provider", async () => {
  let receive;
  const sent = [];
  const fakeProvider = {
    socket: null,
    async connect() {},
    async disconnect() {},
    async sendText(chatId, text) { sent.push({ chatId, text }); },
    onMessage(listener) { receive = listener; return () => {}; }
  };
  const runtime = await createRuntime({ config, provider: fakeProvider });
  assert.equal(runtime.registry.resolve("menu")?.id, "menu");
  assert.equal(runtime.registry.resolve("ping")?.id, "ping");
  await receive({ text: ".menu", senderNumber: "201000000000", isGroup: false, chatId: "chat" });
  assert.match(sent.at(-1).text, /General/);
  await receive({ text: ".ping", senderNumber: "201000000000", isGroup: false, chatId: "chat" });
  assert.match(sent.at(-1).text, /Pong/);
});

test("admin commands require the owner or a real group-admin signal", () => {
  const permissions = createPermissionService(config);
  assert.equal(permissions.canUseAdminCommand({ senderNumber: "201111111111", isGroup: false }), false);
  assert.equal(permissions.canUseAdminCommand({ senderNumber: "201111111111", isGroup: true, senderIsAdmin: true }), true);
  assert.equal(permissions.canUseAdminCommand({ senderNumber: "201000000000", isGroup: false }), true);
});

test("group command plugins are registered and require admin privileges", async () => {
  const registry = new PluginRegistry();
  await registry.loadDirectory(new URL("../plugins/core/", import.meta.url).pathname);
  for (const name of ["add", "kick", "promote", "demote", "groupname", "groupdesc", "groupclose", "groupopen", "antilink", "welcome", "setwelcome", "warn", "unwarn"]) {
    assert.equal(registry.resolve(name)?.adminOnly, true, name);
  }
  assert.ok(registry.resolve("grouplink"));
  assert.ok(registry.resolve("dice"));
  assert.ok(registry.resolve("base64decode"));
  for (const name of ["mode", "setprefix", "setbotname", "setlang"]) {
    assert.equal(registry.resolve(name)?.ownerOnly, true, name);
  }
  assert.equal(registry.resolve("mute")?.id, "groupclose");
  assert.equal(registry.resolve("unmute")?.id, "groupopen");
  assert.equal(registry.resolve("brat")?.id, "brat");
  assert.equal(registry.size, 74);
  assert.equal(registry.resolve("mal")?.id, "animesearch");
  assert.equal(registry.resolve("songinfo")?.id, "lyrics");
  assert.ok(registry.resolve("warn"));
  assert.ok(registry.resolve("unwarn"));
  assert.ok(registry.resolve("warnings"));
  assert.equal(registry.resolve("gh")?.id, "github");
  assert.equal(registry.resolve("npmsearch")?.id, "npm");
  assert.equal(registry.resolve("mal")?.id, "animesearch");
  assert.equal(registry.resolve("songinfo")?.id, "lyrics");
  assert.ok(registry.resolve("warn"));
  assert.ok(registry.resolve("unwarn"));
  assert.ok(registry.resolve("warnings"));
});



test("brat command creates a WebP sticker from bounded text", async () => {
  let sent;
  const replies = [];
  await bratPlugin.execute({
    args: ["hello", "world"],
    message: { chatId: "chat", raw: {} },
    reply: async value => replies.push(value),
    context: { runtime: { provider: { socket: {
      async sendMessage(chatId, payload) { sent = { chatId, payload }; }
    } } } }
  });
  assert.equal(sent.chatId, "chat");
  assert.equal(sent.payload.sticker[0], 0x52);
  assert.equal(sent.payload.sticker.toString("ascii", 1, 4), "IFF");
  await bratPlugin.execute({
    args: [],
    message: { chatId: "chat", raw: {} },
    reply: async value => replies.push(value),
    context: { runtime: { provider: { socket: { async sendMessage() {} } } } }
  });
  assert.match(replies.at(-1), /Usage/);
});

test("group add command requires bot admin and calls Baileys participant add", async () => {
  let call;
  const replies = [];
  const context = { runtime: { provider: { socket: {
    async groupParticipantsUpdate(...args) { call = args; return [{ status: "200" }]; }
  } } } };
  await addPlugin.execute({
    message: { isGroup: true, botIsAdmin: true, chatId: "test-group" },
    args: ["201234567890"],
    reply: async value => replies.push(value),
    context
  });
  assert.deepEqual(call, ["test-group", ["201234567890@s.whatsapp.net"], "add"]);
  assert.match(replies.at(-1), /Member added/);

  const denied = [];
  await addPlugin.execute({
    message: { isGroup: true, botIsAdmin: false, chatId: "test-group" },
    args: ["201234567890"],
    reply: async value => denied.push(value),
    context
  });
  assert.match(denied.at(-1), /Make the bot a group admin/);
});

test("group target resolver supports mentions, quotes and validated phone numbers", () => {
  assert.equal(targetJid({ mentionedJids: ["123@s.whatsapp.net"] }, []), "123@s.whatsapp.net");
  assert.equal(targetJid({ quotedParticipantJid: "456@lid" }, []), "456@lid");
  assert.equal(targetJid({}, ["+201000000000"]), "201000000000@s.whatsapp.net");
  assert.throws(() => targetJid({}, ["123"]), /Reply to a member/);
});

test("owner-only runtime controls persist and private mode takes effect immediately", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "amin-runtime-settings-"));
  const runtimeConfig = loadConfig({ ...config, dataDir: directory, sessionDir: path.join(directory, "session") });
  const makeProvider = () => {
    let receive;
    const sent = [];
    return {
      sent,
      async connect() {},
      async disconnect() {},
      async sendText(chatId, text) { sent.push({ chatId, text }); },
      async sendMessage(chatId, content) { sent.push({ chatId, content }); },
      onMessage(listener) { receive = listener; return () => {}; },
      onParticipants() {},
      receive(message) { return receive(message); }
    };
  };
  try {
    const provider = makeProvider();
    const runtime = await createRuntime({ config: runtimeConfig, provider });
    await provider.receive({ text: ".setprefix !", senderNumber: config.ownerNumber, senderJid: "201000000000@s.whatsapp.net", chatId: "owner-chat", isGroup: false });
    assert.equal(runtime.config.prefix, "!");
    await provider.receive({ text: "!mode private", senderNumber: config.ownerNumber, senderJid: "201000000000@s.whatsapp.net", chatId: "owner-chat", isGroup: false });
    assert.equal(runtime.config.mode, "private");
    const before = provider.sent.length;
    await provider.receive({ text: "!ping", senderNumber: "201111111111", senderJid: "201111111111@s.whatsapp.net", chatId: "other-chat", isGroup: false });
    assert.equal(provider.sent.length, before);

    const secondProvider = makeProvider();
    const secondRuntime = await createRuntime({ config: runtimeConfig, provider: secondProvider });
    assert.equal(secondRuntime.config.prefix, "!");
    assert.equal(secondRuntime.config.mode, "private");
    await runtime.stop();
    await secondRuntime.stop();
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("group moderation target protection blocks owner, bot and self", () => {
  const message = { senderJid: "201111111111@s.whatsapp.net", senderNumber: "201111111111" };
  const context = { runtime: { provider: { socket: { user: { id: "201222222222:1@s.whatsapp.net" } } } } };
  assert.throws(() => protectGroupTarget("201000000000@s.whatsapp.net", message, config, context), /owner is protected/);
  assert.throws(() => protectGroupTarget(message.senderJid, message, config, context), /own account/);
  assert.throws(() => protectGroupTarget("201222222222@s.whatsapp.net", message, config, context), /bot account is protected/);
});
