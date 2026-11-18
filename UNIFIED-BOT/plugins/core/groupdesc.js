import { requireBotAdmin } from "../../core/group-actions.js";
export default {
  id: "groupdesc", command: "groupdesc", aliases: ["setdesc"], category: "Group",
  description: "Change the current group description", adminOnly: true,
  async execute({ message, args, reply, context }) {
    try {
      requireBotAdmin(message);
      const description = args.join(" ").trim().slice(0, 2048);
      if (!description) throw new Error("Usage: .groupdesc New description");
      await context.runtime.provider.socket.groupUpdateDescription(message.chatId, description);
      await reply("Group description updated.");
    } catch (error) { await reply(error.message); }
  }
};
