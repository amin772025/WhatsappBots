import { requireBotAdmin, targetJid } from "../../core/group-actions.js";
export default {
  id: "demote", command: "demote", category: "Group",
  description: "Remove admin status from a group member", adminOnly: true,
  async execute({ message, args, reply, context }) {
    try {
      requireBotAdmin(message);
      const target = targetJid(message, args);
      await context.runtime.provider.socket.groupParticipantsUpdate(message.chatId, [target], "demote");
      await reply("Demotion request sent.");
    } catch (error) { await reply(error.message); }
  }
};
