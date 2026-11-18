import { requireGroup } from "../../core/group-actions.js";
export default {
  id: "antilink", command: "antilink", category: "Group",
  description: "Enable or disable automatic group link moderation", adminOnly: true,
  async execute({ message, args, reply, context }) {
    try {
      requireGroup(message);
      if (!message.botIsAdmin) throw new Error("Make the bot a group admin first.");
      const value = String(args[0] || "").toLowerCase();
      if (!["on", "off"].includes(value)) throw new Error("Usage: .antilink on|off");
      await context.runtime.store.transact(data => {
        data.chats ||= {};
        data.chats[message.chatId] ||= {};
        data.chats[message.chatId].antilink = value === "on";
      });
      await reply(value === "on" ? "Anti-link is enabled for this group." : "Anti-link is disabled.");
    } catch (error) { await reply(error.message); }
  }
};
