export default {
  id: "tagall", command: ["tagall", "everyone"], category: "Group",
  description: "Mention group members (group admins only)",
  adminOnly: true,
  async execute({ message, args, reply, context }) {
    if (!message.isGroup) return reply("This command only works inside a group.");
    const meta = await context.runtime.provider.socket?.groupMetadata(message.chatId).catch(() => null);
    if (!meta) return reply("Could not load group members.");
    const members = (meta.participants || []).slice(0, 100);
    if (!members.length) return reply("No members found.");
    const mentions = members.map(p => p.id);
    const lines = members.map((p, i) => `${i + 1}. @${String(p.id).split("@")[0]}`);
    await context.runtime.provider.sendMessage(message.chatId, { text: (args.join(" ").slice(0, 300) || "📢 Attention everyone") + "\n\n" + lines.join("\n"), mentions });
  }
};