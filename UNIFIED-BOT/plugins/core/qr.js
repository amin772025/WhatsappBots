import QRCode from "qrcode";
export default {
  id: "qr", command: "qr", aliases: ["qrcode"], category: "Tools",
  description: "Generate a QR code image from text or a link",
  async execute({ reply, args, message, context }) {
    const value = args.join(" ").trim();
    if (!value || value.length > 1500) { await reply("Usage: .qr text or https://example.com (max 1500 characters)"); return; }
    try {
      const buffer = await QRCode.toBuffer(value, { type: "png", width: 640, margin: 2, errorCorrectionLevel: "M" });
      await context.runtime.provider.socket.sendMessage(message.chatId, { image: buffer, caption: "QR code" }, { quoted: message.raw });
    } catch { await reply("Could not generate the QR code."); }
  }
};
