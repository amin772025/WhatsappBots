export default {
  id: "hidetag", command: "hidetag", category: "Group",
  description: "Send a message mentioning all group members without displaying their tags",
  adminOnly: true,
  async execute({ message, args, reply, context }) {
    if (!message.isGroup) return reply("This command only works inside a group.");
    const text = args.join(" ").trim();
    if (!text || text.length > 1000) return reply("Usage: .hidetag your message");
    const meta = await context.runtime.provider.socket?.groupMetadata(message.chatId).catch(() => null);
    if (!meta) return reply("Could not load group members.");
    const mentions = (meta.participants || []).slice(0, 100).map(p => p.id);
    await context.runtime.provider.sendMessage(message.chatId, { text, mentions });
  }
};