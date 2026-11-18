import { requireBotAdmin, targetJid, protectGroupTarget } from "../../core/group-actions.js";
export default {
  id: "kick", command: "kick", aliases: ["remove"], category: "Group",
  description: "Remove a member from the current group",
  adminOnly: true,
  async execute({ message, args, reply, context, config }) {
    try {
      requireBotAdmin(message);
      const target = protectGroupTarget(targetJid(message, args), message, config, context);
      if (target === message.chatId) throw new Error("Invalid target.");
      await context.runtime.provider.socket.groupParticipantsUpdate(message.chatId, [target], "remove");
      await reply("Member removal request sent.");
    } catch (error) { await reply(error.message); }
  }
};
