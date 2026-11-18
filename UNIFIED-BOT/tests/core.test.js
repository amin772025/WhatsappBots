import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../core/config.js";
import { createPermissionService } from "../core/permissions.js";
import { PluginRegistry } from "../core/plugin-registry.js";
import { createDispatcher } from "../core/dispatcher.js";
import { renderMenu } from "../core/menu/renderer.js";
import { assertWhatsAppProvider } from "../adapters/baileys/contract.js";
import { normalizeIncomingMessage, extractMessageText } from "../adapters/baileys/provider.js";

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
