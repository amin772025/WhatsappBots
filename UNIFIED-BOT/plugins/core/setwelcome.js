import { requireGroup } from "../../core/group-actions.js";
export default {
  id: "setwelcome", command: "setwelcome", category: "Group",
  description: "Set a welcome template using {user} and {group}", adminOnly: true,
  async execute({ message, args, reply, context }) {
    try {
      requireGroup(message);
      if (!message.botIsAdmin) throw new Error("Make the bot a group admin first.");
      const template = args.join(" ").trim().slice(0, 500);
      if (!template) throw new Error("Usage: .setwelcome Welcome {user} to {group}!");
      await context.runtime.store.transact(data => {
        data.chats ||= {};
        data.chats[message.chatId] ||= {};
        data.chats[message.chatId].welcomeTemplate = template;
      });
      await reply("Welcome template saved.");
    } catch (error) { await reply(error.message); }
  }
};
