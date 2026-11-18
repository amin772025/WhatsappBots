import sharp from "sharp";

function escapeXml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
  })[char]);
}

function wrapText(value, limit = 17) {
  const words = value.trim().split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (word.length > 34) throw new Error("A single word is too long for this sticker.");
    const next = line ? line + " " + word : word;
    if (next.length > limit && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  if (!lines.length || lines.length > 5) throw new Error("Keep the text between 1 and 85 characters.");
  return lines;
}

export default {
  id: "brat",
  command: "brat",
  category: "Tools",
  description: "Create a green text sticker",
  async execute({ args, message, reply, context }) {
    const text = args.join(" ").trim();
    if (!text || text.length > 85) return reply("Usage: .brat your text (maximum 85 characters)");
    try {
      const lines = wrapText(text);
      const fontSize = Math.max(30, Math.min(58, 58 - Math.max(...lines.map(x => x.length)) * 1.15));
      const startY = 256 - ((lines.length - 1) * fontSize * 0.58);
      const tspans = lines.map((line, index) =>
        `<tspan x="256" y="${Math.round(startY + index * fontSize * 1.16)}">${escapeXml(line)}</tspan>`
      ).join("");
      const svg = Buffer.from(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" fill="#8ACE00"/><text text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="#111">${tspans}</text></svg>`);
      const sticker = await sharp(svg).webp({ quality: 84, effort: 4 }).toBuffer();
      await context.runtime.provider.socket.sendMessage(message.chatId, { sticker }, { quoted: message.raw });
    } catch (error) {
      await reply(error.message || "Could not create the text sticker.");
    }
  }
};
