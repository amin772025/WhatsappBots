export default {
  id: "rules", command: "rules", category: "Group",
  description: "Show the saved group rules",
  async execute({ message, reply, context }) {
    if (!message.isGroup) return reply("This command only works inside a group.");
    const rules = context.runtime.store.read().chats?.[message.chatId]?.rules;
    await reply(rules ? "📜 Group rules\n\n" + rules : "No group rules have been set. An admin can use .setrules");
  }
};