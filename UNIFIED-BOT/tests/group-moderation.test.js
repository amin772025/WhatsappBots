import test from "node:test";
import assert from "node:assert/strict";
import warn from "../plugins/core/warn.js";
import unwarn from "../plugins/core/unwarn.js";
import warnings from "../plugins/core/warnings.js";
function fixture() {
  let state = { chats: {} };
  return { runtime: { provider: { socket: null }, store: { read: () => structuredClone(state), async transact(fn) { await fn(state); } } }, get state() { return state; } };
}
test("group warning commands persist, list and remove a member warning", async () => {
  const f = fixture(), replies = [];
  const message = { isGroup: true, chatId: "group@g.us", senderJid: "admin@s.whatsapp.net" };
  const config = { ownerNumber: "201000000000" }, context = { runtime: f.runtime };
  await warn.execute({ message, args: ["201234567890", "Repeated", "spam"], reply: async v => replies.push(v), context, config });
  assert.equal(f.state.chats["group@g.us"].warnings["201234567890@s.whatsapp.net"].length, 1);
  await warnings.execute({ message, args: ["201234567890"], reply: async v => replies.push(v), context });
  assert.match(replies.at(-1), /Repeated spam/);
  await unwarn.execute({ message, args: ["201234567890"], reply: async v => replies.push(v), context, config });
  assert.equal(f.state.chats["group@g.us"].warnings["201234567890@s.whatsapp.net"], undefined);
});
test("group warning command blocks self-targeting", async () => {
  const f = fixture(), replies = [];
  await warn.execute({
    message: { isGroup: true, chatId: "group@g.us", senderJid: "201234567890@s.whatsapp.net", senderNumber: "201234567890" },
    args: ["201234567890"], reply: async v => replies.push(v),
    context: { runtime: f.runtime }, config: { ownerNumber: "201000000000" }
  });
  assert.match(replies[0], /own account/);
});
