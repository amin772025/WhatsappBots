import { downloadMediaMessage } from "@whiskeysockets/baileys";
import sharp from "sharp";
import pino from "pino";

const logger = pino({ level: "silent" });

const MAX_INPUT_BYTES = 12 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 1 * 1024 * 1024;

function mediaSource(message) {
  const current = message?.raw?.message;
  if (current?.imageMessage || current?.stickerMessage) return message.raw;
  const quoted = current?.extendedTextMessage?.contextInfo?.quotedMessage
    || current?.imageMessage?.contextInfo?.quotedMessage
    || current?.videoMessage?.contextInfo?.quotedMessage;
  if (!quoted) throw new Error("Send or reply to an image or sticker.");
  const info = current?.extendedTextMessage?.contextInfo
    || current?.imageMessage?.contextInfo
    || current?.videoMessage?.contextInfo;
  return {
    key: {
      remoteJid: message.chatId,
      participant: info.participant,
      id: info.stanzaId,
      fromMe: false
    },
    message: quoted
  };
}

export async function getImageBuffer(message) {
  const source = mediaSource(message);
  const media = source.message?.imageMessage || source.message?.stickerMessage;
  const size = Number(media?.fileLength || 0);
  if (size > MAX_INPUT_BYTES) throw new Error("Image is too large (maximum 12 MB).");
  const buffer = await downloadMediaMessage(source, "buffer", {}, { logger, reuploadRequest: message.socket?.updateMediaMessage?.bind(message.socket) });
  if (!Buffer.isBuffer(buffer) || !buffer.length || buffer.length > MAX_INPUT_BYTES) {
    throw new Error("Could not download this image or it exceeds the size limit.");
  }
  return buffer;
}

export async function makeSticker(buffer) {
  const output = await sharp(buffer, { limitInputPixels: 20_000_000 })
    .rotate()
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  if (output.length > MAX_OUTPUT_BYTES) throw new Error("Sticker output exceeds 1 MB.");
  return output;
}

export async function makePng(buffer) {
  return sharp(buffer, { limitInputPixels: 20_000_000 })
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();
}
