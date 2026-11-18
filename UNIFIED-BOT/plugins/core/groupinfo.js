export default {
  id: "groupinfo",
  command: "groupinfo",
  category: "Group",
  description: "Show basic information about the current group",
  async execute({ reply, message, context, config }) {
    if (!message.isGroup) {
      await reply(config.language === "ar" ? "الأمر ده متاح داخل المجموعات فقط." : "This command is available in groups only.");
      return;
    }
    const socket = context.runtime.provider.socket;
    const metadata = await socket.groupMetadata(message.chatId);
    const description = String(metadata.desc || "").slice(0, 240);
    const lines = config.language === "ar"
      ? [`اسم المجموعة: ${metadata.subject || "-"}`, `عدد الأعضاء: ${metadata.participants?.length || 0}`, `الوصف: ${description || "-"}`]
      : [`Group: ${metadata.subject || "-"}`, `Members: ${metadata.participants?.length || 0}`, `Description: ${description || "-"}`];
    await reply(lines.join("\n"));
  }
};
