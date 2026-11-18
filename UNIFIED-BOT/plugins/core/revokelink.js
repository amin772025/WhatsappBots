import { requireBotAdmin } from "../../core/group-actions.js";
export default {
  id: "revokelink", command: "revokelink", aliases: ["revoke"], category: "Group",
  description: "Revoke and regenerate the group invitation link", adminOnly: true,
  async execute({ message, reply, context }) {
    try {
      requireBotAdmin(message);
      await context.runtime.provider.socket.groupRevokeInvite(message.chatId);
      await reply("The group invitation link was revoked.");
    } catch (error) { await reply(error.message); }
  }
};
