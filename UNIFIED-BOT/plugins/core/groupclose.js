import { requireBotAdmin } from "../../core/group-actions.js";
export default {
  id: "groupclose", command: "groupclose", aliases: ["close", "mute"], category: "Group",
  description: "Allow only admins to send group messages", adminOnly: true,
  async execute({ message, reply, context }) {
    try {
      requireBotAdmin(message);
      await context.runtime.provider.socket.groupSettingUpdate(message.chatId, "announcement");
      await reply("Group is now admin-only for messages.");
    } catch (error) { await reply(error.message); }
  }
};
