import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { makeSticker, makePng } from "../core/media.js";

test("image tools create a bounded WebP sticker and PNG output", async () => {
  const input = await sharp({ create: { width: 64, height: 64, channels: 4, background: { r: 20, g: 180, b: 120, alpha: 1 } } }).png().toBuffer();
  const sticker = await makeSticker(input);
  const stickerMeta = await sharp(sticker).metadata();
  assert.equal(stickerMeta.format, "webp");
  assert.equal(stickerMeta.width, 512);
  assert.ok(sticker.length < 1024 * 1024);
  const png = await makePng(sticker);
  assert.equal((await sharp(png).metadata()).format, "png");
});
