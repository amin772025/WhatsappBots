import { requireGroup } from "../../core/group-actions.js";
export default {
  id: "welcome", command: "welcome", category: "Group",
  description: "Enable or disable new-member welcome messages", adminOnly: true,
  async execute({ message, args, reply, context }) {
    try {
      requireGroup(message);
      if (!message.botIsAdmin) throw new Error("Make the bot a group admin first.");
      const value = String(args[0] || "").toLowerCase();
      if (!["on", "off"].includes(value)) throw new Error("Usage: .welcome on|off");
      await context.runtime.store.transact(data => {
        data.chats ||= {};
        data.chats[message.chatId] ||= {};
        data.chats[message.chatId].welcomeEnabled = value === "on";
      });
      await reply(value === "on" ? "Welcome messages enabled." : "Welcome messages disabled.");
    } catch (error) { await reply(error.message); }
  }
};
