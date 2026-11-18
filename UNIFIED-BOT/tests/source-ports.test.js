import test from "node:test";
import assert from "node:assert/strict";
import plugins from "../plugins/source-ports/patrickmd.js";

test("PatrickMD source-derived ports expose six distinct original features", () => {
  assert.equal(plugins.length, 6);
  assert.equal(new Set(plugins.map(p => p.id)).size, 6);
  assert.ok(plugins.every(p => typeof p.execute === "function"));
});

test("question commands require a prompt and answer when supplied", async () => {
  for (const command of ["apakah", "bisakah", "kapankah"]) {
    const plugin = plugins.find(p => p.command === command);
    const replies = [];
    await plugin.execute({ args: [], reply: async value => replies.push(value) });
    assert.match(replies[0], /Usage/);
    await plugin.execute({ args: ["pertanyaan"], reply: async value => replies.push(value) });
    assert.ok(replies[1].length > 0);
  }
});

test("pantun, rules and dzikir return content", async () => {
  for (const command of ["pantun", "botrules", "dzikir"]) {
    const plugin = plugins.find(p => p.command === command);
    const replies = [];
    await plugin.execute({ args: [], reply: async value => replies.push(value), config: { botName: "Test" } });
    assert.ok(replies[0].length > 20);
  }
});
