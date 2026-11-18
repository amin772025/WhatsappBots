import { requireBotAdmin, targetJid, protectGroupTarget } from "../../core/group-actions.js";
export default {
  id: "promote", command: "promote", category: "Group",
  description: "Promote a group member to admin", adminOnly: true,
  async execute({ message, args, reply, context, config }) {
    try {
      requireBotAdmin(message);
      const target = protectGroupTarget(targetJid(message, args), message, config, context);
      await context.runtime.provider.socket.groupParticipantsUpdate(message.chatId, [target], "promote");
      await reply("Promotion request sent.");
    } catch (error) { await reply(error.message); }
  }
};
