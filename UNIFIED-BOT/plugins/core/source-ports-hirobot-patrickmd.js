// Source-derived ports from the original HIROBOT and PatrickMD plugins.
// Adapted to the unified plugin contract. Original source files are preserved.
// HIROBOT: extracted/HIROBOT/HIROBOT-main/plugins/main/ping.js
// PatrickMD: extracted/PatrickMD/plugins/tools/uuid.js
// PatrickMD: extracted/PatrickMD/plugins/tools/base64.js

import os from "node:os";
import { randomUUID } from "node:crypto";

function formatBytes(value) {
  if (!Number.isFinite(value) || value < 0) return "N/A";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let n = value, i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(i ? 1 : 0)} ${units[i]}`;
}

export default [
  {
    id: "src-hirobot-ping",
    command: "ping",
    aliases: ["speed"],
    category: "Info",
    description: "Checks response latency and runtime information; adapted from HIROBOT.",
    async execute({ reply }) {
      const start = process.hrtime.bigint();
      const uptime = process.uptime();
      const mem = process.memoryUsage();
      const cpus = os.cpus();
      const elapsed = Number(process.hrtime.bigint() - start) / 1e6;
      const h = Math.floor(uptime / 3600);
      const m = Math.floor((uptime % 3600) / 60);
      const s = Math.floor(uptime % 60);
      return reply(
        `🏓 *PONG* — ${elapsed.toFixed(2)} ms\n` +
        `⏱️ Uptime: ${h}h ${m}m ${s}s\n` +
        `🧠 RAM process: ${formatBytes(mem.rss)}\n` +
        `💾 Heap: ${formatBytes(mem.heapUsed)} / ${formatBytes(mem.heapTotal)}\n` +
        `⚙️ CPU cores: ${cpus.length}\n` +
        `🖥️ Platform: ${os.platform()} ${os.arch()}\n` +
        `🟢 Node: ${process.version}`
      );
    }
  },
  {
    id: "src-patrick-uuid",
    command: "uuid",
    category: "Tools",
    description: "Generates a UUID; adapted from PatrickMD.",
    async execute({ reply }) {
      return reply(`🆔 UUID:\n${randomUUID()}`);
    }
  },
  {
    id: "src-patrick-base64",
    command: "base64",
    aliases: ["b64"],
    category: "Tools",
    description: "Encodes provided text as Base64; adapted from PatrickMD.",
    async execute({ args, reply }) {
      const input = args.join(" ");
      if (!input) return reply("اكتب النص بعد الأمر. مثال: .base64 Hello");
      if (input.length > 12000) return reply("النص طويل جدًا؛ الحد الأقصى 12000 حرف.");
      return reply(`🔐 Base64:\n${Buffer.from(input, "utf8").toString("base64")}`);
    }
  }
];
