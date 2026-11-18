import test from "node:test";
import assert from "node:assert/strict";
import plugins from "../plugins/core/extended-pack-200.js";

test("the expanded pack exports exactly 200 unique executable commands", () => {
  assert.equal(plugins.length, 200);
  assert.equal(new Set(plugins.map(plugin => plugin.command)).size, 200);
  assert.ok(plugins.every(plugin => typeof plugin.execute === "function"));
});

test("text utilities transform content", async () => {
  const plugin = plugins.find(item => item.command === "text_upper");
  const replies = [];
  await plugin.execute({ args: ["hello", "world"], reply: async value => replies.push(value) });
  assert.equal(replies[0], "HELLO WORLD");
});

test("math utilities calculate correctly", async () => {
  const plugin = plugins.find(item => item.command === "math_mean");
  const replies = [];
  await plugin.execute({ args: ["2", "4", "6"], reply: async value => replies.push(value) });
  assert.equal(replies[0], "4");
});

test("date utilities validate and normalize dates", async () => {
  const plugin = plugins.find(item => item.command === "date_adddays");
  const replies = [];
  await plugin.execute({ args: ["2026-01-31", "1"], reply: async value => replies.push(value) });
  assert.equal(replies[0], "2026-02-01");
});

test("developer utilities hash locally and validate JSON", async () => {
  const hash = plugins.find(item => item.command === "dev_sha256");
  const replies = [];
  await hash.execute({ args: ["abc"], reply: async value => replies.push(value) });
  assert.equal(replies[0], "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  const json = plugins.find(item => item.command === "dev_jsonvalidate");
  const jsonReplies = [];
  await json.execute({ args: ['{"ok":true}'], reply: async value => jsonReplies.push(value) });
  assert.match(jsonReplies[0], /Valid JSON/);
});

test("invalid inputs return a safe error message", async () => {
  const plugin = plugins.find(item => item.command === "math_percent");
  const replies = [];
  await plugin.execute({ args: ["10", "0"], reply: async value => replies.push(value) });
  assert.match(replies[0], /cannot be zero/i);
});
