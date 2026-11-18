import { requireBotAdmin } from "../../core/group-actions.js";
export default {
  id: "groupname", command: "groupname", aliases: ["setname"], category: "Group",
  description: "Change the current group name", adminOnly: true,
  async execute({ message, args, reply, context }) {
    try {
      requireBotAdmin(message);
      const name = args.join(" ").trim().slice(0, 100);
      if (!name) throw new Error("Usage: .groupname New group name");
      await context.runtime.provider.socket.groupUpdateSubject(message.chatId, name);
      await reply("Group name updated.");
    } catch (error) { await reply(error.message); }
  }
};
