import { requireBotAdmin, targetJid, protectGroupTarget } from "../../core/group-actions.js";
export default {
  id: "demote", command: "demote", category: "Group",
  description: "Remove admin status from a group member", adminOnly: true,
  async execute({ message, args, reply, context, config }) {
    try {
      requireBotAdmin(message);
      const target = protectGroupTarget(targetJid(message, args), message, config, context);
      await context.runtime.provider.socket.groupParticipantsUpdate(message.chatId, [target], "demote");
      await reply("Demotion request sent.");
    } catch (error) { await reply(error.message); }
  }
};
