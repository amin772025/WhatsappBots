export default {
  id: "setrules", command: "setrules", category: "Group",
  description: "Set the group rules",
  adminOnly: true,
  async execute({ message, args, reply, context }) {
    if (!message.isGroup) return reply("This command only works inside a group.");
    const rules = args.join(" ").trim();
    if (!rules || rules.length > 3000) return reply("Usage: .setrules write the group rules (max 3000 characters)");
    await context.runtime.store.transact(data => {
      data.chats ||= {};
      data.chats[message.chatId] ||= {};
      data.chats[message.chatId].rules = rules;
    });
    await reply("✅ Group rules saved.");
  }
};