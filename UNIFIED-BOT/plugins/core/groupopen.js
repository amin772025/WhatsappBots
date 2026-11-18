import { requireBotAdmin } from "../../core/group-actions.js";
export default {
  id: "groupopen", command: "groupopen", aliases: ["open", "unmute"], category: "Group",
  description: "Allow all members to send group messages", adminOnly: true,
  async execute({ message, reply, context }) {
    try {
      requireBotAdmin(message);
      await context.runtime.provider.socket.groupSettingUpdate(message.chatId, "not_announcement");
      await reply("Group is now open to all members.");
    } catch (error) { await reply(error.message); }
  }
};
