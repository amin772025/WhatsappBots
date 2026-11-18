import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createJsonStore } from "../core/storage/json-store.js";

test("JSON store persists transactions atomically and reloads data", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "amin-bot-store-"));
  const filePath = path.join(directory, "instance", "state.json");
  try {
    const store = await createJsonStore({
      filePath,
      initialValue: { users: {}, chats: {} }
    });
    await store.transact(data => {
      data.users["201000000000"] = { commands: 1 };
    });
    assert.equal(store.read().users["201000000000"].commands, 1);
    const reopened = await createJsonStore({ filePath, initialValue: {} });
    assert.equal(reopened.read().users["201000000000"].commands, 1);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("JSON store does not silently overwrite malformed data", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "amin-bot-store-bad-"));
  const filePath = path.join(directory, "state.json");
  try {
    await fs.writeFile(filePath, "{broken", "utf8");
    await assert.rejects(createJsonStore({ filePath }), /Could not load data store/);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
