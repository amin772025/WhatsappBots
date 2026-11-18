export default {
  id: "idgc", command: ["idgc", "groupid"], category: "Group",
  description: "Show the current group ID",
  async execute({ message, reply }) {
    if (!message.isGroup) return reply("This command only works inside a group.");
    return reply("🆔 Group ID:\n" + message.chatId);
  }
};