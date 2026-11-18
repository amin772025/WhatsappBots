import { getImageBuffer, makeSticker } from "../../core/media.js";
export default {
  id: "sticker", command: "sticker", aliases: ["s"], category: "Tools",
  description: "Convert an image into a WhatsApp sticker",
  async execute({ message, reply, context }) {
    try {
      const input = await getImageBuffer(message);
      const sticker = await makeSticker(input);
      await context.runtime.provider.socket.sendMessage(message.chatId, { sticker }, { quoted: message.raw });
    } catch (error) { await reply(error.message || "Could not create the sticker."); }
  }
};
