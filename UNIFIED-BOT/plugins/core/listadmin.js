export default {
  id: "listadmin", command: "listadmin", category: "Group",
  description: "List group administrators",
  async execute({ message, reply, context }) {
    if (!message.isGroup) return reply("This command only works inside a group.");
    const meta = await context.runtime.provider.socket?.groupMetadata(message.chatId).catch(() => null);
    if (!meta) return reply("Could not load group information.");
    const admins = (meta.participants || []).filter(p => p.admin).map((p, i) => `${i + 1}. @${String(p.id).split("@")[0]}`);
    if (!admins.length) return reply("No administrators were found.");
    await context.runtime.provider.sendMessage(message.chatId, { text: "👑 Group admins\n" + admins.join("\n"), mentions: (meta.participants || []).filter(p => p.admin).map(p => p.id) });
  }
};