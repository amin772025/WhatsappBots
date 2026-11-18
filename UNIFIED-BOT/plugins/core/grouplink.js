import { requireGroup } from "../../core/group-actions.js";
export default {
  id: "grouplink", command: "grouplink", aliases: ["linkgc"], category: "Group",
  description: "Get the current group's invitation link",
  async execute({ message, reply, context }) {
    try {
      requireGroup(message);
      const code = await context.runtime.provider.socket.groupInviteCode(message.chatId);
      await reply("https://chat.whatsapp.com/" + code);
    } catch (error) { await reply(error.message); }
  }
};
