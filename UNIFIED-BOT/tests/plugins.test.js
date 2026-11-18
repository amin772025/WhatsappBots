import test from "node:test";
import assert from "node:assert/strict";
import anime from "../plugins/core/animesearch.js";
import lyrics from "../plugins/core/lyrics.js";

test("anime search uses safe-for-work public results and formats metadata", async () => {
  const originalFetch = globalThis.fetch;
  let requested;
  globalThis.fetch = async (url) => {
    requested = new URL(url);
    return { ok: true, async json() { return { data: [{
      title: "Example Anime", score: 8.2, episodes: 12, status: "Finished Airing",
      genres: [{ name: "Adventure" }], synopsis: "A short synopsis.", url: "https://myanimelist.net/anime/1"
    }] }; } };
  };
  const replies = [];
  try {
    await anime.execute({ args: ["example", "anime"], reply: async value => replies.push(value) });
    assert.equal(requested.searchParams.get("sfw"), "true");
    assert.match(replies[0], /Example Anime/);
    assert.match(replies[0], /Adventure/);
  } finally { globalThis.fetch = originalFetch; }
});

test("anime search validates empty input", async () => {
  const replies = [];
  await anime.execute({ args: [], reply: async value => replies.push(value) });
  assert.match(replies[0], /Usage/);
});

test("lyrics search returns metadata and a lyrics-page link without copying song lyrics", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, async json() { return [{
    trackName: "Example Track", artistName: "Example Artist", albumName: "Album", duration: 185,
    plainLyrics: "This content must not be copied into the bot response."
  }]; } });
  const replies = [];
  try {
    await lyrics.execute({ args: ["example", "track"], reply: async value => replies.push(value) });
    assert.match(replies[0], /Example Track/);
    assert.match(replies[0], /lrclib.net/);
    assert.doesNotMatch(replies[0], /This content must not be copied/);
  } finally { globalThis.fetch = originalFetch; }
});
