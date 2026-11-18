import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../core/config.js";
import { createPermissionService } from "../core/permissions.js";
import { PluginRegistry } from "../core/plugin-registry.js";
import { createDispatcher } from "../core/dispatcher.js";
import { renderMenu } from "../core/menu/renderer.js";
import { assertWhatsAppProvider } from "../adapters/baileys/contract.js";

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
  assert.match(menu, /\.ping/);
  assert.match(menu, /@System\.Fail/);
});

test("provider contract rejects incomplete implementations", () => {
  assert.throws(() => assertWhatsAppProvider({ connect() {} }), /disconnect/);
  assert.equal(assertWhatsAppProvider({
    connect() {}, disconnect() {}, sendText() {}, onMessage() {}
  }).connect instanceof Function, true);
});
