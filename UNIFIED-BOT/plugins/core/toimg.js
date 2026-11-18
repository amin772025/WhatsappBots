import { getImageBuffer, makePng } from "../../core/media.js";
export default {
  id: "toimg", command: "toimg", aliases: ["toimage"], category: "Tools",
  description: "Convert a WhatsApp sticker or image to PNG",
  async execute({ message, reply, context }) {
    try {
      const input = await getImageBuffer(message);
      const png = await makePng(input);
      await context.runtime.provider.socket.sendMessage(message.chatId, {
        image: png, caption: "Converted to PNG."
      }, { quoted: message.raw });
    } catch (error) { await reply(error.message || "Could not convert this media."); }
  }
};
