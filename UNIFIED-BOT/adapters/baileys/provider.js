import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from "pino";
import fs from "node:fs/promises";
import path from "node:path";

const logger = pino({ level: process.env.LOG_LEVEL || "silent" });

export function extractMessageText(message) {
  const content = message?.message;
  if (!content) return "";
  return content.conversation
    || content.extendedTextMessage?.text
    || content.imageMessage?.caption
    || content.videoMessage?.caption
    || content.documentMessage?.caption
    || content.buttonsResponseMessage?.selectedButtonId
    || content.listResponseMessage?.singleSelectReply?.selectedRowId
    || content.templateButtonReplyMessage?.selectedId
    || "";
}

function phoneDigits(jid) {
  if (typeof jid !== "string" || !jid.endsWith("@s.whatsapp.net")) return "";
  return jid.split("@")[0].split(":")[0].replace(/\D/g, "");
}

export function normalizeIncomingMessage(raw, socket) {
  const key = raw?.key || {};
  const chatId = key.remoteJid || "";
  const senderJid = key.participant || key.remoteJidAlt || chatId;
  const senderNumber = [
    key.participantPn, key.senderPn, key.remoteJidAlt, senderJid
  ].map(phoneDigits).find(Boolean) || "";
  const text = extractMessageText(raw);
  const contextInfo = raw?.message?.extendedTextMessage?.contextInfo
    || raw?.message?.imageMessage?.contextInfo
    || raw?.message?.videoMessage?.contextInfo
    || {};
  return {
    id: key.id || "",
    displayName: String(raw?.pushName || ""),
    chatId,
    senderJid,
    senderNumber,
    quotedParticipantJid: contextInfo.participant || "",
    mentionedJids: contextInfo.mentionedJid || [],
    text,
    isGroup: chatId.endsWith("@g.us"),
    fromMe: Boolean(key.fromMe),
    senderIsAdmin: false,
    raw,
    socket
  };
}

export function createBaileysProvider({ sessionDir, onQr = () => {}, onConnection = () => {}, onMessage = () => {} }) {
  let socket = null;
  let saveCreds = null;
  let connecting = false;
  let closedByUser = false;
  const messageListeners = new Set();
  const connectionListeners = new Set();
  const participantListeners = new Set();

  async function connect() {
    if (connecting || (socket && !closedByUser)) return;
    connecting = true;
    closedByUser = false;
    try {
      await fs.mkdir(path.resolve(sessionDir), { recursive: true });
      const auth = await useMultiFileAuthState(path.resolve(sessionDir));
      saveCreds = auth.saveCreds;
      socket = makeWASocket({
        auth: auth.state,
        logger,
        printQRInTerminal: false,
        markOnlineOnConnect: false,
        syncFullHistory: false,
        generateHighQualityLinkPreview: false
      });
      socket.ev.on("creds.update", saveCreds);
      socket.ev.on("connection.update", update => {
        if (update.qr) onQr(update.qr);
        if (!closedByUser) {
          onConnection(update);
          for (const listener of connectionListeners) listener(update);
        }
        if (update.connection === "close") socket = null;
      });
      socket.ev.on("group-participants.update", async update => {
        for (const listener of participantListeners) {
          try { await listener(update); }
          catch (error) { console.error("[participant handler]", error); }
        }
      });
      socket.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return;
        for (const raw of messages || []) {
          const normalized = normalizeIncomingMessage(raw, socket);
          if (!normalized.text || normalized.fromMe || !normalized.chatId) continue;
          for (const listener of messageListeners) {
            try { await listener(normalized); }
            catch (error) { console.error("[message handler]", error); }
          }
          await onMessage(normalized);
        }
      });
    } finally {
      connecting = false;
    }
  }

  async function disconnect() {
    closedByUser = true;
    if (socket) {
      try { socket.end(undefined); } catch {}
      socket = null;
    }
  }

  async function sendMessage(chatId, content, options) {
    if (!socket) throw new Error("WhatsApp is not connected");
    return socket.sendMessage(chatId, content, options);
  }

  async function sendText(chatId, text) {
    return sendMessage(chatId, { text: String(text) });
  }

  function onMessageListener(listener) {
    messageListeners.add(listener);
    return () => messageListeners.delete(listener);
  }

  function onConnectionListener(listener) {
    connectionListeners.add(listener);
    return () => connectionListeners.delete(listener);
  }

  function onParticipants(listener) {
    participantListeners.add(listener);
    return () => participantListeners.delete(listener);
  }

  return Object.freeze({
    connect, disconnect, sendText, sendMessage,
    onMessage: onMessageListener,
    onConnection: onConnectionListener,
    onParticipants,
    get socket() { return socket; },
    get loggedOutCode() { return DisconnectReason.loggedOut; }
  });
}
